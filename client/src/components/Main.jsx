import React from 'react';
import { Route, Switch } from 'react-router-dom';
import $ from 'jquery';
import Dashboard from './Dashboard.jsx';
import InitiatedListings from './InitiatedListings.jsx';

class Main extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			newListings: [],
			joinedListings: [],
			initiatedListings: []
		};
	}

	componentDidMount() {
		// this.getNewListings();
		this.getJoinedListings();
		this.getInitiatedListings();
	}

	getNewListings() {
		$.get('/newListings', (data) => {
			console.log(data);
			this.setState({
				newListings: data
			});
		});
	}

	getJoinedListings() {
		$.get('/joinedListings', (data) => {
			this.setState({
				joinedListings: data
			});
		});
	}

	getInitiatedListings() {
		$.get('/initiatedListings', (data) => {
			this.setState({
				initiatedListings: data
			});
		});
	}

	render() {
		return (
			<div>
		        <Switch>
		          <Route path="/new" render={(props) => (
		            <div>Here are all the new listings!</div>
		          )}/>
		          <Route path="/joined" render={(props) => (
		            <div>Here are all the listings you have joined!</div>
		          )}/>
		          <Route path="/initiated" render={(props) => (
		            <InitiatedListings 
		            userId={this.props.userId}
		            initiatedListings={this.state.initiatedListings} 
		            socket={this.props.socket}/>
		          )}/>
		          <Route exact path="/" render={(props) => (
		            <Dashboard userId={this.props.userId} socket={this.props.socket}/>
		          )}/>
		        </Switch>
	        </div>
		);
	}
}

export default Main;