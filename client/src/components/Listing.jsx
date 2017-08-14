import React from 'react';
import ReactDOM from 'react-dom';
import { Panel, Button } from 'react-bootstrap';
import $ from 'jquery';

class Listing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            completed: false,
            userJoined: false
        };
        this.handleJoin = this.handleJoin.bind(this);
    }

    handleJoin() {
        $.post('/join', 
            {listingId: this.props.listingInfo.id}, 
            (data) => {
                this.setState({
                    userJoined: true
                });
            });
    }

    render() {
      var footer;
      if (this.props.listingInfo.initializer === this.props.userId) {
        footer = (<div>Your Wolfpack Is Asssembling...</div>);
      } else {
        if (this.state.userJoined) {
            footer = (<div>Waiting for the Goods...</div>);
        } else {
            footer = (<Button onClick={this.handleJoin}>Join the Pack</Button>);
        }
      }

      return (
        <Panel header={this.props.listingInfo.name} footer={footer}>
        	<ul>
        		<li>id: {this.props.listingInfo.id}</li>
        		<li>name: {this.props.listingInfo.name}</li>
        		<li>initializer: {this.props.listingInfo.initializer}</li>
        		<li>price: {this.props.listingInfo.price}</li>
        		<li>complete: {this.props.listingInfo.complete}</li>
        		<li>location: {this.props.listingInfo.location}</li>
        		<li>participants: {this.props.listingInfo.num_of_participants}</li>
        	</ul>
        </Panel>
      );
    }
}

export default Listing;
