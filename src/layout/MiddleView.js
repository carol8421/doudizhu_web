import React, {Component} from 'react';
import CardPlayed from '../pokers/CardPlayed';
import UserCard from '../users/UserCard';
import HandStatus from '../doudizhu/HandStatus';
import './MiddleView.css';

class MiddleView extends Component {
    render() {
        var leftIndex = (this.props.gameState.myIndex + 2)%3;
        var rightIndex = (this.props.gameState.myIndex + 1)%3;
        return (<div className="Middle-container">
            <div className="Middle-half half-left">
                <UserCard index={leftIndex}/>
                <HandStatus remain={this.props.gameState.cardsRemain[leftIndex]} 
                    isMaster={this.props.gameState.master === leftIndex}/>
                <CardPlayed  player="left" gameState = {this.props.gameState}/>
            </div>
            <div className="Middle-half half-right">          
                <CardPlayed   player="right"  gameState = {this.props.gameState}/>
                <HandStatus remain={this.props.gameState.cardsRemain[rightIndex]} 
                    isMaster={this.props.gameState.master === rightIndex}/>
                <UserCard index={rightIndex}/>
            </div>
        </div>)
    }
}


export default MiddleView;