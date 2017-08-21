import React from 'react';
import Map from './Map.jsx';
import {Grid, Row, Col} from 'react-bootstrap';
import $ from 'jquery';
import getListingCoordinates from '../../Geocode.js'

class MapContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      mapCenter: {
        lat: 37.773972,
        lng: -122.431297
      }
    }
  }

  render() {
    return (
<<<<<<< HEAD
      <div style={{position: 'absolute', height: `100%`, width: `100%`}}>
        <Map
          containerElement={<div style= {{width:100+'%', height:100+'%'}}/>}
          mapElement={<div style= {{width:100+'%', height:100+'%'}}/>}
          mapCenter={this.state.mapCenter}
          listings={this.props.currentListings}
          userId={this.props.userId}
          socket={this.props.socket}
          history={this.props.history}
        />
      </div>
=======
      <Grid>
        <Row>
          <Col md={12}>
            <div style={{
              width: '700px',
              height: '600px'
            }}>
              <Map
                containerElement={<div style= {{width:100+'%', height:100+'%'}}/>}
                mapElement={<div style= {{width:100+'%', height:100+'%'}}/>}
                mapCenter={this.state.mapCenter}
                listings={this.props.currentListings}
                userId={this.props.userId}
                socket={this.props.socket}
                history={this.props.history}
              />
            </div>
          </Col>
        </Row>
      </Grid>
>>>>>>> Integrate new listings into map component for marker rendering
    )
  }
}

export default MapContainer;
