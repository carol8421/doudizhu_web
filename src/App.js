import React, { Component } from 'react';
import PublicCards from './doudizhu/PublicCards'
import CardList from './pokers/CardList';
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
      current_index:-1, //改谁出牌了
      master:-1,
      back3 :[0x25, 0x2E,0x8D],//底牌，为空表示还没叫地主
      remains:[0,0,0],
      cards : [0x43, 0x6C, 0x8B, 0x27, 0x2F],
      chooseCards: [0,2],
      pre_deals:[[0x43, 0x6C,],[0x43, 0x6C,],[]] //已经出牌数，为空表示不出
    }
    this.cursor = 0
    this.my_index = -1
  }

  toggle(i) {
 
    if (i < this.state.cards.length) {
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
    console.log(data);
    data.forEach(msg => {
      this.cursor = msg.cursor;
      if (this.cursor == 1) {
        this.getMyCards()
        //加入抢地主的阶段
      }
      else if (this.cursor == 2){
        this.setState({
          master:msg.master,
          current_index:msg.current_index,
          back3: poker.min3hex_to_list(msg.back3),
        });
      }
      else {
        this.handleDealCards(msg);
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
    var cds = poker.min3hex_to_list(data.cards);
    this.my_index = data.my_index;
    var newstate = {
      'cards':cds,
      'remains':data.remains,
      'pre_deals':data.pre_deals ?data.pre_deals: []
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
        clist.push(this.state.cards[this.state.chooseCards[i]])
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

  canIOperate(){
    if (this.cursor == 0){
      return false;
    }
    else if (this.cursor == 1) {
      return true;
    }
    else {
      return this.my_index == this.state.current_index;
    }
  }
  getLeftDeals(){
    if (this.cursor < 2) {
      return [];
    }
    var pre_length = this.state.pre_deals.length;
    if (pre_length == 0) {
      return [];
    }
    var leftIndex = (this.my_index+2) %3;
    if ( leftIndex ===  this.state.current_index) {
      return [];
    }
    else if (this.state.current_index === this.my_index) {
      //前面一个出牌
      return this.state.pre_deals[pre_length -1];
    }
    else {
      //前面两个
        return pre_length == 2? this.state.pre_deals[0] : [];
    }
  }

  getRightDeals(){
    if (this.cursor < 2) {
      return [];
    }
    var pre_length = this.state.pre_deals.length;
    if (pre_length == 0) {
      return [];
    }
    var rightIndex = (this.my_index+1) %3;
    if ( rightIndex ===  this.state.current_index) {
      return [];
    }
    else if (this.state.current_index === this.my_index) {
      //前面一个出牌
      return pre_length == 2? this.state.pre_deals[0] : [];
    }
    else {
      //前面两个
      return this.state.pre_deals[pre_length -1];  
    }
  }

  getMyDeals() {
    if (this.cursor < 2) {
      return [];
    }
    var pre_length = this.state.pre_deals.length;
    if (pre_length == 0) {
      return [];
    }
    var nextIndex = (this.my_index+1) %3;
    if ( nextIndex ===  this.state.current_index) {
      return this.state.pre_deals[pre_length -1];  
    }
    else if (this.state.current_index === this.my_index) {
      //前面一个出牌
      return [];
    }
    else {
      //前面两个
      return pre_length == 2? this.state.pre_deals[0] : [];
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
          <PublicCards cards={this.state.back3}
                     hideCard = {false}
          />
          <div>
          <div className="Player Left-Player">🐷</div>
            <CardList   cards={this.getLeftDeals()} 
                       enableChoose = {false}
                       exClass = "Embedded-Deal"
                    />
            <span>|||||||</span>
            <CardList   cards={this.getRightDeals()} 
                       enableChoose = {false}
                       exClass = "Embedded-Deal"
                    />
          <div className="Player Right-Player">🐶</div>
        </div>
        <div className="My-Out-Section">
          {this.canIOperate() ? 
          (<OperatePanel onOperateAction = {this.onOperateAction.bind(this)}/>):
          (<CardList   cards={this.getMyDeals()} 
                       enableChoose = {false}
                    />) }
        </div>
        <CardList   cards={this.state.cards} 
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
