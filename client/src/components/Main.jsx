import React from 'react';
import { Route, Switch } from 'react-router-dom';
import $ from 'jquery';
import Dashboard from './Dashboard.jsx';

class Main extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			newListing: [],
			joinedListings: [],
			initiatedListings: []
		};
	}

	componentDidMount() {
		this.getNewListings();
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
			console.log(data);
			this.setState({
				joinedListings: data
			});
		});
	}

	getInitiatedListings() {
		$.get('/initiatedListings', (data) => {
			console.log(data);
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
		            <div>Here are all the listings you have initiated!</div>
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