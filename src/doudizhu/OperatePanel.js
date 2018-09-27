import React, {Component} from 'react';

export const Action = {
    askMaster: 0,
    deal:1,
    pass:2,
    tip:3,
};

class OperatePanel extends Component {
    render () {
        return (<div style={{ display: this.props.show?'block':'none'}}>
            <button onClick={() => this.props.onOperateAction(Action.pass)}>不出</button>
            <button onClick={() => this.props.onOperateAction(Action.tip)}>提示</button>
            <button onClick={() => this.props.onOperateAction(Action.deal)}>出牌</button>
            <button onClick={() => this.props.onOperateAction(Action.askMaster)}>叫地主</button>
          </div>)
    }
}

export default OperatePanel;

