/*jshint esversion: 9 */
import React from 'react';
import './Login.css';
import GoogleSignIn from './signin';
import Container from 'react-bootstrap/Container';
import Titlebar from './Titlebar';
class Login extends React.Component {
    render() {
      return (
        <Titlebar />
        <Container className="login-body">
            <GoogleSignIn/>
        </Container>
      );
    }
  }
  export default Login;