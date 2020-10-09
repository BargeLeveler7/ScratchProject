import React from 'react';

const SideA = ({ cardStatus, onCardClick, id, turnOwner, currentPlayerID, setPlayerClicks, playerClicks }) => {
  return (
    <div
      id="front"
      onClick={() => {
        // we need to check who clicked - by asking the server
        // then we need to check if that user is the turnOwner
        // right now we've hard coded it in
        console.log('turnOwner, currentPlayerID:', turnOwner, currentPlayerID);
        if (turnOwner !== currentPlayerID) {
          setTimeout(alert("It's not your turn!"), 500);
          return;
        }
        onCardClick(id, cardStatus);
        setPlayerClicks(playerClicks + 1);
      }}
    >
      <img src="https://d92mrp7hetgfk.cloudfront.net/images/sites/misc/21/original.png" width="100" height="100" />
    </div>
  );
};

export default SideA;
