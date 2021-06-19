import React, { useEffect } from "react";
import Button from '@material-ui/core/Button';

import { Grid, Input } from "@material-ui/core";


const JoinRoom = () => {
  const roomId = String(localStorage.getItem('roomId'));
  const [roomName, setRoomName] = React.useState(roomId ? roomId : "");
  const [userName, setUserName] = React.useState("");

  const handleRoomNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(event.target.value);
  };

  const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const joinRoom = () => {
    localStorage.setItem('userName', userName);
    window.location.href = `/${roomName}`;
  }

  return (
    <>
      <Grid
        container
        direction="column"
        alignContent="center"
        justify="center"
        alignItems="center">

        <form style={{ marginTop: 300, width: 400 }} >
          <Input style={{ margin: 20 }} value={userName} error={!userName} onChange={handleUserNameChange} placeholder="Username" autoFocus fullWidth />
          <Input style={{ margin: 20 }} value={roomName} error={!roomName} onChange={handleRoomNameChange} placeholder="Nom de la room" fullWidth />
        </form>
        <Button onClick={joinRoom} disabled={!roomName || !userName} variant="contained" color="primary" size="medium" style={{ background: "#3dbd31", fontWeight: "bold", marginTop: "30px" }}> Rejoindre la partie </Button>
      </Grid>

    </>
  );
};

export default JoinRoom;
