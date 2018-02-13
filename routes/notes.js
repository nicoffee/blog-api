var express = require('express');
var router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017';

const dbName = 'notes';

const insertNotes = function(db, callback, data) {
  const collection = db.collection('documents');
  collection.insertMany([data], function(err, result) {
    callback(result);
  });
};

module.exports = insertNotes;

router.put('*', function(req, res, next) {
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);

    const db = client.db(dbName);

    insertNotes(
      db,
      function() {
        client.close();
      },
      req.body
    );

    if (!err) {
      res.send(res.body);
    }
  });
});

module.exports = router;
