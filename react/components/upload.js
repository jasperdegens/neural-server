var React = require('react'),
    Link = require('react-router').Link;


var classname = require('classname');

class ImgUploadBox extends React.Component {
  constructor(args) {
    super();
    this.state = { inputValue : null};
  }


  handleFile(e) {
    var self = this;
    var reader = new FileReader();
    var file = e.target.files[0];
    reader.onload = function(upload){
      self.setState({
        inputValue : upload.target.result
      });
    };
    reader.readAsDataURL(file);
  }

  render() {
    var containerClasses = classname('drop-area', this.props.className);
    // set preview background if file is uploaded
    var previewStyle = this.state.inputValue ? {backgroundImage : 'url(' + this.state.inputValue + ')'} : {};

    return (
      <div className={containerClasses}>
        <div className={classname('preview', {'active' : this.state.inputValue})} style={previewStyle} />
        <div className="drop-description">
          <div className="file-input uk-button-large uk-button-success">
            <span>{this.props.description}</span>
            <input type="file" name={this.props.name} accept="image/*" onChange={this.handleFile.bind(this)} required />
          </div>
        </div>
      </div>
    )
  }

}




class UploadForm extends React.Component {
  constructor(args) {
    super();
    this.state = {uploading : false, uploadPercent : 0};
  }

  handleSubmit(e) {
    e.preventDefault();
    var formData = new FormData();
    // loop over images and create form to submit
    // NOTE: all refs need inputValue as state and name in props!!!
    var images = ['content_image', 'style_image'];
    images.map(key => {
      const val = this.refs[key];
      formData.append(val.props.name, val.state.inputValue);
    });
    // add remaining form fields
    formData.append('email', this.refs['email']);
    formData.append('isPublic', this.refs['isPublic'].checked);
    this.setState({
      uploading : true
    });
    this.simulateUpload.call(this, 0);
  }



  simulateUpload(percent){
    if (percent > 1000) {
      this.setState({uploading: false, uploadPercent: 0});
      return;
    }
    var self = this;
    console.log(percent);
    self.handleUpload({loaded:percent, total: 1000});
    setTimeout(function(){
      self.simulateUpload.call(self, percent+10);
    }, 200);
  }

  componentDidMount() {
    // this.simulateUpload.call(this, 0);
  }

  handleUpload(e){
    var percent = Math.floor((e.loaded * 100) / e.total);
    if (percent >= 100) { percent = 99;}
    this.setState({uploadPercent : percent});
  }

  render() {


    return (
        <form action="#" onSubmit={this.handleSubmit.bind(this)}>
          <ImgUploadBox ref="content_image" name="content_image" description="Upload Your Photo"/>
          <ImgUploadBox ref="style_image" name="style_image" description="Upload Painting" />
          <input ref="email" type="email" placeholder="Enter email address" required />
          <input ref="isPublic" name="isPublic" type="checkbox" defaultChecked="true" />
          <button className='uk-button uk-button-primary'>Submit</button>
        </form>
      )
  }
    
};

module.exports = UploadForm;