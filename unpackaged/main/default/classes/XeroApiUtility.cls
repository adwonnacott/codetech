public class XeroApiUtility {
    private static String baseUrl = 'https://api.xero.com';
    
    public static HttpRequest getXeroHttpRequest(String method, String endpoint, String body){
        Xero_API_Settings__c settings = Xero_API_Settings__c.getOrgDefaults();

        if(settings != null && settings.Id != null){
            HttpRequest req = new HttpRequest();
            req.setMethod(method);
            req.setEndpoint(baseUrl+endpoint);
            if((method == 'POST' || method == 'PUT') && body != null){
                req.setBody(body);
            }
            setAuthorizationHeader(req);
            req.setHeader('Content-Type', 'application/json');
            req.setHeader('Accept', 'application/json');
    
            return req;
        } else {
            throw new XeroApiException('No Xero API Settings found.');
        }
    }

    // public static String getXeroTenantId(){
    //     //Get Tenant Id
    //     String tenantId;

    //     HttpRequest tenantReq = XeroApiUtility.getXeroHttpRequest('GET', '/connections', null);
    //     Http tenantHttp = new Http();
    //     HttpResponse tenantResp = tenantHttp.send(tenantReq);
        
    //     if(tenantResp.getStatus() == 'OK' && tenantResp.getStatusCode() == 200){
    //         List<TenantResponse> tenantParsedResp = (List<TenantResponse>)JSON.deserialize(tenantResp.getBody(), List<TenantResponse>.class);
    //         for(TenantResponse tenantResp2 : tenantParsedResp){
    //             System.debug(tenantResp2);
    //         }
    //         tenantId = tenantParsedResp[0].tenantId;
    //     } else {
    //         throw new XeroApiException('Failed to Retrieve Tenant ID: '+tenantResp.getStatus()+' '+tenantResp.getStatusCode()+' - '+tenantResp.getBody());
    //     }

    //     return tenantId;
    // }

    private static void setAuthorizationHeader(HttpRequest req){
        Xero_API_Settings__c xeroApiSettings = Xero_API_Settings__c.getOrgDefaults();
        Xero_API_Tokens__c xeroTokens = [SELECT Id, Access_Token__c FROM Xero_API_Tokens__c WHERE Name = :xeroApiSettings.Xero_API_Tokens_Record_Name__c LIMIT 1];

        req.setHeader('Authorization' , 'Bearer '+xeroTokens.Access_Token__c);
        System.debug('Authorization: '+req.getHeader('Authorization'));
    }
    
    public class TenantResponse {
        public String tenantId;
        public String tenantType;
        public String tenantName;
    }
}