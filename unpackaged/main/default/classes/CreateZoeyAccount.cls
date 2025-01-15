/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 03-07-2024
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
public with sharing class CreateZoeyAccount {
    private static final String baseUrl = 'https://portal.codeinternational.com/api/';
	
    @InvocableMethod(label='Create Zoey Account')
    public static void callCreateAPI(List<String> ids) {
        System.debug('@@@ run create zoey');
        createZoeyAccount(ids);
    }
    
    @future(callout = true)
    public static void createZoeyAccount(List<Id> accountId){

        try {
            Id acctId = accountId[0];
            List<Xero_Log_Activity__c> xeroLogActivities = new List<Xero_Log_Activity__c>();
    
            Account acct = [SELECT 
                                Id,
                                Name, 
                                PaymentType__c, 
                                BillingAddressLine1__c,
                                BillingAddressLine2__c,
                                BillingAddressLine3__c,
                                BillingAddressLine4__c,
                                BillingAddressPostcode__c,
                                EmailAddress__c, 
                                Phone,
                                Zoey_Closed_Date__c,
                                TaxType__c
                            FROM 
                                Account 
                            WHERE 
                                Id = :acctId];
                                
            //Create new Zoey Account object
            ZoeyAccount newZoeyAcct = new ZoeyAccount();
            newZoeyAcct.name = acct.Name;
            newZoeyAcct.payment_method = (acct.PaymentType__c == 'Direct Debit' ? 'D' : 'C');
            newZoeyAcct.payment_reference = null;
            newZoeyAcct.address_line_1 = acct.BillingAddressLine1__c;
            newZoeyAcct.address_line_2 = acct.BillingAddressLine2__c;
            newZoeyAcct.address_line_3 = acct.BillingAddressLine3__c;
            newZoeyAcct.address_line_4 = acct.BillingAddressLine4__c;
            newZoeyAcct.post_code = acct.BillingAddressPostcode__c;
            newZoeyAcct.email = acct.EmailAddress__c;
            newZoeyAcct.phone = acct.Phone;
            newZoeyAcct.dealer_code = 'BP02';
            newZoeyAcct.closed = String.valueOf(acct.Zoey_Closed_Date__c);
            //Determine tax_profile
            String taxProfile = null;
            if(acct.TaxType__c == 'Domestic Consumer' || acct.TaxType__c == 'International Consumer'){
                taxProfile = 'CONSUMER';
            } else if(acct.TaxType__c == 'Domestic Business' || acct.TaxType__c == 'International Business'){
                taxProfile = 'BUSINESS';
            } 
            newZoeyAcct.tax_profile = taxProfile;
    
            String token = getZoeyAuthentication();
    
            if(token != null){
                ZoeyAccount details = createZoeyAccount(token, newZoeyAcct);
                
                Account updatedAcct = new Account(
                    Id                      = acct.Id,
                    ZoeyAccountCode__c      = details?.account_code,
                    Zoey_Account_Created__c = true
                );

                if( String.isNotEmpty(details?.closed) ){
                    updatedAcct.Zoey_Closed_Date__c     = Date.valueOf(details?.closed);
                }

                update updatedAcct;
                            
                xeroLogActivities.add(new Xero_Log_Activity__c(
                    Object__c = 'Account',
                    Action__c = 'Create in Zoey',
                    //Xero_ID__c = xeroCont.ContactID,
                    Account__c = acct.Id,
                    Outcome__c = 'Success',
                    JSON_Request__c = details?.account_code
                ));
                
            } else {
                System.debug('No token retrieved');
                xeroLogActivities.add(new Xero_Log_Activity__c(
                        Object__c = 'Account',
                        Action__c = 'Create in Zoey',
                        Account__c = acct.Id,
                        Outcome__c = 'Error',
                        Error_Code__c = 'No token retrieved'
                    ));
                
            }
            
            if(xeroLogActivities.size() > 0){
                insert xeroLogActivities;
            }
        } catch(DmlException e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
        }

    }

    private static String getZoeyAuthentication(){
        Zoey_API_Settings__c settings = Zoey_API_Settings__c.getOrgDefaults();
        String username = settings.Username__c;
        String password = settings.Password__c;

        HttpRequest req = new HttpRequest();
        req.setHeader('Content-Type', 'application/json');
        req.setEndpoint(baseUrl+'v2/auth');
        req.setMethod('POST');
        //Construct body
        AuthenticationBody authBody = new AuthenticationBody(username, password);
        System.debug('JSON auth req body: '+JSON.serialize(authBody));
        req.setBody(JSON.serialize(authBody));

        Http http = new Http();
        HttpResponse resp = http.send(req);
        
        String token;

        System.debug('resp status code: '+resp.getStatusCode());
        System.debug('resp status: '+resp.getStatus());
        System.debug('resp body: '+resp.getBody());
        if(resp.getStatusCode() == 200 && resp.getStatus() == 'OK' && resp.getBody() != null){
            Map<String, Object> parsedResponse = (Map<String, Object>)JSON.deserializeUntyped(resp.getBody());
            if(parsedResponse != null && parsedResponse.containsKey('token')){
                token = (parsedResponse.get('token')!=null ? String.valueOf(parsedResponse.get('token')) : null);
            }
        }

        return token;
    }

    private static ZoeyAccount createZoeyAccount(String token, ZoeyAccount newZoeyAcct){

        System.debug('newZoeyAcct' + newZoeyAcct);

        HttpRequest req = new HttpRequest();
        req.setHeader('Authorization','Bearer '+token);
        req.setHeader('Content-Type', 'application/json');
        req.setEndpoint(baseUrl+'v2/accounts');
        req.setMethod('POST');
        //Construct body
        req.setBody(JSON.serialize(newZoeyAcct, true));
        System.debug('req body: '+req.getBody());

        Http http = new Http();
        HttpResponse resp = http.send(req);

        String accountCode;
		
        System.debug('resp status code: '+resp.getStatusCode());
        System.debug('resp status: '+resp.getStatus());
        System.debug('resp body: '+resp.getBody());

        ZoeyAccount parsedResponse = new ZoeyAccount();

        if(resp.getStatusCode() == 200 && resp.getStatus() == 'OK' && resp.getBody() != null){
            parsedResponse = (ZoeyAccount)JSON.deserialize(resp.getBody(), ZoeyAccount.class);
            // if(parsedResponse != null && parsedResponse.containsKey('account_code')){
            //     accountCode = (parsedResponse.get('account_code')!= null ? String.valueOf(parsedResponse.get('account_code')) : null);
            // }

            System.debug('parsedResponse' + parsedResponse);
        }
		
        return parsedResponse;
        
    }

    private class AuthenticationBody { 
        private String username;
        private String password;
        
        public AuthenticationBody(String usernameVal, String passwordVal){
            username = usernameVal;
            password = passwordVal;
        }
    }

    public class ZoeyAccount {
        public String account_code {get; set;}
        public String name {get; set;}
        public String account_reference {get; set;}
        public String payment_method {get; set;}
        public String payment_reference {get; set;}
        public String address_line_1 {get; set;}
        public String address_line_2 {get; set;}
        public String address_line_3 {get; set;}
        public String address_line_4 {get; set;}
        public String post_code {get; set;}
        public String email {get; set;}
        public String phone {get; set;}
        public String tax_profile {get; set;}
        public String dealer_code {get; set;}
        public String closed {get; set;}
    }
}