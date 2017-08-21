import React from 'react';
import { Panel, Button } from 'react-bootstrap';

var Deal = (props) => (
		<Panel
		header={props.dealInfo.description}
		footer={
			<Button bsStyle="info" onClick={() => props.handleSelect(props.dealInfo)}>Start a Campaign</Button>
		}>
			<div>
				<img src={props.dealInfo.medium_image} ></img>
				<span>Price: {props.dealInfo.list_price}</span>
				&nbsp;<a href={props.dealInfo.url} target="_blank">See this deal on Amazon</a>
				<p>{props.dealInfo.long_description}</p>
			</div>
		</Panel>
);

export default Deal;
