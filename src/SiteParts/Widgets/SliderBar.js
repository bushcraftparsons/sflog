/*jshint esversion: 9 */
import React from 'react';
import styled, { css } from 'styled-components';
/**SliderBar creates a horizontal slider containing all the children, viewable by dragging back and forth
 * props:
 * essential:
 * childWidth - the desired width of children
 * children - an array of children e.g. cards or images but inside li tags
 * arrowColour - colour to use for the sliderbar arrows, numerical (without the preceding hash)
 * optional:
 * onDragStart - a function called when dragging starts
 * onDragEnd - a function called when dragging ends
 */
class SliderBar extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isDragging: false,
            originalX: 0,
            translateX: 0,
            lastTranslateX: 0,
            childWidth:props.childWidth,
            visibleChildren:0,
            hideLeft:true,
            hideRight:true
        };
        this.sliderBarRef = React.createRef();
    }
    componentWillUnmount() {
        window.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('mouseup', this.handleMouseUp);
        window.removeEventListener('touchmove', this.handleTouchMove);
        window.removeEventListener('touchend', this.handleTouchEnd);
    }
    shouldComponentUpdate(nextProps, nextState){
      if(nextProps.children.length !== this.props.children.length){
        this.resetChildNumber(nextProps);//Set starting position
      }
      return true;
    }
    handleTouchStart (e){
        const touch = e.touches[0];
        window.addEventListener('touchmove', this.handleTouchMove.bind(this));
        window.addEventListener('touchend', this.handleTouchEnd.bind(this));

        if (this.props.onDragStart) {
          this.props.onDragStart();
        }

        this.setState({
          originalX: touch.clientX,
          isDragging: true
        });
    }
    handleMouseDown ({ clientX }) {
        window.addEventListener('mousemove', this.handleMouseMove.bind(this));
        window.addEventListener('mouseup', this.handleMouseUp.bind(this));
    
        if (this.props.onDragStart) {
          this.props.onDragStart();
        }
    
        this.setState({
          originalX: clientX,
          isDragging: true
        });
    }
    handleLeftClick(){
        this.translate((this.state.childWidth) - this.state.originalX + this.state.lastTranslateX);
    }
    handleRightClick(){
        this.translate((this.state.childWidth*-1) - this.state.originalX + this.state.lastTranslateX);
    }
    handleTouchMove(e){
      const touch = e.touches[0];
      const { isDragging } = this.state;
        if (!isDragging) {
          return;
        }
        this.translate(touch.clientX - this.state.originalX + this.state.lastTranslateX);
    }
    handleMouseMove ({ clientX }) {
        const { isDragging } = this.state;
        if (!isDragging) {
          return;
        }
        this.translate(clientX - this.state.originalX + this.state.lastTranslateX);
        
    }
    resetChildNumber(nextProps){
      if(nextProps.children.length<=this.state.visibleChildren){
          this.hideLeftMask();
          this.hideRightMask();
          return;//Don't slide the bar when there are too few cards
      }
      if(0>=(nextProps.children.length-this.state.visibleChildren)*this.state.cardWidth *-1){
          this.showRightMask();
      }
  }
    translate(amountToTranslate){
        if(this.props.children.length<=this.state.visibleChildren){
            this.hideLeftMask();
            this.hideRightMask();
            return;//Don't slide the bar when there are too few cards
        }
        const { onDrag } = this.props;
        if(amountToTranslate>0){
            //Attempting to scroll further left than possible. Set to 0.
            amountToTranslate = 0;
        }
        if(amountToTranslate===0){
          this.hideLeftMask();
        }else{
          this.showLeftMask();
        }
        if(amountToTranslate<(this.props.children.length-this.state.visibleChildren)*this.state.cardWidth *-1){
            amountToTranslate = (this.props.children.length-this.state.visibleChildren)*this.state.cardWidth *-1;
            this.hideRightMask();
        }else{
            this.showRightMask();
        }
        this.setState({
          translateX: amountToTranslate
        }, () => {
          if (onDrag) {
            onDrag({
              translateX: this.state.translateX
            });
          }
        });
    }
    handleTouchEnd () {
      window.removeEventListener('touchmove', this.handleTouchMove.bind(this));
      window.removeEventListener('touchend', this.handleTouchEnd.bind(this));
  
      this.setState(
        {
          originalX: 0,
          lastTranslateX: this.state.translateX,
          isDragging: false
        },
        () => {
          if (this.props.onDragEnd) {
            this.props.onDragEnd();
          }
        }
      );
    }
    handleMouseUp () {
        window.removeEventListener('mousemove', this.handleMouseMove.bind(this));
        window.removeEventListener('mouseup', this.handleMouseUp.bind(this));
    
        this.setState(
          {
            originalX: 0,
            lastTranslateX: this.state.translateX,
            isDragging: false
          },
          () => {
            if (this.props.onDragEnd) {
              this.props.onDragEnd();
            }
          }
        );
    }
    componentDidMount() {
        window.addEventListener("resize", this.resize.bind(this));
        this.resize();
    }
    resize(){
      let width = window.innerWidth;
        this.setState({visibleChildren:Math.ceil(width/this.props.childWidth),
            cardWidth:this.sliderBarRef.current.offsetWidth/Math.ceil(width/this.props.childWidth)});
    }
    handleSelect(selectedIndex, e){
        this.setState({
            index:selectedIndex,
            direction:e.direction
        });
    }
    hideLeftMask(){
      if(this.state.hideLeft){return;}
      this.setState({hideLeft:true});
    }
    hideRightMask(){
      if(this.state.hideRight){return;}
      this.setState({hideRight:true});
    }
    showLeftMask(){
      if(!this.state.hideLeft){return;}
      this.setState({hideLeft:false});
    }
    showRightMask(){
      if(!this.state.hideRight){return;}
      this.setState({hideRight:false});
    }
    render(){
        const { translateX, isDragging } = this.state;
        return(
            <SliderContainer ref={this.sliderBarRef}>
                {!this.state.hideLeft &&
                  <MaskLeft>
                    <ScrollerLeft arrowColour={this.props.arrowColour} onClick={this.handleLeftClick.bind(this)}/>
                  </MaskLeft>
                }
                {!this.state.hideRight &&
                  <MaskRight>
                    <ScrollerRight arrowColour={this.props.arrowColour} onClick={this.handleRightClick.bind(this)}/>
                  </MaskRight>
                }
                <Slider
                     onMouseDown={this.handleMouseDown.bind(this)}
                     onTouchStart={this.handleTouchStart.bind(this)}
                     x={translateX}
                     isDragging={isDragging}
                     id="sflSlider">
                    {this.props.children}
                </Slider>
            </SliderContainer>
        );
    }
}

