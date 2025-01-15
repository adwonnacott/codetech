public with sharing class XeroAuthUtility {
    private static final String authUrl = 'https://login.xero.com/identity/connect/authorize';
    private static final String tokenUrl = 'https://identity.xero.com/connect/token';
    private static final String tenantsUrl = 'https://api.xero.com/connections';

    @AuraEnabled
    public static Xero_API_Settings__c getXeroApiSettings(){
        return Xero_API_Settings__c.getOrgDefaults();
    }

    @AuraEnabled
    public static void upsertXeroApiSettings(Xero_API_Settings__c settings){
        upsert settings;
    }

    @AuraEnabled
    public static void revokeXeroApiTokens(){
        Xero_API_Settings__c xeroApiSettings = Xero_API_Settings__c.getOrgDefaults();

        List<Xero_API_Tokens__c> tokensList = [SELECT Id FROM Xero_API_Tokens__c WHERE Name = :xeroApiSettings.Xero_API_Tokens_Record_Name__c];
        delete tokensList;

        List<CronTrigger> refreshTokenJobs = [SELECT 
                                                    Id, 
                                                    CronJobDetail.Id, 
                                                    CronJobDetail.Name 
                                                FROM CronTrigger 
                                                WHERE CronJobDetail.Name LIKE 'XeroTokenRefreshBatch%'];
        if(!refreshTokenJobs.isEmpty()){
            for(CronTrigger cronTrig : refreshTokenJobs){
                System.abortJob(cronTrig.Id);
            }
        }
    }

    @AuraEnabled
    public static void scheduleRefreshTokenBatch(){
        List<CronTrigger> refreshTokenJobs = [SELECT 
                                                    Id, 
                                                    CronJobDetail.Id, 
                                                    CronJobDetail.Name 
                                                FROM CronTrigger 
                                                WHERE CronJobDetail.Name LIKE 'XeroTokenRefreshBatch%'];
        if(refreshTokenJobs.isEmpty()){
            System.schedule('XeroTokenRefreshBatch 01', '0 0 * * * ?', new XeroTokenRefreshBatch());
            System.schedule('XeroTokenRefreshBatch 02', '0 15 * * * ?', new XeroTokenRefreshBatch());
            System.schedule('XeroTokenRefreshBatch 03', '0 30 * * * ?', new XeroTokenRefreshBatch());
            System.schedule('XeroTokenRefreshBatch 04', '0 45 * * * ?', new XeroTokenRefreshBatch());
        }
    }

    @AuraEnabled
    public static String getAuthURL(String clientId){
        Xero_API_Settings__c xeroApiSettings = Xero_API_Settings__c.getOrgDefaults();

        return authUrl+'?response_type=code&client_id='+clientId+'&redirect_uri='+xeroApiSettings.Redirect_URI__c+'&scope='+xeroApiSettings.Scope__c;
    }

    //Get Access and Refresh Tokens
    @AuraEnabled
    public static TokenResponse exchangeCodeToToken(String oAuthCode){
        TokenResponse tokenParsedResp;

        Xero_API_Settings__c xeroApiSettings = Xero_API_Settings__c.getOrgDefaults();

        if(xeroApiSettings != null){
            Http http = new Http();
            HttpRequest tokenReq = constructTokenRequest(oAuthCode);
            HttpResponse tokenResp = http.send(tokenReq);

            if(tokenResp.getStatusCode() == 200){
                System.debug('@@@tokenResp body = ' + tokenResp.getBody());
                tokenParsedResp = (TokenResponse)JSON.deserialize(tokenResp.getBody(), TokenResponse.class);

                //Update Xero API Tokens record
                List<Xero_API_Tokens__c> tokensList = [SELECT Id FROM Xero_API_Tokens__c WHERE Name = :xeroApiSettings.Xero_API_Tokens_Record_Name__c];
                Xero_API_Tokens__c tokens;
                if(tokensList.size() > 0){
                    tokens = tokensList[0];
                } else {
                    tokens = new Xero_API_Tokens__c(Name = xeroApiSettings.Xero_API_Tokens_Record_Name__c);
                }
                tokens.Access_Token__c = tokenParsedResp.access_token;
                tokens.Refresh_Token__c = tokenParsedResp.refresh_token;
                tokens.Expires_In__c = System.Now().addSeconds(tokenParsedResp.expires_in);
                upsert tokens;

            }else{
                throw new XeroApiException('Token Request Error: ' + tokenResp.getBody());
            }
        }else{
            throw new XeroApiException('No Xero API Setting found.');
        }
        
        return tokenParsedResp;
    }

    //Get Tenant Id
    @AuraEnabled
    public static TenantResponse getTenantId(String accessToken){
        TenantResponse tenantParsedResp;

        Xero_API_Settings__c xeroApiSettings = Xero_API_Settings__c.getOrgDefaults();

        if(xeroApiSettings != null){
            Http http = new Http();
            HttpRequest tenantReq = constructTenantRequest(accessToken);
            HttpResponse tenantResp = http.send(tenantReq);
            if(tenantResp.getStatusCode() == 200){
                System.debug('@@@tenantResp body = ' + tenantResp.getBody());
    
                String tenantDetails = tenantResp.getBody();
                List<TenantResponse> tenantParsedRespList = (List<TenantResponse>)JSON.deserialize(tenantDetails, List<TenantResponse>.class);
                for(TenantResponse singleTenantResp : tenantParsedRespList){
                    if(singleTenantResp.tenantName == xeroApiSettings.Tenant_Name__c){
                        tenantParsedResp = singleTenantResp;
                    }
                }
            }else{
                throw new XeroApiException('Tenant Request Error: '+tenantResp.getBody());
            }
        } else {
            throw new XeroApiException('No Xero API Setting found.');
        }
        
        return tenantParsedResp;
    }

    //Refresh Tokens
    public static void refreshAccessToken(Xero_API_Tokens__c xeroApiTokens){
        Xero_API_Settings__c xeroApiSettings = Xero_API_Settings__c.getOrgDefaults();
        
        String requestBody = 'grant_type=refresh_token&refresh_token='+xeroApiTokens.Refresh_Token__c;
        String encodedString = EncodingUtil.base64Encode(Blob.valueOf(xeroApiSettings.Consumer_Key__c+':'+xeroApiSettings.Consumer_Secret__c));
        
        Http http = new Http();
        HttpRequest httpReq = new HttpRequest();
        httpReq.setMethod('POST');
        httpReq.setEndPoint(tokenUrl);
        httpReq.setHeader('Authorization' , 'Basic '+encodedString);
        httpReq.setHeader('Content-Type' , 'application/x-www-form-urlencoded');
        httpReq.setBody(requestBody);
        httpReq.setTimeout(120000);

        HttpResponse httpRes = http.send(httpReq);
        if(httpRes.getStatusCode() == 200){
            system.debug('@@@refreshToken body = ' + httpRes.getBody());
            TokenResponse tokenResponse = (TokenResponse)JSON.deserialize(httpRes.getBody(), TokenResponse.class);
            
            Xero_API_Tokens__c updatedXeroApiTokens = new Xero_API_Tokens__c(
                Id = xeroApiTokens.Id,
                Access_Token__c = tokenResponse.access_token,
                Refresh_Token__c = tokenResponse.refresh_token,
                Expires_In__c = System.Now().addSeconds(tokenResponse.expires_in)
            );
            update updatedXeroApiTokens;
        }
    }

    public static HttpRequest constructTokenRequest(String oAuthCode){
        Xero_API_Settings__c xeroApiSettings = Xero_API_Settings__c.getOrgDefaults();

        String encodedString = EncodingUtil.base64Encode(Blob.valueOf(xeroApiSettings.Consumer_Key__c+':'+xeroApiSettings.Consumer_Secret__c));
        String payload = 'grant_type=authorization_code&code='+oAuthCode+'&redirect_uri='+xeroApiSettings.Redirect_URI__c;
        System.debug('payload: '+payload);

        HttpRequest httpReq = new HttpRequest();
        httpReq.setMethod('POST');
        httpReq.setEndPoint(tokenUrl);
        httpReq.setHeader('Authorization' , 'Basic '+encodedString);
        httpReq.setHeader('Content-Type' , 'application/x-www-form-urlencoded');
        httpReq.setBody(payload);

        return httpReq;
    }

    public static HttpRequest constructTenantRequest(String accessToken){
        Http http = new Http();
        HttpRequest httpReq = new HttpRequest();
        httpReq.setMethod('GET');
        httpReq.setEndPoint(tenantsUrl);
        httpReq.setHeader('Authorization' , 'Bearer '+accessToken);
        httpReq.setHeader('Content-Type' , 'application/json');
        return httpReq;
    }

    public class TokenResponse{
        @AuraEnabled
        public String refresh_token;
        @AuraEnabled
        public String access_token;
        @AuraEnabled
        public Integer expires_in;
    }

    public class TenantResponse{
        @AuraEnabled
        public String tenantId;
        @AuraEnabled
        public String tenantType;
        @AuraEnabled
        public String tenantName;
    }
}