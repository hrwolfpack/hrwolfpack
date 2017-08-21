import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import { ListGroup, Button, Modal, Col, Thumbnail, Grid, Row, Panel,  } from 'react-bootstrap';


var boxStyle = {
  boxShadow: '3px 3px 5px 6px grey',
  margin: '1em'
};

class Listing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            completed: false,
            arrived: false,
            packed: false,
            userJoined: false,
            received: false,
            lgShow: false,
            btShow: true,
            listingParticipants: [],
            receivedParticipants: [],
            initializer: false
        };
        this.handleJoin = this.handleJoin.bind(this);
        this.handleArrive = this.handleArrive.bind(this);
        this.handleReceive = this.handleReceive.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.showModal = this.showModal.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);

    }

    componentDidMount() {
        this.setState({
            packed: this.props.listingInfo.packed,
            arrived: this.props.listingInfo.arrived,
            completed: this.props.listingInfo.completed
        });

        this.checkListingStatus();
        this.isUserInitializer();

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

    checkListingStatus() {
        $.post('/listingStatus',
            {listingId: this.props.listingInfo.id},
            (data) => {
                this.setState({listingParticipants: data.rows});
                var receivedEntries = data.rows.filter(entry => {
                    return entry.received;
                });
                this.setState({receivedParticipants: receivedEntries});
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
            this.setState({btShow: false});
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

    isUserInitializer() {
        if (this.props.listingInfo.initializer === this.props.userId) {
            this.setState({
                btShow: false,
                initializer: true
            });
        }
    }

    handleJoin() {
        this.props.socket.emit('join', {
            listingId: this.props.listingInfo.id,
            userId: this.props.userId,
            packSize: this.props.listingInfo.num_of_participants
        });
        this.hideModal();
        this.props.history.push('/joined');
    }

    handleArrive() {
        this.props.socket.emit('arrived', {
            listingId: this.props.listingInfo.id
        });
    }

    handleReceive() {
        this.props.socket.emit('received', {
            listingId: this.props.listingInfo.id,
            userId: this.props.userId,
            packSize: this.props.listingInfo.num_of_participants
        });
    }

    showModal(e){
      e.preventDefault();
      this.setState({
        lgShow: true
      });
    }

    hideModal(e){
      this.setState({
        lgShow: false
      });
    }

    handleKeyDown (e) {
      if (e.keyCode === 27) {
        this.hideModal();
      }
    }

    render() {
      var footer;
      if (this.state.initializer) { //if current user is the initializer for this listing
        if (!this.state.completed) { //if not all parties have received the goods
            if (!this.state.arrived) { //if initializer has not yet notified the arrival of goods
                if (!this.state.packed) { //if wolfpack is not yet filled
                    footer = (<div>Your Wolfpack Is Asssembling...</div>);
                } else { //if wolfpack is filled
                    footer = (
                        <div>
                            Wolfpack Assembled! Go get the goods!
                            <Button onClick={this.handleArrive}>Goods are here!</Button>
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
          // this.hideJoinButton();
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
                    // footer = (<Button onClick={this.handleJoin}>Join the Pack</Button>);
                } else { //if this pack is already filled
                    footer = (<div>Sorry, this Pack is full.</div>);
                }
            } else {
                footer = (<div>Listing Closed</div>);
            }
        }
      }

      return (
        <div>

          <Modal show={this.state.lgShow}  bsSize="small" aria-labelledby="contained-modal-title-sm"  onKeyDown={this.handleKeyDown}>
            <Modal.Header >
              <Modal.Title id="contained-modal-title-sm"><div>{this.props.listingInfo.name}</div></Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ul>
              <li>listing id: {this.props.listingInfo.id}</li>
          		<li>listing name: {this.props.listingInfo.name}</li>
          		<li>initializer: {this.props.listingInfo.initializer}</li>
          		<li>price: {this.props.listingInfo.price}</li>
          		<li>pick up location: {this.props.listingInfo.location}</li>
          		<li>required num of wolves to join: {this.props.listingInfo.num_of_participants}</li>
              <li>num of wolves joined: {this.state.listingParticipants.length}</li>
              <li>num of wolves who received the goods: {this.state.receivedParticipants.length}</li>
              <li>Description: {this.props.listingInfo.description}</li>
              <li>Link: <a href={this.props.listingInfo.url}>{this.props.listingInfo.name}</a></li>
          	</ul>

            </Modal.Body>
            <Modal.Footer>
              <Button bsStyle="danger" onClick={this.hideModal}>Exit</Button>
              {this.state.btShow ? <Button onClick={this.handleJoin} >Join the Pack</Button>: null}
            </Modal.Footer>
          </Modal>
            <Col xs={4} md={4} >
                <Thumbnail src={this.props.listingInfo.image_url}alt="220x150" style={boxStyle}>
                  <h3>{this.props.listingInfo.name}</h3>
                  <p>Original Bulk Price: <span style={{fontSize: '1.1em', fontWeight: 'bold', color: 'green'}}>${this.props.listingInfo.price}</span></p>
                  <p><strong style={{fontSize: '1.4em', fontWeight: 'bold'}}>You pay</strong> <span style={{fontSize: '1.4em', fontWeight: 'bold', color: '#B12704'}}>${((this.props.listingInfo.price / (Number(this.props.listingInfo.num_of_participants) + 1) )).toFixed(2)}</span></p>
                  <div>
                    <Button bsStyle="primary" onClick={this.showModal}>More Info</Button>
                  </div>
                </Thumbnail>
              </Col >
        </div>
      );
    }
}

export default Listing;
