import $ from 'jquery';

let getListingCoordinates = (location, callback) => {
  $.get({
    url: `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=AIzaSyAvZYSB--DSFanCYWoTz36qfFjlAUhhW_o`
  }, callback)
}

export default getListingCoordinates;
