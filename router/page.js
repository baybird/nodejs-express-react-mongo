var express = require('express');
var router = express.Router();


router.get('/',function(req,res){
  //res.cookie("id",12588);

  var filename =  req.params.name;

  // If requested file not existed then send index.html as default page
  filename = (typeof filename == 'undefined' )? "index.html" :req.params.name;

  res.sendFile(filename, {
    root: __dirname + '/www/',
  },function(err){
    if (err) {
      res.status(err.status).end();
    }
  });
});


module.exports = router;