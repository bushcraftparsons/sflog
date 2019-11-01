/*jshint esversion: 9 */
import React from 'react';
import Button from 'react-bootstrap/Button';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import { Formik } from 'formik';
import * as yup from 'yup';
import MultiSuggest from '../Widgets/MultiSuggest';
import dayjs from 'dayjs';
const schema = yup.object({
    date: yup.date().required(),
    aircraft: yup.string().required(),
    depPlace: yup.string().notRequired(),
    depTime: yup.string()
    .matches(/\d\d:\d\d/,"Entry must match format HH:mm")
    .test(
        "dep_time_test",
        "If present, departure time must be before arrival time",
        function(value) {
            const { arrTime } = this.parent;
            return isSameOrBefore(value, arrTime);
        }
    ).notRequired(),
    arrTime: yup.string()
    .matches(/\d\d:\d\d/,"Entry must match format HH:mm")
    .test(
        "arr_time_test",
        "If present, arrival time must be after departure time",
        function(value) {
            const { arrTime } = this.parent;
            return isSameOrBefore(value, arrTime);
        }
    ).notRequired(),
    arrPlace: yup.string().notRequired(),
    nightFlightDuration: yup.number().notRequired().positive().integer(),
    flightDuration: yup.number().when(['depTime', 'arrTime'], {
        is:(depTime, arrTime) => depTime && arrTime,
        then: yup.number().notRequired().positive().integer(),
        otherwise: yup.number().required('Flight duration is required when arrival and departure are not completed').positive().integer()
    }),
    instrumentApproach: yup.bool().required(),
    log: yup.bool().required(),
    comments: yup.string().notRequired(),
    pilotNumber: yup.string().required().oneOf(['SP','MP']),
    capacity: yup.string().required()
  });

  const isSameOrBefore = (startTime, endTime) => {
      if(typeof startTime === 'undefined' || typeof endTime === 'undefined'){
          return true;
      }
      //Convert to dayjs
      let start = dayjs().set('hour', startTime.split(":")[0]).set('minute',startTime.split(":")[1]);
      let end = dayjs().set('hour', endTime.split(":")[0]).set('minute',endTime.split(":")[1]);
    return !start.isAfter(end);
  };
class LogForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            aircraft:[],
            places:[],
            capacity:[]
        };
        this.saveNewAircraft.bind(this);
    }

    componentDidMount(){
        //Fetch all needed variables for the form here
        this.getAircraft();
        this.getPlaces();
        this.getCapacity();
    }
    getAircraft(){
        let fetchParams = {  
            method: 'GET',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization':this.props.user.googleToken
            }
        };
        //process.env.REACT_APP_GO_SERVER is set in package.json (production)
        //or in docker-compose.yml (development)
        fetch(process.env.REACT_APP_GO_SERVER + '/listAircraft', fetchParams)
        .then(response => {
            if(response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            if (data.status) {
              //Aircraft have been returned
              let arrayCraft = data.aircraft;
              let result = [];
              for(let i=0; i<arrayCraft.length; i++){
                  let ac = arrayCraft[i];
                  result.push([ac.aircraft,ac.type]);
              }
              schema.aircraft = yup.string().required().oneOf(result);
              result.sort();
              this.setState({aircraft:result});
              return;
            }
            throw new Error(`Aircraft not returned`);
          })
        .catch(error => {
            console.log({ error, gotAircraft: false });
            this.setState({aircraft:[]});
        });
    }
    getPlaces(){
        let fetchParams = {  
            method: 'GET',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization':this.props.user.googleToken
            }
        };
        //process.env.REACT_APP_GO_SERVER is set in package.json (production)
        //or in docker-compose.yml (development)
        fetch(process.env.REACT_APP_GO_SERVER + '/listPlaces', fetchParams)
        .then(response => {
            if(response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            if (data.status) {
              //Places have been returned
              let arrayPlaces = data.places;
              let result = [];
              for(let i=0; i<arrayPlaces.length; i++){
                  let pl = arrayPlaces[i];
                  result.push(pl.place);
              }
              schema.place = yup.string().required().oneOf(result);
              result.sort();
              this.setState({places:result});
              return;
            }
            throw new Error(`Places not returned`);
          })
        .catch(error => {
            console.log({ error, gotPlaces: false });
            this.setState({places:[]});
        });
    }
    getCapacity(){
        let fetchParams = {  
            method: 'GET',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization':this.props.user.googleToken
            }
        };
        //process.env.REACT_APP_GO_SERVER is set in package.json
        fetch(process.env.REACT_APP_GO_SERVER + '/listCapacity', fetchParams)
        .then(response => {
            if(response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            if (data.status) {
              //Places have been returned
              let arrayCapacity = data.capacity;
              let result = [];
              for(let i=0; i<arrayCapacity.length; i++){
                  let cap = arrayCapacity[i];
                  result.push(cap.capacity);
              }
              schema.capacity = yup.string().required().oneOf(result);
              result.sort();
              this.setState({capacity:result});
              return;
            }
            throw new Error(`Capacity not returned`);
          })
        .catch(error => {
            console.log({ error, gotCapacity: false });
            this.setState({capacity:[]});
        });
    }
    now(){
        let today = new Date(); 
        let dd = today.getDate(); 
        let mm = today.getMonth() + 1; 
        let yyyy = today.getFullYear(); 
        if (dd < 10) { 
            dd = '0' + dd; 
        } 
        if (mm < 10) { 
            mm = '0' + mm; 
        } 
        return yyyy + '-' + mm + '-' + dd;
    }
    submitLog(values, actions){
        //Make sure values has split the aircraft into aircraft and type
        let at = values.aircraft.split("|");
        values.aircraft = at[0];
        values.type = at[1];
        //Date values should be in format: 2006-01-02T15:04:05Z - this is UTC +-0
        let date = new Date(values.date);
        let shortDate = values.date;
        values.date = date.toISOString();//Need: 2006-01-02T15:04:05Z
        values.date = values.date.split(".")[0] + "Z";
        if(values.arrTime!==""){
            let depTime = new Date(shortDate + "T" + values.depTime);
            let arrTime = new Date(shortDate + "T" +  values.arrTime);
            values.depTime = depTime.toISOString();//"2019-10-18T05:15:00.000Z"
            values.arrTime = arrTime.toISOString();//"2019-10-18T05:15:00.000Z"
            values.depTime = values.depTime.split(".")[0] + "Z";
            values.arrTime = values.arrTime.split(".")[0] + "Z";
        }
        if(typeof values.nightFlightDuration === "string"){
            values.nightFlightDuration = 0;
        }
        console.log(values);
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
        fetch(process.env.REACT_APP_GO_SERVER + '/addLog', fetchParams)
        .then(response => {
            if(response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            if (data.status) {
              //Log was added successfully
              console.log("log added");
              actions.setSubmitting(false);
              //Close form once completed.
              this.props.hide();
              return;
            }
            throw new Error(`User not recognised`);
          })
        .catch(error => {
            console.log("Log addition failed");
            console.log({ error});
            actions.setSubmitting(false);
        });
    }
    saveNewAircraft(aircraft){
        let fetchParams = {  
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization':this.props.user.googleToken
            },
            body: JSON.stringify({'aircraft':aircraft[0],
                'type':aircraft[1]})
        };
        //process.env.REACT_APP_GO_SERVER is set in package.json (production)
        //or in docker-compose.yml (development)
        fetch(process.env.REACT_APP_GO_SERVER + '/addAircraft', fetchParams)
        .then(response => {
            if(response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            if (data.status) {
              //Aircraft has been added. Refresh list.
              this.getAircraft();
              return;
            }
            throw new Error(`Aircraft not added`);
          })
        .catch(error => {
            console.log({ error, saveAircraft: false });
        });
        
    }
    saveNewPlace(place){
        let fetchParams = {  
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization':this.props.user.googleToken
            },
            body: JSON.stringify({'place':place})
        };
        //process.env.REACT_APP_GO_SERVER is set in package.json (production)
        //or in docker-compose.yml (development)
        fetch(process.env.REACT_APP_GO_SERVER + '/addPlace', fetchParams)
        .then(response => {
            if(response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            if (data.status) {
              //Place has been added. Refresh list.
              this.getPlaces();
              return;
            }
            throw new Error(`Place not added`);
          })
        .catch(error => {
            console.log({ error, savePlace: false });
        });
    }
    checkVals(touched, errors, values){
        console.log("Showing touched, errors and values");
        console.log(touched);
        console.log(errors);
        console.log(values);
    }
    /**TODO make general for whatever aircraft are in database */
    checkSPMP(setFieldValue, newVal){
        //Check if the aircraft type is likely to be single or multi pilot, then preset form
        if(newVal.includes("|")){
            let type = newVal.split("|")[1];
            if(type==="DHC6"){
                setFieldValue("pilotNumber", "MP");
            }
            if(type==="BN2"){
                setFieldValue("pilotNumber", "SP");
            }
        }
    }
    timeFieldComplete(e, handleBlur, handleChange, setFieldValue){
        let v = e.target.value;
        if(v.includes(":")){
            let varr = v.split(":");
            if(varr[0].length===1){
                varr[0] = varr[0] + "0";
            }
            if(varr[1].length===0){
                varr[1] = "00";
            }
            if(varr[1].length===1){
                varr[1] = varr[1] + "0";
            }
            e.value = varr[0] + ":" + varr[1];
        }else{
            if(v.length===1){
                e.value = "0" + v + ":00";
            }else if(v.length===2){
                e.value = v + ":00";
            }else if(v.length===3){
                if(v.substring(2)==="0"){
                    e.value = "0" + v.substring(0,1) + ":" + v.substring(1);
                }else{
                    e.value = v.substring(0,2) + ":" + v.substring(2) + "0";
                }
            }else{
                e.value = v.substring(0,2) + ":" + v.substring(2);
            }
        }
        e.target.value = e.value;
        handleChange(e);
        //Make sure flight duration is completed automatically if possible
        let atime = this.arrTime.value;
        let dtime = this.depTime.value;
        if(atime.includes(":") && dtime.includes(":")){
            //We have both departure and arrival times, calculate duration
            let end = dayjs().set('hour', atime.split(":")[0]).set('minute',atime.split(":")[1]).set('second',0);
            let start = dayjs().set('hour', dtime.split(":")[0]).set('minute',dtime.split(":")[1]).set('second',0);
            let df2 = end.diff(start, "minutes");
            setFieldValue("flightDuration", df2);
        }
        handleBlur(e);
    }
    render(){
        return (
            <Jumbotron>
                <Formik
                    validationSchema={schema}
                    onSubmit={this.submitLog.bind(this)}
                    initialValues={{
                        date: this.now(),
                        aircraft: "",
                        depPlace:"",
                        depTime:"",
                        arrPlace:"",
                        arrTime:"",
                        flightDuration:"",
                        nightFlightDuration:"",
                        instrumentApproach: true,
                        log: true,
                        comments: "",
                        pilotNumber:"SP",
                        capacity:"P1"
                    }}
                >
                    {({
                        handleSubmit,
                        handleChange,
                        handleBlur,
                        values,
                        touched,
                        isValid,
                        errors,
                        setFieldValue
                    }) => (
                    <Form noValidate onSubmit={handleSubmit} autoComplete="off">
                        <input type={'hidden'} value={'turnoffautocomplete'} />
                        <Form.Group controlId="validationFormik01">
                            <Form.Label>Flight Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="date"
                                value={values.date}
                                onChange={handleChange}
                                isValid={touched.date && !errors.date}
                            />
                            <Form.Control.Feedback type="invalid">{errors.date}</Form.Control.Feedback>
                        </Form.Group>
                        <MultiSuggest 
                            label="Aircraft|Type"
                            type="text"
                            name="aircraft"
                            controlId="validationFormik02"
                            value={values.aircraft}
                            updateValue={(newVal)=>{
                                values.aircraft=newVal;
                                touched.aircraft=true;
                                this.checkSPMP(setFieldValue, newVal);
                            }}
                            saveNewOption={this.saveNewAircraft.bind(this)}
                            isValid={touched.aircraft && !errors.aircraft}
                            options={this.state.aircraft}
                            forceUpperCase={true}
                            errors={errors.aircraft}
                            onChange={handleChange}/>
                        <Form.Row>
                            <Col>
                                <MultiSuggest 
                                    label="Departure place"
                                    type="text"
                                    name="depPlace"
                                    controlId="validationFormik03"
                                    value={values.depPlace}
                                    updateValue={(newVal)=>{
                                        values.depPlace=newVal;
                                        touched.depPlace=true;
                                    }}
                                    saveNewOption={this.saveNewPlace.bind(this)}
                                    isValid={touched.depPlace && !errors.depPlace}
                                    options={this.state.places}
                                    forceUpperCase={true}
                                    errors={errors.depPlace}
                                    onChange={handleChange}/>
                            </Col>
                            <Col>
                                <Form.Group  controlId="validationFormik04">
                                    <Form.Label>Departure time</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="depTime"
                                        ref={(node)=>{this.depTime = node;}}
                                        placeholder="hh:mm"
                                        value={values.depTime}
                                        onBlur={(e)=>this.timeFieldComplete(e, handleBlur,handleChange,setFieldValue)}
                                        onChange={(e)=>{
                                            let v = e.target.value;
                                            if(v.includes(":")){
                                                let varr = v.split(":");
                                                if(varr[1].length===2){
                                                    //Make sure flight duration is completed automatically if possible
                                                    let atime = this.arrTime.value;
                                                    if(atime.includes(":")){
                                                        //We have both departure and arrival times, calculate duration
                                                        let end = dayjs().set('hour', atime.split(":")[0]).set('minute',atime.split(":")[1]).set('second',0);
                                                        let start = dayjs().set('hour', varr[0]).set('minute',varr[1]).set('second',0);
                                                        let df2 = end.diff(start, "minutes");
                                                        setFieldValue("flightDuration", df2);
                                                    }
                                                }
                                                //Make sure single digit hours are prepended by 0
                                                let hour = varr[0];
                                                if(hour.length===1){
                                                    hour = "0" + hour;
                                                    e.value = hour + ":" + varr[1];
                                                    handleChange(e);
                                                    setFieldValue("depTime", hour + ":" + varr[1]);
                                                    return;
                                                }
                                            }else{
                                                //No colon typed
                                                if(v.length===4){
                                                    e.value = v.substring(0,2) + ":" + v.substring(2);
                                                }
                                            }
                                            handleChange(e);
                                        }}
                                        isValid={touched.depTime && !errors.depTime}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.depTime}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col>
                                <MultiSuggest 
                                    label="Arrival place"
                                    type="text"
                                    name="arrPlace"
                                    controlId="validationFormik05"
                                    value={values.arrPlace}
                                    updateValue={(newVal)=>{
                                        values.arrPlace=newVal;
                                        touched.arrPlace=true;
                                    }}
                                    saveNewOption={this.saveNewPlace.bind(this)}
                                    isValid={touched.arrPlace && !errors.arrPlace}
                                    options={this.state.places}
                                    forceUpperCase={true}
                                    errors={errors.arrPlace}
                                    onChange={handleChange}/>
                            </Col>
                            <Col>
                                <Form.Group  controlId="validationFormik06">
                                    <Form.Label>Arrival time</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="arrTime"
                                        ref={(node)=>{this.arrTime = node;}}
                                        placeholder="hh:mm"
                                        value={values.arrTime}
                                        onBlur={(e)=>this.timeFieldComplete(e, handleBlur,handleChange,setFieldValue)}
                                        onChange={(e)=>{
                                            let v = e.target.value;
                                            if(v.includes(":")){
                                                let varr = v.split(":");
                                                if(varr[1].length===2){
                                                    //Make sure flight duration is completed automatically if possible
                                                    let dtime = this.depTime.value;
                                                    if(dtime.includes(":")){
                                                        //We have both departure and arrival times, calculate duration
                                                        let start = dayjs().set('hour', dtime.split(":")[0]).set('minute',dtime.split(":")[1]).set('second',0);
                                                        let end = dayjs().set('hour', varr[0]).set('minute',varr[1]).set('second',0);
                                                        let df2 = end.diff(start, "minutes");
                                                        setFieldValue("flightDuration", df2);
                                                    }
                                                }
                                                //Make sure single digit hours are prepended by 0
                                                let hour = varr[0];
                                                if(hour.length===1){
                                                    hour = "0" + hour;
                                                    e.value = hour + ":" + varr[1];
                                                    handleChange(e);
                                                    setFieldValue("arrTime", hour + ":" + varr[1]);
                                                    return;
                                                }
                                            }
                                            handleChange(e);
                                        }}
                                        isValid={touched.arrTime && !errors.arrTime}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.arrTime}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col>
                                <Form.Group  controlId="validationFormik07">
                                    <Form.Label>Flight duration</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="flightDuration"
                                        placeholder="Duration in minutes"
                                        value={values.flightDuration}
                                        onChange={handleChange}
                                        isValid={!errors.flightDuration}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.flightDuration}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group  controlId="validationFormik09">
                                    <Form.Label>Night flight duration</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="nightFlightDuration"
                                        placeholder="Duration in minutes"
                                        value={values.nightFlightDuration}
                                        onChange={handleChange}
                                        isValid={touched.nightFlightDuration && !errors.nightFlightDuration}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.nightFlightDuration}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col>
                                <Form.Group>
                                    <Form.Check
                                    required
                                    name="instrumentApproach"
                                    label="Instrument approach"
                                    onChange={handleChange}
                                    isInvalid={!!errors.instrumentApproach}
                                    feedback={errors.instrumentApproach}
                                    defaultChecked={true}
                                    id="validationFormik08"
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Check
                                    required
                                    name="log"
                                    label="Log"
                                    onChange={handleChange}
                                    isInvalid={!!errors.log}
                                    feedback={errors.log}
                                    defaultChecked={true}
                                    id="validationFormik010"
                                    />
                                </Form.Group>
                            </Col>
                        </Form.Row>
                        <Form.Group  controlId="validationFormik11">
                            <Form.Label>Comments</Form.Label>
                            <Form.Control
                                type="textArea"
                                name="comments"
                                placeholder="comments"
                                value={values.comments}
                                onChange={handleChange}
                                isValid={touched.comments && !errors.comments}
                            />
                            <Form.Control.Feedback type="invalid">{errors.comments}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Row>
                            <Col>
                                <Form.Group controlId="validationFormik12">
                                    <Form.Label>Single or Multi pilot</Form.Label>
                                    <Form.Control as="select" name="pilotNumber" 
                                        value={values.pilotNumber}
                                        isValid={!errors.pilotNumber}
                                        onChange={handleChange}
                                    >
                                        <option value={'SP'} label={'SP'}>SP</option>
                                        <option value={'MP'} label={'MP'}>MP</option>
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">{errors.pilotNumber}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="validationFormik13">
                                    <Form.Label>Capacity</Form.Label>
                                    <Form.Control as="select" name="capacity" 
                                        value={values.capacity}
                                        isValid={!errors.capacity}
                                        onChange={handleChange}
                                    >
                                        {this.state.capacity.map((option, index) => {
                                            return (
                                            <option 
                                                key={index}
                                                value={option} 
                                                label={option}></option>
                                            );
                                        })}
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">{errors.capacity}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                        <ButtonToolbar>
                            <Button variant="primary" type="submit">Submit Log</Button>
                            <Button variant="primary" onClick={this.props.hide}>Cancel</Button>
                            <Button variant="primary" onClick={this.checkVals.bind(this,touched, errors, values)}>Check</Button>
                        </ButtonToolbar>
                    </Form>
                    )}
                </Formik>
            </Jumbotron>
        );
    }
}
export default LogForm;