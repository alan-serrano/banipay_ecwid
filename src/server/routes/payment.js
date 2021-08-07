import express from 'express';
import {URL} from 'url';
import {config} from 'dotenv';
import {decrypt, registerTransaction} from '../services';
import axios from 'axios';
config();

const router = express.Router();

router.route('/')
    .get((req, res) => {
        res.json({
            message: 'Acceso no permitido'
        })
    })
    .post((req, res) => {
        const data = decryptData(req.body.data); // Decrypt data from ecwid
        const host = req.get('host'); //domain that Express is running on
        const notificationUrl = `https://${host}/payment/notification`;
        const successUrl = `https://${host}/payment/notification`;
        const failedUrl = data.returnUrl ? `${data.returnUrl}&errorMsg=${encodeURIComponent('Ocurrió un error en el método de pago')}` : null;

        registerTransaction(data, {notificationUrl, successUrl, failedUrl})
            .then(register => {
                if(register) {
                    res.redirect(register.urlTransaction);
                } else if(failedUrl) {
                    res.redirect(failedUrl)  // Redireccionar a Ecwid con mensaje de error
                } else {
                    res.json({
                        message: 'Ocurrió un error en el método de pago'
                    })
                }
            })
            .catch(err => {
                // Redireccionar a Ecwid con mensaje de error
                if(failedUrl) {
                    res.redirect(failedUrl)  // Redireccionar a Ecwid con mensaje de error
                } else {
                    res.json({
                        message: 'Ocurrió un error en el método de pago',
                        error: err
                    })
                }
            }) 
        ;
    })
;

router.route('/notification')
    .get((req, res)=> {
        const {
            successUrl,
            accessToken,
            storeId,
            referenceTransactionId
        } = getEcwidParams(req.query);
        
        if(successUrl) {
            let endPointEcwidStore = `https://app.ecwid.com/api/v3/${storeId}/orders/transaction_${referenceTransactionId}?token=${accessToken}`;

            axios({
                method: 'PUT',
                url: endPointEcwidStore,
                headers: {
                    'Content-Type': 'application/json',
                },
                data: {
                    "paymentStatus": "PAID"
                }
            }).then((responseEcwid)=> {
                res.redirect(successUrl);
            }).catch((err)=> {
                // Redireccionar a Ecwid con mensaje de console.error();
                res.send(err);
            })
        }
    })
    .post((req, res)=> {
        // Handle requests from banipay for changes in payment status

        const {
            externalCode: referenceTransactionId,
            reserved1: storeId,
            reserved2: accessToken,
            paymentStatus
        } = req.body;

        let endPointEcwidStore = `https://app.ecwid.com/api/v3/${storeId}/orders/transaction_${referenceTransactionId}?token=${accessToken}`;
        
        if(paymentStatus === 'PROCESSING') {
            axios({
                method: 'PUT',
                url: endPointEcwidStore,
                headers: {
                    'Content-Type': 'application/json',
                },
                data: {
                    "paymentStatus": "PAID"
                }
            }).then((responseEcwid)=> {
                res.json({message: 'Actualizado'});
            }).catch((err)=> {
                res.send(err);
            })
        }
        

        // res.json({message: 'Actualizado'})
    })
;

function decryptData(data) {
    return decrypt(data)
}



/*

This function get all the params from and URL that comes in this way:
URL = `https://integration.com/payment/notification?successUrl=https%3A%2F%2Fapp.ecwid.com%2Fcustompaymentapps%2F1003%3ForderId%3D123456%26clientId%3Dmollie-pg&accessToken=asdf1234`
EncodedUriSuccessUrl = https%3A%2F%2Fapp.ecwid.com%2Fcustompaymentapps%2F1003%3ForderId%3D123456%26clientId%3Dmollie-pg
DecodedUriSuccessUrl = https://app.ecwid.com/custompaymentapps/1003?orderId=123456&clientId=mollie-pg`.

getEcwidParams(URL) returns:
 {
    storeId: '1003',
    referenceTransactionId: '123456,
    accessToken: asdf1234,
    successUrl: https%3A%2F%2Fapp.ecwid.com%2Fcustompaymentapps%2F1003%3ForderId%3D123456%26clientId%3Dmollie-pg
 }
 
*/
function getEcwidParams(reqQuery) {
    const {successUrl, accessToken} = reqQuery;
    const paramsEcwid = new URL(successUrl);
    let storeId = paramsEcwid.pathname.split('/');
    storeId = storeId[storeId.length - 1];

    const referenceTransactionId = paramsEcwid.searchParams.get('orderId');

    return {
        storeId,
        referenceTransactionId,
        accessToken,
        successUrl,
    }
}

export default router;
