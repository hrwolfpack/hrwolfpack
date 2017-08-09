import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: 'Bob Marley',
    }
  }

  render() {
    return (
      <div>{this.state.currentUser}</div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
