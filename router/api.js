// Create instance of express
var express = require('express');

// Create instance of express router
var router = express.Router();

// requiure js function file
var func = require('../libs/functions');


// Using MongoDB
var db = require( '../libs/mongo' );
var collection = db.collection('works');
var ObjectID = require('mongodb').ObjectID;

// Get one order
router.get('/get/:id', function(req, res, next) {

  var oid = new ObjectID(req.params.id);

  collection.findOne({_id:oid}, function(err, order) {
      if (err) {
        throw err;
      }
      res.send(order);
    })

});


// Query all orders
router.get('/:status/:sortingKey/:sortingOrder', function(req, res, next) {

  var query = {};
  if (req.params.status.toLowerCase() !='all') {
    query["status"] = req.params.status.toLowerCase();
  }

  var sorting = {};
  if (req.params.sortingKey=='id') {
    sorting["_id"] = parseInt(req.params.sortingOrder);
  } else if (req.params.sortingKey=='time') {
    sorting["created_at"] = parseInt(req.params.sortingOrder);
  } else {
    sorting[req.params.sortingKey] = parseInt(req.params.sortingOrder);
  }


  collection.find(query).sort(sorting).toArray(function(err, result) {
    if (err) {
      throw err;
    }

    // Init database
    if (result.length==0 && req.params.status.toLowerCase() == 'all') {
      var data = [
        {
          "subject":"Open an account for new customer",
          "priority":"medium",
          "status":"active",
          "created_at": Date().toString()
        },
        {
          "subject":"Fixing broken Wifi",
          "priority":"high",
          "status":"active",
          "created_at": Date().toString()
        }
      ];


      collection.insert(data);

      result = data;
    }

    var output = [];
    for (var item of result) {
      item['duration'] = func.calTimeDuration(item.created_at);
      output.push(item);
    }

    res.send(result);
  });
});

// Query with keyword
router.get('/:status/:sortingKey/:sortingOrder/:keyword', function(req, res, next) {
  var query = {};
  if (req.params.keyword) {
    query["subject"] = new RegExp(req.params.keyword, 'i');
  }
  

  if (req.params.status.toLowerCase() !='all') {
    query["status"] = req.params.status.toLowerCase();
  }


  collection.find(query).toArray(function(err, result) {
    if (err) {
      throw err;
    }

    var output = [];
    for (var item of result) {
      item['duration'] = func.calTimeDuration(item.created_at);
      output.push(item);
    }

    res.send(output);
  });
});

// Add new order
router.post('/insert', function(req, res, next){
  var date = new Date();

  var reStatus = false;
  var reMessage;

  var subject = req.body.subject;
  var priority= req.body.priority;
  var status  = req.body.status;
  var create_at= date.toString();

  if(subject==''){
    reMessage = "Please enter a subject.";
    reStatus  = false;
  }else if(priority==''){
    reMessage = "Please select a priority.";
    reStatus  = false;
  }else if(status==''){
    reMessage = "Please select a status.";
    reStatus = false;
  }else{
    reMessage = "Done.";
    reStatus = true;

    collection.insert({subject: subject, priority: priority, status: status, created_at: create_at}); 
  }

  var ret = {status: reStatus, message: reMessage};

  res.send(ret);

});

// Update order
router.put('/update', function(req, res, next){
  var date = new Date();

  var reStatus = false;
  var reMessage;

  var id      = req.body.id; 
  var subject = req.body.subject;
  var priority= req.body.priority;
  var status  = req.body.status;


  //collection.update({_id:ObjectId("57cb21713e0be145dcc2058d")},{$set:{'subject':'New MongoDB Tutorial'}})

  if(id=""){
    reMessage = "Invalid order ID.";
    reStatus  = false; 
  }else if(subject==''){
    reMessage = "Please enter a subject.";
    reStatus  = false;
  }else if(priority==''){
    reMessage = "Please select a priority.";
    reStatus  = false;
  }else if(status==''){
    reMessage = "Please select a status.";
    reStatus = false;
  }else{

    var oid = new ObjectID(req.body.id);

    var data = {
      'subject': req.body.subject,
      'priority': req.body.priority,
      'status': req.body.status
    };

    reMessage = "Updated.";
    reStatus  = true;


    collection.update(
        { "_id": oid },
        { $set:  data},
        function (err, documents) {
          if(err){
            throw err;
          }

          //var ret = {status: reStatus, message: reMessage};
          //res.send(ret);
        }
    );   
    
  }

  var ret = {status: reStatus, message: reMessage};
  res.send(ret);

});
module.exports = router;