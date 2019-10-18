/*jshint esversion: 9 */
import React from 'react';
import styled from 'styled-components';
import Record from './Record';
import SliderBar from '../Widgets/SliderBar';
class RecordBar extends React.Component {
    getRecords(){
        let result = [];
        for(let i=1; i<=12; i++){
            result.push( <ListRecord key={i}><Record date="2019-03-20" aircraft="GBIHO-DHC6"/></ListRecord>);
        }
        return result;
    }
    render(){
        return(
            <SliderBar 
                childWidth={350}
                children={this.getRecords()}
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