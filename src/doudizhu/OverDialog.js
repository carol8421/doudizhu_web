import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';


class OverDialog extends React.Component {
    render() {
        var win_index = 0;
        if (this.props.gameState.unplayedCards) {

         this.props.gameState.unplayedCards.forEach( function cb(ele,index,arr) {
            if(!ele) {
            win_index = index;
            }
        });
        }
        var result = '你赢了';
        if (win_index === this.props.gameState.master) {
            if (this.props.gameState.myIndex != win_index) {
                result = '你输了';
            }
        }
        else {
            if (this.props.gameState.myIndex === this.props.gameState.master) {
                result = '你输了';
            }
        }
        return (<Dialog onClose={this.handleClose} 
        open={this.props.gameState.showOverDialog} >
            <DialogTitle>游戏结束</DialogTitle>
            <div>{result}</div>
        </Dialog>)
    }
}



export default OverDialog;