var React = require("react"),
   styles = require('../styles');


var FlexSection = React.createClass({



  render : function() {
    return (
      <div style={Object.assign({},
                  styles.flexContainer,
                  styles.fullScreen,
                  styles.section,
                  this.props.style)}
      >
        {this.props.children}
      </div> 
    ); 
  }


});

module.exports = FlexSection;
