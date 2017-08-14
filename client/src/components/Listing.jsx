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
            listingParticipants: []
        };
        this.handleJoin = this.handleJoin.bind(this);
    }

    componentDidMount() {
        $.post('/userListings', 
            {listingId: this.props.listingInfo.id}, 
            (data) => {
                if (data.length > 0) {
                    this.setState({
                        userJoined: true
                    });
                }
                this.checkPackSize();
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
                console.log('count: ', data);
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

    render() {
      var footer;
      if (this.props.listingInfo.initializer === this.props.userId) {
        if (!this.state.packed) {
            footer = (<div>Your Wolfpack Is Asssembling...</div>);
        } else {
            footer = (<div>Wolfpack Assembled! Go get the goods!</div>);
        }
      } else {
        var involved = this.state.listingParticipants.some(listing => {
            return listing.user_id === this.props.userId ? true : false;
        });
        if (involved) {
            if (!this.state.packed) {
                footer = (<div>Waiting for the Rest of the Pack to Assemble</div>);
            } else {
                footer = (<div>Packed Assembled! Goods Will Arrive Soon!</div>);
            }
        } else {
            if (!this.state.packed) {
                footer = (<Button onClick={this.handleJoin}>Join the Pack</Button>);
            } else {
                footer = (<div>Sorry, this Pack is full.</div>);
            }
        }
    }



      //   if (!this.state.userJoined) {
      //       footer = (<Button onClick={this.handleJoin}>Join the Pack</Button>);
      //   } else {
      //       footer = (<div>Waiting for the Goods...</div>);
      //   }
      // }

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
