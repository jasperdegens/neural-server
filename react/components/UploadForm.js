var React = require('react'),
    Link = require('react-router').Link,
    Checkbox = require('material-ui/lib/checkbox'),
    RaisedButton = require('material-ui/lib/raised-button'),
    FlatButton = require('material-ui/lib/flat-button'),
    TextField = require('material-ui/lib/text-field'),
    Dialog = require('material-ui/lib/dialog'),
    Paper = require('material-ui/lib/paper'),
    LinearProgress = require('material-ui/lib/linear-progress'),
    styles = require('../styles');


var classname = require('classname');

class ImgUploadBox extends React.Component {
  constructor(args) {
    super();
    this.state = { inputValue : null, isDataURI : false};
  }

  resetState(){
    this.setState({
      inputValue : null, isDataURI : false
    });
  }

  handleFile(e) {
    var self = this;
    var reader = new FileReader();
    var file = e.target.files[0];
    reader.onload = function(upload){
      var img = resizeImage.call(self, upload.target.result, function(resizedImg){
        self.setState({
          inputValue : resizedImg,
          isDataURI: true
        });
      });
    };
    reader.readAsDataURL(file);
  }

  handleClick(e){
    this.setState({
      inputValue : e.target.src,
      isDataURI: false
    });
  }

  handleClose(){
    this.setState({
      inputValue : null
    });
  }

  render() {
    var containerClasses = classname('drop-area', this.props.className);
    // set preview background if file is uploaded
    var previewStyle = this.state.inputValue ? {backgroundImage : 'url(' + this.state.inputValue + ')'} : {};

    var absoluteStyle = {
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0'
    };

    var backgroundSelectableImages;
    if(this.props.defaultImages){

      var imgStyle = {
        minWidth: '60px',
        maxHeight: '90px',
        flex: '0 0 auto',
        cursor: 'pointer'
      };

      var flexStyleAdditions = {
        justifyContent: 'space-around',
        alignContent: 'space-around'
      };

      backgroundSelectableImages = (
        <div style={Object.assign({}, styles.flexContainer, absoluteStyle, flexStyleAdditions)}>
          {this.props.defaultImages.map((image, i) => {
            return (
              <img 
                  key={"img_" + i}
                  src={image} 
                  style={Object.assign({}, imgStyle)}
                  onClick={this.handleClick.bind(this)} />
            );
        })}
        </div>
      );
    };

    var closeButtonStyle = {
      float: 'right',
      margin: '10px 10px 0 0'
    };

    return (
      <div className={containerClasses}>
        <div className={classname('preview', {'active' : this.state.inputValue})} style={previewStyle}>
          <div className="closeButton" onClick={this.handleClose.bind(this)} />
        </div>
        {backgroundSelectableImages}
        <div className="drop-description">
          <RaisedButton 
              containerElement="div"
              label={this.props.description} 
              className="file-input">
            {this.state.inputValue ? '' : <input type="file" name={this.props.name} accept="image/*" onChange={this.handleFile.bind(this)} required />}
          </RaisedButton>
        </div>
      </div>
    )
  }
}


class UploadModal extends React.Component {
  constructor(args){
    super(args);
  }

