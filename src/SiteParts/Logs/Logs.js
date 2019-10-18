/*jshint esversion: 9 */
import React from 'react';
import RecordBar from './RecordBar';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import LogForm from './LogForm';
class Logs extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            addLog:false
        };
    }
    handleClose(){
        this.setState({addLog:false});
    }
    addLog(){
        this.setState({addLog:true});
    }
    render(){
        return(
            <div id="logs">
                <Modal show={this.state.addLog}><LogForm user={this.props.user} hide={this.handleClose.bind(this)}></LogForm></Modal>
                <RecordBar user={this.props.user}/>
                <Button href="#" onClick={this.addLog.bind(this)} id="add-log-button" className="pull-right">Add log</Button>
            </div>
        );
    }
}

export default Logs;