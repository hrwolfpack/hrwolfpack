import React from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';

var Header = (props) => (
	<div>



			<Navbar inverse collapseOnSelect>
    <Navbar.Header>
      <Navbar.Brand>
        <a href="#">
					Hello, {props.currentUser}
				</a>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav>
        <NavItem eventKey={1} href="#">
					<Link to="/joined">Listings You Joined</Link>
        </NavItem>

        <NavItem eventKey={2} href="#">
					<Link to="/joined">Listings You Joined</Link>
        </NavItem>

				<NavItem eventKey={2} href="#">
					<Link to="/initiated">Listings You Initiated</Link>
        </NavItem>
        <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
          <MenuItem eventKey={3.1}>Action</MenuItem>
          <MenuItem eventKey={3.2}>Another action</MenuItem>
          <MenuItem eventKey={3.3}>Something else here</MenuItem>
          <MenuItem divider />
          <MenuItem eventKey={3.3}>Separated link</MenuItem>
        </NavDropdown>
      </Nav>
      <Nav pullRight>
        <NavItem eventKey={1} href="#">Link Right</NavItem>
        <NavItem eventKey={2} href="#">Link Right</NavItem>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
	</div>
);

export default Header;

// <Navbar>
// 	<Navbar.Header>
// 		<Navbar.Brand>
//
//
// 		</Navbar.Brand>
// 	</Navbar.Header>
// 	<Nav>
// 		<NavItem>
// 			<Link to="/">Explore</Link>
// 		</NavItem>
// 		<NavItem>
// 			<Link to="/new">New Listings Near You</Link>
// 		</NavItem>
// 		<NavItem>
// 			<Link to="/joined">Listings You Joined</Link>
// 		</NavItem>
// 		<NavItem>
// 			<Link to="/initiated">Listings You Initiated</Link>
// 		</NavItem>
// 	</Nav>
// </Navbar>
