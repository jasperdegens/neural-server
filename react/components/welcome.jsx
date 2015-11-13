
class Welcome extends React.Component {
  constructor(args) {
    super();
  }

  render() {
    return (
      <p>{this.props.text}</p>
      )
  }
    
};

module.exports = Welcome;