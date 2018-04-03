import * as express from 'express';
import * as jwt from 'jsonwebtoken';
let api = express.Router();

global['secret'] = 'jsdjrfozej654541fkn';

api.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  next();
});

api.use('/authentication', require('./authentication'));

api.use((req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, global['secret'], (err, decoded) => {
       if (err) {
         return res.json({ success: false, error: 'Failed to authenticate token.' });
       } else {
         // if everything is good, save to request for use in other routes
         req.decoded = decoded;
         next();
       }
     });
  } else {
    return res.status(403).send({
      success: false,
      error: 'No token provided.'
    });
  }
});

api.use('/posting', require('./posting'));



module.exports = api;
