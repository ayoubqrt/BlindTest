import React from "react";
import Button from '@material-ui/core/Button';
import { Grid, Input } from "@material-ui/core";

const CreateRoom = () => {
  const [userName, setUserName] = React.useState("");

  const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setUserName(event.target.value);
  }

  const saveUserName = (roomId: string) => {
    localStorage.setItem('creatorRoom', `${roomId}: true`);
    localStorage.setItem('userName', userName);
  }

  const createRoom = (event: any) => {
    event.preventDefault();
    if (userName) {
      const roomId = generateRandomCode(4);
      saveUserName(roomId);
      window.location.href = `${roomId}`
    }
  }

  const generateRandomCode = (length: number) => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text.toUpperCase();
  }

  return (
    <>
      <Grid
        container
        direction="column"
        alignContent="center"
        justify="center"
        alignItems="center">

        <form style={{ marginTop: 300, width: 400 }} onSubmit={createRoom}>
          <Input error={!userName} value={userName} onChange={handleUserNameChange} placeholder="Username" autoFocus fullWidth />
        </form>
        <Button type="submit" disabled={!userName} onClick={createRoom} variant="contained" color="primary" size="medium" style={{ background: "#3dbd31", fontWeight: "bold", marginTop: "30px" }}> Créer une partie </Button>
      </Grid>

    </>
  );
};

export default CreateRoom;
