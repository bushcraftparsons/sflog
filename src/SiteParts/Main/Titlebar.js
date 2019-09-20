/*jshint esversion: 9 */
import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Planeicon from '../../Icons/plane.js';
import SignOut from '../Auth/signout';
import SignIn from '../Auth/signin';
class Titlebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn : false
    };
  }
  checkAuth() {
    if(process.env.NODE_ENV==="development"){
      this.setState({ loggedIn:true});
      return;
    }
      if(sessionStorage.getItem('jwtToken') !== null){
          let user = JSON.parse(sessionStorage.getItem('user'));
          let obj = {  
              method: 'POST',
              headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization':sessionStorage.getItem('jwtToken')
              },
              body: JSON.stringify({
              'email': user.email
              })
          };
          console.log("go server " + process.env.REACT_APP_GO_SERVER);
          fetch(process.env.REACT_APP_GO_SERVER + '/login', obj)
          .then(function(response) {
              if(response.ok) {
                  return response.json();
              }
              throw new Error('Network response was not ok.');
          })
          .then(data => {
              if (data.status) {
                  this.setState({ loggedIn:true});
              }
              throw new Error(`User not recognised`);
          })
          .catch(error => {
              console.log({ error, isLoading: false });
          });
      }
  }
    loggedIn(){
      if(this.state.loggedIn){
        return <SignOut />
      }else{
        return <SignIn />
      }
    }
    render() {
      this.checkAuth();
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
              <loggedIn />
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      );
    }
  }
  export default Titlebar;