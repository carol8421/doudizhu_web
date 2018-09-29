import React, {Component} from 'react';
import Card from './Card';
import './CardList.css';

class CardList extends Component {
    //props
    // cards min3的list
    // enableChoose 是否可选中 false/true
    // chooseCards 选中的index的list
    // toggle 改变一个的回调函数
    onClickCard(ev, index) {
        if (this.props.enableChoose && this.props.toggle) {
            this.props.toggle(index);
        }

    }

    render() {
        var card_list = []
        // enable的情况
        var mobile = document.documentElement.clientHeight < 400;
        var mgLeft = mobile? "-30px" : "-100px";
        var firstChoosed = {marginTop:"0px"};
        var firstUnchoosed = {marginTop: mobile? "18px" :"30px"};
        var nChoosed = {marginLeft :mgLeft,
                        marginTop : "0px"};
        var nUnchoosed = {marginLeft :mgLeft,
                          marginTop:mobile? "18px":"30px"};
        var cStyle;

        for (var i = 0; i < this.props.cards.length; i++) {
            if (this.props.enableChoose) {
                if (this.props.chooseCards.includes(i)) {
                    cStyle = i ? nChoosed: firstChoosed;
                }
                else {
                    cStyle = i ? nUnchoosed: firstUnchoosed;
                }
            }
            else {
                cStyle = i ? nChoosed: {};
            }

            card_list.push((<Card   cValue={this.props.cards[i]} 
                                    cStyle={cStyle} 
                                    key = {this.props.cards[i]}
                                    index = {i}
                                    onClick = {this.onClickCard.bind(this)}/>))
        }


        return (<div className={["CardList",this.props.exClass].join(' ')}>
                {card_list}
                </div>)
    }

}


export default CardList;