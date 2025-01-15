@isTest
public class XeroApiUtilityTest {
    @isTest
    static void testGetXeroHttpRequest(){
        insert XeroTestDataFactory.createXeroSettings();
        insert XeroTestDataFactory.createXeroApiTokenRecord();

        HttpRequest req = XeroApiUtility.getXeroHttpRequest('POST', '/api.xro/2.0/Contacts/', '{}');
        Assert.isNotNull(req);
        Assert.areEqual('POST', req.getMethod());
        Assert.isTrue(req.getEndpoint().contains('/api.xro/2.0/Contacts/'));
        Assert.isNotNull(req.getBody());
        Assert.isNotNull(req.getHeader('Authorization'));
    }

    @isTest
    static void testGetXeroHttpRequestNoSettings(){
        try{
            HttpRequest req = XeroApiUtility.getXeroHttpRequest('POST', '/api.xro/2.0/Contacts/', '{}');
            Assert.fail();
        } catch(Exception ex){

        }
    }
}