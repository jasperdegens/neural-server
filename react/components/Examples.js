var React = require('react'),
    styles = require('../styles'),
    RaisedButton = require('material-ui/lib/raised-button'),
    ReactCSSTransitionGroup = require('react-addons-css-transition-group');

var sampleData = [
  {
    content_image: '/images/oslo.png',
    style_image: 'http://artcritical.com/fyfe/images/The_Yellow_Log_m.jpg',
    final_image: '/images/oslo_stylised.png'
  },
  /*
  {
    content_image: '/images/blues.jpg',
    style_image: '/images/karen.jpg',
    final_image: '/images/blues_stylised.png'
  },*/

  {
    content_image: '/images/buddist.jpg',
    style_image: '/images/Mandan.jpg',
    final_image: '/images/buddist_stylised.png'
  }
];

var Examples = React.createClass({

  getInitialState : function(){
    return {
      currSlide : 0,
      examples : sampleData, //could be changed later to ajax call
      numSlides : sampleData.length
    };
  },

  // direction is -1 for left, 1 for right
  changeSlide : function(direction){
    this.setState({
      currSlide : (Math.abs(this.state.currSlide + direction) % this.state.numSlides)
    });
  },

  handleRightClick : function(){
    this.changeSlide(1);
  },
  handleLeftClick : function(){
    this.changeSlide(-1);
  },

  render : function(){
    var gutter = '10px';
    var flexItemHalfStyle = {flex: '1'};
    var imgStyle = {width: '100%', display: 'block'};

    return (
      <div>
        <div key={'slide' + this.state.currSlide} style={Object.assign({}, styles.flexContainer, {margin: '10px 0'})}>          
          <div style={Object.assign({}, flexItemHalfStyle, {marginRight:gutter})}>
            <img style={imgStyle} src={this.state.examples[this.state.currSlide].content_image}/>
          </div>
          <div style={flexItemHalfStyle}>
            <img style={imgStyle} src={this.state.examples[this.state.currSlide].style_image}/>
          </div>
        </div>
        <div>
          <img style={{width: '100%'}} src={this.state.examples[this.state.currSlide].final_image} />
        </div>
        <div style={{textAlign: 'center', marginTop: '10px'}}>
          <RaisedButton style={{marginRight: '20px'}} onClick={this.handleLeftClick} label="Previous" />
          <RaisedButton secondary={true} onClick={this.handleRightClick} label="Next" />
        </div>
      </div>
    );
  }

});



module.exports = Examples;