import React from 'react';
import ReactDOM from 'react-dom';
import Dashboard from './components/Dashboard.jsx';
import $ from 'jquery';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import io from 'socket.io-client';
let socket = io('http://localhost:3000');

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
        <div>
          Hello, {this.state.currentUser}
        </div>

        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <a href='#'>WolfPack</a>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav>
            <NavItem>
              <Link to="/new">New Listings Near You</Link>
            </NavItem>
            <NavItem>
              <Link to="/joined">Listings You Joined</Link>
            </NavItem>
            <NavItem>
              <Link to="/initiated">Listings You Initiated</Link>
            </NavItem>
            <NavItem>
              <Link to="/dashboard">Dashboard</Link>
            </NavItem>
          </Nav>
        </Navbar> 

        <Route path="/new" render={(props) => (
          <div>Here are all the new listings!</div>
        )}/>
        <Route path="/joined" render={(props) => (
          <div>Here are all the listings you have joined!</div>
        )}/>
        <Route path="/initiated" render={(props) => (
          <div>Here are all the listings you have initiated!</div>
        )}/>
        <Route path="/dashboard" render={(props) => (
          <Dashboard userId={this.state.userId} socket={socket}/>
        )}/>


      </div>
    );
  }
        // <Dashboard userId={this.state.userId} socket={socket}/>
}

ReactDOM.render((
  <BrowserRouter>
    <App />
  </BrowserRouter>
), document.getElementById('app'));
