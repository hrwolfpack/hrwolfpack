var records = [
    {id: 1, username: 'kevin', password: '123k'}, 
    {id: 2, username: 'clarence', password: '123c'},
    {id: 3, username: 'dylan', password: '123d'},
    {id: 4, username: 'jason', password: '123j'}
];

var findByUsername = (username, callback) => {
	var user = null;
	var err = null;
	for (var i = 0; i < records.length; i++) {
		if (records[i].username === username) {
			user = records[i];
			return callback(err, user);
		}
	}
	return callback(err, user);
};

var findById = (id, callback) => {
	var user = null;
	var err = null;
	for (var i = 0; i < records.length; i++) {
		if (records[i].id === id) {
			user = records[i];
			return callback(err, user);
		}
	}
	return callback(err, user);
};

var addUser = (user, callback) => {
	findByUsername(user.username, (err, oldUser) => {
		if (oldUser) {
			return callback(null, false);
		}
		user.id = records.length + 1;
		records.push(user);
		return callback(null, records[records.length - 1]);
	});
};

var getUsers = () => {
	return records;
}

module.exports.findByUsername = findByUsername;
module.exports.findById = findById;
module.exports.addUser = addUser;
module.exports.getUsers = getUsers;