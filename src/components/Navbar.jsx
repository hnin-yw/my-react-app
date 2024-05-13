import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiUser, FiLogOut } from 'react-icons/fi';

function HeaderNavbar() {
  const isLoggedIn = true; // Assuming the user is logged in

  const handleLogout = () => {
    console.log('User logged out');
  };
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#"></Navbar.Brand>
          <Nav className="ml-auto">
            {isLoggedIn ? (
              <>
                <Nav.Link disabled className="text-light"><FiUser /> User</Nav.Link>
                <Nav.Link onClick={handleLogout}>
                  <FiLogOut /> ログアウト
                </Nav.Link>
              </>
            ) : (
              <Link to="/login" className="nav-link">Login</Link>
            )}
          </Nav>
        </Container>
      </Navbar>
      </>
  );
  
}

export default HeaderNavbar;
