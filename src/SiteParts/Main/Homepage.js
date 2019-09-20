/*jshint esversion: 9 */
import React from 'react';
import Titlebar from './Titlebar';
import Container from 'react-bootstrap/Container';
class Homepage extends React.Component {
    render() {
      return (
        <Container className="login-body">
          <Titlebar />
        </Container>
      );
    }
  }
  export default Homepage;