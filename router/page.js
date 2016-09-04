var express = require('express');
var router = express.Router();


router.get('/',function(req,res){
  res.cookie("id",12588);
  //res.send("Hello world!");
  //
  var filename =  req.params.name;
  filename = (typeof filename == 'undefined' )? "index.html" :req.params.name;
  //res.send(filename);

  res.sendFile(filename, {
    root: __dirname + '/www/',
  },function(err){
    if (err) {
      res.status(err.status).end();
    }
  });
});


module.exports = router;