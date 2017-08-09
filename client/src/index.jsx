import React from 'react';
import ReactDOM from 'react-dom';
import Dashboard from './components/Dashboard.jsx'
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: 'Bob Marley',
    };
  }

  render() {
    return (

      <div>
        {this.state.currentUser}'this is App.jsx'
        <Dashboard />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