  render() {
          
    var uploadStatus = this.props.uploadStatus;
    console.log(uploadStatus);      
    var isOpen = (uploadStatus === 'stopped') ? false : true;

    var titleText, 
        subHeadStyle = {margin: '0 0 7px 0'},
        subHeadText,
        paperContent,
        actions = [];

    var green = '#00e676';

    if(uploadStatus === 'complete'){
      titleText = 'Success!';
      subHeadStyle.color = green;
      subHeadText = 'Your images have uploaded!';

      paperContent = (
        <p style={Object.assign({}, styles.paragraphStyle, {margin: '0'})}>
        We have received your request and are working to process your images. 
        Depending on our job queue, this could take several minutes, or up to a day. 
        We will send you an email with a link to view and download your new artistic 
        creation. The email we send may be put into your spam folder.</p>
      );
      actions = [
        <FlatButton 
            key="upload"
            secondary={true} 
            label="Upload Another"
            onClick={this.props.handleResetForm} />,
        <FlatButton 
            key="close"
            label="Close"
            onClick={this.props.handleResetForm} />
      ];

    } else if (uploadStatus === 'uploading') {
      titleText = 'Uploading Images...';
      subHeadText = 'Please wait while we process your images.';
      paperContent = (
          <p style={Object.assign({}, styles.paragraphStyle, {margin: '0'})}>
            <span 
              style={{fontWeight: 'bold', color: '#00bcd4', margin: '0'}}>
            Note:</span> I am not made of money, and your 
          image will not be mashed up until there are enough requests. 
          You will be sent an email when your job is ready</p>
      );
      
    } else {
      titleText = 'Error';
      subHeadText = 'Sorry, but there was an error with the upload.'
      subHeadStyle.color = '#ff5722';
      paperContent = (
        <p style={Object.assign({}, styles.paragraphStyle, {margin: '0'})}>
        We are taking a look to see what the problem is. Please try again.</p>
      );
      actions = [
        <FlatButton 
            key="close"
            label="Close"
            onClick={this.props.handleResetForm} />
      ];
    }



    return (
      <Dialog
          title={titleText}
          open={isOpen}
          actions={actions}
          style={{zIndex:'999'}}
          bodyStyle={{paddingTop: '10px'}}>
        <h4 style={subHeadStyle}>{subHeadText}</h4>
        {uploadStatus === 'uploading' ? <LinearProgress
            mode="determinate"
            value={this.props.uploadPercent} 
            style={{height: '20px'}}/>
        : null }
        <Paper style={{padding: '7px 10px', marginTop: '15px', background: '#ededed'}}>
          {paperContent}
        </Paper>

      </Dialog>
    );
  }
}


class UploadForm extends React.Component {
  constructor(args) {
    super();
    this.state = {uploadStatus : 'stopped', uploadPercent : 0};
  }

  resetState() {
    for (var ref in this.refs){
      if(this.refs[ref].resetState){
        this.refs[ref].resetState();
      }
    }
    this.setState({
      uploadStatus : 'stopped',
      uploadPercent : 0
    });
  }

  toggleTab(value){
    this.props.toggleTabHandler(value);
  }

  handleSubmit(e) {
    e.preventDefault();
    var formData = new FormData();
    // loop over images and create form to submit
    // NOTE: all refs need inputValue as state and name in props!!!
    var images = ['content_image', 'style_image'];
    images.map(key => {
      const val = this.refs[key];
      var inputValue = val.state.inputValue;
      if (val.state.isDataURI) {
        inputValue = dataURItoBlob(inputValue);
      }
      formData.append(val.props.name, inputValue);
    });
    // add remaining form fields
    formData.append('email', this.refs['email'].getValue());
    formData.append('isPublic', this.refs['isPublic'].isChecked());
    this.setState({
      uploadStatus : 'uploading'
    });

    var r = new XMLHttpRequest();
    r.open("POST", "/api/job", true);
    var self = this;
    r.onreadystatechange = function () {
      if (r.readyState != 4) return;
      if (r.status != 200){
        self.handleUploadError.call(self);
        return;
      }
      self.handleUploadSuccess.call(self);
    };
    r.addEventListener('progress', this.handleUploadProgress.bind(this));
    r.addEventListener('error', this.handleUploadError.bind(this));
    r.send(formData);
  }



  simulateUpload(percent){
    this.setState({
      uploadStatus : 'uploading'
    });
    if (percent > 1000) {
      this.setState({uploadStatus: 'complete'});
      return;
    }
    var self = this;
    self.handleUpload({loaded:percent, total: 1000});
    setTimeout(function(){
      self.simulateUpload.call(self, percent+100);
    }, 200);
  }

  componentDidMount() {
  }

  handleUploadSuccess(e){
    this.setState({
      uploadStatus: 'complete'
    });
  }

  handleUploadError(e){
    this.setState({
      uploadStatus : 'error'
    });
  }

  handleUploadProgress(e){
    var percent = Math.floor((e.loaded * 100) / e.total);
    if (percent >= 100) { percent = 99;}
    this.setState({uploadPercent : percent});
  }

