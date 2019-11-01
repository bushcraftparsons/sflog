/*jshint esversion: 9 */
import React from 'react';
import RecordBar from './RecordBar';
import Record from './Record';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import LogForm from './LogForm';
import styled from 'styled-components';
class Logs extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            records:[],
            startRecord:1,
            endRecord:10,
            addLog:false
        };
    }
    /**Returns records from start to end in date desc. */
    getRecords(){
        let values = {start:this.state.startRecord,end:this.state.endRecord};
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
    handleClose(){
        this.setState({addLog:false});
    }
    addLog(){
        this.setState({addLog:true});
    }
    render(){
        return(
            <LogBody id="logs">
                <Modal show={this.state.addLog}><LogForm user={this.props.user} getRecords={this.getRecords.bind(this)} hide={this.handleClose.bind(this)}></LogForm></Modal>
                <RecordBar user={this.props.user} getRecords={this.getRecords.bind(this)} records={this.state.records}/>
                <Button href="#" onClick={this.addLog.bind(this)} id="add-log-button" className="pull-right">Add log</Button>
            </LogBody>
        );
    }
}

export default Logs;
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
const LogBody = styled.div``;