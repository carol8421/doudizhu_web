import React, {Component} from 'react';
import "./Card.css"
import * as poker from './poker';

//显示 console格式的牌 ['♦', '♣', '♥', '♠'] min3 类型
class Card extends Component {
    render() {
        var small = this.props.size === 'small';
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
        else if (nValue == poker.MIN3_V) {
            number = '小';
            color = '王';
            color_css = 'card-spade';
        }
        else if (nValue == poker.MIN3_W) {
            number = '大';
            color = '王';
            color_css = 'card-heart';
        }    
        
        var small_cn = '';
        if (small) {
            small_cn += ' card-small';
        }
        
        return (<div className= {"card " + color_css + small_cn} 
                     style = {this.props.cStyle} 
                     onClick = { e => { e.preventDefault();if (this.props.onClick){this.props.onClick(e, this.props.index);}}}
                >
            <div className= {"card-number " + color_css}> {number}</div>
            <div className= {"card-color " + color_css}> {color}</div>
            { !small &&
                (<div className= {"card-big-color " + color_css}> {color}</div>)
            }
        </div>);
    }



}

export default Card;