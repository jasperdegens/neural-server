var React = require('react');
var Link = require('react-router').Link;
var styles = require('../styles');


var RaisedButton = require('material-ui/lib/raised-button'),
    FlexSection = require('./FlexSection');

class IntroBox extends React.Component{

  constructor(args){
    super();
  }

  render () {
    var description = "Curious how your photos would look like if painted by Van Gogh, Munch, or Picasso? ";
        description += 'Utilising <a href="https://github.com/jcjohnson/neural-style">neural networks</a>, you can now find out! ';
        description += 'What are you waiting for?';

    var headerStyle = {
      fontWeight: '700',
      fontSize: '22px',
      marginBottom: '10px',
      color: '#222'
    };

    

    return (
      <FlexSection>
        <div style={{background: 'rgba(255, 255, 255, 0.5)', padding: '30px'}}>
          <h1 style={headerStyle}>Give your photos a bit of style!</h1>
          <p style={styles.paragraphStyle} dangerouslySetInnerHTML={{__html: description}} />
          <div style={Object.assign({}, styles.flexContainer)}>
            <Link to="/home/upload">
              <RaisedButton style={Object.assign({}, styles.flexItem, {marginRight: '30px'})} 
                  secondary={true} 
                  label="Make Your Own!"
              />
            </Link>
            <Link to="/home/examples">
              <RaisedButton 
                  style={Object.assign({}, styles.flexItem, styles.button)} 
                  onClick={this.props.onToggleForm}
                  label="Examples"
              />
            </Link>
          </div>
        </div>
      </FlexSection>
    );
  }

}


class Welcome extends React.Component {
  constructor(args) {
    super();
    this.state = {
      isFormShowing : false
    };
  }

  handleToggleForm(e){
    this.setState({isFormShowing : !this.state.isFormShowing});
  }

  render() {
    
    return (
      <FlexSection style={{position: 'fixed', maxWidth: '100%', width: '100%'}}>
        <div style={Object.assign({}, styles.flexItem, {maxWidth: '600px', marginTop: '-20%'})}>
          <IntroBox onToggleForm={this.handleToggleForm.bind(this)} />
        </div>
      </FlexSection>
      )
  }
    
};

module.exports = Welcome;