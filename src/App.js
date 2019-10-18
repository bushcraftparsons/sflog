/*jshint esversion: 9 */
import React from 'react';
// import { ReactComponent as planeIcon} from './plane.svg';
import './App.css';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Titlebar from './SiteParts/Main/Titlebar';
import Body from './SiteParts/Main/Body';

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
    window.gapi.signin2.render(
      GOOGLE_BUTTON_ID,
      {
        width: 200,
        height: 50,
        //Bind 'this' to the callback function, otherwise it won't be able to setState.
        onsuccess: this.onSuccess.bind(this),
      },
    );
    if(process.env.NODE_ENV==="development"){
      this.setState({
        firstName:"Susannah",
        lastName:"Parsons",
        name:"Susannah Parsons",
        email:"bushcraftparsons@gmail.com",
        googleToken:"eyJhbGciOiJSUzI1NiIsImtpZCI6IjNkYjNlZDZiOTU3NGVlM2ZjZDlmMTQ5ZTU5ZmYwZWVmNGY5MzIxNTMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiOTQ4MDgyMDUzMDQwLXIxdGVhZDQ4Z2tzdXE5MDJtMWc0Zm80cnNrNXFqMXR1LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiOTQ4MDgyMDUzMDQwLXIxdGVhZDQ4Z2tzdXE5MDJtMWc0Zm80cnNrNXFqMXR1LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTExMjM4Mzg5MDI1MDgzNDg2ODI3IiwiZW1haWwiOiJidXNoY3JhZnRwYXJzb25zQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoidW9GY0J1MlVHTXBTbml4b3RHR0V6USIsIm5hbWUiOiJTdXNhbm5haCBQYXJzb25zIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BQXVFN21CWDc0bFRWcXBnUXh0UDN6MHhpUDhJU052d0ZWOXRwY1BuTVdTVj1zOTYtYyIsImdpdmVuX25hbWUiOiJTdXNhbm5haCIsImZhbWlseV9uYW1lIjoiUGFyc29ucyIsImxvY2FsZSI6ImVuLUdCIiwiaWF0IjoxNTcxMzkxODk5LCJleHAiOjE1NzEzOTU0OTksImp0aSI6IjBhOGUwYTk0MGM5ZjJhYWM3ZDk3NGQ2MDZiNTdiY2QyYzYyOWViNWUifQ.T-qij_f5joxraMJdnw9V96669ytICIHFjiLMzlrUuMKRxjDfonjukaq4SHDvQMo1ma-_VPXUWCZEWuB-u_Cwspp1RjVqb7Jzc61nXS490UkCSvPLc1aX6uvAAgMZQgwfa6Pg__LowyT3ESpxyIndGevptUdsIk2n15HG9c39enthtj9taMesTk5D98u2fbn04a3ISOhrTphOg3KSC1uQZJ0P1rZFcndHCqlXpSXaeD-pXb0rqOsY69-WZRMQCkdXdrHCmGCt7ez_T-4BxMqYrQnLHU-EnMY5cvVbg3QZjo222S1d9-ShB_b17wocqF1mxh4IbDVaRtDU-4LTMTWypg",
        subscribed:true
      });
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
  onSuccess(googleUser) {
    //This should be bound to method already in componentDidMount
    const profile = googleUser.getBasicProfile();
    //Logged in to Google, but we need to check if user is subscribed.
    let newState = {
      name:profile.getName(),
      firstName:profile.getGivenName(),
      lastName:profile.getFamilyName(),
      email:profile.getEmail(),
      googleToken:googleUser.getAuthResponse().id_token
    };
    console.log(newState);//TODO remove once no longer needed for dev
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
    fetch(process.env.REACT_APP_GO_SERVER + '/login', fetchParams)
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

  getWelcomeMessage(){
    if(this.state.subscribed){
      return (<p id="welcome">Welcome {this.state.firstName}</p>);
    }
  }

  render(){
    //https://aws.amazon.com/blogs/compute/task-networking-in-aws-fargate/
    return (
      <React.Fragment>
        <Titlebar auth={this.state.auth} authhandler={this.authhandler} GOOGLE_BUTTON_ID={GOOGLE_BUTTON_ID} user={this.state}/>
        <div id="sfl-body"> 
          {this.getWelcomeMessage()}
          <Jumbotron id="content" className="col-md-offset-3">
            <Body user={this.state} />
          </Jumbotron>
          <footer id="sfl-footer"></footer>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
