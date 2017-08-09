import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'react-bootstrap';

const Listing = React.createClass({
render() {
  return (
    <Modal {...this.props} bsSize="large" aria-labelledby="contained-modal-title-lg">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-lg">Modal heading</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Wrapped Text</h4>
        <p>Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>

      </Modal.Body>
      <Modal.Footer>
        <Button onClick={this.props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
});
