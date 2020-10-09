import React, { useState, useEffect } from 'react';
import Board from './Board.jsx';
import InfoContainer from './InfoContainer.jsx';
import LeaderBoard from './LeaderBoard';
import Message from './Message';
import socket from '../socket.js';

const Game = (props) => {
  // first hook nate has written:
  // const [ players, setPlayers ] = useState([]);

  // const [ turnOwner, setTurnOwner ] = useState(null);
  // const [ currentPlayerID, setCurrentPlayerID ] = useState(null);
  const [ playerClicks, setPlayerClicks ] = useState(0);

  useEffect(
    () => {
      // set turnOwner to current owner if turnOwner is null
      // if (!turnOwner) {
      //   setTurnOwner(props.userID);
      // }

      // if we're at two clicks, change player (handled by the backend)
      if (playerClicks === 2) {
        // socket.emit('next-player', turnOwner, (newTurnOwner) => {
        //   setTurnOwner(newTurnOwner);
        // });

        socket.emit('next-player', props.state.turnOwner);
        // dummy data to simulate another player's 'turn'
        // setTurnOwner(12);
        // dummy data

        setPlayerClicks(0);
      }
    },
    [ playerClicks ]
  );

  return (
    <div className="Game">
      <InfoContainer state={props.state} />
      <Message state={props.state} />
      <Board
        setPlayerClicks={setPlayerClicks}
        playerClicks={playerClicks}
        turnOwner={props.state.turnOwner}
        currentPlayerID={props.state.userID}
        state={props.state}
        onCardClick={props.onCardClick}
      />
      <LeaderBoard leaderBoard={props.state.leaderBoard} />
    </div>
  );
};

export default Game;
