const express = require('express');
const router = express.Router();
const db = require('../db');

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

module.exports = router;