import React from 'react';
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import { ListGroup, Button, Modal, Col, Thumbnail, Grid, Row, Panel,  } from 'react-bootstrap';
import Listing from './Listing.jsx';
import $ from 'jquery';

class Map extends React.Component {
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
        initializer: false,
        currentListing: ''
    };
    this.handleJoin = this.handleJoin.bind(this);
    this.handleArrive = this.handleArrive.bind(this);
    this.handleReceive = this.handleReceive.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.showModal = this.showModal.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(listing) {
    this.setState({
      currentListing: listing
    })
    this.showModal(listing);
  }

  componentDidMount() {
      this.setState({
          packed: this.state.currentListing.packed,
          arrived: this.state.currentListing.arrived,
          completed: this.state.currentListing.completed
      });

      this.checkListingStatus();
      this.isUserInitializer();

      this.props.socket.on('join', (data) => {
          if (this.state.currentListing.id === data.rows[0].listing_id) {
              this.setState({listingParticipants: data.rows});
              this.hasUserJoined();
              if (data.count === this.state.currentListing.num_of_participants) {
                  this.setState({packed: true});
              }
          }
      });

      this.props.socket.on('arrived', (data) => {
          if (this.state.currentListing.id === data.id) {
              this.setState({arrived: data.arrived});
          }
      });

      this.props.socket.on('received', (data) => {
          if (this.state.currentListing.id === data.rows[0].listing_id) {
              this.setState({receivedParticipants: data.rows});
              this.hasUserReceived();
              if (data.count === this.state.currentListing.num_of_participants) {
                  this.setState({completed: true});
              }
          }
      });
  }

  checkListingStatus() {
      $.post('/listingStatus',
          {listingId: this.state.currentListing.id},
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
      if (this.state.currentListing.initializer === this.props.userId) {
          this.setState({
              btShow: false,
              initializer: true
          });
      }
  }

  handleJoin() {
      this.props.socket.emit('join', {
          listingId: this.state.currentListing.id,
          userId: this.props.userId,
          packSize: this.state.currentListing.num_of_participants
      });
      this.hideModal();
      this.props.history.push('/joined');
  }

  handleArrive() {
      this.props.socket.emit('arrived', {
          listingId: this.state.currentListing.id
      });
  }

  handleReceive() {
      this.props.socket.emit('received', {
          listingId: this.state.currentListing.id,
          userId: this.props.userId,
          packSize: this.state.currentListing.num_of_participants
      });
  }

  showModal(e){
    //e.preventDefault();
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

		return (
      <div>
        <GoogleMap
  				defaultZoom={13}
  				defaultCenter={this.props.mapCenter}>

          {this.props.listings.map((listing, i) => {
          	return <Marker
          	position={{lat: Number(listing.lat), lng: Number(listing.lng)}}
            onClick={() => this.handleClick(listing)}
          	key={i}/>
          })}

        </GoogleMap>

          <Modal show={this.state.lgShow}  bsSize="small" aria-labelledby="contained-modal-title-sm"  onKeyDown={this.handleKeyDown}>
            <Modal.Header >
              <Modal.Title id="contained-modal-title-sm"><div>{this.state.currentListing.name}</div></Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ul>
              <li>listing id: {this.state.currentListing.id}</li>
          		<li>listing name: {this.state.currentListing.name}</li>
          		<li>initializer: {this.state.currentListing.initializer}</li>
          		<li>price: {this.state.currentListing.price}</li>
          		<li>pick up location: {this.state.currentListing.location}</li>
          		<li>required num of wolves: {this.state.currentListing.num_of_participants}</li>
              <li>num of wolves joined: {this.state.listingParticipants.length}</li>
              <li>num of wolves received the goods: {this.state.receivedParticipants.length}</li>
              <li>Description: {this.state.currentListing.description}</li>
              <li>Link: <a href={this.state.currentListing.url} target="_blank">{this.state.currentListing.name}</a></li>
          	</ul>

            </Modal.Body>
            <Modal.Footer>
              <Button bsStyle="danger" onClick={this.hideModal}>Exit</Button>
              {this.state.btShow ? <Button onClick={this.handleJoin} >Join the Pack</Button>: null}
            </Modal.Footer>
          </Modal>
      </div>
		)
	}
}

export default withGoogleMap(Map);
