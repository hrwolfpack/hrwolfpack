const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../db');
const amazonApiHandler = require('./amazon.js');

router.get('/listings', (req, res) => {
	db.Listing.findAll()
		.then(results => {
			res.send(results);
		})
		.catch(err => {
			console.log('Error: ', err);
		});
})

router.get('/user', (req, res) => {
	var {id, username} = req.user;
	res.send({id, username});
});

router.post('/listingStatus', (req, res) => {
	db.UserListings.findAndCountAll({
		where: {listing_id: req.body.listingId}
	})
	.then(results => {
		res.send(results);
	})
	.catch(err => {
		console.log('Error: ', err);
	});
});


router.get('/newListings', (req, res) => {
	var notInitListingArray;
	var partListingArray;
	db.Listing.findAll({
		where: {initializer: {$ne: req.user.id}}
	})
	.then(results => {
		notInitListingArray = results.map(item => item.id); //produce array of all the listing id for the listings this user didn't create
		return db.UserListings.findAll({
			where: {user_id: req.user.id}
		});
	})
	.then(results => {
		partListingArray = results.map(item => item.listing_id); //produce array of all the listing id for the listings this user participated
		return notInitListingArray.filter(id => { //produce array of listing id for listings that user did not init or parti
			return !partListingArray.includes(id);
		});
	})
	.then(results => {
		return db.Listing.findAll({
			where: {id: results}
		});
	})
	.then(results => {
		res.send(results);
	})
	.catch(err => {
		console.log('Error: ', err);
	});
});

router.get('/joinedListings', (req, res) => {
	db.UserListings.findAll({
		where: {user_id: req.user.id}
	})
	.then(results => {
		var listingIdArray = results.map(item => {
			return item.listing_id;
		});
		return db.Listing.findAll({
			where: {id: listingIdArray}
		});
	})
	.then(results => {
		res.send(results);
	})
	.catch(err => {
		console.log('Error: ', err);
	});
});

router.get('/initiatedListings', (req, res) => {
	db.Listing.findAll({
		where: {initializer: req.user.id}
	})
	.then(results => {
		res.send(results);
	})
	.catch(err => {
		console.log('Error: ', err);
	});
});

router.post('/api', amazonApiHandler);

router.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

module.exports = router;