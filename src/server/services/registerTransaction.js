import axios from 'axios'
import {config} from 'dotenv';
config();

async function createURL(data, additionalData = {}) {
    data = transformOrderData(data, additionalData);

    if(!data) return null;

    try {
        const response = await axios({
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            url: `${data.endpointUrl}`,
            data
        });
        return response.data;

    } catch (error){
        return null;
    }
}

function transformOrderData(data, additionalData = {}) {
    if(!data.cart) return null;
    let affiliateCode;
    let endpointUrl;

    // Getting affiliate code and enpoint from ecwid merchant settings
    if(data.merchantAppSettings.testMode === 'false') {
        affiliateCode = data.merchantAppSettings.affiliateCode;
        endpointUrl = data.merchantAppSettings.endpointUrl;
    } else {
        affiliateCode = data.merchantAppSettings.affiliateCodeTest;
        endpointUrl = data.merchantAppSettings.endpointUrlTest;
    }
    
    if(additionalData.successUrl) {
        additionalData = {
            ...additionalData,
            successUrl: `${additionalData.successUrl}?successUrl=${encodeURIComponent(data.returnUrl)}&accessToken=${data.token}`
        }
    }

    return {
        "successUrl": data.returnUrl,
        "affiliateCode": affiliateCode,
        "endpointUrl": endpointUrl,
        "withInvoice": false,
        "expireMinutes": 20,
        "externalCode": data.cart.order.orderNumber,
        "paymentDescription": "Pago de Productos",
        "reserved1": data.storeId,
        "reserved2": data.token,
        "details": [{
            concept: `Compra de productos en ${data.merchantAppSettings.storeName}`,
            productImageUrl: null,
            quantity: 1,
            unitPrice: data.cart.order.total
        }],
        ...additionalData,
    }
}

export default createURL;