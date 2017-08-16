import React from 'react';
import ReactDOM from 'react-dom';
import Listing from './Listing.jsx';
import { ListGroup } from 'react-bootstrap';

class Listings extends React.Component {
	constructor(props) {
		super(props);
		
	}

	componentDidMount() {
		this.props.socket.on('newListing', (data) => {
			console.log('new Listing created by someone', data);
		});
	}

	render() {
		return (
		  <div>
		    {this.props.currentListings.map((listingInfo, i) => {
		      return <Listing listingInfo={listingInfo} key={i} userId={this.props.userId}/> ;
		    })}
		  </div>
		);
	}
}

export default Listings

