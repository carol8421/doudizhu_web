import React, {Component} from 'react';

import CardList from './CardList';
import * as poker from './poker';
class CardPlayed extends Component {

    render() {
        if (this.props.played) {
            var didSomething = this.props.played.pattern ? ( 
            <CardList   cards={poker.min3hex_to_list(this.props.played.cards)} 
            enableChoose = {false}
            exClass = "Embedded-Deal"
         />):'不要';
        }
        return (<div>
            {this.props.played && didSomething}
        </div>)
    }
}

export default CardPlayed;