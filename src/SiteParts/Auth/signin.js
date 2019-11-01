/*jshint esversion: 9 */
/*Signing in with Google https://developers.google.com/identity/sign-in/web/sign-in#before_you_begin*/
import React from 'react';
import Button from 'react-bootstrap/Button';
import styled from 'styled-components';
const GOOGLE_BUTTON_ID = 'google-sign-in-button';
class GoogleSignIn extends React.Component {
  componentDidMount() {
    window.gapi.signin2.render(
      GOOGLE_BUTTON_ID,
      {
        width: 100,
        height: 30,
        theme: "dark",
        //Bind 'this' to the callback function, otherwise it won't be able to setState.
        onsuccess: this.props.logIn,
        onLoginSuccess: this.props.logIn,
        onfailure: this.props.failedLogIn
      },
    );
  }
  render() {
    return (
      <SigninButton id={GOOGLE_BUTTON_ID}/>
    );
  }
}

export default GoogleSignIn;

const SigninButton = styled(Button)`
display:inline-block;
font-size: 0.9375rem;
`;