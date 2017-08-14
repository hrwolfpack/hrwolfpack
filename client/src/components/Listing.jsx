import React from 'react';
import ReactDOM from 'react-dom';
import { Panel, Button } from 'react-bootstrap';
import $ from 'jquery';

class Listing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            completed: false,
            userJoined: false,
            packed: false,
            listingParticipants: [],
            arrived: false,
            received: false
        };
        this.handleJoin = this.handleJoin.bind(this);
        this.handleArrive = this.handleArrive.bind(this);
        this.handleReceive = this.handleReceive.bind(this);
    }

    componentDidMount() {
        $.post('/userListings', 
            {listingId: this.props.listingInfo.id}, 
            (data) => {
                if (data.length > 0) {
                    console.log(data);
                    this.setState({
                        userJoined: true,
                        received: data[0].received
                    });
                }
                this.checkPackSize();
                this.checkReceive();
            });
        this.setState({
            arrived: this.props.listingInfo.arrived
        });
    }

    handleJoin() {
        $.post('/join', 
            {listingId: this.props.listingInfo.id}, 
            (data) => {
                this.setState({
                    userJoined: true
                });
                this.checkPackSize();
            });
    }

    checkPackSize() {
        $.post('/packsize', 
            {listingId: this.props.listingInfo.id},
            (data) => {
                this.setState({
                    listingParticipants: data.rows
                });
                if (data.count === this.props.listingInfo.num_of_participants) {
                    this.setState({
                        packed: true
                    });
                }
            });
    }

    handleArrive() {
        $.post('/arrived', 
            {listingId: this.props.listingInfo.id}, 
            (data) => {
                this.setState({
                    arrived: true
                });
            });
    }

    handleReceive() {
        $.post('/received', 
            {listingId: this.props.listingInfo.id}, 
            (data) => {
                this.setState({
                    received: true
                });
            });
    }

    checkReceive() {
        $.post('/receiveCount', 
            {listingId: this.props.listingInfo.id},
            (data) => {
                if (data.count === this.props.listingInfo.num_of_participants) {
                    this.setState({
                        completed: true
                    });
                }
            })
    }

    render() {
      var footer;
      if (this.props.listingInfo.initializer === this.props.userId) {
        if (!this.state.completed) {
            if (!this.state.packed) {
                footer = (<div>Your Wolfpack Is Asssembling...</div>);
            } else {
                footer = (
                    <div>
                        Wolfpack Assembled! Go get the goods!
                        <Button onClick={this.handleArrive}>Good are here!</Button>
                    </div>);
            }
            if (this.state.arrived) {
              footer = (<div>The pack has been notified. They will come pick up soon...</div>);
            }
        } else {
            footer = (<div>Mission Complete!</div>);
        }
      } else {
        var involved = this.state.listingParticipants.some(listing => {
            return listing.user_id === this.props.userId ? true : false;
        });
        if (involved) {
            if (!this.state.arrived) {
                if (!this.state.packed) {
                    footer = (<div>Waiting for the Rest of the Pack to Assemble</div>);
                } else {
                    footer = (<div>Packed Assembled! Goods Will Arrive Soon!</div>);
                }
            } else {
                if (this.state.received) {
                    footer = (<div>Thanks for being part of the Pack! Could not have done it without you!</div>);
                } else {
                    footer = (
                        <div>
                            Goods are here! Go pick it up from the Pack Leader!
                            <Button onClick={this.handleReceive}>Received Goods!</Button>
                        </div>);                    
                }
            }
        } else {
            if (!this.state.packed) {
                footer = (<Button onClick={this.handleJoin}>Join the Pack</Button>);
            } else {
                footer = (<div>Sorry, this Pack is full.</div>);
            }
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
