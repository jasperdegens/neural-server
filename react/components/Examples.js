var React = require('react'),
    styles = require('../styles'),
    RaisedButton = require('material-ui/lib/raised-button'),
    ReactCSSTransitionGroup = require('react-addons-css-transition-group');


var Examples = React.createClass({

  getInitialState : function(){
    return {
      currSlide : 0,
      examples : this.props.examples, //could be changed later to ajax call
      numSlides : this.props.examples.length
    };
  },

  propTypes : {
    examples : React.PropTypes.array
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