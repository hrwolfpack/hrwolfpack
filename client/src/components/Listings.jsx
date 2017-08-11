import React from 'react';
import ReactDOM from 'react-dom';
import Listing from './Listing.jsx';

class Listings extends React.Component  {
  constructor(props){
    super(props);
  }
  render (){
    return (
      <div>
        {this.props.currentListings.map((listingInfo, i) => {
          return <Listing listingInfo={listingInfo} key={i}/> ;
        })}
      </div>
    );
  }

}


export default Listings

