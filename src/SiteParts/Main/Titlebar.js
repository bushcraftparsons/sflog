/*jshint esversion: 9 */
import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Planeicon from '../../Icons/plane.js';
import SignOut from '../Auth/signout';
import SignIn from '../Auth/signin';
import styled from 'styled-components';
class Titlebar extends React.Component {
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
          <Navbar.Brand href="#home">Scilly Flight Log</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <NavCollapse>
            <Nav className="ml-auto">
              <div id="titleButtons">
                <SignIn GOOGLE_BUTTON_ID={this.props.GOOGLE_BUTTON_ID}/>
                <SignOut logOut={this.props.logOut} />
              </div>
            </Nav>
          </NavCollapse>
        </Navbar>
      )
    }
  }
  const NavCollapse = styled(Navbar.Collapse)`
    z-index:40;
  `;
  export default Titlebar;