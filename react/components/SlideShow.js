var React = require('react'),
   styles = require('../styles'),
   ReactCSSTransitionGroup = require('react-addons-css-transition-group');




var SlideShow = React.createClass({

  getInitialState : function(){
    return {
      currSlide : 0,
      numSlides : this.props.slides.length,
      active : false
    };
  },

  componentDidMount : function(){
    this.start();
  },

  componentWillUnmount : function(){
    if (this.state.active) {
      clearInterval(this.slideshow);
    }
  },

  getDefaultProps : function(){
    return {
      interval : 4
    };
  },

  propTypes : {
    slides : React.PropTypes.arrayOf(React.PropTypes.string)
  },

  start : function(){
    if(!this.state.active){
      this.slideshow = setInterval(this.changeSlide, this.props.interval*1000);
      this.setState({active : true});
    }
  },

  stop : function(){
    if(this.state.active){
      clearInterval(this.slideshow);
      this.setState({active: false});
    }
  },

  changeSlide : function(){
    this.setState({
      currSlide : (this.state.currSlide + 1) % this.state.numSlides
    });
  },

  render : function(){

    var fullScreen = {
      width: '100%',
      height: '100%'
    };

    var slideStyles = {
      position: 'absolute',
      backgroundSize: 'cover !important'
    };

    return (
      <div style={Object.assign({}, fullScreen, {position: 'fixed', zIndex: '-1'})}>
        <ReactCSSTransitionGroup 
            transitionName="slide"
            transitionEnterTimeout={this.props.interval*500}
            transitionLeaveTimeout={this.props.interval*500}
        >
          <div
              key={'slide_' + this.state.currSlide} 
              style={Object.assign({}, 
                    fullScreen, 
                    slideStyles,
                    {background: 'url("' + this.props.slides[this.state.currSlide] + '")'}
          )} />
        </ReactCSSTransitionGroup>
      </div>
    );
  }
});

module.exports = SlideShow;

/* {this.props.slides.map(imgUrl => {
          return (
            <div style={Object.assign({}, 
                        fullScreen,
                        styles.transition, 
                        {background: 'url("' + imgUrl + '")'})} />
          ); 
        })} */