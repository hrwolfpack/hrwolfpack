import React from 'react';
import ReactDOM from 'react-dom';
import Listings from './Listings.jsx';
import $ from 'jquery';
import { Carousel, Col, Grid, Row } from 'react-bootstrap';


var divStyle = {
  margin:'100px'
};


class JoinedListings extends React.Component {

  constructor(props){
    super(props);
    this.state ={
      currentListings: []
    };
  }

  componentDidMount() {
    this.getJoinedListings();
  }

  getJoinedListings() {
    $.get('/joinedListings', (data) => {
      this.setState({
        currentListings: data
      });
    });
  }

  render () {
    return (
      <div style={divStyle}>
        <Listings

        currentListings={this.state.currentListings}
        userId={this.props.userId}
        socket={this.props.socket}/>
      </div>
    )
  }
}

export default JoinedListings;
