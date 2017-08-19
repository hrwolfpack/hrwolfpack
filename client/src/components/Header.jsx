import React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';

var Header = (props) => (
	<div>

	    <Navbar>
	      <Navbar.Header>
	        <Navbar.Brand>

							<div>
					      Hello, {props.currentUser}
					    </div>
	        </Navbar.Brand>
	      </Navbar.Header>
	      <Nav>
	        <NavItem>
	          <Link to="/">Explore</Link>
	        </NavItem>
	        <NavItem>
	          <Link to="/new">New Listings Near You</Link>
	        </NavItem>
	        <NavItem>
	          <Link to="/joined">Listings You Joined</Link>
	        </NavItem>
	        <NavItem>
	          <Link to="/initiated">Listings You Initiated</Link>
	        </NavItem>
	      </Nav>
	    </Navbar>
	</div>
);

export default Header;
