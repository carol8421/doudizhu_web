import React, { Component } from 'react';
import PublicCards from './doudizhu/PublicCards'
import CardList from './pokers/CardList';
import UserLogin from './users/UserLogin';
import axios from 'axios';
import qs from 'qs';
import * as poker from './pokers/poker';
import {PollChangesUrl, GetMyCardsUrl} from './url';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid:0,
      roomId:0,
      turn:1, //改谁出牌了
      publicCards :[0x25, 0x2E,0x8D],//底牌，为空表示还没叫地主
      leftRemainCount:6, //两边剩余排数
      rightRemainCount:17,
      cards : [0x43, 0x6C, 0x8B, 0x27, 0x2F],
      chooseCards: [0,2],
      dealedCards:[[0x43, 0x6C,],[0x43, 0x6C,],[]] //已经出牌数，为空表示不出
    }
    this.cursor = 0
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
    this.setState({
      'cards':cds,
    });
  }

  handleDealCards(msg) {

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
          <PublicCards cards={this.state.publicCards}
                     hideCard = {false}
          />
          <div>
          <div className="Player Left-Player">🐷</div>
            <CardList   cards={this.state.dealedCards[2]} 
                       enableChoose = {false}
                       exClass = "Embedded-Deal"
                    />
            <CardList   cards={this.state.dealedCards[1]} 
                       enableChoose = {false}
                       exClass = "Embedded-Deal"
                    />
          <div className="Player Right-Player">🐶</div>
        </div>
        <div className="My-Out-Section">
          {this.state.turn ? 
          (<CardList   cards={this.state.dealedCards[0]} 
                       enableChoose = {false}
                    />) :
          (<div>
            <button>不出</button>
            <button>提示</button>
            <button>出牌</button>
          </div>)}
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
