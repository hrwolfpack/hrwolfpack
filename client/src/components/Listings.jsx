import React from 'react';
import ReactDOM from 'react-dom';
import Listing from './Listing.jsx';

class Listings extends React.Component  {
  constructor(props){
    super(props);
    this.state = {

    };
  }
  render (){
    return (
      <div>
        <Listing/>
      </div>
    );
  }

}


export default Listings
