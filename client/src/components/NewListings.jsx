import React from 'react';
import ReactDOM from 'react-dom';
import Listings from './Listings.jsx';
import $ from 'jquery';
import MapContainer from './MapContainer.jsx';
import { ButtonToolbar, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';

let toggleBtnStyle = {
  marginTop: '70px',
  display:'flex',
  alignItems:'center',
  justifyContent:'center',
};

let cardsStyle = {
  margin:'10px 50px 50px 50px'
};

let mapStyle = {
  margin: '10px 50px 50px 0px'
};

class NewListings extends React.Component {

  constructor(props){
    super(props);
    this.state ={
      currentListings: [],
      toggleValue: 1
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.getNewListings();

    this.props.socket.on('newListing', (data) => {
      if (data.initializer !== this.props.userId) {
        var nNewListings = this.state.currentListings.concat(data);
        this.setState({
          currentListings: nNewListings
        });
      }
    });
  }

  getNewListings() {
    $.get('/newListings', (data) => {
      this.setState({
        currentListings: data
      });
    });
  }

  handleChange(value) {
    this.setState({
      toggleValue: value
    });
  }

  render () {
    var view;
    if (this.state.toggleValue === 1) {
      view = (
        <div style={cardsStyle}>
          <Listings
          currentListings={this.state.currentListings}
          userId={this.props.userId}
          socket={this.props.socket}
          history={this.props.history}/>
        </div>
      );
    } else {
      view = (
        <div style={mapStyle}>
          <MapContainer
            currentListings={this.state.currentListings}
            userId={this.props.userId}
            socket={this.props.socket}
            history={this.props.history}
            />
        </div>
      )
    }

    return (
      <div>
        <div style={toggleBtnStyle}>
          <ButtonToolbar>
            <ToggleButtonGroup
            type="radio"
            name="options"
            defaultValue={this.state.toggleValue}
            onChange={this.handleChange}>
              <ToggleButton value={1}>List View</ToggleButton>
              <ToggleButton value={2}>Map View</ToggleButton>
            </ToggleButtonGroup>
          </ButtonToolbar>
        </div>
        {view}
      </div>
    )
  }
}

export default NewListings;
