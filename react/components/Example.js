var React = require('react'),
    styles = require('../styles');

class Example extends React.Component{
  constructor(){
    super();
  }

  render(){
    var flexItemHalfStyle = {flex: '1'};
    var imgStyle = {width: '100%', display: 'block'};

    return (
      <div>
        <div style={Object.assign({}, styles.flexContainer, {margin: '10px 0'})}>          
          <div style={Object.assign({}, flexItemHalfStyle, {marginRight:this.props.imageSpacing})}>
            <img style={imgStyle} src={this.props.topLeftImage}/>
          </div>
          <div style={flexItemHalfStyle}>
            <img style={imgStyle} src={this.props.topRightImage}/>
          </div>
        </div>
        <div>
          <img style={{width: '100%'}} src={this.props.mainImage} />
        </div>
      </div>
    );
  }
};



module.exports = Example;