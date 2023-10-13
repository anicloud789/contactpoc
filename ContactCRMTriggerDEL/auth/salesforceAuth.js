const axios = require('axios');


const salesforceConfig = {
    clientId: '3MVG95mg0lk4batgXsIfxmF4cCf2xt9s_4TOoW4cmSUM6DITFPZGEiwkbt5vhgmbjHfSjZVSTjbTMB.4Q4t2k',
    clientSecret: 'AC95EECDF4C5968F1E65D9D976821333ECDA02F28101B0CFF56AFC0DAF9A593D',
    refreshToken: '5Aep861sDdjizbO.v67LqnYf.ft9iRXFahTWmFnFE51_rEreGDFEfhUW25TKGNOSuGDq4e7jLcMOVcZaZLU3YRW',
    accessToken: '', // Store the access token here
    tokenExpiration: 0, // Store the access token expiration timestamp here
    instanceUrl: 'https://dream-nosoftware-499.my.salesforce.com',
};

const authenticateWithSalesforce = async () => {
    try {
        const response = await axios.post(`${salesforceConfig.instanceUrl}/services/oauth2/token`, null, {
            params: {
                grant_type: 'refresh_token',
                client_id: salesforceConfig.clientId,
                client_secret: salesforceConfig.clientSecret,
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
    authenticateWithSalesforce
};



