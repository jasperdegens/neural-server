var mongoose = require('mongoose');

var jobSchema = new mongoose.Schema({
  email : String,
  content_image : String,
  style_image : String,
  isPublic : {type: Boolean, default: true}, //whether will be publically listed
  job_complete : {type: Boolean, default: false},
  final_image : {type: String, default: ''},
  date_completed: {type: Date, default: null},
  date_created: {type: Date, default: Date.now},
  exampleId : {type: String, unique: true} // used when sending link
});

jobSchema.pre('save', function(next){
  if(!this.exampleId){
    this.exampleId = this.content_image.replace(/\.[^/.]+$/, "");
  }
  next();
});


module.exports = mongoose.model('Job', jobSchema);
