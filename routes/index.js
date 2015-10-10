var express = require('express');
var router = express.Router();
var Job = require('../models/Job');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('full_image', { title: 'Neural Painter' });
});


/* GET completed jobs to view */
router.get('/examples', function(req, res, next){
  var q = Job.find(
            {isPublic : true, job_complete : true},
            {content_image : 1, style_image : 1,
            final_image : 1, date_completed : 1}
          ).sort({date_completed : -1})
           .limit(6);


  q.exec(function(err, jobs){
    console.log(jobs);
    if(err) {next(err, req, res); return;}
    res.render('jobs', {jobs: jobs});
  });
});

router.get('/upload', function(req, res, next) {
  res.render('index', { title: 'Neural Painter' });
});

router.get('/redesign', function(req, res, next){
  res.render('full_image', {title: 'Neural Painter'});
});

module.exports = router;
