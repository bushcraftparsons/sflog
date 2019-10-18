/*jshint esversion: 9 */
import React from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styled from 'styled-components';
import bin from '../../Icons/bin.svg';
import pen from '../../Icons/pen.svg';
import dayjs from '../../Utility/day';
class Record extends React.Component {
    render(){
        return(
            <LogCard bg="primary" border="secondary" style={{ width: '18rem' }}>
                <Card.Header as="h5">{new dayjs.utc(this.props.log.date).local().format("L")}</Card.Header>
                <Card.Body>
                    <DeleteLog className = "deleteLog" onClick={this.deleteLog}></DeleteLog>
                    <EditLog className = "editLog" onClick={this.editLog}></EditLog>
                    <Card.Title>{this.props.log.aircraft + "-" + this.props.log.type}</Card.Title>
                    <Row>
                        <Col>Departure</Col><Col xs={6}>{this.props.log.depPlace + " " + new dayjs.utc(this.props.log.depTime).local().format("LT")}</Col>
                    </Row><Row>
                        <Col>Arrival</Col><Col xs={6}>{this.props.log.arrPlace + " " + new dayjs.utc(this.props.log.arrTime).local().format("LT")}</Col>
                    </Row><Row>
                        <Col>Flight time (mins)</Col><Col xs={6}>{this.props.log.flightDuration}</Col>
                    </Row><Row>
                        <Col>Inst App</Col><Col xs={6}>{(this.props.log.instrumentApproach)?"True":"False"}</Col>
                    </Row><Row>
                        <Col>Night flight time (mins)</Col><Col xs={6}>{this.props.log.nightFlightDuration}</Col>
                    </Row><Row>
                        <Col>Log</Col><Col xs={6}>{(this.props.log.log)?"Yes":"No"}</Col>
                    </Row><Row>
                        <Col>Comments</Col><Col xs={6}>{this.props.log.comments}</Col>
                    </Row><Row>
                        <Col>SP/MP</Col><Col xs={6}>{this.props.log.pilotNumber}</Col>
                    </Row><Row>
                        <Col>Capacity</Col><Col xs={6}>{this.props.log.capacity}</Col>
                    </Row>
                    
                </Card.Body>
            </LogCard>
        );
    }
}

const LogCard = styled(Card)`
white-space: pre-wrap;`

const FooterButton = styled.div`
position:absolute;
margin-right:6px;
display:inline-block;
width:30px;
height:30px;
fill:#0a1d3c;
&:hover {
    background-color:white;
    fill:#0a1d3c;
    opacity:0.5;
}`

const DeleteLog = styled(FooterButton)`
background: url(${bin});
right:0px;
`

const EditLog = styled(FooterButton)`
background: url(${pen});
right:36px;
`

export default Record;