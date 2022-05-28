const fetch = require('node-fetch')
// const server = require("http").createServer();
// const io = require("socket.io")(server, {
//   cors: {
//     origin: "*",
//   },
// });
// const PORT = process.env.PORT || 4000;
const fs = require("fs").promises;
const cors = require('cors');
const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 4000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .use(cors())
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server, {
  cors: {
    origin: "*",
  },
});

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const NEW_TRACK = "newTrack";
const LAUNCH_PARTY = "launchParty";
const END_GAME = "endGame";
const GOOD_GUESS = "goodGuess";
const CODE_DONT_EXIST = "codeDontExist";
const NUMBER_USERS = "nbUsers";
const USERS = "users";

let playlistTracksInterval;
let users = [];
let trackNumbers = [];

io.on("connection", async (socket) => {
  const tracks = await getAllTracks();
  // const tracks = JSON.parse(await fs.readFile('test.txt', 'utf-8'));
  
  // Join a conversation
  const { roomId, userName, creatorRoom } = socket.handshake.query;
  console.log(`Client ${userName} connected`);

  if (creatorRoom === "false") {
    const rooms = [...io.sockets.adapter.rooms.keys()]
    let roomIdExist = false;

    if (rooms.indexOf(roomId) >= 0) {
      roomIdExist = true;
    }

    if (!roomIdExist) {
      io.to(socket.id).emit(CODE_DONT_EXIST);
    }
    else {
      socket.join(roomId);
    }
  }
  else {
    socket.join(roomId);
  }

  saveUsers(roomId, userName);
  sendNbUsersConnected(roomId);
  sendUsersConnected(roomId);

  socket.on(LAUNCH_PARTY, () => {
    setTimeout(() => {
      emitTrack();
    }, 2000)
    playlistTracksInterval = setInterval(emitTrack, 30000);
  });

  // Listen for new messages
  socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
    saveUsers(socket, data);
    io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, data);
  });

  socket.on(GOOD_GUESS, (data) => {
    io.in(roomId).emit(GOOD_GUESS, data);
  });

  // Leave the room if the user closes the socket
  socket.on("disconnect", () => {
    // clearInterval(playlistTracksInterval);
    deleteUserDisconnected(userName, roomId);
    console.log(`Client ${userName} disconnected`);
    socket.leave(roomId);

    // When all the users of the room leave, clear the interval to stop emit songs to the client
    const clientsRoom = io.of("/").adapter.rooms.get(roomId);
    if(clientsRoom === undefined) 
    {
      clearInterval(playlistTracksInterval);
    }
  });


  const emitTrack = () => {
    let trackNumber = trackNumbers[`${roomId}`] | 0;
    console.log(trackNumber);
    console.log(tracks[trackNumber]);

    tracks[trackNumber].title_short = takeOffOverflowFromTitle(tracks[trackNumber].title_short);
    io.in(roomId).emit(NEW_TRACK, tracks[trackNumber]);
    trackNumber++;
    saveTrackNumber(roomId, trackNumber);
    console.log(trackNumber);

    if (trackNumber === 15) {
      console.log("fin bientot")
      setTimeout(() => {
        io.in(roomId).emit(END_GAME);
        saveTrackNumber(roomId, 0);
        clearInterval(playlistTracksInterval);
      }, 30000);
    }
  }
});

// server.listen(PORT, () => {
//   console.log(`Listening on port ${PORT}`);
// });


let totalNbTracks;
let currentNbTracks;
let nbTracksMissing;
let tracks = [];

const shuffle = function (array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


const getAllTracks = async () => {
  const responseDeezer = await fetchPlaylist(0);
  // console.log(responseDeezer);
  totalNbTracks = responseDeezer.nb_tracks;
  currentNbTracks = responseDeezer.tracks.data.length;
  nbTracksMissing = totalNbTracks - currentNbTracks;
  tracks = responseDeezer.tracks.data;

  const nextTracks = await fetchPlaylist(currentNbTracks);
  tracks = tracks.concat(nextTracks.tracks.data);
  tracks = shuffle(tracks);

  return tracks;
}

const takeOffOverflowFromTitle = (title) => {
  const reParentheses = /\(.+\)/g;
  const reDots = /\./g;
  let newTitle;

  newTitle = title.replace(reParentheses, "").replace(reDots, "");

  return newTitle.trim();
}

const fetchPlaylist = async (index) => {
  return await fetch(`https://api.deezer.com/playlist/8564374482?index=${index}`)
    .then(response => response.json());
}

const saveUsers = (roomId, userName) => {
  if (Array.isArray(users[`${roomId}`])) {
    users[`${roomId}`].push(userName);
  }
  else {
    users[`${roomId}`] = [];
    users[`${roomId}`].push(userName);
  }
}

const saveTrackNumber = (roomId, trackNumber) => {
  if (Array.isArray(trackNumbers[`${roomId}`])) {
    trackNumbers[`${roomId}`] = trackNumber;
  }
  else {
    trackNumbers[`${roomId}`] = [];
    trackNumbers[`${roomId}`] = trackNumber;
  }
}

const deleteUserDisconnected = (username, roomId) => {
  const index = users[`${roomId}`].indexOf(username);
  users[`${roomId}`].splice(index, 1);
  sendNbUsersConnected(roomId);
  sendUsersConnected(roomId);
}

const sendNbUsersConnected = (roomId) => {
  io.in(roomId).emit(NUMBER_USERS, users[`${roomId}`].length);
}

const sendUsersConnected = (roomId) => {
  io.in(roomId).emit(USERS, users[`${roomId}`]);
}
