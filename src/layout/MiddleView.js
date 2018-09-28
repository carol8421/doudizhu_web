import React, {Component} from 'react';
import CardPlayed from '../pokers/CardPlayed';
import UserCard from '../users/UserCard';

import './MiddleView.css';

class MiddleView extends Component {
    render() {
        return (<div className="Middle-container">
            <div className="Middle-half half-left">
                <UserCard index={(this.props.gameState.myIndex + 2)%3}/>
                <CardPlayed  player="left" gameState = {this.props.gameState}/>
            </div>
            <div className="Middle-half half-right">          
                <CardPlayed   player="right"  gameState = {this.props.gameState}/>
                <UserCard index={(this.props.gameState.myIndex + 1)%3}/>
            </div>
        </div>)
    }
}


export default MiddleView;