/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
        var collection = db.collection('books');
        collection.aggregate([
          { $project: { title: 1, commentcount: { $size: "$comments" } } }]
        ).toArray(function(err, books){
          !err ? res.json(books) : res.send(err);
        });
      });
    })

    .post(function (req, res){
      var title = req.body.title;
      //response will contain new book object including at least _id and title
      MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
        var collection = db.collection('books');
        var book = { title: title, comments: [] };

        collection.insertOne(book, function(err, doc){
          book._id = doc.insertedId;
          delete book.comments;
          !err ? res.json(book) : res.send(err);
        })
      });
    })

    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
        var collection = db.collection('books');
        collection.remove({}, function(err, result){
          //console.log(result.n);
          !err ? res.send('complete delete successful') : res.send(err);
        })
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
    })

    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
    });

};
