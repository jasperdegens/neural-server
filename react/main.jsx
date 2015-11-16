var React = require("react"),
    ReactDom = require('react-dom'),
    Welcome = require('./components/welcome'),
    HomePage = require('./components/Home'),
    MyPhotoSection = require('./components/MyPhotoSection'),
    SlideShow = require('./components/SlideShow'),
    Footer = require('./components/Footer'),
    injectTapEventPlugin = require("react-tap-event-plugin");

injectTapEventPlugin();

import {Router, Route, Link} from 'react-router';


const MainApp = React.createClass({

    // childContextTypes : {
    //   muiTheme: React.PropTypes.object
    // },

    // getChildContext() {
    //   return {
    //     muiTheme: ThemeManager.getMuiTheme(darkTheme),
    //   };
    // },

    render() {

        var slides = [
            '/images/oslo.png',
            '/images/oslo_stylised.png',
            '/images/oslo.png',
            '/images/oslo_munch.png'
        ];

        return (
            <div style={{position: 'relative', minHeight: '100%'}}>
              <SlideShow slides={slides} interval={8}/>
              <Router>
                <Route path='/' component={Welcome} />
                <Route path='/home/:tab' component={HomePage} />
                <Route path='/view/:id' component={MyPhotoSection} />
              </Router>
              <Footer />
            </div>
        );
    }
});


ReactDom.render((
  <MainApp />
),document.getElementById('app'));