  render() {

    var description = "Submit a photo of yours and a painting of an artist you fancy. Your photo will be magically redrawn using the artist's style! Or try any other crazy experiment and see what happens.";

    var lightColor = 'white';
    var darkColor = 'black';


    var flexRowStyle = {
      flex: '1 0 300px'
    };

    var headingStyle = {
      color: lightColor,
      textAlign : 'center',
      margin: '10px 0 10px 0',
      fontSize: '18px',
      fontWeight: '300'
    };

    var labelOffset = {
      marginRight: '10px',
      color: lightColor
    };

    var rowOffset = {
      marginTop : '20px'
    };

    var descriptionBoxStyle = {
      background: 'rgb(230, 230, 230)',
      padding: '10px 20px',
      marginBottom: '20px',
      border: '3px solid #555'
    };

    var titleStyle = {
      color: '#949494',
      margin: '0',
      fontWeight: '500',
      fontSize: '25px'
    };

    var descriptionStyle = {
      lineHeight: '28px',
      fontWeight: '100',
      color: '#555',
      fontSize : '15px'
    };

    var defaultStyleImages = [
      'https://s3.amazonaws.com/neural-style/meaning-of-the-scream-painting-by-edvard-munch-art.jpg',
      'https://s3.amazonaws.com/neural-style/Claude_Monet%2C_Saint-Georges_majeur_au_cr%C3%A9puscule.jpg',
      'https://s3.amazonaws.com/neural-style/the-kiss.jpg',
      'https://s3.amazonaws.com/neural-style/monet.jpg',
      'https://s3.amazonaws.com/neural-style/starry_night.jpg'
    ];

    return (
        <div>
          <div style={descriptionBoxStyle}>
            <h1 style={titleStyle}>Prepare to have your mind blown!</h1>
            <p style={styles.paragraphStyle}>{description}</p>
          </div>
          <form action="#" onSubmit={this.handleSubmit.bind(this)}>
            <div style={Object.assign({}, styles.flexContainer)}>
              <div style={Object.assign({}, flexRowStyle)}>
                <h2 style={headingStyle}>Your Photo</h2>
                <ImgUploadBox ref="content_image" name="content_image" description="Upload Photo"/>
              </div>
              <div style={flexRowStyle}>
                <h2 style={headingStyle}>Artist Painting</h2>
                <ImgUploadBox 
                    ref="style_image" 
                    name="style_image" 
                    description="Choose or upload"
                    defaultImages={defaultStyleImages} />
              </div>
            </div>
            <div style={Object.assign({}, styles.flexContainer, rowOffset)}>
              <TextField ref="email" type="email" 
                  hintText="Email Address" 
                  hintStyle={{color: 'white', textAlign: 'center'}}
                  inputStyle={{color: lightColor}}
                  style={{width: '200px'}}
                  underlineStyle={{borderColor: lightColor}}
                  underlineFocusStyle={{borderColor: lightColor}}
                   required />
            </div>
            <div style={Object.assign({}, styles.flexContainer, rowOffset)}>
              <p style={Object.assign({}, {color: lightColor, margin: '0 20px 0 0'})}
              >Public?</p>
              <Checkbox 
                  ref="isPublic" 
                  name="isPublic"
                  style={{width: 'auto'}}
                  defaultChecked={true} />
            </div>
            <div style={Object.assign({}, styles.flexContainer, rowOffset)}>
              <RaisedButton label="submit" type="submit" secondary={true}/>
            </div>
          </form>
          <UploadModal
              uploadStatus={this.state.uploadStatus}
              uploadPercent={this.state.uploadPercent} 
              handleResetForm={this.resetState.bind(this)} />
        </div>
      )
  }
    
};

// creates a dummy canvas element, draws resized image on canvas
// and converts back to url
// NEEDS a callback
function resizeImage(imageUrl, callback){
  var img = new Image();
  img.src = imageUrl;
  var self = this;

  img.onload = function(){
    self.canvas = document.createElement('canvas');
    self.canvas.style.opacity = 1; // change to 0 to hide
    self.canvas.style.position = 'fixed';
    self.canvas.style.left = '-4000px'; //change to off screen
    document.body.appendChild(self.canvas);
    var MAX_WIDTH = self.props.maxWidth ? self.props.maxWidth : 600;
    var MAX_HEIGHT = self.props.maxHeight ? self.props.maxHeight : 600;
    var width = img.width;
    var height = img.height;
     
    if (width > height) {
      if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
      }
    } else {
      if (height > MAX_HEIGHT) {
        width *= MAX_HEIGHT / height;
        height = MAX_HEIGHT;
      }
    }
    self.canvas.width = width;
    self.canvas.height = height;
    var ctx = self.canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);
    var resizedImg = self.canvas.toDataURL('image/png');
    document.body.removeChild(self.canvas);
    callback(resizedImg);
  };
}

// Helper function to convert datauri to blob for for submit
//   -- from: http://stackoverflow.com/questions/4998908/
function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}

module.exports = UploadForm;