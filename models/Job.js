var mongoose = require('mongoose');

var jobSchema = new mongoose.Schema({
  email : String,
  content_image : String,
  style_image : String,
  isPublic : {type: Boolean, default: true}, //whether will be publically listed
  job_complete : {type: Boolean, default: false},
  final_image : {type: String, default: ''},
  date_completed: {type: Date, default: null},
  date_created: {type: Date, default: Date.now}
  
});


module.exports = mongoose.model('Job', jobSchema);
