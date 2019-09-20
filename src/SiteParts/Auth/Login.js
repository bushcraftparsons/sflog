/*jshint esversion: 9 */
import React from 'react';
import './Login.css';
import GoogleSignIn from './signin';
import Container from 'react-bootstrap/Container';
import Titlebar from '../Main/Titlebar';
class Login extends React.Component {
    render() {
      return (
        <Container className="login-body">
            <Titlebar />
            <GoogleSignIn/>
        </Container>
      );
    }
  }
  export default Login;