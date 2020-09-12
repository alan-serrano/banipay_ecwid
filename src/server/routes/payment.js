import express from 'express';
import React from 'react';
import ReactDom from 'react-dom/server';
import App from '../../client/components/app';
import mockData from '../mockData.json';

const router = express.Router();

function BodyComponent({children}) {

    return (
        <html>
            <body>
                <div id="root">
                    <App/>
                </div>
                <script src="/static/bundle.js"></script>
                {children}
            </body>
        </html>
    )
}

router.route('/')
    .get((req, res) => {
        const root = (
            <BodyComponent />
        )

        const html = ReactDom.renderToString(root);

        res.send(`
            <!DOCTYPE html>
            ${html}
        `)
    })
    .post((req, res) => {
        const data = req.body.data;
        const root = (
            <BodyComponent>
                <script id="data"
                    dangerouslySetInnerHTML={{
                        __html: `window.__data__ = ${JSON.stringify({
                            ...getOrderData(),
                            encrypteData: data,
                        })};`
                    }}
                />
            </BodyComponent>
        );

        const html = ReactDom.renderToString(root);

        res.send(`
            <!DOCTYPE html>
            ${html}
        `)
    })
;

function getOrderData() {
    const data = mockData;

    return mockData;
}

export default router;
