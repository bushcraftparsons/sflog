/*jshint esversion: 6 */
/*Signing in with Google https://developers.google.com/identity/sign-in/web/sign-in#before_you_begin*/
import React from 'react';
const GOOGLE_BUTTON_ID = 'google-sign-in-button';
class GoogleSignIn extends React.Component {
  componentDidMount() {
    window.gapi.signin2.render(
      GOOGLE_BUTTON_ID,
      {
        width: 200,
        height: 50,
        onsuccess: this.onSuccess,
      },
    );
  }
  onSuccess(googleUser) {
    const profile = googleUser.getBasicProfile();
    console.log("Name: " + profile.getName());
    /**profile options are as follows: 
    BasicProfile.getId()// Do not send to your backend! Use an ID token instead.
    BasicProfile.getName()
    BasicProfile.getGivenName()
    BasicProfile.getFamilyName()
    BasicProfile.getImageUrl()
    BasicProfile.getEmail()// This is null if the 'email' scope is not present.
    */
    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    console.log("ID Token: " + id_token);
  }
  render() {
    return (
      <div id={GOOGLE_BUTTON_ID}/>
    );
  }
}

export default GoogleSignIn;