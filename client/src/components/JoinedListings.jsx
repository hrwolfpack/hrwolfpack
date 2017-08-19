import React from 'react';
import ReactDOM from 'react-dom';
import Listings from './Listings.jsx';
import $ from 'jquery';
import { Carousel, Col, Grid, Row } from 'react-bootstrap';


var divStyle = {
  margin:'100px'
};

const imgStyle = {
  width: '100%',
};
class JoinedListings extends React.Component {

  constructor(props){
    super(props);
    this.state ={
      currentListings: []
    };
  }

  componentDidMount() {
    this.getJoinedListings();
  }

  getJoinedListings() {
    $.get('/joinedListings', (data) => {
      this.setState({
        currentListings: data
      });
    });
  }

  render () {
    return (
      <div>
        <Carousel>
          <Carousel.Item>
            <img style={imgStyle} width={900} height={500} alt="900x500" src="http://forselfhealing.net/images/news8.jpg"/>
            <Carousel.Caption>
              <h3>First slide label</h3>
              <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img style={imgStyle} width={900} height={500} alt="900x500" src="http://pinnaclepellet.com/images/900x500-prince-george.jpg"/>
            <Carousel.Caption>
              <h3>Second slide label</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img style={imgStyle} width={900} height={500} alt="900x500" src="https://media.mnn.com/assets/images/2014/03/Bahamas-Intro.jpg"/>
            <Carousel.Caption>
              <h3>Third slide label</h3>
              <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
        <Listings
        style={divStyle}
        currentListings={this.state.currentListings}
        userId={this.props.userId}
        socket={this.props.socket}/>
      </div>
    )
  }
}

export default JoinedListings;
