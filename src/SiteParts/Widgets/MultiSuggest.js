/*jshint esversion: 9 */
import React from 'react';
import styled, { css } from 'styled-components';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
/**
 * MultiSuggest creates a text box which reveals a multiple select dropdown on focus.
 * Typing in the box filters the multiple select.
 * The first selection in the list is selected by default, or up down arrow keys can be used to change selection.
 * If a selection doesn't exist, "add new" is selected and will run the given addNew function.
 * Props:
 * options - an array of options. If array contains an array of two values, then it will be displayed array[0]|array[1].
 * name - name of the form control
 * saveNewOption - function to add new item if user types a new one into the selection list. Parameter will be 
 * String or array of strings depending on whether options were given as an array of strings or as an array of arrays 
 * with two values
 */
export default class MultiSuggest extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        showSuggestions:true,
        showSecondOptionSuggestions:false,
        selectedIndex: 0,//Default to first one
        secondSelectedIndex: 0,//For if there is a second option
        suggestions:[],//The filtered list of suggestions
        secondOptionSuggestions:[],//The filtered list of second option suggestions
        openAddOptionDialogue:false,
        newOption:false,//User has typed a new option not in the list
        optionAccepted:false,
        twoOptionList:false,
        searchVal:"",
        widgetHasFocus:false
      };
      // create a ref to store the textInput DOM element
      this.setWrapperRef = this.setWrapperRef.bind(this);
      this.handleClickOutside = this.handleClickOutside.bind(this);
      this.textSearch = React.createRef();
    }

    /**
     * The below four methods make sure clicks outside the widget close the suggestions box.
     */
    setWrapperRef(node) {
        this.wrapperRef = node;
    }
    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }
    //handleClicking outside the widget
    handleClickOutside(e){
        if (this.wrapperRef && !this.wrapperRef.contains(e.target)) {
            //Clicked outside widget
            this.setState({
                widgetHasFocus:false
            });
        }
    }
    /**
     * The method below updates every time the props are updated.
     * Used to set the options
     * @param {*} prevProps 
     */
    componentDidUpdate(prevProps) {
        // Check for a change in props and update
        if (this.props.options !== prevProps.options) {
            this.setFilteredLists();
        }
    }

    setFilteredLists(){
        const searchVal = this.textSearch.current.value;
        const twoElementList = (typeof this.props.options[0] === "object");
        if(twoElementList){
            const result = this.props.options.filter(item => item[0].includes(searchVal.split("|")[0])).map(item=>item[0] + "|" + item[1]);
            if(result.length===0){
                //There aren't any first option suggestions. Try the second.
                const result2 = this.props.options.filter(item => item[1].includes(searchVal.split("|")[1])).map(item=>item[1]).filter((value, index, map)=>{return map.indexOf(value) === index;});
                if(result2.length===0){
                    //There aren't any second option suggestions. Hide suggestions completely.
                    this.setState({
                        showSuggestions:false,
                        showSecondOptionSuggestions:false,
                        twoOptionList:true,
                        newOption:true
                    });
                }else{
                    console.log("Showing second option suggestions");
                    //There are second option suggestions.
                    this.setState({
                        secondOptionSuggestions:result2,
                        showSuggestions:false,
                        showSecondOptionSuggestions:true,
                        twoOptionList:true,
                        newOption:true
                    });
                }
            }else{
                this.setState({
                    suggestions:result,
                    twoOptionList:true,
                    newOption:false,
                    showSuggestions:true,
                    showSecondOptionSuggestions:false,
                });
            }
        }else{
            //If a simple array, then return filtered list
            const result = this.props.options.filter(item => item.includes(searchVal));
            //If there are no results, then user is typing in a new item. Set selected index to null.
            if(result.length===0){
                //There are no results, this is a new option
                this.setState({
                    selectedIndex:null,
                    twoOptionList:false,
                    newOption:true,
                    showSuggestions:false,
                    showSecondOptionSuggestions:false,
                });
            }else{
                //There are results.
                this.setState({
                    suggestions:result,
                    twoOptionList:false,
                    newOption:false,
                    showSuggestions:true,
                    showSecondOptionSuggestions:false,
                });
            }
        }
    }

    searchFocus(){
        //Search box has focus. Show the suggestions list.
        this.setState({widgetHasFocus:true});
    }

    handleKeyPress(e){
        let newText = this.textSearch.current.value;
        if(this.props.forceUpperCase){
            newText = newText.toUpperCase();
        }
        if (e.key === 'Enter') {
            if(this.state.twoOptionList){
                //Could be selecting the second option
                if(this.state.newOption){
                    //Selecting the second option
                    let firstOption = newText.split("|")[0];
                    console.log("first option: " + firstOption);
                    let selection = this.state.secondOptionSuggestions[this.state.secondSelectedIndex];
                    let finalVal = firstOption + "|" + selection;
                    //Accept the selection, but open add new option form
                    this.setState({searchVal:finalVal});
                    this.textSearch.current.value = finalVal;
                    this.props.updateValue(this.textSearch.current.value);
                    this.setFilteredLists();
                    this.setState({openAddOptionDialogue:true});
                    return;
                }
            }
            //Accept selection
            let selection = this.state.suggestions[this.state.selectedIndex];
            this.setState({searchVal:selection});
            this.textSearch.current.value = selection;
            this.setFilteredLists();
            this.props.updateValue(this.textSearch.current.value);
        }else if(e.key === 'ArrowUp'){
            if(this.state.newOption){
                const selectedi = this.state.secondSelectedIndex;
                if(selectedi>0){
                    this.setState({secondSelectedIndex:selectedi-1});
                }
                return;
            }else{
                const selectedi = this.state.selectedIndex;
                if(selectedi>0){
                    this.setState({selectedIndex:selectedi-1});
                }
                return;
            }
        }else if(e.key === 'ArrowDown'){
            if(this.state.newOption){
                const selectedi = this.state.secondSelectedIndex;
                if(selectedi+1<this.state.secondOptionSuggestions.length){
                    this.setState({secondSelectedIndex:selectedi+1});
                }
                return;
            }
            const selectedi = this.state.selectedIndex;
            if(selectedi+1<this.state.suggestions.length){
                this.setState({selectedIndex:selectedi+1});
            }
            return;
        }else{
            this.setState({searchVal:newText});
            this.textSearch.current.value = newText;
            this.setFilteredLists();
            this.props.updateValue(this.textSearch.current.value);
        }
    }

    saveNew(){
        //Save the new value
        if(this.state.twoOptionList){
            this.props.saveNewOption(this.state.searchVal.split("|"));
        }else{
            this.props.saveNewOption(this.state.searchVal);
        }
        
        //Set the text search value to match it
        this.textSearch.current.value = this.state.searchVal;
        //Close the selections, hide the add option dialogue
        this.setState({
            widgetHasFocus:false,
            openAddOptionDialogue:false
        });
    }

    selectedOptionClick(index, e){
        //Selection is chosen.
        //Unfocus widget (hides all suggestion lists)
        //Set search text to the suggested item
        this.setState({
            widgetHasFocus:false,
            searchVal:this.state.suggestions[index],
            selectedIndex:index
        });
        this.textSearch.current.value = this.state.suggestions[index];
        this.setFilteredLists();
        this.props.updateValue(this.textSearch.current.value);
    }

    selectedSecondOptionClick(index, e){
        //Second selection chosen, is this a new option?
        if(this.state.newOption){
            //Show the add new option dialogue. //Hide selections.
            //Append the chosen item to the searchVal box
            this.setState({
                openAddOptionDialogue:true,
                searchVal:this.state.searchVal.split("|")[0] + "|" + this.state.secondOptionSuggestions[index],
                widgetHasFocus:false
            });
            this.textSearch.current.value = this.state.searchVal.split("|")[0] + "|" + this.state.secondOptionSuggestions[index];
            this.setFilteredLists();
            this.props.updateValue(this.textSearch.current.value);
        }else{
            //Selection is chosen.
            //Unfocus widget (hides all suggestion lists)
            //Set search text to the suggested item
            this.setState({
                widgetHasFocus:false,
                searchVal:this.state.searchVal.split("|")[0] + "|" + this.state.secondOptionSuggestions[index],
                secondOptionSuggestions:index
            });
            this.textSearch.current.value = this.state.searchVal.split("|")[0] + "|" + this.state.secondOptionSuggestions[index];
            this.setFilteredLists();
            this.props.updateValue(this.textSearch.current.value);
        }
    }

    getClassName(){
        if(this.props.isValid){
            return "form-control is-valid";
        }else{
            return "form-control";
        }
    }

    render() {
        return(
            <Form.Group ref={this.setWrapperRef} controlId={this.props.controlId}>
                <Form.Label>{this.props.label}</Form.Label>
                <input 
                    className={this.getClassName()}
                    type="text"
                    onFocus={this.searchFocus.bind(this)}
                    autoComplete="disabled"
                    ref={this.textSearch}
                    onKeyUp={this.handleKeyPress.bind(this)}
                    placeholder="Search.."
                />
                <Alert show={this.state.openAddOptionDialogue} variant="primary">
                    <Alert.Heading>Adding a new option:</Alert.Heading>
                    <p>{"Are you sure you want to add: " + this.state.searchVal + "?"}</p>
                    <p>You will not be able to remove it again.</p>
                    <hr />
                    <div className="d-flex justify-content-end">
                    <Button onClick={function(){this.setState({openAddOptionDialogue:false});}.bind(this)}>
                        No
                    </Button>
                    <Button onClick={this.saveNew.bind(this)} variant="primary">Yes</Button>
                    </div>
                </Alert>
                <div style={{position:"relative"}}>
                <SuggestionsBox as="select" 
                    id={this.props.controlId}
                    multiple={false}
                    name={this.props.name}
                    value={this.props.value}
                    onChange={(e)=>{
                        console.log("Selection changed");
                        this.props.handleChange(e);
                    }}
                    onBlur={this.props.handleBlur}
                    size={(this.state.widgetHasFocus && this.state.showSuggestions)?3:0}
                    hasFocus={this.state.widgetHasFocus}
                    show={this.state.showSuggestions}>
                {this.state.suggestions.map((option, index) => {
                    if(index===this.state.selectedIndex){
                        return (
                        <SuggestionSelected key={index} onMouseDown={this.selectedOptionClick.bind(this,index)}
                         value={option} label={option}/>
                        );
                    }
                    return (
                    <Suggestion key={index} onMouseDown={this.selectedOptionClick.bind(this, index)}
                    value={option} label={option}/>
                    );
                })}
                </SuggestionsBox>
                </div>
                {this.state.showSecondOptionSuggestions && this.state.widgetHasFocus &&
                    <SecondOptionSuggestionBox as="select" 
                        multiple={false}
                        size="3">
                    {this.state.secondOptionSuggestions.map((option, index) => {
                        if(index===this.state.secondSelectedIndex){
                            return (
                            <SuggestionSelected key={index} onMouseDown={this.selectedSecondOptionClick.bind(this,index)}>
                                {option}
                            </SuggestionSelected>
                            );
                        }
                        return (
                        <Suggestion key={index} onMouseDown={this.selectedSecondOptionClick.bind(this, index)}>
                            {option}
                        </Suggestion>
                        );
                    })}
                    </SecondOptionSuggestionBox>
                }
            <Form.Control.Feedback type="invalid">{this.props.errors}</Form.Control.Feedback>
        </Form.Group>)
    }
}

const SuggestionsBox = styled(Form.Control)`
position:absolute;
width:100%;
background-color:#222;
border: 2px solid white;
display:inline-block;
padding-inline-start: 25px;
padding-inline-end: 25px;
height: 100px;
overflow: hidden;
overflow-y: scroll;
z-index:20;
${props => !(props.show && props.hasFocus) ? 
    css`
  width: 0%;
  padding-inline-start: 0px;
  padding-inline-end: 0px;
  border:none;
  height:0%;`
  :``
}`;

const SecondOptionSuggestionBox = styled(Form.Control)`
position:absolute;
width:100%;
background-color:#222;
border: 2px solid white;
display:inline-block;
padding-inline-start: 25px;
padding-inline-end: 25px;
height: 100px;
overflow: hidden;
overflow-y: scroll;
z-index:20;`;

const SuggestionSelected = styled.option`
list-style-type: none;
display:block;
background-color:white;
color:#303030;`;

const Suggestion = styled.option`
list-style-type: none;
display:block;
color: #FFF;
&:hover {
    background-color:white;
    color:#303030;
}`;