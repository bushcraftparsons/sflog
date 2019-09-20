/*jshint esversion: 9 */
import React from 'react';
import Login from '../Auth/Login';
import Homepage from './Homepage';
class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn : false
        };
    }

    componentDidMount() {
        if(sessionStorage.getItem('jwtToken') !== null){
            let user = JSON.parse(sessionStorage.getItem('user'));
            let obj = {  
                method: 'POST',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization':sessionStorage.getItem('jwtToken')
                },
                body: JSON.stringify({
                'email': user.email
                })
            };
            console.log("go server " + process.env.REACT_APP_GO_SERVER);
            fetch(process.env.REACT_APP_GO_SERVER + '/login', obj)
            .then(function(response) {
                if(response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                if (data.status) {
                    this.login(true);
                }
                throw new Error(`User not recognised`);
            })
            .catch(error => {
                console.log({ error, isLoading: false });
            });
        }
    }

    login(isloggedIn){
        this.setState({
            loggedIn: isloggedIn
          });
    }
    
    render() {
        if(this.state.loggedIn){
            console.log("returning the homepage");
            return (<Homepage/>);
        }
        return (<Login/>);
    }
  }
  export default Main;