import React from 'react';
import { Route, Switch } from 'react-router-dom';
import NewListings from './NewListings.jsx';
import JoinedListings from './JoinedListings.jsx';
import InitiatedListings from './InitiatedListings.jsx';
import Explore from './Explore.jsx';
import MapContainer from './MapContainer.jsx';


var Main = (props) => (
	<div>
	    <Switch>
	      <Route exact path="/" render={(propz) => (
	        <Explore
	        {...propz}
	        userId={props.userId}
	        socket={props.socket}/>
	      )}/>
	      <Route exact path="/new" render={(propz) => (
	        <NewListings
	        {...propz}
	        userId={props.userId}
	        socket={props.socket}/>
	      )}/>
	      <Route exact path="/joined" render={(propz) => (
	        <JoinedListings 
	        {...propz}
	        userId={props.userId}
	        socket={props.socket}/>
	      )}/>
	      <Route exact path="/initiated" render={(propz) => (
	        <InitiatedListings 
	        {...propz}
	        userId={props.userId}
	        socket={props.socket}/>
	      )}/>
			<Route exact path="/map" render={(propz) => (
	        <MapContainer
	        userId={props.userId}
	        socket={props.socket}/>
	      )}/>
	    </Switch>
	</div>
);

export default Main;
