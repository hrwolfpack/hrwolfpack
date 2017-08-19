import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import Form from './ListingsForm.jsx';

var CampaignModal = (props) => (
	<div>
		<Modal show={props.lgShow}  bsSize="large" aria-labelledby="contained-modal-title-sm">
	      <Modal.Header >
	        <Modal.Title id="contained-modal-title-sm">Create New Listing</Modal.Title>
	      </Modal.Header>
	      <Modal.Body>
	        <h4>Create a Listing!</h4>
	        <p>Fill out the form below</p>
	        <Form
	        socket={props.socket} userId={props.userId}
	        hideModal={props.hideModal}
	        prePopulate={props.prePopulate}/>
	      </Modal.Body>
	      <Modal.Footer>
	        <Button bsStyle="danger" onClick={props.hideModal}>Cancel</Button>
	      </Modal.Footer>
	    </Modal>
    </div>
);

export default CampaignModal;