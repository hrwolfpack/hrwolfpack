import React from 'react';
import ReactDOM from 'react-dom';

function Listing (props) {
  return (
    <div>
    	<ul>
    		<li>id: {props.listingInfo.id}</li>
    		<li>name: {props.listingInfo.name}</li>
    		<li>initializer: {props.listingInfo.initializer}</li>
    		<li>price: {props.listingInfo.price}</li>
    		<li>complete: {props.listingInfo.complete}</li>
    		<li>location: {props.listingInfo.location}</li>
    		<li>participants: {props.listingInfo.num_of_participants}</li>
    	</ul>
    </div>
  )
}

export default Listing;
