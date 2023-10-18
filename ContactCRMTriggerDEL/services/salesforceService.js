const salesforceAuth = require('../auth/salesforceAuth');
const axios = require('axios');

// Update Salesforce instance URL : process.env.SaleforceURL
const BASE_URL = 'https://dream-nosoftware-499.my.salesforce.com';

const getSalefoceAccessToken = async () => {
    const accessToken = await salesforceAuth.authenticatSFTokenRequest();
    return accessToken;
};

const getAllContact = async () => {
    try {
        const accessToken = await getSalefoceAccessToken();

        const response = await axios.get(`${BASE_URL}/services/data/v53.0/sobjects/Contact`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (response && response.data) {
            return response.data;
        } else {
            throw new Error('Failed to fetch contact from Salesforce.');
        }
    } catch (error) {
        throw new Error('Failed to fetch contact from Salesforce: ' + error.message);
    }
};

const getContact = async (contactId) => {
    try {
        const accessToken = await getSalefoceAccessToken();

        const response = await axios.get(`${BASE_URL}/services/data/v53.0/sobjects/Contact/${contactId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (response && response.data) {
            return response.data;
        } else {
            throw new Error('Failed to fetch contact from Salesforce.');
        }
    } catch (error) {
        throw new Error('Failed to fetch contact from Salesforce: ' + error.message);
    }
};

const createContact = async (contactDetails) => {
    try {
        const accessToken = await getSalefoceAccessToken();

        const response = await axios.post(`${BASE_URL}/services/data/v53.0/sobjects/Contact/`, contactDetails, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (response && response.data && response.data.success) {
            return response.data;
        } else {
            throw new Error('Failed to create contact in Salesforce.');
        }
    } catch (error) {
        throw new Error('Failed to create contact in Salesforce: ' + error.message);
    }
};

const updateContact = async (contactId, contactDetails) => {
    try {
        const accessToken = await getSalefoceAccessToken();

        const response = await axios.patch(`${BASE_URL}/services/data/v53.0/sobjects/Contact/${contactId}`, contactDetails, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (response && response.data && response.data.success) {
            return response.data;
        } else {
            throw new Error('Failed to update contact in Salesforce.');
        }
    } catch (error) {
        throw new Error('Failed to update contact in Salesforce: ' + error.message);
    }
};

const deleteContact = async (contactId) => {
    try {
        const accessToken = await getSalefoceAccessToken();

        const response = await axios.delete(`${BASE_URL}/services/data/v53.0/sobjects/Contact/${contactId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (response && response.status === 204) {
            return true; // Successful deletion
        } else {
            throw new Error('Failed to delete contact from Salesforce.');
        }
    } catch (error) {
        throw new Error('Failed to delete contact from Salesforce: ' + error.message);
    }
};

module.exports = {
    getAllContact,
    getContact,
    createContact,
    updateContact,
    deleteContact
};