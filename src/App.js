/*jshint esversion: 9 */
import React from 'react';
// import { ReactComponent as planeIcon} from './plane.svg';
import './App.css';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Titlebar from './SiteParts/Main/Titlebar';
import Body from './SiteParts/Main/Body';


/**
 * Test google user for development purposes
 * TODO remove this when done
 */
const googleTestUser = {
  getBasicProfile:function(){return profile;},
  getAuthResponse:function(){return{id_token:"eyJhbGciOiJSUzI1NiIsImtpZCI6IjBiMGJmMTg2NzQzNDcxYTFlZGNhYzMwNjBkMTI1NmY5ZTQwNTBiYTgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiOTQ4MDgyMDUzMDQwLXIxdGVhZDQ4Z2tzdXE5MDJtMWc0Zm80cnNrNXFqMXR1LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiOTQ4MDgyMDUzMDQwLXIxdGVhZDQ4Z2tzdXE5MDJtMWc0Zm80cnNrNXFqMXR1LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTExMjM4Mzg5MDI1MDgzNDg2ODI3IiwiZW1haWwiOiJidXNoY3JhZnRwYXJzb25zQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiUkM3eDZ4aHZnLTgwWjJwZEgzaGRiQSIsIm5hbWUiOiJTdXNhbm5haCBQYXJzb25zIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BQXVFN21CWDc0bFRWcXBnUXh0UDN6MHhpUDhJU052d0ZWOXRwY1BuTVdTVj1zOTYtYyIsImdpdmVuX25hbWUiOiJTdXNhbm5haCIsImZhbWlseV9uYW1lIjoiUGFyc29ucyIsImxvY2FsZSI6ImVuLUdCIiwiaWF0IjoxNTY5NTAzMTEwLCJleHAiOjE1Njk1MDY3MTAsImp0aSI6IjVhMDJmZWFiZDRkNjBiZjQ2YzE0MzhmMjRlMGE0ZGY4ODRhY2QzNmUifQ.d89HC2NInPbRBT1WqVcuQd900xWz_bxUhKdmPu8KjnzhhjtOG_dD2lsP8NMzkoyLVWogaV3uz0M8Q68xHPeR9IzsBeZaWPH9E50IE2b58zTl5XFD3w2_0n-z67rvDTMcSch5nahKE1fqWIfRnmMw6bXw2zWlfkYkwCsknCXmCcb8jHDjpGogxiBx7alkrgA8ItnVKR8cdmadLDTjl4sHxMSM-4SRa13SO6g_g4HQDnDlhAoex1OcfH4XV48K8lIAoMM7roK3XxV0eADccAp0c7leWfVjGSAXwsMU6pzwg37iEWdxreXnMRCmHvmmRmnfLJRcf3NCKg5yqRxWfeDd9Q"};}//Fill in with real token for testing
};
/**
 * Test profile component for development
 * TODO remove this again
 */
const profile = {
  getEmail:function(){return "bushcraftparsons@gmail.com";},
  getName:function(){return "Susannah Parsons";},
  getGivenName:function(){return "Susannah";},
  getFamilyName:function(){return "Parsons";}
};

const GOOGLE_BUTTON_ID = 'google-sign-in-button';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      firstName:"",
      lastName:"",
      email:"",
      googleToken:null,
      subscribed:false
    };
  }
  //https://docs.aws.amazon.com/AmazonS3/latest/user-guide/add-cors-configuration.html
  componentDidMount() {
    if(process.env.NODE_ENV==="development"){
      this.onSuccess({});
    }else{
      window.gapi.signin2.render(
        GOOGLE_BUTTON_ID,
        {
          width: 200,
          height: 50,
          //Bind 'this' to the callback function, otherwise it won't be able to setState.
          onsuccess: this.onSuccess.bind(this),
        },
      );
    }
  }
  /**
   * onSuccess runs when the user signs in with Google sign in
   * /**Google basic profile options are as follows: 
    BasicProfile.getId()// Do not send to your backend! Use an ID token instead.
    BasicProfile.getName()
    BasicProfile.getGivenName()
    BasicProfile.getFamilyName()
    BasicProfile.getImageUrl()
    BasicProfile.getEmail()// This is null if the 'email' scope is not present.
   * @param {*} googleUser 
   */
  onSuccess(gUser) {
    //This should be bound to method already in componentDidMount
    let googleUser;
    if(process.env.NODE_ENV==="development"){
      googleUser = googleTestUser;
    }else{
      googleUser = gUser;
    }
    const profile = googleUser.getBasicProfile();
    //Logged in to Google, but we need to check if user is subscribed.
    let newState = {
      name:profile.getName(),
      firstName:profile.getGivenName(),
      lastName:profile.getFamilyName(),
      email:profile.getEmail(),
      googleToken:googleUser.getAuthResponse().id_token
    };
    console.log(newState);
    let fetchParams = {  
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization':newState.googleToken
        },
        body: JSON.stringify({
        'email': newState.email
        })
    };
    //process.env.REACT_APP_GO_SERVER is set in package.json (production)
    //or in docker-compose.yml (development)
    let apiurl;
    if(process.env.NODE_ENV==="development"){
      apiurl = process.env.REACT_APP_GO_SERVER;
      fetchParams = {  
        method: 'GET',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        }
    };
    }else{
      apiurl = process.env.REACT_APP_GO_SERVER + '/login';
    }
    fetch(apiurl, fetchParams)
    .then(response => {
        if(response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    })
    .then(data => {
        if (data.status) {
          //User is subscribed to our system
          newState.subscribed = true;
          this.setState(newState);
          return;
        }
        throw new Error(`User not recognised`);
      })
    .catch(error => {
        console.log({ error, loggedin: false });
        this.setState(newState);
    });
  }

  render(){
    //https://aws.amazon.com/blogs/compute/task-networking-in-aws-fargate/
    console.log("React app root:" + process.env.REACT_APP_GO_SERVER + " NODE_ENV:" + process.env.NODE_ENV);
    return (
      <React.Fragment>
        <Titlebar auth={this.state.auth} authhandler={this.authhandler} GOOGLE_BUTTON_ID={GOOGLE_BUTTON_ID}/>
        <div id="sfl-body"> 
          <Jumbotron id="content" className="col-md-offset-3">
            <Body user={this.state} />
          </Jumbotron>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
