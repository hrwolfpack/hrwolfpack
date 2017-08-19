import React from 'react';
import Listing from './Listing.jsx';
import { ListGroup, Button, Modal, Col, Thumbnail, Grid, Row,  } from 'react-bootstrap';

class Listings extends React.Component {
	constructor(props) {
		super(props);

	}

	render() {
		return (
					<Col xs={4} md={4}>
						{this.props.currentListings.map((listingInfo, i) => {
							return <Listing
								listingInfo={listingInfo}
								key={i}
								userId={this.props.userId}
								socket={this.props.socket}/>
						})}
					</Col>
					
		);
	}
	}

export default Listings;

//<Button bsStyle="primary" onClick={this.showModal}>Create Listing</Button>
