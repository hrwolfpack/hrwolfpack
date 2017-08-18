import React from 'react';
import ReactDOM from 'react-dom';
import Listings from './Listings.jsx';

class JoinedListings extends React.Component {

  constructor(props){
    super(props);
    this.state ={
      currentListings: []
    };
  }

  componentDidMount() {
    this.setState({
      currentListings: this.props.joinedListings
    });

    // this.props.socket.on('join', (data) => {
      
    // })
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
