import React, {Component} from 'react';
import './HandStatus.css';


class HandStatus extends Component {
    render() {
        return (<div className="HandStatus">
            {this.props.remain}
            <div> {this.props.isMaster?'地主':'农民'}</div>
        </div>)
    }
}

export default HandStatus;