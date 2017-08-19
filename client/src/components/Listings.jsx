import React from 'react';
import Listing from './Listing.jsx';
import { ListGroup, Button, Modal } from 'react-bootstrap';

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
		      socket={this.props.socket}/>

		    })}

		  </div>
		);
	}
}

export default Listings;

//<Button bsStyle="primary" onClick={this.showModal}>Create Listing</Button>
