const fs = require('fs');
const path = require('path');
const db = path.resolve(__dirname, '../', 'data', 'players.json');

const socketController = {};

socketController.addPlayer = (playerID) => {
  const playerList = JSON.parse(fs.readFileSync(db));

  if (playerList.length < 2) {
    playerList.push(playerID); // ['strings', ]
    console.log('playerList should contain newly logged in user:', playerList);
    fs.writeFileSync(db, JSON.stringify(playerList));
  }

  // return JSON.parse(fs.readFileSync(db));
};

socketController.nextPlayer = (currentTurnOwner) => {
  const playerList = JSON.parse(fs.readFileSync(db));

  // logic works for only 2 players. will need to revise if we want to add more
  const nextPlayerID = playerList.filter((currentPlayer) => currentTurnOwner !== currentPlayer)[0];

  return nextPlayerID;
};

module.exports = socketController;
