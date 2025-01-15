public with sharing class CreateXeroContact {
    @InvocableMethod(label='Create Xero Contact')
    public static void callCreateAPI(List<Id> acctIds) {
        createXeroContact(acctIds);
    }
    
    @future(callout = true)
    public static void createXeroContact(List<Id> acctIds){
        //Get Tenant Id
        String tenantId = Xero_API_Settings__c.getOrgDefaults().Tenant_ID__c;
        
        List<Xero_Log_Activity__c> xeroLogActivities = new List<Xero_Log_Activity__c>();

        try {
            List<Account> acctRecs = [SELECT 
                                            Id, 
                                            Name, 
                                            ZoeyAccountCode__c,
                                            Billing_Contact__c, 
                                            Billing_Contact__r.FirstName, 
                                            Billing_Contact__r.LastName, 
                                            Billing_Contact__r.Email,
                                      		Billing_Contact__r.Phone, 
                                            Primary_Contact__c,
                                            Primary_Contact__r.FirstName,
                                            Primary_Contact__r.LastName,
                                            Primary_Contact__r.Email,
                                            BillingCity,
                                            BillingState,
                                            BillingCountry,
                                            BillingPostalCode,
                                      		BillingAddressLine1__c,
                                            BillingAddressLine2__c, //Line 2/City
                                            BillingAddressLine3__c, //City (State?)
                                            BillingAddressLine4__c, //Country
                                            BillingAddressPostcode__c, //PostalCode
                                            ShippingCity,
                                            ShippingState,
                                            ShippingCountry,
                                            ShippingPostalCode
                                        FROM Account 
                                        WHERE Id IN :acctIds];

            XeroContacts xeroConts = new XeroContacts();
            xeroConts.Contacts = new List<XeroContact>();

            for(Account acctRec : acctRecs){
                //Create Xero Contact
                XeroContact xeroCont = new XeroContact();
                xeroCont.Name = acctRec.Name;
                xeroCont.ContactNumber = acctRec.Id;
                xeroCont.AccountNumber = acctRec.ZoeyAccountCode__c;
                if(acctRec.Billing_Contact__c != null){
                    xeroCont.FirstName = acctRec.Billing_Contact__r.FirstName;
                    xeroCont.LastName = acctRec.Billing_Contact__r.LastName;
                    xeroCont.EmailAddress = acctRec.Billing_Contact__r.Email;
                }

                XeroAddress billingAddr = new XeroAddress();
                billingAddr.AddressType = 'POBOX';
                billingAddr.AddressLine1 = acctRec.BillingAddressLine1__c;
                billingAddr.City = acctRec.BillingAddressLine2__c;
                billingAddr.Region = acctRec.BillingAddressLine3__c;
                billingAddr.PostalCode = acctRec.BillingAddressPostcode__c;
                billingAddr.Country = acctRec.BillingAddressLine4__c;
                
                XeroAddress shippingAddr = new XeroAddress();
                shippingAddr.AddressType = 'STREET';
                shippingAddr.City = acctRec.ShippingCity;
                shippingAddr.Region = acctRec.ShippingState;
                shippingAddr.PostalCode = acctRec.ShippingPostalCode;
                shippingAddr.Country = acctRec.ShippingCountry;

                xeroCont.Addresses = new List<XeroAddress>{billingAddr, shippingAddr};

				XeroPhones XeroPhone = new XeroPhones();
               	XeroPhone.PhoneType = 'DEFAULT';
                XeroPhone.PhoneNumber = acctRec.Billing_Contact__r.Phone;
                xeroCont.Phones = new List<XeroPhones>{XeroPhone};
                system.debug('acctRec.Primary_Contact__r.Phone ==> ' + acctRec.Billing_Contact__r.Phone);
                //Add to Request
                xeroConts.Contacts.add(xeroCont);
            }

            if(xeroConts.Contacts != null && !xeroConts.Contacts.isEmpty()){
                system.debug(JSON.serialize(xeroConts, true));
                HttpRequest createContReq = XeroApiUtility.getXeroHttpRequest('POST', '/api.xro/2.0/Contacts/', JSON.serialize(xeroConts, true));
                createContReq.setHeader('xero-tenant-id', tenantId);
                Http createContHttp = new Http();
                HttpResponse createContResp = createContHttp.send(createContReq);
        	
                if(createContResp.getStatus() == 'OK' && createContResp.getStatusCode() == 200){
                    System.debug('Xero Contact created successfully!');
                    System.debug('body: '+createContResp.getBody());
                    XeroContacts xeroContsResponse = (XeroContacts)JSON.deserialize(createContResp.getBody(), XeroContacts.class);
	
                    List<Account> updatedAccts = new List<Account>();
                    for(XeroContact xeroCont : xeroContsResponse.Contacts){
                        updatedAccts.add(new Account(
                            Id = xeroCont.ContactNumber,
                            Xero_Contact_ID__c = xeroCont.ContactID
                        ));

                        xeroLogActivities.add(new Xero_Log_Activity__c(
                            Object__c = 'Account',
                            Action__c = 'Create in Xero',
                            Xero_ID__c = xeroCont.ContactID,
                            Account__c = xeroCont.ContactNumber,
                            Outcome__c = 'Success',
                            JSON_Request__c = JSON.serialize(xeroConts)
                        ));
                    }
                    if(updatedAccts.size() > 0){
                        update updatedAccts;
                    }
                } else {
                    throw new XeroApiException('Failed to create Contact: '+createContResp.getStatus()+' '+createContResp.getStatusCode()+' - '+createContResp.getBody());
                }
                
            }
        } catch(Exception ex){
            String errMessage = ex.getMessage();
            system.debug(errMessage);
            for(Id acctId : acctIds){
                xeroLogActivities.add(new Xero_Log_Activity__c(
                    Object__c = 'Account',
                    Action__c = 'Create in Xero',
                    Account__c = acctId,
                    Outcome__c = 'Error',
                    Error_Code__c = errMessage,
                    JSON_Request__c = errMessage
                ));
            }
        }

        if(xeroLogActivities.size() > 0){
            insert xeroLogActivities;
        }
    }
    
    public static void createXeroContactStandard(List<Id> acctIds){
        System.debug('***** runcreateXeroContactStandard');
        //Get Tenant Id
        String tenantId = Xero_API_Settings__c.getOrgDefaults().Tenant_ID__c;
        
        List<Xero_Log_Activity__c> xeroLogActivities = new List<Xero_Log_Activity__c>();

        try {
            List<Account> acctRecs = [SELECT 
                                            Id, 
                                            Name, 
                                            ZoeyAccountCode__c,
                                            Billing_Contact__c, 
                                            Billing_Contact__r.FirstName, 
                                            Billing_Contact__r.LastName, 
                                            Billing_Contact__r.Email, 
                                            Primary_Contact__c,
                                            Primary_Contact__r.FirstName,
                                            Primary_Contact__r.LastName,
                                            Primary_Contact__r.Email,
                                      		Primary_Contact__r.Phone,
                                            BillingCity,
                                            BillingState,
                                            BillingCountry,
                                            BillingPostalCode,
                                            BillingAddressLine2__c, //Line 2/City
                                            BillingAddressLine3__c, //City (State?)
                                            BillingAddressLine4__c, //Country
                                            BillingAddressPostcode__c, //PostalCode
                                            ShippingCity,
                                            ShippingState,
                                            ShippingCountry,
                                            ShippingPostalCode
                                        FROM Account 
                                        WHERE Id IN :acctIds];

            XeroContacts xeroConts = new XeroContacts();
            xeroConts.Contacts = new List<XeroContact>();

            for(Account acctRec : acctRecs){
                //Create Xero Contact
                XeroContact xeroCont = new XeroContact();
                xeroCont.Name = acctRec.Name;
                xeroCont.ContactNumber = acctRec.Id;
                xeroCont.AccountNumber = acctRec.ZoeyAccountCode__c;
                if(acctRec.Billing_Contact__c != null){
                    xeroCont.FirstName = acctRec.Billing_Contact__r.FirstName;
                    xeroCont.LastName = acctRec.Billing_Contact__r.LastName;
                    xeroCont.EmailAddress = acctRec.Billing_Contact__r.Email;
                    
                }

                XeroAddress billingAddr = new XeroAddress();
                billingAddr.AddressType = 'POBOX';
                billingAddr.City = acctRec.BillingAddressLine2__c;
                billingAddr.Region = acctRec.BillingAddressLine3__c;
                billingAddr.PostalCode = acctRec.BillingAddressPostcode__c;
                billingAddr.Country = acctRec.BillingAddressLine4__c;
                
                XeroAddress shippingAddr = new XeroAddress();
                shippingAddr.AddressType = 'STREET';
                shippingAddr.City = acctRec.ShippingCity;
                shippingAddr.Region = acctRec.ShippingState;
                shippingAddr.PostalCode = acctRec.ShippingPostalCode;
                shippingAddr.Country = acctRec.ShippingCountry;

                xeroCont.Addresses = new List<XeroAddress>{billingAddr, shippingAddr};
				
                XeroPhones XeroPhone = new XeroPhones();
               	XeroPhone.PhoneType = 'DEFAULT';
                XeroPhone.PhoneNumber = acctRec.Primary_Contact__r.Phone;
                xeroCont.Phones = new List<XeroPhones>{XeroPhone};
                //Add to Request
                xeroConts.Contacts.add(xeroCont);
            }

            if(xeroConts.Contacts != null && !xeroConts.Contacts.isEmpty()){
                HttpRequest createContReq = XeroApiUtility.getXeroHttpRequest('POST', '/api.xro/2.0/Contacts/', JSON.serialize(xeroConts));
                createContReq.setHeader('xero-tenant-id', tenantId);
                Http createContHttp = new Http();
                HttpResponse createContResp = createContHttp.send(createContReq);
        
                if(createContResp.getStatus() == 'OK' && createContResp.getStatusCode() == 200){
                    System.debug('Xero Contact created successfully!');
                    System.debug('body: '+createContResp.getBody());
                    XeroContacts xeroContsResponse = (XeroContacts)JSON.deserialize(createContResp.getBody(), XeroContacts.class);

                    List<Account> updatedAccts = new List<Account>();
                    for(XeroContact xeroCont : xeroContsResponse.Contacts){
                        updatedAccts.add(new Account(
                            Id = xeroCont.ContactNumber,
                            Xero_Contact_ID__c = xeroCont.ContactID
                        ));

                        xeroLogActivities.add(new Xero_Log_Activity__c(
                            Object__c = 'Account',
                            Action__c = 'Create in Xero',
                            Xero_ID__c = xeroCont.ContactID,
                            Account__c = xeroCont.ContactNumber,
                            Outcome__c = 'Success',
                            JSON_Request__c = JSON.serialize(xeroConts)
                        ));
                    }
                    if(updatedAccts.size() > 0){
                        update updatedAccts;
                    }
                } else {
                    throw new XeroApiException('Failed to create Contact: '+createContResp.getStatus()+' '+createContResp.getStatusCode()+' - '+createContResp.getBody());
                }
            }
        } catch(Exception ex){
            String errMessage = ex.getMessage();
            for(Id acctId : acctIds){
                xeroLogActivities.add(new Xero_Log_Activity__c(
                    Object__c = 'Account',
                    Action__c = 'Create in Xero',
                    Account__c = acctId,
                    Outcome__c = 'Error',
                    Error_Code__c = errMessage,
                    JSON_Request__c = errMessage
                ));
            }
        }

        if(xeroLogActivities.size() > 0){
            insert xeroLogActivities;
        }
    }

    public class XeroContacts {
        public List<XeroContact> Contacts;
    }

    public class XeroContact {
         
        public String ContactID;
        public String ContactNumber;
        public String AccountNumber;
        public String Name;
        public String FirstName;
        public String LastName;
        public String EmailAddress;
        public List<XeroAddress> Addresses;
        public List<XeroPhones> Phones;
    }

    public class XeroAddress {
        public String AddressLine1;
        public String AddressType;
        public String City;
        public String Region;
        public String PostalCode;
        public String Country;
    }
    public class XeroPhones{
        public String PhoneType;
        public String PhoneNumber;
        public String PhoneAreaCode;
        public String PhoneCountryCode;
    }
}