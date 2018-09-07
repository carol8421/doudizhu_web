import React, {Component} from 'react';
import "./Card.css"
import * as poker from './poker';

//显示 console格式的牌 ['♦', '♣', '♥', '♠'] min3 类型
class Card extends Component {
    render() {

        var nValue = this.props.cValue & 0x1F;
        if (nValue < poker.MIN3_V) {
            var number = poker.MIN3[nValue];
            var colorIndex = (this.props.cValue >> 5) - 1;
            var color = poker.MIN3_COLOR[colorIndex];
            var color_css = 'card-diamond';
            if (colorIndex === 1) {
                color_css = 'card-clubs';
            }
            else if (colorIndex === 2) {
                color_css = 'card-heart';
            }
            else if (colorIndex === 3){
                color_css = 'card-spade';
            }
        }    
        
        
        
        return (<div className= {"card " + color_css} >
            <div className= {"card-number " + color_css}> {number}</div>
            <div className= {"card-color " + color_css}> {color}</div>
            <div className= {"card-big-color " + color_css}> {color}</div>
        </div>);
    }



}

export default Card;