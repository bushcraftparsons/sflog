/*jshint esversion: 9 */
import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Planeicon from '../../Icons/plane.js';
import SignOut from '../Auth/signout';
import SignIn from '../Auth/signin';
class Titlebar extends React.Component {
    loggedIn(isLoggedIn){
      if(isLoggedIn){
        return <SignOut />
      }else{
        return <SignIn />
      }
    }
    render() {
      return (
        <Navbar bg="light" expand="lg">
          <Navbar.Brand href="#home">
            <Planeicon
              fill="#000"
              className="otter-logo"
              height = '64px'
              width = '135px'
              // style={{ background: "#333", padding: "16px" }}
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <loggedIn isLoggedIn:false/>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      );
    }
  }
  export default Titlebar;