/*jshint esversion: 9 */
import React from 'react';
import './Login.css';
import GoogleSignIn from './signin';
import Container from 'react-bootstrap/Container';
class Login extends React.Component {
    render() {
      return (
        <Container className="login-body">
            <GoogleSignIn/>
        </Container>
      );
    }
  }
  export default Login;