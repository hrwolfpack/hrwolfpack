import React from 'react';
import { FormGroup, FormControl, Button, Well } from 'react-bootstrap';
import axios from 'axios';
import Deal from './Deal.jsx';
import Deals from './Deals.jsx';
import CampaignModal from './CampaignModal.jsx';

class Explore extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: '',
			deals: [],
			lgShow: false
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
		this.handleSelect = this.handleSelect.bind(this);
		this.hideModal = this.hideModal.bind(this);
		this.showModal = this.showModal.bind(this);
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

	handleSelect(dealInfo) {
		this.showModal();
	}

	hideModal(e){
	this.setState({
	  lgShow: false
	});
	}

	showModal(e){
	// e.preventDefault();
	this.setState({
	  lgShow: true
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
				<CampaignModal 
				userId={this.props.userId}
				lgShow={this.state.lgShow}
				socket={this.props.socket}
				hideModal={this.hideModal}
				/>
				<Deals dealInfos={this.state.deals} handleSelect={this.handleSelect}/>
			</div>
		);
	}
}

export default Explore;