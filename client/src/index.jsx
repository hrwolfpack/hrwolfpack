import React from 'react';
import ReactDOM from 'react-dom';
import Dashboard from './components/Dashboard.jsx';
import $ from 'jquery';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: '',
      currentUser: 'Wolf'
    };
  }

  componentDidMount() {
    $.get('/user', (data) => {
      this.setState({
        userId: data.id,
        currentUser: data.username
      });
    });
  }

  render() {
    return (
      <div>
        <div>
          Hello, {this.state.currentUser}
        </div>
        <Dashboard userId={this.state.userId}/>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
