import React from 'react';
import ReactDOM from 'react-dom';
import { Panel, Button } from 'react-bootstrap';
import $ from 'jquery';
import Promise from 'bluebird';

class Listing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            completed: false, //listing property
            packed: false, //listing user relation
            arrived: false, //listing property
            userJoined: false, //listing user relation
            received: false, //listing user relation
            listingParticipants: [], //listing user relation
            receivedParticipants: []
        };
        this.handleJoin = this.handleJoin.bind(this);
        this.handleArrive = this.handleArrive.bind(this);
        this.handleReceive = this.handleReceive.bind(this);
    }

    componentDidMount() { //when component refreshes, do the following: 
        // $.post('/userListings', 
        //     {listingId: this.props.listingInfo.id}, 
        //     (data) => {
        //         if (data.length > 0) { //if there's a match in the UserListing table with listing_id and user_id
        //             this.setState({
        //                 userJoined: true, //indicate this current user has joined the listing
        //                 received: data[0].received //show if the goods been received by this user according to the UserListing table
        //             });
        //         }
        //         // this.checkPackSize(); // check if pack size is full
        //         this.checkReceive(); //check if everyone received goods
        //     });
        this.setState({
            arrived: this.props.listingInfo.arrived,
            completed: this.props.listingInfo.complete
        });

        this.checkPackSize();
        //socket stuff
        this.props.socket.on('join', (data) => {
            if (this.props.listingInfo.id === data.rows[0].listing_id) {
                this.setState({listingParticipants: data.rows});
                this.hasUserJoined();
                if (data.count === this.props.listingInfo.num_of_participants) {
                    this.setState({packed: true});
                }
            }
        });

        this.props.socket.on('arrived', (data) => {
            if (this.props.listingInfo.id === data.id) {
                this.setState({arrived: data.arrived});
            }
        });

        this.props.socket.on('received', (data) => {
            if (this.props.listingInfo.id === data.rows[0].listing_id) {
                this.setState({receivedParticipants: data.rows});
                this.hasUserReceived();
                if (data.count === this.props.listingInfo.num_of_participants) {
                    this.setState({completed: true});
                }
            }
        });
    }

    checkPackSize() { //check how many wolves has joined this pack
        $.post('/packsize', 
            {listingId: this.props.listingInfo.id},
            (data) => {
                this.setState({listingParticipants: data.rows});
                if (data.count === this.props.listingInfo.num_of_participants) {
                    var receivedEntries = data.rows.filter(entry => {
                        return entry.received;
                    });
                    this.setState({
                        packed: true,
                        receivedParticipants: receivedEntries
                    });
                    if (receivedEntries.length === this.props.listingInfo.num_of_participants) {
                        this.setState({completed: true});
                    }
                }
                this.hasUserJoined();
                this.hasUserReceived();
            });
    }

    hasUserJoined() {
        var involved = this.state.listingParticipants.some(listing => {
            return listing.user_id === this.props.userId ? true : false;
        });
        if (involved) {
            this.setState({userJoined: true});
        }
    }

    hasUserReceived() {
        var received = this.state.receivedParticipants.some(listing => {
            return listing.user_id === this.props.userId ? true : false;
        });
        if (received) {
            this.setState({received: true});
        }
    }

    // checkReceive() { //check if all parties have received the goods 
    //     $.post('/receiveCount', 
    //         {listingId: this.props.listingInfo.id},
    //         (data) => {
    //             if (data.count === this.props.listingInfo.num_of_participants) {
    //                 this.setState({
    //                     completed: true
    //                 });
    //             }
    //         })
    // }
    
    handleJoin() { //when user joins listing, update db UserListing record
        // $.post('/join', 
        //     {listingId: this.props.listingInfo.id}, 
        //     (data) => {
        //         this.setState({
        //             userJoined: true
        //         });
        //         this.checkPackSize(); //see if pack is filled after this user joins
        //     });
        this.props.socket.emit('join', {
            listingId: this.props.listingInfo.id,
            userId: this.props.userId
        });

    }

    handleArrive() { //when initializer confirms arrival, update db listing record
        // $.post('/arrived', 
        //     {listingId: this.props.listingInfo.id}, 
        //     (data) => {
        //         this.setState({
        //             arrived: true
        //         });
        //     });
        this.props.socket.emit('arrived', {
            listingId: this.props.listingInfo.id
        });
    }

    handleReceive() { //when participant confirms receipt, update db UserListing record
        // $.post('/received', 
        //     {listingId: this.props.listingInfo.id}, 
        //     (data) => {
        //         this.setState({
        //             received: true
        //         });
        //     });
        this.props.socket.emit('received', {
            listingId: this.props.listingInfo.id,
            userId: this.props.userId
        });
    }

    render() {
      var footer;
      if (this.props.listingInfo.initializer === this.props.userId) { //if current user is the initializer for this listing
        if (!this.state.completed) { //if not all parties have received the goods
            if (!this.state.arrived) { //if initializer has not yet notified the arrival of goods
                if (!this.state.packed) { //if wolfpack is not yet filled
                    footer = (<div>Your Wolfpack Is Asssembling...</div>);
                } else { //if wolfpack is filled
                    footer = (
                        <div>
                            Wolfpack Assembled! Go get the goods!
                            <Button onClick={this.handleArrive}>Good are here!</Button>
                        </div>);
                }
            } else { //if initializer has notified the arrival of goods
                footer = (<div>The pack has been notified. They will come pick up soon...</div>);
            }
        } else { //if all parties have received the goods
            footer = (<div>Mission Complete!</div>);
        }
      } else { //if current user is not the initializer for this listing
        var involved = this.state.listingParticipants.some(listing => {
            return listing.user_id === this.props.userId ? true : false;
        });
        if (this.state.userJoined) { //if current user has joined the listing already
            if (!this.state.arrived) { //if initializer has not yet notified the arrivial of goods
                if (!this.state.packed) { //if the pack is not filled
                    footer = (<div>Waiting for the Rest of the Pack to Assemble</div>);
                } else { //if the pack is filled
                    footer = (<div>Packed Assembled! Goods Will Arrive Soon!</div>);
                }
            } else { //if initializer has notified the arrivial of goods
                if (this.state.received) { //if current user has confirmed the receipt of goods
                    footer = (<div>Thanks for being part of the Pack! Could not have done it without you!</div>);
                } else { //if current user has not confirmed the receipt of goods 
                    footer = (
                        <div>
                            Goods are here! Go pick it up from the Pack Leader!
                            <Button onClick={this.handleReceive}>Received Goods!</Button>
                        </div>);                    
                }
            }
        } else { //if current user has not joined this listing yet
            if (!this.state.completed) { //if listing is already complete
                if (!this.state.packed) { //if this pack is not yet filled
                    footer = (<Button onClick={this.handleJoin}>Join the Pack</Button>);
                } else { //if this pack is already filled
                    footer = (<div>Sorry, this Pack is full.</div>);
                }
            } else {
                footer = (<div>Listing Closed</div>);
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
                <li>num of wolves joined: {this.state.listingParticipants.length}</li>
                <li>num of wolves received the goods: {this.state.receivedParticipants.length}</li>
        	</ul>
        </Panel>
      );
    }
}

export default Listing;
