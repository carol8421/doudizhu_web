import React, { Component } from 'react';
import './App.css';
import PublicCards from './doudizhu/PublicCards'
import CardList from './pokers/CardList';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      turn:1, //改谁出牌了
      publicCards :[0x25, 0x2E,0x8D],//底牌，为空表示还没叫地主
      leftRemainCount:6, //两边剩余排数
      rightRemainCount:17,
      cards : [0x43, 0x6C, 0x8B, 0x27, 0x2F],
      chooseCards: [0,2],
      dealedCards:[[0x43, 0x6C,],[0x43, 0x6C,],[]] //已经出牌数，为空表示不出
    }
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

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">欢迎来到九九斗地主</h1>
        </header>
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
        

      </div>
    );
  }
}

export default App;
