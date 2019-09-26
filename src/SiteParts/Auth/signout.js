/*jshint esversion: 9 */
/*Signing out with Google https://developers.google.com/identity/sign-in/web/sign-in#before_you_begin*/
import React from 'react';
import Button from 'react-bootstrap/Button';
class SignOut extends React.Component{
    signOut() {
        var auth2 = window.gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
          console.log('User signed out.');
        });
      }

      render(){
          return(
            <Button href="#" onClick="signOut();" id="sign-out-button">Sign out</Button>
          );
      }
}
export default SignOut;