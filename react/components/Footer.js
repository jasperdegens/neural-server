var React = require('react');

class Footer extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
          <footer>
            <p>Contact <a href="mailto:jasperdegens@gmail.com?subject=Neural Painter">
                Jasper Degens
              </a> with any questions</p>
          </footer>
        );
    }
}

module.exports = Footer;
