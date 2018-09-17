import React, {Component} from 'react';

import CardList from './CardList';

class CardPlayed extends Component {

    render() {
        if (this.props.played) {
            var didSomething = this.props.played.pattern ? ( 
            <CardList   cards={this.props.played.cards} 
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