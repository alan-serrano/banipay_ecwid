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
        const data = getData(req.body.data);
        const notificationUrl = `https://${req.get('host')}/payment/notification`;
        const successUrl = `https://${req.get('host')}/payment/notification`;

        registerTransaction(data, {notificationUrl, successUrl})
            .then(register => {
                if(register) {
                    console.log(register);
                    res.redirect(register.urlTransaction);
                } else {
                    // Redireccionar a Ecwid con mensaje de error
                    res.json({
                        message: 'Error en crear la url de pago'
                    })
                }
            })
            .catch(err => {
                // console.log(err);
                // Redireccionar a Ecwid con mensaje de error
                res.json({
                    message: "Error"
                })
            }) 
        ;
    })
;

router.route('/notification')
    .get((req, res)=> {
        let {successUrl, accessToken} = req.query;

        const paramsEcwid = new URL(successUrl);
        let storeId = paramsEcwid.pathname.split('/');
        storeId = storeId[storeId.length - 1];

        const referenceTransactionId = paramsEcwid.searchParams.get('orderId');
        
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

function getData(data) {
    return decrypt(data)
}

export default router;
