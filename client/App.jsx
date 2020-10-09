import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import Game from './components/Game';
import Login from './components/Login';
import Signup from './components/Signup';

import './style.css';
import CardComponent from './Picture';

// import io from 'socket.io-client';
import socket from './socket.js';

// const ENDPOINT = 'http://127.0.0.1:3000';
// const socket = io(ENDPOINT);

class App extends Component {
  constructor() {
    super();
    this.state = {
      cardCreated: false,
      user: {}, // {username, bestRecord, played}
      userID: null, // socket ID
      cardsArray: [],
      clickCount: 0,
      matched: {}, // { userID: score, userID2: score }
      previousCard: {}, // add in the cardObj from cards
      previousCardID: -1,
      currentCard: {},
      currentCardID: -1,
      // allowFlipping: true,
      cardNeedUpdate: false,
      leaderBoard: {}, // { bestRecord: [{username: bestRecord}, ...], {mostPlays: [{username: played}, ... ] }  }
      found: null,
      turnOwner: null
    };

    this.logInUser = this.logInUser.bind(this);
    this.signUpUser = this.signUpUser.bind(this);
    this.onCardClick = this.onCardClick.bind(this);
    this.getSocketID = this.getSocketID.bind(this);
  }

  componentDidMount() {
    socket.on('connect', () => {
      // this.setState({ ...this.state, userID: socket.id });
      const userID = socket.id;
      const turnOwner = !this.state.turnOwner ? userID : this.state.turnOwner;
      const matched = this.state.matched; // { userID: score, userID2: score }
      matched[userID] = 0;

      this.setState({
        ...this.state,
        userID,
        matched,
        turnOwner
      });

      socket.emit('new-player', this.state.userID);

      socket.on('set-turn-owner', (turnOwner) => {
        this.setState({ ...this.state, turnOwner });
      });
    });
    // socket.emit('playerConnected', { hello: 'world' }, (id) => {
    //   console.log('get socket ID', id);
    //   const newMatched = this.state.matched;
    //   newMatched[id] = 0;
    //   this.setState({
    //     ...this.state,
    //     userID: id,
    //     matched: newMatched
    //   });
    // });
    // console.log('current ID: ', currentID.id);
    // this.getSocketID();

    let cardsArray = this.createCardsArray();
    let cardCreated = !this.state.cardCreated;
    return this.setState({ ...this.state, cardsArray, cardCreated });
  }

  getSocketID() {
    socket.emit('playerConnected', { hello: 'world' }, (id) => {
      console.log('get socket ID', id);
      return id;
    });
  }
  //each card is an object in the cardsArray
  createCardsArray() {
    const cardsArray = [];
    for (let i = 0; i < 8; i += 1) {
      const card = {
        flipped: false,
        cardValue: i,
        picture: CardComponent[i].content
      };
      cardsArray.push(card);
      cardsArray.push(card);
      cardsArray.sort(() => Math.random() - 0.5); // Randomizer function
    }
    return cardsArray;
  }

  initGame() {
    // get player ID and push it to state function1
    // create cards function2
  }

  gameLogic() {
    // currentPlayer: players[0]
    // clickCount if even number, increment the currentPlayer to players[1]
    // currentState -> server -> whoever next player is
  }

