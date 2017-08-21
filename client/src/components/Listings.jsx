import React from 'react';
import Listing from './Listing.jsx';
import { ListGroup, Button, Modal, Thumbnail, Grid, Row,  } from 'react-bootstrap';

class Listings extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div>
				<Grid>
					<Row>
						{this.props.currentListings.map((listingInfo, i) => {
							return <Listing
								listingInfo={listingInfo}
								key={i}
								userId={this.props.userId}
								socket={this.props.socket}
								history={this.props.history}/>
						})}
					</Row>
				</Grid>
			</div>
		);
	}
}

export default Listings;
