const axios = require('axios');
const { SecretClient } = require('@azure/keyvault-secrets');
const { DefaultAzureCredential } = require('@azure/identity');

const KeyVault_name = 'az-kv-dev-sales-poc'; // process.env.KEY-VAULT-NAME
const keyVault_URL = `https://${KeyVault_name}.vault.azure.net/`;
const keyVaultCLient = new SecretClient(keyVault_URL, new DefaultAzureCredential());

const salesforceConfig = {
    clientId: '3MVG95mg0lk4batgXsIfxmF4cCf2xt9s_4TOoW4cmSUM6DITFPZGEiwkbt5vhgmbjHfSjZVSTjbTMB.4Q4t2k', // process.env.SF_CLIENT_ID
    //clientSecret: 'AC95EECDF4C5968F1E65D9D976821333ECDA02F28101B0CFF56AFC0DAF9A593D', // process.env.SF_CLIENT_SECRET
    refreshToken: '5Aep861sDdjizbO.v67LqnYf.ft9iRXFahTWmFnFE51_rEreGDFEfhUW25TKGNOSuGDq4e7jLcMOVcZaZLU3YRW', // process.env.SF_CLIENT_REFRESH_TOKEN
    accessToken: '',
    tokenExpiration: 0, // Access token expiration timestamp
    instanceUrl: 'https://dream-nosoftware-499.my.salesforce.com', //process.env.SF_INTANCE_URL
};

const authenticatSFTokenRequest = async () => {
    try {
        const kVSalesClientSecret = await keyVaultCLient.getSecret('kv-sales-client-secret');
        const response = await axios.post(`${salesforceConfig.instanceUrl}/services/oauth2/token`, null, {
            params: {
                grant_type: 'refresh_token',
                client_id: salesforceConfig.clientId,
                client_secret: kVSalesClientSecret.value,
                refresh_token: salesforceConfig.refreshToken,
            },
        });

        // Update the access token and its expiration
        salesforceConfig.accessToken = response.data.access_token;

        if (response.data && response.data.access_token) {
            return response.data.access_token;
        } else {
            throw new Error('Failed to authenticate with Salesforce.');
        }
    } catch (error) {
        throw new Error('Salesforce authentication failed: ' + error.message);
    }
};

module.exports = {
    authenticatSFTokenRequest
};