const Mask = styled.div`
position: absolute;
top: 0px;
bottom: 0px;
margin-bottom: 10px;
margin-top: 10px;
display: inline-flex;
justify-content: center;
align-items: center;
background-color: rgba(255,255,255,0.25);
width:50px;
z-index:10;
flex: 1;
`;

const MaskLeft = styled(Mask)`
left:0px;
`;

const MaskRight = styled(Mask)`
right:0px;
;
`;

const Scroller = styled.div.attrs(props => ({
    style: {
        backgroundImage: `url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox%3D%272%202%2012%2012%27%3E%3Cpath%20d%3D%27M6%203l5%205-5%205z%27%20fill%3D%27%23${props.arrowColour}%27%2F%3E%3C%2Fsvg%3E")`
    },
  }))`
cursor: pointer;
background-size: 50px 50px;
width: 50px;
height: 50px;
z-index:20;`;

const ScrollerLeft = styled(Scroller)`
-webkit-transform: scaleX(-1);
transform: scaleX(-1);
`;

const ScrollerRight = styled(Scroller)``;



const SliderContainer = styled.div`
    position: relative;
    display:flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height:100%;
    overflow: hidden;
`;

const Slider = styled.ul.attrs(props => ({
    style: {
      transform: `translate(${props.x}px)`
    },
  }))`
    flex: 1;
    margin-bottom: 10px;
    margin-top: 10px;
    cursor: grab;
    padding-inline-start:0px;
    width: 1170px;
    white-space: nowrap;
    ${props => props.isDragging ? 
        css`
      opacity: 0.8;
      cursor: grabbing;`
      :``
    }
`;
export default SliderBar;