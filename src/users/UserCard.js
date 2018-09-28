import React, {Component} from 'react';
import './UserCard.css';

class UserCard extends Component {
    render () {
        var text = '猪🐷 ';
        var cn= 'player-pig ';
        if (this.props.index === 1) {
            text = '狗🐶';
            cn = 'player-dog ';
        }
        else if (this.props.index === 2) {
            text = '猪狗不如';
            cn = 'player-none ';
        }
        return (
                <div className={ "Player "+ cn + this.props.exClass }>
                 {text}
                </div>
        )
    }
}


export default UserCard;