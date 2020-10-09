import React from 'react';
// import Card from './Card';  // Flippy
import Card from './Card-copy';

const Board = (props) => {
  if (props.state.cardCreated) {
    const cardsArray = [];
    for (let i = 0; i < 16; i += 1) {
      cardsArray.push(
        <Card
          setPlayerClicks={props.setPlayerClicks}
          playerClicks={props.playerClicks}
          currentPlayerID={props.currentPlayerID}
          turnOwner={props.turnOwner}
          id={i}
          key={`Card${i}`}
          cardValue={props.state.cardsArray[i].cardValue}
          cardStatus={props.state.cardsArray[i]}
          onCardClick={props.onCardClick}
        />
      );
    }
    return <div className="board">{cardsArray}</div>;
  } else {
    return <div className="board" />;
  }
};
export default Board;
