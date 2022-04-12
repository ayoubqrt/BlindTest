import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const LAUNCH_PARTY = "launchParty";
const END_GAME = "endGame";
const CODE_DONT_EXIST = "codeDontExist";
const GOOD_GUESS = "goodGuess";
const NEW_TRACK = "newTrack";
const SOCKET_SERVER_URL = "https://berriblindback.herokuapp.com";

const useChat = (roomId: string, userName: string) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [guesses, setGuesses] = useState<any[]>([]);
  const [users, setUsers] = useState([]);
  const [track, setTrack] = useState(Object);
  const [newTrack, setNewTrack] = useState(false);
  const [gameIsFinished, setGameIsFinish] = useState(false);
  const [codeError, setCodeError] = useState(false);
  const [creatorRoom] = useState(localStorage.getItem('creatorRoom')?.includes("true") ? true : false);
  const socketRef = useRef({} as SocketIOClient.Socket);

  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      query: { roomId, userName, creatorRoom },
      transports: ["websocket"]
    });
    
    socketRef.current.on(CODE_DONT_EXIST, () =>
    {
      setCodeError(true);
    });

    socketRef.current.on(END_GAME, () =>
    {
      setGameIsFinish(true);
    });

    socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message: any) => {
      const incomingMessage = {
        ...message,
        ownedByCurrentUser: message.senderId === socketRef.current.id,
        userName: message.senderUserName
      };
      setMessages((messages) => [...messages, incomingMessage]);
    });


    socketRef.current.on(GOOD_GUESS, (goodGuessPlayer: any) => {
      const incomingGuessPlayer = {
        ...goodGuessPlayer,
        userName: goodGuessPlayer.senderUserName
      };
      setGuesses((guesses) => 
      {
        let newArray = [...guesses];
        let indexToReplace: number = -1;

        guesses.forEach((e,i) => {
          if(e.senderId === incomingGuessPlayer.senderId)
          {
            indexToReplace = i;
          }
        });

        if(indexToReplace >= 0)
        {
          newArray[indexToReplace] = incomingGuessPlayer;
        }
        else
        {
          newArray = newArray.concat(incomingGuessPlayer);
        }

        return newArray.sort(compare);
      });
    });

    socketRef.current.on(NEW_TRACK, (track: any) => {
      console.log(track);
      setTrack(track);
      setNewTrack(true);
    });

    socketRef.current.on('users', (users: any) => {
      setUsers(users);
    });
    
    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId]);

  const launchParty = () => {
    socketRef.current.emit(LAUNCH_PARTY);
  }

  const sendMessage = (messageBody: string) => {
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
      body: messageBody,
      senderId: socketRef.current.id,
      senderUserName: userName
    });
  };

  const sendGuess = (artist: boolean, title: boolean, points: number) => {
    socketRef.current.emit(GOOD_GUESS, {
      artist: artist,
      title: title,
      points: points,
      senderId: socketRef.current.id,
      senderUserName: userName
    });
  };
  
  function compare(a: any, b: any) 
	{
		let comparison = 0;
		if (a.points < b.points) 
		{
			comparison = 1;
		}
		else if (a.points > b.points) 
		{
			comparison = -1;
		}
		return comparison;
  }

  return { users, gameIsFinished, messages, guesses, track, newTrack, codeError, setGameIsFinish, sendMessage, sendGuess, launchParty };
};

export default useChat;
