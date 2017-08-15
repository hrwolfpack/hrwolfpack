import React from 'react';
import ReactDOM from 'react-dom';
import Listing from './Listing.jsx';
import { ListGroup } from 'react-bootstrap';

const Listings = (props) => (
  <div>
    {props.currentListings.map((listingInfo, i) => {
      return <Listing listingInfo={listingInfo} key={i} userId={props.userId}/> ;
    })}
  </div>
);

export default Listings

