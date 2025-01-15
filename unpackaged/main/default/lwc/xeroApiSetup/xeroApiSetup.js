import { LightningElement } from 'lwc';
import LightningConfirm from 'lightning/confirm';
import getXeroApiSettings from '@salesforce/apex/XeroAuthUtility.getXeroApiSettings';
import saveSettings from '@salesforce/apex/XeroAuthUtility.upsertXeroApiSettings';
import scheduleRefreshTokenBatch from '@salesforce/apex/XeroAuthUtility.scheduleRefreshTokenBatch';
import getAuthUrl from '@salesforce/apex/XeroAuthUtility.getAuthURL';
import exchangeCodeToToken from '@salesforce/apex/XeroAuthUtility.exchangeCodeToToken';
import getTenantId from '@salesforce/apex/XeroAuthUtility.getTenantId';
import revokeTokens from '@salesforce/apex/XeroAuthUtility.revokeXeroApiTokens';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class XeroApiSetup extends LightningElement {
    settings = {};

    get maskedClientSecret(){
        return this.settings.Consumer_Secret__c ? this.maskString(this.settings.Consumer_Secret__c) : '';
    }

    webhookKeyEditMode;
    newWebhookKey = '';
    get maskedWebhookKey(){
        return this.settings.Webhook_Private_Key__c ? this.maskString(this.settings.Webhook_Private_Key__c) : '';
    }

    isLoading;

    connectedCallback(){
        this.initializeComponent();
    }

    async initializeComponent(){
        this.isLoading = true;

        let settings = await getXeroApiSettings();
        if(settings){
            this.settings = settings;
        } else {
            alert('Please setup Xero API Settings first in Setup.');
            return;
        }

        //Redirect handling
        await this.handleAuthRedirect();

        if(!settings.Webhook_Private_Key__c){
            this.webhookKeyEditMode = true;
        } else {
            this.webhookKeyEditMode = false;
        }

        
        this.isLoading = false;
    }

    async handleAuthRedirect(){
        let code = this.getUrlParamValue(window.location.href, 'c__code');
        if(code){
            try{
                //Exchange code for token and save
                let tokenResp = await this.exchangeCodeForToken(code);

                //Get Tenant Id 
                let tenantResp = await this.getTenantId(tokenResp.access_token);

                //Save Tenant Id
                let settings = JSON.parse(JSON.stringify(this.settings));
                settings.Tenant_ID__c = tenantResp.tenantId;
                this.settings = settings;
                await saveSettings({ settings : this.settings });

                await scheduleRefreshTokenBatch();

                this.showToast('Success!', 'Successfully connected to Xero API.', 'success');
            } catch(error){
                console.log('handleAuthRedirect error log');
                console.log(JSON.parse(JSON.stringify(error)));
                let errorMessage = 'Couldn\'t retrieve error. Please contact your System Administrator.';
                if(error && error.body && error.body.message && typeof error.body.message == 'string'){
                    errorMessage = error.body.message.replaceAll('{', '').replaceAll('}', '');
                }
                this.showToast('Authentication failed', errorMessage, 'error', 'sticky');
            }
        } else {
            //If no code in parameter
            let nocode = this.getUrlParamValue(window.location.href, 'c__nocode');
            if(nocode && nocode == 1){
                this.showToast('Authentication failed', 'Authentication to Xero API failed. Please try again or contact your System Administrator.', 'warning', 'sticky');
            }
        }
        this.clearUrlParams();
    }

    handleChange(event){
        let fieldName = event.currentTarget.name;
        if(fieldName != 'newWebhookKey'){
            this.settings[fieldName] = event.currentTarget.value;
        } else {
            this[fieldName] = event.currentTarget.value;
        }
    }

    async handleConnect(){
        if(this.validateConnect()){
            this.isLoading = true;
            await saveSettings({ settings : this.settings });
            let authUrl = await getAuthUrl({ clientId: this.settings.Consumer_Key__c, clientSecret: this.settings.Consumer_Secret__c });
            window.location.href = authUrl;
        }
    }

    async handleRevoke(){
        let proceed = true;

        let confirmRes = await this.showConfirm('Are you sure you want to revoke this connection?', 'Confirm')
        
        if(!confirmRes){
            proceed = false;
        }

        if(proceed){
            this.isLoading = true;

            let revokedSettings = JSON.parse(JSON.stringify(this.settings));
            revokedSettings.Consumer_Key__c = null;
            revokedSettings.Consumer_Secret__c = null;
            revokedSettings.Tenant_ID__c = null;
            revokedSettings.Webhook_Private_Key__c = null;
            
            await saveSettings({ settings : revokedSettings });
            await revokeTokens();
            this.settings = revokedSettings;

            this.isLoading = false;

            this.showToast('Connection revoked', 'Successfully revoked connection to Xero API.', 'info');
        }
    }

    handleChangeWebhookKey(){
        this.newWebhookKey = this.settings.Webhook_Private_Key__c;
        this.webhookKeyEditMode = true;
    }

    handleCancelChangeWebhookKey(){
        this.webhookKeyEditMode = false;
        this.newWebhookKey = '';
    }

    async handleWebhookSave(){
        if(this.newWebhookKey){
            let proceed = true;

            if(this.settings.Webhook_Private_Key__c && this.settings.Webhook_Private_Key__c != this.newWebhookKey){
                let confirmRes = await this.showConfirm('Are you sure you want to change the Webhook Private Key?', 'Confirm')
                
                if(!confirmRes){
                    proceed = false;
                }
            }  

            if(proceed){
                this.isLoading = true;
                let updatedSettings = JSON.parse(JSON.stringify(this.settings));
                updatedSettings.Webhook_Private_Key__c = this.newWebhookKey;
        
                await saveSettings({ settings : updatedSettings });
                this.settings = updatedSettings;
                this.webhookKeyEditMode = false;
                this.newWebhookKey = '';
                this.isLoading = false;
            }
        }
    }

    validateConnect(){
        let isValid = true;

        let inputs = this.template.querySelectorAll('lightning-input[data-type=connection]');
        if(inputs){
            inputs.forEach(input => {
                if(!input.checkValidity()){
                    input.reportValidity();
                    isValid = false;
                }
            });
        } else {
            isValid = false;
        }

        return isValid;
    }

    async exchangeCodeForToken(code){
        let tokenResponse = await exchangeCodeToToken({ oAuthCode : code });
        return tokenResponse;
    }

    async getTenantId(accessToken){
        let tenantResponse = await getTenantId({ accessToken : accessToken });
        return tenantResponse;
    }

    getUrlParamValue(url, key) {
        return new URL(url).searchParams.get(key);
    }

    clearUrlParams(){
        window.history.replaceState({}, document.title, "/lightning/n/Xero_API_Setup1");
    }

    maskString(text){
        return '......'+text.substring(text.length - 5, text.length)
    }

    async showConfirm(message, label) {
        const result = await LightningConfirm.open({
            message: message,
            variant: 'headerless',
            label: label,
            // setting theme would have no effect
        });

        //Confirm has been closed
        //result is true if OK was clicked
        //and false if cancel was clicked
        return result;
    }

    showToast(title, message, variant, mode = 'dismissible'){
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant : variant,
            mode : mode
        });
        this.dispatchEvent(event);
    }
}