import React from 'react';
import ReactDOM from 'react-dom';
import Listings from './Listings.jsx';

class NewListings extends React.Component {

  constructor(props){
    super(props);
    this.state ={
      currentListings: []
    };
  }

  componentDidMount() {
    this.setState({
      currentListings: this.props.newListings
    });

    this.props.socket.on('newListing', (data) => {
      if (data.initializer !== this.props.userId) {
        var nNewListings = this.state.currentListings.concat(data);
        this.setState({
          currentListings: nNewListings
        });
      }
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

export default NewListings;
