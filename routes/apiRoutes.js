var express = require('express');
var router = express.Router();
var multer = require('multer');
var Job = require('../models/Job');
var AWS = require('aws-sdk');
var s3 = new AWS.S3({region: 'us-east-1'});
var BUCKET = 'neural-style';
var fs = require('fs');
var Q = require('q');
var config = require('../config');
var sendgrid = require('sendgrid')(config.sendgrid);
var path_helper = require('path');

var imgProcessor = require('./imgProcessor');

var storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, 'tempUploads/');
  },
  filename: function(req, file, cb){
    var fileType = file.mimetype.match(/[^\/][\w]*$/g)[0];
    cb(null, Date.now() + '.' + fileType);
  }
});

var upload = multer({
  storage : storage
});

// max dimension for picture upload
var MAX_SIZE = 600;

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
var BASE_BUCKET_PATH = 'neural-style.s3-website-us-east-1.amazonaws.com/';
router.post('/job/complete', function(req, res, next){
  var id = req.body.id;
  var final_image = req.body.final_image;
  Job.findById(id, function(err, job){
    if(err) {next(err, req, res); return;}
    job.date_completed = Date.now();
    job.job_complete = true;
    job.final_image = final_image;
    job.save(function(err){
      if(err){next(err, req, res); return;}
      var url = BASE_BUCKET_PATH + job.final_image;
      sendEmail({
        to: job.email,
        url: url
      }).then(function(){res.sendStatus(200);},
              function(){res.sendStatus(500);});
    });
  });
});


/* POST -- create job 
 * tasks:
 *   - retrieve uploaded images
 *   - resize image if necessary -- should be resized on client, but fallback for future api
 *   - upload to s3
 *   - enter job into db
 *   - check if should turn on img-processor
 */
var uploadImgs = upload.fields([
  {name: 'content_image', maxCount: 1},
  {name: 'style_image', maxCount: 1}
]);
router.post('/job', uploadImgs, function(req, res, next) {

  // do not do anything for dev purposes
  res.sendStatus(500);
  return;


  var filesToProcess = [];
  filesToProcess.push(processImage(req.files.content_image[0]));
  
  // style image can be either link or file:
  // check if style_image exists in req.body -- 
  //   if it does not, we know we uploaded a file, otherwise, it is already in bucket
  if(!req.body.style_image && req.files.style_image){
    console.log('file for style');
    filesToProcess.push(processImage(req.files.style_image[0]));
  }

  Q.all(filesToProcess)
  .then(function(paths){
    console.log('made it past all file stuff');
    var data = req.body;
    var content_img = paths[0]; //key in s3 bucket
    var style_img = req.body.style_image ? path_helper.basename(req.body.style_image) : paths[1];  // key in s3 bucket
    
    // create entry to store in db
    var job = new Job({
      email: data.email,
      content_image : content_img,
      style_image : style_img,
      isPublic : data.isPublic
    });
    job.save(function(err, obj){
      if (err) {next(err, req, res); return; }
      // activate img processor if emought jobs submitted
      // imgProcessor.checkRun();

      res.send(obj);
    });
  })
  .then(null, function(error){
    console.log(error);
    res.sendStatus(500);
  });
});


// consists of 4 steps:
//   1. Upload to server
//   2. Resize if necessary
//   3. Upload to s3
//   4. Remove photo from this machine
//   5. Return s3 bucket key for file
function processImage(file){
  var path = file.destination + file.filename;
  return resizeImage(path)
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
    if (largest > MAX_SIZE) {
      // need to resize with scale of 2 digits
      var scale = Math.floor((MAX_SIZE*100.0) / largest) / 100;
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

function sendEmail(params){
  var deferred = Q.defer();
  var to = params.to;
  var from = params.from || "artwork@neural-style.com";
  var subject = params.subject || 'Your Image is Ready!';
  var baseMessage = '<p>Hi there!</p><p>Exciting news: your image is ready to view and download. Please travel to <a href="{url}">this page</a> to view your image!</p><br/><p>Thanks,</p><p>The Neural Image Team</p>';
  sendgrid.send({
    to: to,
    from: from,
    subject: subject,
    html: baseMessage.replace("{url}", params.url)
  }, function(err, json){
    if (err) {
      deferred.reject(err);
    }
    deferred.resolve(json);
  });
  return deferred.promise;
}


module.exports = router;
