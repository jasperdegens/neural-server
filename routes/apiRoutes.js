var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest : 'tempUploads/'});
var Job = require('../models/Job');
var AWS = require('aws-sdk');
var s3 = new AWS.S3({region: 'us-east-1'});
var BUCKET = 'neural-style';
var fs = require('fs');
var Q = require('q');


/* GET current jobs. */
router.get('/jobs', function(req, res, next) {
  Job.find({job_complete : false}, 
           {_id : 1, content_image : 1, style_image : 1},
  function(err, jobs){
    if (err) {next(err, req, res); return;}
    res.send(jobs);
  });
});

/* POST job complete 
 * Steps:
 *   1. Update job to complete in DB
 *   2. Send email with link to file to person or maybe attach image?
 */
router.post('/job/complete', function(req, res, next){
  var id = req.body.id;
  var final_image = req.body.final_image;
  Job.findById(id, function(err, job){
    if(err) {next(err, req, res); return;}
    job.date_completed = new Date.now;
    job.job_complete = true;
    final_image = final_image;
    job.save(function(err){
      if(err){next(err, req, res); return;}
      res.send(job);        
    });
  });
});

/* POST -- create job 
 * tasks:
 *   - upload images
 *   - check to make sure less than 500x500px, resize if necessary
 *   - upload to s3
 *   - add urls to db
 */
var uploadImgs = upload.fields([
  {name: 'content_image', maxCount: 1}, 
  {name: 'style_image', maxCount: 1} 
]);
router.post('/job', uploadImgs, function(req, res, next) {
  Q.all([
    processImage(req.files.content_image[0]),
    processImage(req.files.style_image[0]),
  ])
  .then(function(paths){  
    var data = req.body;
    var email = data.email;
    var content_img = paths[0]; //key in s3 bucket
    var style_img = paths[1];  // key in s3 bucket
    var job = new Job({
      email: email,
      content_image : content_img,
      style_image : style_img,
      isPublic : data.isPublic
    });
    job.save(function(err, obj){
      if (err) {next(err, req, res); return; }
      res.send(obj);
    });
  })
  .then(null, function(error){
    console.log(error);
    res.sendstatus(500);
  });
});


// consists of 4 steps:
//   1. Upload to server
//   2. Resize if necessary
//   3. Upload to s3
//   4. Remove photo from this machine
//   5. Return s3 bucket key for file
function processImage(file){
  return uploadImageLocal(file)
  .then(resizeImage)
  .then(function(localPath){
    return uploadToS3(localPath)
    .then(function(cloudPath) {
      return deleteImage(localPath)
      .then(function(d){
        return cloudPath;
      });
    });
  });
}

var path_helper = require('path');
function uploadToS3(path){
  var deferred = Q.defer();
  var stream = fs.createReadStream(path);
  var key = path_helper.basename(path);
  var params = {Bucket: BUCKET, 
                Key: key,
                Body: stream};
  s3.putObject(params, function(err, data){
    if(err){console.log('bad upad');deferred.reject(err);}
    deferred.resolve(key);
  });
  return deferred.promise;
}

// TODO: check if file name already exists
function uploadImageLocal(file){
  var deferred = Q.defer();
  var destPath = file.destination + file.originalname;
  fs.rename(file.path, destPath, function(err){
    if(err){deferred.reject(new Error(err));}
    deferred.resolve(destPath);
  });  
  return deferred.promise;
}

function deleteImage(path){
  return Q.nfcall(fs.unlink, path);
}

var lwip = require('lwip');
function resizeImage(path){
  var deferred = Q.defer();
  lwip.open(path, function(err, image){
    if(err){deferred.reject(err)};
    // resize to max 600px for largest side
    var width = image.width();
    var height = image.height();
    console.log('img width: ' + width);
    console.log('img height: ' + height);
    var largest = width > height ? width : height;
    if (largest > 600) {
      // need to resize with scale of 2 digits
      var scale = Math.floor((600.*100.) / largest) / 100;
      console.log('scale is: ' + scale);
      
      image.batch()
      .scale(scale)
      .writeFile(path, function(err){
        if(err){deferred.reject(err);}
        deferred.resolve(path);
      });
    } else {
      deferred.resolve(path);
    }
  });
  return deferred.promise;
}


module.exports = router;
