import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiLogOut } from 'react-icons/fi';
import cookies from 'js-cookie';

function HeaderNavbar() {
  const userName = cookies.get('userName');
  const isLoggedIn = true; // Assuming the user is logged in
  const navigate = useNavigate();

  const handleLogout = () => {
    clearCookie();
    navigate('/');
  }

  function clearCookie() {
    document.cookie = 'userId=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'userCode=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'groupCode=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'userName=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#"></Navbar.Brand>
          <Nav className="ml-auto">
            {isLoggedIn ? (
              <>
                <Nav.Link disabled className="text-light pf_link"><FiUser /> {userName}</Nav.Link>
                <Nav.Link onClick={handleLogout}>
                  <FiLogOut /> ログアウト
                </Nav.Link>
              </>
            ) : (
              <Link to="/" className="nav-link" >Login</Link>
            )}
          </Nav>
        </Container>
      </Navbar>
    </>
  );

}

export default HeaderNavbar;
