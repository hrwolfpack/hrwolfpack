import React from 'react';
import ReactDOM from 'react-dom';
import Listing from './Listing.jsx';
import { ListGroup } from 'react-bootstrap';

class Listings extends React.Component {
	constructor(props) {
		super(props);
		
	}

	render() {
		return (
		  <div>
		    {this.props.currentListings.map((listingInfo, i) => {
		      return <Listing 
		      listingInfo={listingInfo} 
		      key={i} 
		      userId={this.props.userId}
		      socket={this.props.socket}/> ;
		    })}
		  </div>
		);
	}
}

export default Listings

