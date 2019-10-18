/*jshint esversion: 9 */
import React from 'react';
import styled from 'styled-components';
import Record from './Record';
import SliderBar from '../Widgets/SliderBar';

class RecordBar extends React.Component {
    constructor(props){
        super(props);
        this.state = {records:[],
                    startRecord:1,
                    endRecord:10};
    }
    componentDidMount(){
        //Fetch all needed variables for the form here
        this.getRecords(this.state.startRecord, this.state.endRecord);
    }
    /**Returns records from start to end in date desc. */
    getRecords(start, end){
        let values = {start:start,end:end};
        let fetchParams = {  
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization':this.props.user.googleToken
            },
            body: JSON.stringify(values)
        };
        //process.env.REACT_APP_GO_SERVER is set in package.json (production)
        //or in docker-compose.yml (development)
        fetch(process.env.REACT_APP_GO_SERVER + '/listLogs', fetchParams)
        .then(response => {
            if(response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            if (data.status) {
              //Logs have been returned
              let arrayLogs = data.logs;
              let result = [];
              for(let i=0; i<arrayLogs.length; i++){
                  let log = arrayLogs[i];
                  console.log(log);
                  result.push(<ListRecord key={i}>
                      <Record 
                        log={log}
                      /></ListRecord>);
              }
              this.setState({records:result});
              return;
            }
            throw new Error(`Logs not returned`);
          })
        .catch(error => {
            console.log({ error, gotLogs: false });
            this.setState({records:[]});
        });
    }
    render(){
        return(
            <SliderBar 
                childWidth={350}
                children={this.state.records}
                arrowColour={'222'}
            >
            </SliderBar>
        );
    }
}
const ListRecord = styled.li`
-webkit-border-top-right-radius: 5px;
-webkit-border-bottom-right-radius: 5px;
-webkit-border-bottom-left-radius: 5px;
-webkit-border-top-left-radius: 5px;
-moz-border-radius-topright: 5px;
-moz-border-radius-bottomright: 5px;
-moz-border-radius-bottomleft: 5px;
-moz-border-radius-topleft: 5px;
border-top-right-radius: 5px;
border-bottom-right-radius: 5px;
border-bottom-left-radius: 5px;
border-top-left-radius: 5px;
-moz-background-clip: padding;
-webkit-background-clip: padding-box;
background-clip: padding-box;
margin: 0px;
display: inline-block;
vertical-align: bottom;
position: relative;
z-index: 20;
background-color: white;`;
export default RecordBar;