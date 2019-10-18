/*jshint esversion: 9 */
import React from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styled from 'styled-components';
import bin from '../../Icons/bin.svg';
import pen from '../../Icons/pen.svg';
class Record extends React.Component {
    render(){
        return(
            <LogCard bg="primary" border="secondary" style={{ width: '18rem' }}>
                <Card.Header as="h5">{this.props.date}</Card.Header>
                <Card.Body>
                    <DeleteLog className = "deleteLog" onClick={this.deleteLog}></DeleteLog>
                    <EditLog className = "editLog" onClick={this.editLog}></EditLog>
                    <Card.Title>{this.props.aircraft}</Card.Title>
                    <Row>
                        <Col>Departure</Col><Col xs={6}>LEQ 10:20</Col>
                    </Row><Row>
                        <Col>Arrival</Col><Col xs={6}>ISC 10:40</Col>
                    </Row><Row>
                        <Col>Flight time (mins)</Col><Col xs={6}>20</Col>
                    </Row><Row>
                        <Col>Inst App</Col><Col xs={6}>True</Col>
                    </Row><Row>
                        <Col>Night flight time (mins)</Col><Col xs={6}>0</Col>
                    </Row><Row>
                        <Col>Log</Col><Col xs={6}>Yes</Col>
                    </Row><Row>
                        <Col>Comments</Col><Col xs={6}>Had a great time, saw dolphins</Col>
                    </Row><Row>
                        <Col>SP/MP</Col><Col xs={6}>MP</Col>
                    </Row><Row>
                        <Col>Capacity</Col><Col xs={6}>P1</Col>
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