
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
