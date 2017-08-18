import React from 'react';
import ReactDOM from 'react-dom';
import Listings from './Listings.jsx';
import $ from 'jquery';

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
      <div>
        <Listings 
        currentListings={this.state.currentListings} 
        userId={this.props.userId} 
        socket={this.props.socket}/>
      </div>
    )
  }
}

export default JoinedListings;
