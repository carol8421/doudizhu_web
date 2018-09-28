import React, { Component } from 'react';
import PublicCards from './doudizhu/PublicCards'
import CardList from './pokers/CardList';
import CardPlayed from './pokers/CardPlayed';
import UserLogin from './users/UserLogin';
import OperatePanel, {Action} from './doudizhu/OperatePanel';
import MiddleView from './layout/MiddleView';
import UserCard from './users/UserCard';
import Snackbar from '@material-ui/core/Snackbar';
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
      myCards: [],
      myIndex: 0,
      master: -1,
      bottomCards: [],
      playingTrack: [],

      chooseCards: [],//准备出的牌
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
    this.poll_event_getMyCards();
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
        setTimeout(this.startPolling.bind(this), 1);
    })
    .catch ( error => {
        console.error(error);
        setTimeout(this.startPolling.bind(this), 1);
    });
  }

  onPollingSuccess (data) {
    data.forEach(msg => {
      console.log(msg);
      this.cursor = msg.cursor;
      if (msg.eventType == 100) {
        this.poll_event_getMyCards()
        //加入抢地主的阶段
      }
      else if (msg.eventType == 110){
        this.poll_event_masterDecided(msg.eventContent);
      }
      else {
        this.poll_event_playCards(msg.eventContent);
      }
    });
  }

  poll_event_getMyCards() {
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
    var newstate = {stage:0};
    if (data.stage) {
      var cds = poker.min3hex_to_list(data.myCards);
      newstate = {
        'stage': data.stage,
        'myCards':cds,
        'myIndex':data.myIndex,
        'cardsRemain':data.cardsRemain,
      };
      if (data.stage === 2) {
        newstate['master'] = data.master;
        newstate['bottomCards'] = poker.min3hex_to_order_list(data.bottomCards);
        newstate['playingTrack'] = data.playingTrack;
      }
    }
    this.setState(newstate);

    if (!this.cursor) {
      this.cursor = data.cursor;
      this.startPolling();
    }
  }

  poll_event_masterDecided(eventContent) {
        //地主确定事件
        var btmList = poker.min3hex_to_order_list(eventContent.bottomCards);
        if (this.state.myIndex === eventContent.master) {
          var newMyCards = this.state.myCards.concat(btmList);
          this.setState({
            stage:2,
            master:eventContent.master,
            bottomCards:btmList,
            myCards: newMyCards.sort(poker.min3_compare_nocolor),
          });
        }
        else {
          this.setState({
            stage:2,
            master:eventContent.master,
            bottomCards:btmList,
          });
        }
  }

  poll_event_playCards(msg) {
    var track = this.state.playingTrack;
    if (track.length === 2) {
      track.splice(0,1);
    }
    track.push(msg);
    this.setState({
      playingTrack:track,
    });
    console.log(this.state);
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
      this.playCard();
    }
    else if (actor === Action.pass) {
      this.passCard();
    }
  }

  playCard() {
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
            this.setState({
              chooseCards :[],
              myCards:this.state.myCards.filter((c) => !clist.includes(c)),
            });
        }
        else if (resp.data.rcode === 121) {
          this.showSnackbar('无效出牌');
        }
    })
    .catch ( error => {
        console.error('play card',error);
    }); 
  }

  passCard() {
    axios.post(DealCardUrl, qs.stringify({
      'uid':this.state.uid,
      'roomId':this.state.roomId,
      'cards':'',
    }))
    .then( resp => {
        if(resp.data.rcode === 0) {
            console.log('value pass card');
        }
    })
    .catch ( error => {
        console.error('pass card',error);
    });  
  }

  getCurrentTurn() {
    if (this.state.playingTrack.length) {
      return (this.state.playingTrack[this.state.playingTrack.length - 1].player + 1) % 3;
    }
    else {
      return this.state.master;
    }
  }

  showSnackbar(msg) {
    this.setState({
      showSnackbar:true,
      snackbarMessage:msg,
    });
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
          <MiddleView gameState={this.state}/>
          <div className="My-Out-Section">
            <CardPlayed   gameState={this.state} player="myself" />
            <OperatePanel onOperateAction = {this.onOperateAction.bind(this)} show = {this.canIOperate()}/>
          </div>
          <CardList   cards={this.state.myCards} 
                    enableChoose = {true}
                    toggle={this.toggle.bind(this)}
                    chooseCards = {this.state.chooseCards}
          />
          <UserCard exClass="MyUserInfo" index = {this.state.myIndex} />
        </React.Fragment>) : ( <UserLogin onLoginSuccess={this.onLoginSuccess.bind(this)} />)}
        
        <Snackbar
          anchorOrigin={{
            vertical:'bottom',
            horizontal:'center',
          }}
          open = {this.state.showSnackbar}
          autoHideDuration = {4000}
          message = {this.state.snackbarMessage}
          onClose ={(r) => this.setState({showSnackbar:false})}
          />
      </div>
    );
  }
}

export default App;
