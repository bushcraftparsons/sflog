/*jshint esversion: 9 */
import React from 'react';
import SliderBar from '../Widgets/SliderBar';

class RecordBar extends React.Component {
    componentDidMount(){
        //Fetch all needed variables for the form here
        this.props.getRecords();
    }
    
    render(){
        return(
            <SliderBar 
                childWidth={350}
                children={this.props.records}
                arrowColour={'222'}
            >
            </SliderBar>
        );
    }
}

export default RecordBar;