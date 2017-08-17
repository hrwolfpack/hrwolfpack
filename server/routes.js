const express = require('express');
const router = express.Router();
const db = require('../db');

// router.post('/listings', (req,res) => {
// 	db.Listing.create({name: req.body.name, price: parseInt(req.body.price), location: req.body.location, initializer: req.user.id })
// 	.then(listing => {
// 		res.send('success');
// 	});
// })

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

// router.post('/join', (req, res) => {
// 	db.UserListings.create(
// 		{listing_id: req.body.listingId, 
// 			user_id: req.user.id})
// 		.then(results => {
// 			res.send(results);
// 		})
// 		.catch(err => {
// 			console.log('Error', err);
// 		});
// });

router.post('/userListings', (req, res) => {
	db.UserListings.findAll({
		where: {
			listing_id: req.body.listingId,
			user_id: req.user.id
		}
	})
	.then(results => {
		res.send(results);
	})
	.catch(err => {
		console.log('Error: ', err);
	})
});

router.post('/packsize', (req, res) => {
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

// router.post('/arrived', (req, res) => {
// 	db.Listing.update({
// 		arrived: true
// 	}, {
// 		where: {id: req.body.listingId}
// 	})
// 	.then(result => {
// 		res.send('Listing status updated');
// 	})
// 	.catch(err => {
// 		console.log('Error: ', err);
// 	});
// });

router.post('/received', (req, res) => {
	db.UserListings.update({
		received: true
	}, {
		where: {
			listing_id: req.body.listingId,
			user_id: req.user.id
		}
	})
	.then(result => {
		res.send('Received!');
	})
	.catch(err => {
		console.log('Error: ', err);
	});
});

router.post('/receiveCount', (req, res) => {
	db.UserListings.findAndCountAll({
		where: {listing_id: req.body.listingId,
				received: true}
	})
	.then(result => {
		res.send(result);
	})
	.catch(err => {
		console.log('Error: ', err);
	});
});

module.exports = router;