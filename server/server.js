require('dotenv').config();
const express = require('express');
const path = require('path');
const PORT = 3000;

const app = express();
const cookieParser = require('cookie-parser');
const socketIO = require('socket.io');
const apiRouter = require('./routes/api');

// const session = require('express-session')

// mongo "mongodb+srv://cluster0.bepyw.mongodb.net/cardgame" --username BargeLeveler7
// codesmithMongoDB
/**
 * Express middlewares
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api', apiRouter);

/**
 * Serve static files
 */
app.use('/build', express.static(path.join(__dirname, '../build')));

/**
 * Serve home page
 */
app.use('*', (req, res) => {
  // res.status(404).send('Not Found');
  return res.status(200).sendFile(path.join(__dirname, '../index.html'));
});

/**
 * Global error handler
 */
app.use((err, req, res, next) => {
  res.status(500).json({ err: err.message.toString() });
});

const server = app.listen(PORT, () => console.log(`listening on port ${PORT}`));

const io = socketIO(server);

/**
 * as users are authenticated - they're stored as objects in state
 * once there are two (saved as Player one and two) - their information is sent to the backend through sockets
 * (as well as currentPlayer (which defaults to player1))
 * each time a player makes a play, get that information and send it to all users, so that the front end can update state accordingly
 * same with game over, etc.
 */

io.on('connection', (socket) => {
  console.log('user connected! socket info:', socket.id);
  // console.log('different id check', socket.client.id);
  // const userId = socket.id;
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('playerConnected', (req, res) => {
    // currentPlayer & gameState -> server -> emit broadcast -> player2
    console.log('Sending player ID to client', socket.id);
    res(socket.id);
  });

  // io.emit('sendPlayerState', (req, res) => {
  //   console.log(req);
  // });
  // io.emit('fromServer', { hello: 'server-side' });

  socket.on('sendPlayerState', (req, res) => {
    console.log('state on the server', req);
  });
});
