var React = require('react'),
    styles = require('../styles'),
    Example = require('./Example'),
    RaisedButton = require('material-ui/lib/raised-button');

var ExamplesSection = React.createClass({

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

    return (
      <div>
        <Example
            imageSpacing={gutter} 
            topLeftImage={this.state.examples[this.state.currSlide].content_image}
            topRightImage={this.state.examples[this.state.currSlide].style_image}
            mainImage={this.state.examples[this.state.currSlide].final_image} />
        <div style={{textAlign: 'center', marginTop: '10px'}}>
          <RaisedButton style={{marginRight: '20px'}} onClick={this.handleLeftClick} label="Previous" />
          <RaisedButton secondary={true} onClick={this.handleRightClick} label="Next" />
        </div>
      </div>
    );
  }

});

module.exports = ExamplesSection;