  componentDidUpdate() {
    if (this.state.cardNeedUpdate) {
      const { currentCard, previousCard, matched, currentCardID, previousCardID, userID } = this.state;

      if (currentCard.cardValue === previousCard.cardValue) {
        console.log('found a match!');
        // Matched: [0,0]
        // if(Matched[0] + Matched[1] === 14) {
        // if (matched[0] > matched[1])
        // alert first player wins
        // else second player
        //}
        const sumMatch = Object.values(matched).reduce((sum, next) => sum + next);
        console.log('sum Match', sumMatch);
        if (sumMatch === 8) {
          // figure out which user has the higher score
          let highest = -Infinity;
          let highestUser;
          Object.entries(matched).forEach((kvPair) => {
            const [ id, score ] = kvPair;
            if (score > highest) {
              highest = score;
              highestUser = id;
            }
          });

          // if the user's userID is the same as the winner
          if (highestUser === userID) {
            alert('you won the game!!');
          } else {
            alert('you lost, sucker! Try again later');
          }

          fetch('/api/update', {
            method: 'PUT',
            body: JSON.stringify({
              user: this.state.user,
              clickCount: this.state.clickCount
            }),
            headers: {
              'Content-type': 'application/json'
            }
          })
            .then((data) => data.json())
            .then((data) => {
              const cardsArray = this.createCardsArray();
              const { user, leaderBoard } = data;
              return this.setState({
                ...this.state,
                user,
                leaderBoard,
                cardsArray,
                clickCount: 0,
                matched: {},
                previousCard: {},
                previousCardID: -1,
                currentCard: {},
                currentCardID: -1,
                cardNeedUpdate: false,
                found: null
              });
            });
        } else {
          // a match but not the final match
          // store the cardValue in found so we can display the match in message
          const found = currentCard.cardValue;
          const newMatched = this.state.matched;
          newMatched[this.state.userID] += 1;
          this.setState({
            ...this.state,

            matched: newMatched,
            cardNeedUpdate: false,
            previousCard: {},
            previousCardID: -1,
            currentCard: {},
            currentCardID: -1,
            found
          });
        }
      } else {
        console.log('not a match');
        previousCard.flipped = false;
        currentCard.flipped = false;
        const cardsArray = [ ...this.state.cardsArray ];
        cardsArray[previousCardID] = previousCard;
        cardsArray[currentCardID] = currentCard;
        return setTimeout(() => {
          this.setState({
            ...this.state,
            cardsArray,
            previousCard: {},
            previousCardID: -1,
            currentCard: {},
            currentCardID: -1,
            cardNeedUpdate: false
          });
        }, 1500);
      }
    }
  }

  onCardClick(id, cardStatus) {
    const flipped = true;
    const clickCount = this.state.clickCount + 1;
    // on odd clicks (ie first click of the turn)
    if (clickCount % 2 === 1) {
      const previousCardID = id;
      const previousCard = { ...cardStatus, flipped };
      const cardsArray = [ ...this.state.cardsArray ];
      cardsArray[previousCardID] = previousCard;
      return this.setState({
        ...this.state,
        cardsArray,
        clickCount,
        previousCard,
        previousCardID,
        found: null
      });
    } else {
      // on even clicks (ie second click of the turn)
      const currentCard = { ...cardStatus, flipped };
      const currentCardID = id;
      const cardsArray = [ ...this.state.cardsArray ];
      cardsArray[id] = currentCard;
      // at this point, the 2nd card is not flipped yet, so we need to update the state to complete the flipping
      // after components have been updated, we will check if previous card value matches the current card value
      return this.setState({
        ...this.state,
        cardsArray,
        clickCount,
        currentCard,
        currentCardID,
        cardNeedUpdate: true
      });
    }
  }

  logInUser(data) {
    // send post request to server to log in
    const { user, leaderBoard } = data;
    console.log('logged in user is', user);
    const newState = { ...this.state, user, leaderBoard };
    this.setState(newState);
  }

  signUpUser(data) {
    // send post request to server to sign up
    const { user, leaderBoard } = data;
    const newState = { ...this.state, user, leaderBoard };
    this.setState(newState);
  }

  render() {
    return (
      <div className="router">
        <Switch>
          <Route
            exact
            path="/"
            render={(props) => <Login {...props} state={this.state} logInUser={this.logInUser} />}
          />
          <Route
            exact
            path="/signup"
            render={(props) => <Signup {...props} state={this.state} signUpUser={this.signUpUser} />}
          />
          <Route
            exact
            path="/game"
            render={(props) => <Game {...props} state={this.state} onCardClick={this.onCardClick} />}
          />
        </Switch>
      </div>
    );
  }
}

export default App;
