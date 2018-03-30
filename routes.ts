import * as mongoose from 'mongoose';
import * as express from 'express';

var api = express.Router();

var Kitten = require('./schema')

mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  api.get('/user', (req, res) => {
    var silence = new Kitten({ name: 'Silence' });
    res.send(JSON.stringify([
      {
        'id': 1,
        'name': silence.name,
        'content': 'hello'
      }
      ]));
    }
  )
});

module.exports = api;
