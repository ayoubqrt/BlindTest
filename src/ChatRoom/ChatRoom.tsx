import React from "react";

import "./ChatRoom.css";
import { Input } from '@material-ui/core';


const ChatRoom = (props: any) => {
  const [newMessage, setNewMessage] = React.useState("");

  const handleNewMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(newMessage)
    {
      props.sendMessage(newMessage);
      setNewMessage("");
    }
  };

  return (
    <>
      <div >
        <div>
          <ol className="messages-list">
            {props.messages.map((message: any, i: number) => (
              <>
                <h5 style={{color: "white"}}className={`message-item ${message.ownedByCurrentUser ? "my-message-username" : "received-message-username"}`}>{message.userName}</h5>
                <li
                  key={message + i}
                  className={`message-item ${
                    message.ownedByCurrentUser ? "my-message" : "received-message"
                  }`}
                >
                  {message.body}
                </li>
              </>
            ))}
          </ol>
        </div>
        <form style={{bottom:0, padding: "10px",   position: "fixed", width: "100%", textAlign: "center", marginBottom: 20}} onSubmit={handleSendMessage}>
          <Input
            style={{width: "100%", color: "#CCC", fontWeight: "bold"}}
            value={newMessage}
            onChange={handleNewMessageChange}
            placeholder="Écrit ici"
          />
        </form>
      </div>
    </>
  );
};

export default ChatRoom;
