import React, {Component} from 'react';

import CardList from './CardList';
import * as poker from './poker';
class CardPlayed extends Component {
    constructor(props) {
        super(props);
        this.tempstate = {
            main:0,//0 显示空白， 1 倒计时， 2 不要， 3 显示牌内容
            cards:[],//牌内容
            second: 0, //秒数
        }
    }
    getPlayerPlayed(index) {
        var length = this.props.gameState.playingTrack.length;
        for (var i = 0; i < length; i++) {
            if (this.props.gameState.playingTrack[i].player === index) {
              return this.props.gameState.playingTrack[i];
            }
        }
        return null;
      }
    
    getNextActor() {
        if (this.props.gameState.playingTrack.length === 1) {
            return (this.props.gameState.playingTrack[0].player + 1) % 3;
        } 
        else {
            return (this.props.gameState.playingTrack[1].player + 1) % 3; 
        }
    }

    render() {
        if (this.props.gameState.stage === 2) {
            var targetIndex = this.props.gameState.myIndex;
            if (this.props.player == 'left') {
                targetIndex = (targetIndex+2)%3;
            }
            else if (this.props.player == 'right') {
                targetIndex = (targetIndex+1)%3;
            }

            if (this.props.gameState.playingTrack.length === 0) {
                this.tempstate.main = targetIndex === this.props.gameState.master ? 1: 0;
            }
            else {
                var nextActor = this.getNextActor();
                if (nextActor === targetIndex) {
                    this.tempstate.main = 1;
                }
                else {
                    //不是倒计时，仍有其它三种可能，需要辩论playingTrack
                    var myOperate = this.getPlayerPlayed(targetIndex);
                    if (myOperate) {
                        //显示不要或者牌
                        if (myOperate.pattern) {
                            this.tempstate.main = 3;
                            this.tempstate.cards = poker.min3hex_to_list(myOperate.cards);
                        }
                        else {
                            this.tempstate.main = 2;
                        }
                    }
                    else {
                        this.tempstate.main = 0;
                    }
                }
            }
        }
        else {
            this.tempstate = {
                main:0,//0 显示空白， 1 倒计时， 2 不要， 3 显示牌内容
                cards:[],//牌内容
                second: 0, //秒数
            }; 
        }
        console.log('card played for '+ this.props.player, this.tempstate);
        var didSomething = ''; 
        if (this.tempstate.main === 1) {
            didSomething = '倒计时：' + this.tempstate.second;
        }
        else if (this.tempstate.main === 2) {
            didSomething = '不要';
        }
        else if (this.tempstate.main === 3) {
            didSomething = (<CardList   cards={this.tempstate.cards} 
            enableChoose = {false}/>);
        }
        return (<div className="CardPlayed">
            {didSomething}
        </div>)
    }
}

export default CardPlayed;