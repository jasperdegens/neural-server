/* Nightly Tasks 

 * nightly process that will turn on
   img-process server if there are
   awaiting jobs 

*/

var CronJob = require('cron').CronJob;
var aws = require('aws-sdk');
aws.config.update({region:'us-east-1'});

// job fires every day except wednesday
var cronJob = new CronJob('00 00 5 * * *', function(){
  checkJobs(function(enoughJobs){
    if (enoughJobs) {
      startImgProcessor();
    } else {
      console.log('not enoigh jobs');
    }
  });
});


var Job = require('./models/Job');
function checkJobs(callback){
  Job.find({}, function(err, jobs){
    if(jobs.length > 2){
      callback(true);
    } else {
      callback(false);
    }
  });
}



function startImgProcessor(){
  var ec2 = new aws.EC2();
  var params = {Filters: [
      {
        Name: 'tag-value',
        Values: ['img-processor']
      }
    ]};

  ec2.describeInstances(params, function(err, data){
    console.log(data.Reservations[0]);
    var instanceId = data.Reservations[0].Instances[0].InstanceId;
    startInstance(instanceId);
  });
}

function startInstance(instanceId){
  var params = {InstanceIds: [instanceId], DryRun: true};
  ec2.stopInstances(params, function(err, res){
    console.log('error: ' + err);
    console.log(res);
  });
}

module.exports = cronJob.start.bind(cronJob);