import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import { BrowserRouter } from 'react-router-dom';
import Header from './components/Header.jsx';
import Main from './components/Main.jsx';
import io from 'socket.io-client';
let env = window.location.hostname + ':' + window.location.port;
let socket = io(env);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: '',
      currentUser: ''
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
        <Header currentUser={this.state.currentUser}/>
        <Main userId={this.state.userId} socket={socket}/>
      </div>
    );
  }
}

ReactDOM.render((
  <BrowserRouter>
    <App />
  </BrowserRouter>
), document.getElementById('app'));
