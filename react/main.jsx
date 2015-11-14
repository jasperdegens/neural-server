var React = require("react"),
    ReactDom = require('react-dom'),
    Welcome = require('./components/welcome'),
    HomePage = require('./components/Home'),
    SlideShow = require('./components/SlideShow'),
    injectTapEventPlugin = require("react-tap-event-plugin"),
    darkTheme = require('material-ui/lib/styles/raw-themes/dark-raw-theme'),
    ThemeManager = require('material-ui/lib/styles/theme-manager');

//require css files for webpack magic



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
            <div>
              <SlideShow slides={slides} interval={8}/>
              <Router>
                <Route path='/' component={Welcome} />
                <Route path='/home/:tab' component={HomePage} />
              </Router>
            </div>
        );
    }
});


ReactDom.render((
  <MainApp />
),document.getElementById('app'));
