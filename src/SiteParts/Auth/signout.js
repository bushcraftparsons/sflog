/*jshint esversion: 9 */
/*Signing out with Google https://developers.google.com/identity/sign-in/web/sign-in#before_you_begin*/
import React from 'react';
import Button from 'react-bootstrap/Button';
import styled from 'styled-components';
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
            <SignoutButton onClick={this.signOut.bind(this)} id="sign-out-button" className="navbar-expand-lg navbar-nav">Sign out</SignoutButton>
          );
      }
}
const SignoutButton = styled(Button)`
  display:inline-block;
  width:100px;
  height:40px;
  margin:2px;
  box-sizing: border-box;
  `;
export default SignOut;