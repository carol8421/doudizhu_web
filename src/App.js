import React, { Component } from 'react';
import PublicCards from './doudizhu/PublicCards'
import CardList from './pokers/CardList';
import CardPlayed from './pokers/CardPlayed';
import UserLogin from './users/UserLogin';
import OperatePanel, {Action} from './doudizhu/OperatePanel';
import axios from 'axios';
import qs from 'qs';
import * as poker from './pokers/poker';
import {PollChangesUrl, GetMyCardsUrl,AskForMasterUrl, DealCardUrl} from './url';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid:0,
      roomId:0,

      stage:0,
      cardsRemain:[],
      myCards: [0x43, 0x6C, 0x8B, 0x27, 0x2F],
      myIndex: 0,
      master: -1,
      bottomCards: [0x25, 0x2E,0x8D],
      playingTrack: [],

      chooseCards: [0,2],//准备出的牌
    };
    this.cursor = 0;
  }

  toggle(i) {
 
    if (i < this.state.myCards.length) {
      var chooseCards = this.state.chooseCards;
      var orig_i = this.state.chooseCards.indexOf(i);
      if (orig_i >= 0) {
        chooseCards.splice(orig_i,1);
      }
      else {
        chooseCards.push(i);
      }

      this.setState({
        chooseCards:chooseCards
      });
    }

   
  }
  onLoginSuccess(uid, data) {
    console.log(uid, ' login result:', data);
    this.setState({
      'uid':uid,
      'roomId':data.roomId,
    });
    this.startPolling();
  }

  startPolling(){
    axios.post(PollChangesUrl, qs.stringify({
      'uid':this.state.uid,
      'roomId':this.state.roomId,
      'cursor':this.cursor,
    }))
    .then( resp => {
        if(resp.data.rcode === 0) {
            this.onPollingSuccess(resp.data.data);
        }
        setTimeout(this.startPolling.bind(this), 11000);
    })
    .catch ( error => {
        console.error(error);
        setTimeout(this.startPolling.bind(this), 11000);
    });
  }

  onPollingSuccess (data) {
    data.forEach(msg => {
      console.log(msg);
      this.cursor = msg.cursor;
      if (msg.eventType == 100) {
        this.getMyCards()
        //加入抢地主的阶段
      }
      else if (msg.eventType == 110){
        this.setState({
          master:msg.eventContent.master,
          bottomCards: poker.min3hex_to_list(msg.bottomCards),
        });
      }
      else {
        this.handleDealCards(msg.eventContent);
      }
    });
  }

  getMyCards() {
    axios.post(GetMyCardsUrl, qs.stringify({
      'uid':this.state.uid,
      'roomId':this.state.roomId,
    }))
    .then( resp => {
        if(resp.data.rcode === 0) {
            this.onGetMyCards(resp.data.data);
        }
    })
    .catch ( error => {
        console.error('get my card',error);
    });
  }

  onGetMyCards(data) {
    console.log('get my status:', data);
    var cds = poker.min3hex_to_list(data.myCards);
    var newstate = {
      'state': data.state,
      'myCards':cds,
      'myIndex':data.myIndex,
      'cardsRemain':data.cardsRemain,
      'playingTrack':data.playingTrack,
    };

    this.setState(newstate);
  }

  handleDealCards(msg) {

  }

  onOperateAction(actor) {
    if(actor === Action.askMaster) {
      axios.post(AskForMasterUrl, qs.stringify({
        'uid':this.state.uid,
        'roomId':this.state.roomId,
      }))
      .then( resp => {
          if(resp.data.rcode === 0) {
              console.log('congulation, you get master');
          }
      })
      .catch ( error => {
          console.error('ask for master',error);
      });
    }
    else if (actor === Action.deal) {
      if (this.state.chooseCards.length == 0) {
        console.log("please choose card");
        return;
      }
      var clist = [];
      for(var i = 0; i< this.state.chooseCards.length; ++i) {
        clist.push(this.state.myCards[this.state.chooseCards[i]])
      }
      var cards = poker.min3list_to_hex(clist);
      axios.post(DealCardUrl, qs.stringify({
        'uid':this.state.uid,
        'roomId':this.state.roomId,
        'cards':cards,
      }))
      .then( resp => {
          if(resp.data.rcode === 0) {
              console.log('value deal card');
          }
      })
      .catch ( error => {
          console.error('ask for master',error);
      }); 
    }
  }

  getCurrentTurn() {
    if (this.state.playingTrack.length) {
      return (this.state.playingTrack[this.state.playingTrack.length - 1].player + 1) % 3;
    }
    else {
      return this.state.master;
    }
  }

  canIOperate(){
    if (this.state.stage == 0){
      return false;
    }
    else if (this.state.stage == 1) {
      return true;
    }
    else {
      return this.state.myIndex == this.getCurrentTurn();
    }
  }

  getPlayerPlayed(index) {
    if (this.state.stage < 2) {
      return null;
    }
    var pre_length = this.state.playingTrack.length;
    if (pre_length == 0) {
      return null;
    }

    for (var i = pre_length - 2; i < pre_length; i++) {
      if (i>= 0) {
        if (this.state.playingTrack[i].player === index) {
          return this.state.playingTrack[i];
        }
      }
    }
    return null;
  }

  getLeftPlayed(){
    var leftIndex = (this.state.myIndex+2) %3;
    // 遍历playTrack，最后的两项
    return this.getPlayerPlayed(leftIndex);
  }

  getRightPlayed(){
    var rightIndex = (this.state.myIndex+1) %3;
    return this.getPlayerPlayed(rightIndex);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">欢迎来到九九斗地主</h1>
          <div className="App-login-status">uid:{this.state.uid}, roomId:{this.state.roomId}</div>
        </header>
        {this.state.uid?
        (<React.Fragment>
          <PublicCards cards={this.state.bottomCards}
                     hideCard = {false}
          />
          <div>
          <div className="Player Left-Player">🐷</div>
            <CardPlayed  played={this.getLeftPlayed()}
                    />
            <span>|||||||</span>
            <CardPlayed   cards={this.getRightPlayed()} 
                      
                       exClass = "Embedded-Deal"
                    />
          <div className="Player Right-Player">🐶</div>
        </div>
        <div className="My-Out-Section">
          {this.canIOperate() ? 
          (<OperatePanel onOperateAction = {this.onOperateAction.bind(this)}/>):
          (<CardPlayed   played={this.getPlayerPlayed(this.state.myIndex)}
                    />) }
        </div>
        <CardList   cards={this.state.myCards} 
                    enableChoose = {true}
                    toggle={this.toggle.bind(this)}
                    chooseCards = {this.state.chooseCards}
        />
        </React.Fragment>) : ( <UserLogin onLoginSuccess={this.onLoginSuccess.bind(this)} />)}
        

      </div>
    );
  }
}

export default App;
