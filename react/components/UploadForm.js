var React = require('react'),
    Link = require('react-router').Link,
    Checkbox = require('material-ui/lib/checkbox'),
    RaisedButton = require('material-ui/lib/raised-button'),
    TextField = require('material-ui/lib/text-field'),
    styles = require('../styles');


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
      var img = self.resizeImage.call(self, upload.target.result, function(resizedImg){
        self.setState({
          inputValue : resizedImg
        });
      });
    };
    reader.readAsDataURL(file);
  }

  // creates a dummy canvas element, draws resized image on canvas
  // and converts back to url
  // NEEDS a callback
  resizeImage(imageUrl, callback){
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

  handleClick(e){
    this.setState({
      inputValue : e.target.src
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

  }

  handleUpload(e){
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
        </div>
      )
  }
    
};

module.exports = UploadForm;