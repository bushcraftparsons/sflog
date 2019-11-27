/*jshint esversion: 9 */
import React from 'react';
// import { ReactComponent as planeIcon} from './plane.svg';
import './App.css';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Titlebar from './SiteParts/Main/Titlebar';
import Body from './SiteParts/Main/Body';

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

  testLogin(googleToken, email){
    let fetchParams = {  
      method: 'POST',
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization':googleToken
      },
      body: JSON.stringify({
      'email': email
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
        console.log("User subscribed");
        return;
      }
      throw new Error(`User not recognised`);
    })
  .catch(error => {
      console.log({ error, loggedin: false });
      console.log("User not subscribed");
  });
  }
  //https://docs.aws.amazon.com/AmazonS3/latest/user-guide/add-cors-configuration.html
  componentDidMount() {
      const email = "bushcraftparsons@gmail.com";
      const token = ENV['GOOGLETOKEN'];
      if(process.env.NODE_ENV==="development"){
        this.setState({
          firstName:"Susannah",
          lastName:"Parsons",
          name:"Susannah Parsons",
          email:email,
          googleToken:token,
          subscribed:true
        });
      }
      // this.testLogin(token, email);
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
  logIn(googleUser) {
    console.log(googleUser);
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
          let user = data.user;
          console.log(user);
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

  failedLogIn(){
    console.log("Failed to log in");
  }

  logOut(){
    this.setState({
      firstName:"",
      lastName:"",
      email:"",
      googleToken:null,
      subscribed:false
    });//Return to the default state
  }

  getWelcomeMessage(){
    if(this.state.subscribed){
      return (<p>Welcome {this.state.firstName}</p>);
    }
  }

  render(){
    //https://aws.amazon.com/blogs/compute/task-networking-in-aws-fargate/
    return (
      <React.Fragment>
        <Titlebar auth={this.state.auth} logIn={this.logIn.bind(this)} failedLogIn={this.failedLogIn.bind(this)} logOut={this.logOut.bind(this)} authhandler={this.authhandler} user={this.state}/>
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
