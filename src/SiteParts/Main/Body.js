/*jshint esversion: 9 */
import React from 'react';
class Body extends React.Component {
    render(){
        if(this.props.user.subscribed){
            return(<p>Welcome {this.props.user.name}</p>);
        }else if(this.props.user.googleToken){
            return(<p>Hi {this.props.user.name}, this is a subscription only service. Pricing...</p>);
        }else{
            return(<p>Please sign in with your google account using the sign in button above.</p>);
        }
    };
}
export default Body;