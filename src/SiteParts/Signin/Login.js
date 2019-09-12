/*jshint esversion: 6 */
import React from 'react';
import Titlebar from '../Main/Titlebar';
import './Login.css';
import GoogleSignIn from './signin';
class Login extends React.Component {
    render() {
      return (
        <container className="login-body">
            <GoogleSignIn/>
        </container>
      );
    }
  }
  export default Login;