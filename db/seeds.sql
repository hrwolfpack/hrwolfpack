
DROP DATABASE IF EXISTS wolfpack;
CREATE DATABASE wolfpack;

USE wolfpack;

DROP TABLE IF EXISTS userListings;
DROP TABLE IF EXISTS listings;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(20) NOT NULL,
  password VARCHAR(25) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (username)
);

CREATE TABLE listings (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  description VARCHAR(100),
  image_url VARCHAR(200),
  initializer INT NOT NULL,
  price DECIMAL(5,2) NOT NULL,
  completed INT NOT NULL DEFAULT 0,
  arrived INT NOT NULL DEFAULT 0,
  packed INT NOT NULL DEFAULT 0,
  location VARCHAR(100) NOT NULL ,
  num_of_participants INT NOT NULL,
  created_dt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE (initializer, created_dt),
  FOREIGN KEY (initializer) REFERENCES users (id)
);

CREATE TABLE userListings (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  listing_id INT NOT NULL,
  received INT NOT NULL DEFAULT 0,
  CONSTRAINT primk PRIMARY KEY (id),
  UNIQUE(user_id, listing_id),
  CONSTRAINT fork1 FOREIGN KEY (user_id)
    REFERENCES users (id),
  CONSTRAINT fork2 FOREIGN KEY (listing_id)
    REFERENCES listings (id)
);

INSERT INTO users (username, password)
VALUES ('dylan', '123d'), ('clarence', '123c'), ('kevin', '123k'), ('jason', '123j'), ('fred', '1234');

INSERT INTO listings (name, description, image_url, initializer, price, completed, location, num_of_participants)
VALUES ('20 pack of shampoo', '20 bottles of Herbal Essences shampoo 32oz', 'https://images-na.ssl-images-amazon.com/images/I/81BZskZAufL._SY355_.jpg', 1, 5.00, 1, '944 Market St, San Francisco, CA 94121', 3);

INSERT INTO listings (name, description, image_url, initializer, price, completed, location, num_of_participants, created_dt)
VALUES ('30 pack of paper towels', '30 Bounty brand paper towel rolls', 'https://images-na.ssl-images-amazon.com/images/I/71cPnhz81gL._SY355_.jpg', 1, 7.50, 0, '944 Market St, San Francisco, CA 94121', 2, '2017-08-11 20:11:30');

INSERT INTO listings (name, description, image_url, initializer, price, completed, location, num_of_participants)
VALUES ('100 pack of protein bars', '100 Clif Bar brand Builder Bar protein bars ', 'https://images-na.ssl-images-amazon.com/images/I/41D0dDvgfAL._SY355_.jpg', 2, 20.00, 0, '1015 Folsom St, San Francisco, CA 94103', 4);

-- -- Case 1: Full-participation closed listing (completed transaction) created by Dylan and joined by 3 other participants
-- INSERT INTO userListings (user_id, listing_id, received) VALUES (2, 1, 1), (3, 1, 1), (4, 1, 1);
--
-- -- Case 2: Full-participation open listing (incomplete transaction) created by Dylan and joined by 2 other participants
-- INSERT INTO userListings (user_id, listing_id, received) VALUES (3, 2, 1), (4, 2, 0);
--
-- -- Case 3: Partial-participation open listing created by Clarence requiring 4 participants, but only Dylan has joined (initializer from case 1)
-- INSERT INTO userListings (user_id, listing_id, received) VALUES (1, 3, 0);
