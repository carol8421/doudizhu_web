import React, {Component} from 'react';
import CardPlayed from '../pokers/CardPlayed';
import './MiddleView.css';

class MiddleView extends Component {
    render() {
        return (<div className="Middle-container">
            <div className="Middle-half half-left">
                <div className="Player Left-Player">🐷    <div>猪</div></div> 
                <CardPlayed  player="left" gameState = {this.props.gameState}/>
            </div>
            <div className="Middle-half half-right">          
                <CardPlayed   player="right"  gameState = {this.props.gameState}/>
                <div className="Player Right-Player">🐶 <div>狗</div></div>
            </div>
        </div>)
    }
}


export default MiddleView;