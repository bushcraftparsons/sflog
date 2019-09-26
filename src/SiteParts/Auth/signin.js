/*jshint esversion: 9 */
/*Signing in with Google https://developers.google.com/identity/sign-in/web/sign-in#before_you_begin*/
import React from 'react';
class GoogleSignIn extends React.Component {
  render() {
    return (
      <div id={this.props.GOOGLE_BUTTON_ID} className="btn btn-primary"/>
    );
  }
}

export default GoogleSignIn;