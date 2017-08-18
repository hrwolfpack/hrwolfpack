var expect = require('chai').expect;
var request = require('request');
var db = require('../db');
var chai = require('chai');
var chaiHTTP = require('chai-http');
var should = chai.should();
var server = require('../server/index.js');



describe('Server Side Testing', function() {

  describe('Integration Testing', function() {

    beforeEach(function(done) {
    	request({
    		method: 'POST',
    		uri: 'http://127.0.0.1:3000/login',
    		json: {
    			username: 'dylan',
    			password: '123d'
    		}
    	}, function(data) {
    		console.log(data);
    		done();
    	});
    });

    // afterEach(function() {

    // });

    it('should insert into Listing after post request to "/listings"', function(done) {
      request({
	      method: 'POST',
	      uri: 'http://127.0.0.1:3000/listings',
	      json: {
		      name: '6 Packs of Chicken Breast',
		      price: 12,
		      location: '50 Webster, San Francisco, CA 94102'
	  	  },
      }, function() {
      	db.Listing.findAndCountAll()
      	.then(result => {
      		expect(result.count).to.equal(4);
      	 	done();
      	});
      });
    });

    it('should return index when the value is present', function() {
      expect([1,2,3].indexOf(3)).to.equal(2);
    });

  });

});


// tests

// after create listing is hit, new listing should be
// inserted into the listing table

// after good are here button is list, listing property "arrived"
// in listing table should change to true

// after a user clicks join listing, a new record on the userListing
// table should be created with user_id and listing_id

// after goods are received buttion is hit, the corressponding
// record on the userListing table should be updated with property
// received to true
