import React from 'react';
import ReactDOM from 'react-dom';
// import { ListGroupItem } from 'react-bootstrap';
import { Panel, Button } from 'react-bootstrap';

function Listing (props) {
  var footer;
  if (props.listingInfo.initializer === props.userId) {
    footer = (<div>Your Wolfpack Is Asssembling...</div>);
  } else {
    footer = (<Button>Join the Pack</Button>);
  }

  return (
    <Panel header={props.listingInfo.name} footer={footer}>
    	<ul>
    		<li>id: {props.listingInfo.id}</li>
    		<li>name: {props.listingInfo.name}</li>
    		<li>initializer: {props.listingInfo.initializer}</li>
    		<li>price: {props.listingInfo.price}</li>
    		<li>complete: {props.listingInfo.complete}</li>
    		<li>location: {props.listingInfo.location}</li>
    		<li>participants: {props.listingInfo.num_of_participants}</li>
    	</ul>
    </Panel>
  )
}

export default Listing;
