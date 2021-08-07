import express from 'express';
import {config} from 'dotenv';
config();

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'BaniPay Config',
    endpointUrlTest: process.env.END_POINT_TEST,
    affiliateCodeTest: process.env.AFFILIATE_CODE_TEST,
    nameSpaceApp: process.env.NAME_SPACE_APP
  });
});

export default router;
