/*jshint esversion: 9 */
/*Signing out with Google https://developers.google.com/identity/sign-in/web/sign-in#before_you_begin*/
import React from 'react';
import Nav from 'react-bootstrap/Nav';
class SignOut extends React.Component{
    signOut() {
        var auth2 = window.gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
          console.log('User signed out.');
        });
      }

      render(){
          return(
            <Nav.Link href="#" onclick="signOut();">Sign out</Nav.Link>
          );
      }
}
export default SignOut;