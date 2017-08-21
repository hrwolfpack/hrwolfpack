import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import { Carousel, Col, Grid, Row } from 'react-bootstrap';

const imgStyle = {
  width: '100%',
};
const Testimonials = (props) => (
  <div>
    <Carousel>
      <Carousel.Item>
        <Carousel.Caption>
          <h1>Voted Best App of 2017!</h1>
          <h3>-Tech Crunch</h3>
        </Carousel.Caption>
        <img style={imgStyle} width={900} height={500} alt="900x500" src="http://forselfhealing.net/images/news8.jpg"/>
      </Carousel.Item>
      <Carousel.Item>
        <img style={imgStyle} width={900} height={500} alt="900x500" src="http://pinnaclepellet.com/images/900x500-prince-george.jpg"/>
        <Carousel.Caption>
          <h1>Best thing since the ACA.</h1>
          <h3>Barack O.</h3>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img style={imgStyle} width={900} height={500} alt="900x500" src="https://media.mnn.com/assets/images/2014/03/Bahamas-Intro.jpg"/>
        <Carousel.Caption>
          <h1></h1>
          <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  </div>

);

export default Testimonials;
