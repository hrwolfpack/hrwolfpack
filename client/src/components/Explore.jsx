import React from 'react';
import { FormGroup, FormControl, Button, Well } from 'react-bootstrap';
import axios from 'axios';
import Deal from './Deal.jsx';
import Deals from './Deals.jsx';

class Explore extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: '',
			deals: []
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
	}

	handleChange(event) {
		this.setState({
			value: event.target.value
		});
	}

	handleSearch() {
		axios.post('/api', {
			query: this.state.value
		})
		.then(res => {
			this.setState({
				deals: res.data
			});
		})
		.catch(err => {
			console.log('error', err);
		});
	}

	render() {
		return (
			<div>
				<form>
					<FormGroup>
						<FormControl
						type="text"
						value={this.state.value}
						placeholder="Search for good deals around the web"
						onChange={this.handleChange}
						/>
					</FormGroup>
					<Button bsStyle="primary" onClick={this.handleSearch}>
						Search
					</Button>
				</form>
				<Deals dealInfos={this.state.deals} />
			</div>
		);
	}
}

export default Explore;