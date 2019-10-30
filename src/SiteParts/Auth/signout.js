/*jshint esversion: 9 */
/*Signing out with Google https://developers.google.com/identity/sign-in/web/sign-in#before_you_begin*/
import React from 'react';
import Button from 'react-bootstrap/Button';
class SignOut extends React.Component{
    signOut() {
        var auth2 = window.gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
          this.props.logOut();
          console.log('User signed out.');
        }.bind(this));
      }

      render(){
          return(
            <Button href="#" onClick={this.signOut.bind(this)} id="sign-out-button">Sign out</Button>
          );
      }
}
export default SignOut;