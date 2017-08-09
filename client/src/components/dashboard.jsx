import React from 'react';
import ReactDOM from 'react-dom';
import Listings from './Listings.jsx'
import { Button, Modal } from 'react-bootstrap';

class Dashboard extends React.Component {
  constructor(props){
    super(props);
    this.state ={
    };
  }
  handleClick(e){
    e.preventDefault();
    console.log('the create was clicked');
  }

  render () {
    return (
      <div>
        <Listings/>
        <Button bsStyle="primary" onClick = {this.handleClick.bind(this)}>'Create.jsx'</Button>
      </div>
    )
  }
}

export default Dashboard;
