import * as express from 'express';

let trusting = express.Router();

// owner creates a trust
trusting.post('/trusts/create', (req, res) => {
  return res.json({
    success: true
  });
});

// data from the trust
trusting.get('/trusts/:trust', (req, res) => {
});

// owner changes the trust
trusting.post('/trusts/:trust/update', (req, res) => {
});

// owner deletes the trust
trusting.get('/trusts/:trust/delete', (req, res) => {
});
