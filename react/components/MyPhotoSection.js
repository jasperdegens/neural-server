var React = require('react'),
    styles = require('../styles'),
    FlexSection = require('./FlexSection'),
    Example = require('./Example'),
    RaisedButton = require('material-ui/lib/raised-button'),
    LinearProgress = require('material-ui/lib/linear-progress'),
    Overlay = require('material-ui/lib/overlay'),
    Link = require('react-router').Link;

var MyPhotoSection = React.createClass({

  getInitialState : function(){
    return {
      status : 'loading',
      percentLoaded : 0,
      images : null,
      baseURL :  'https://s3.amazonaws.com/neural-style/' // could move from state
    };
  },

  componentDidMount : function(){
    var r = new XMLHttpRequest();
    r.open("GET", "/api/job/" + this.props.params.id, true);
    var self = this;
    r.onreadystatechange = function () {
      if (r.readyState != 4) return;
      if (r.status != 200){
        self.handleError();
        return;
      }
      if (self.isMounted()){
        self.setState({
          status : 'loaded',
          images : JSON.parse(r.responseText)
        });
      }
    };
    r.addEventListener('progress', this.handleProgress);
    r.addEventListener('error', this.handleError);
    r.send();
  },

  handleProgress : function(e){
    var percent = Math.floor((e.loaded * 100) / e.total);
    if (percent >= 100) { percent = 99;}
    this.setState({
      percentLoaded : percent
    });
  },

  handleError : function(r){
    this.setState({
      status : 'error'
    });
  },

  render : function(){
    var gutter = '10px';

    var exampleContent = this.state.images ? (
        <Example
            imageSpacing={gutter}
            topLeftImage={this.state.baseURL + this.state.images.content_image}
            topRightImage={this.state.baseURL + this.state.images.style_image}
            mainImage={this.state.baseURL + this.state.images.final_image} />) : null;
    var loadingContent = (
        <div style={{minHeight: '200px'}}>
          <LinearProgress
              mode="determinate"
              value={this.state.percentLoaded} 
              style={{height: '20px', width: '100%'}}/>
        </div>);
    var errorContent = <h2 style={{color: '#ff5722'}}>Error: Something went wrong.</h2>;

    var content = loadingContent; // loading content by default
    if(this.state.status === 'loaded'){
      content = exampleContent;
    } else if (this.state.status === 'error'){
      content = errorContent;
    }

    var buttonStyle = {marginTop: '10px'};

    return (
      <FlexSection>
        <div style={{zIndex : 99, marginTop: '50px'}}>
        <h1 style={{margin: '0 0 10px 0', fontWeight: '300', textAlign: 'center', color: 'white'}}
            >Neural Painter</h1>
          {content}
          <div style={{textAlign: 'center', marginTop: '10px'}}>
            {this.state.images ? 
              <form style={{display: 'inline-block'}} 
                    method="get" 
                    action={this.state.baseURL + this.state.images.final_image}>
                <RaisedButton 
                    style={Object.assign({}, buttonStyle, {marginRight: '20px'})} 
                    label="Dowload" 
                    type="submit"
                    secondary={true} />
              </form>
            : null}
            <Link to="/home/upload">
              <RaisedButton 
                  style={Object.assign({}, buttonStyle, {marginRight: '20px'})} 
                  label="New Image" />
            </Link>
            <Link to='/home/examples'>
              <RaisedButton 
                  style={Object.assign({}, buttonStyle)} 
                  secondary={true} 
                  label="More Examples" />
            </Link>
          </div>
        </div>
        <Overlay 
            style={{background : 'rgba(0,0,0,0.8)'}}
            show={true}
            autoLockScrolling={false} />
      </FlexSection>
    );
  }

});

module.exports = MyPhotoSection;