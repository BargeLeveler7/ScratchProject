import React, { useState, useEffect } from 'react';
import Board from './Board.jsx';
import InfoContainer from './InfoContainer.jsx';
import LeaderBoard from './LeaderBoard';
import Message from './Message';
import io from 'socket.io-client';

const ENDPOINT = 'http://127.0.0.1:3000';
const socket = io(ENDPOINT);

const Game = (props) => {
  // first hook nate has written:
  const [players, setPlayers] = useState([]);
  // TODO: Figure out which game state we need

  useEffect(() => {
    // setPlayer ID
    getSocketID();
  }, []);

  const getSocketID = () => {
    socket.emit('playerConnected', { hello: 'world' }, (id) => {
      // set the player state to whoever logged in
      setPlayers([id]);
      // broadcast the state change to the server
      socket.emit('sendPlayerState', { playerState: [...players, id] });
    });
  };

  // const emitPlayerState = () => {
  //   socket.emit('sendPlayerState', { playerState: players });
  // };

  return (
    <div className="Game">
      <InfoContainer state={props.state} />
      <Message state={props.state} />
      <Board state={props.state} onCardClick={props.onCardClick} />
      <LeaderBoard leaderBoard={props.state.leaderBoard} />
    </div>
  );
};

export default Game;
