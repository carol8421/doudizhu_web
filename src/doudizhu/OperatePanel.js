import React, {Component} from 'react';
import './OperatePanel.css';
import Button from '@material-ui/core/Button';

export const Action = {
    askMaster: 0,
    deal:1,
    pass:2,
    tip:3,
};

class OperatePanel extends Component {
    render () {
        return (<div className="OperatePanel"
                 style={{ display: this.props.show?'block':'none'}}>
            <div className="Button-Flex">
            <Button variant='contained' color="primary" className="Operate-Button" onClick={() => this.props.onOperateAction(Action.pass)}>不出</Button>
            <Button variant = 'contained' disabled className="Operate-Button" onClick={() => this.props.onOperateAction(Action.tip)}>提示</Button>
            <Button variant = 'contained' color="primary" className="Operate-Button" onClick={() => this.props.onOperateAction(Action.deal)}>出牌</Button>
            {this.props.stage === 1 ? (
            <Button variant = 'contained' color="primary" className="Operate-Button" 
            onClick={() => this.props.onOperateAction(Action.askMaster)}>叫地主</Button>
            ):(
                <Button variant = 'contained' disabled color="primary" className="Operate-Button" 
                onClick={() => this.props.onOperateAction(Action.askMaster)}>叫地主</Button> 
            )}
            </div>
          </div>)
    }
}

export default OperatePanel;

