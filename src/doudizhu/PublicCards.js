import React , {Component} from 'react';
import Card from "../pokers/Card";
import './PublicCards.css';


class PublicCards extends Component {
    render() {

        return (<div className="PublicCards">
            <Card cValue = {this.props.cards[0]} size='small'/>
            <Card cValue = {this.props.cards[1]} size='small'/>
            <Card cValue = {this.props.cards[2]} size='small'/>
        </div>)
    }


}


export default PublicCards;