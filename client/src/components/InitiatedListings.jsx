import React from 'react';
import ReactDOM from 'react-dom';
import Listings from './Listings.jsx';
import Form from './ListingsForm.jsx'
import { Button, Modal, FormGroup } from 'react-bootstrap';

class InitiatedListings extends React.Component {

  constructor(props){
    super(props);
    this.state ={
      lgShow: false,
      currentListings: []
    };
    this.hideModal = this.hideModal.bind(this);
    this.showModal = this.showModal.bind(this);
  }

  componentDidMount() {
    this.setState({
      currentListings: this.props.initiatedListings
    });

    this.props.socket.on('newListing', (data) => {
      this.setState({
        currentListings: data
      });
    });
  }

  hideModal(e){
    this.setState({
      lgShow: false
    });
  }

  showModal(e){
    e.preventDefault();
    this.setState({
      lgShow: true
    });
  }

  render () {
    return (
      <div>
        <Button bsStyle="primary" onClick={this.showModal}>Create Listing</Button>
        <Modal show={this.state.lgShow}  bsSize="large" aria-labelledby="contained-modal-title-sm">
          <Modal.Header >
            <Modal.Title id="contained-modal-title-sm">Create New Listing</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Create a Listing!</h4>
            <p>Fill out the form below</p>
            <Form
            socket={this.props.socket} userId={this.props.userId}
            hideModal={this.hideModal}/>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="danger" onClick={this.hideModal}>Cancel</Button>
          </Modal.Footer>
        </Modal>
        <Listings 
        currentListings={this.state.currentListings} 
        userId={this.props.userId} 
        socket={this.props.socket}/>
      </div>
    )
  }
}

export default InitiatedListings;
