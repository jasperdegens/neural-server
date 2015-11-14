var React = require('react'),
    UploadForm = require('./UploadForm'),
    Link = require('react-router').Link,
    Overlay = require('material-ui/lib/overlay'),    
    Examples = require('./Examples'),
    FlexSection = require('./FlexSection'),
    styles = require('../styles'),
    {Tabs, Tab} = require('material-ui/lib/tabs');


var examplesData = [
  {
    content_image: '/images/oslo.png',
    style_image: 'http://artcritical.com/fyfe/images/The_Yellow_Log_m.jpg',
    final_image: '/images/oslo_stylised.png'
  },
  {
    content_image: '/images/buddist.jpg',
    style_image: '/images/Mandan.jpg',
    final_image: '/images/buddist_stylised.png'
  }
];

var HomePage = React.createClass({

  getInitialState : function(){
    return {
      currTab : this.props.params.tab
    };
  },

  propTypes : {
    initialState : React.PropTypes.number
  },

  handleChange : function(value, e, tab){
    this.setState({
      currTab : value
    });
  },

  render : function(){

    var isExamplesTabActive = this.state.currTab === 'examples' ? true : false;

    var containerStyles = {marginTop: '40px',
                            marginBottom: '40px',
                            textAlign: 'center',
                            width: '100%',
                            zIndex: '99',
                            padding: '20px 40px'
                          };

    var contentContainerStyle = isExamplesTabActive ? {margin: '0 0 40px 0'} : {margin: '20px 0 40px 0'};

    var formStyles = {
      text : {
        color: '#222'
      },
      background : {
        background : 'rgba(255,255,255,0.8)'
      },
      tabItemContainerStyle : {
        background : 'black',
        color : '#222'
      },
      inkBarStyle : {
        background : 'white'
      }
    };

    var exampleStyles = {
      text : {
        color: 'white'
      },
      background : {
        background : 'rgba(0,0,0,0.8)'
      },
      tabItemContainerStyle : {
        background : 'transparent',
        color : 'white',
        borderBottom : '1px solid #999'
      },
      inkBarStyle : {
        background : 'white'
      }
    };

    var selectedStyle = isExamplesTabActive ? exampleStyles : exampleStyles;


    return (
      <FlexSection style={{alignItems: 'initial'}}>
        <div style={Object.assign({}, containerStyles)} >
          <h1 style={Object.assign({}, styles.transition, selectedStyle.text, {margin: '0 0 10px 0', fontWeight: '300'})}
            >Neural Painter</h1>
          <Tabs initialSelectedIndex={this.props.params.tab === 'examples' ? 1 : 0} 
                onChange={this.handleChange}
                tabItemContainerStyle={selectedStyle.tabItemContainerStyle}
                inkBarStyle={selectedStyle.inkBarStyle}
                contentContainerStyle={Object.assign({}, contentContainerStyle, styles.transition)}>
            <Tab label="Make Your Own" value="form">
              <UploadForm />
            </Tab>
            <Tab label="Examples" value="examples">
              <Examples examples={examplesData}/>
            </Tab>
          </Tabs>
        </div>
        <Overlay 
            style={selectedStyle.background}
            show={isExamplesTabActive ? true : true}
            autoLockScrolling={false} />
      </FlexSection>
    );
  }

});

module.exports = HomePage;