import React, { useEffect } from "react";
import Button from '@material-ui/core/Button';
import { Grid, Input } from "@material-ui/core";

const CreateRoom = () => {
  const [userName, setUserName] = React.useState("");
  const [userNameIsValid, setUserNameIsValid] = React.useState(false);

  const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setUserName(event.target.value);
  }

  const saveUserName = () => {
    localStorage.setItem('creatorRoom', "true");
    localStorage.setItem('userName', userName);
  }

  const createRoom = (event: any) => {
    event.preventDefault();
    if(userName)
    {
      setUserNameIsValid(true);
      const room = generateRandomCode(4);
      saveUserName();
      window.location.href = `${room}`
    }
    else
    {
      setUserNameIsValid(false);
    }
  }

  const generateRandomCode = (length: number) => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  
    for(var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    
    return text.toUpperCase();
  }

  const validateForm = () => 
  {
    if(userName)
    {
      setUserNameIsValid(true);
    }
    else
    {
      setUserNameIsValid(false);
    }
  }

  useEffect(() =>
  {
    validateForm()
  }, [userName]);

  return (
    <>
      <Grid  
        container
        direction="column"
        alignContent="center"
        justify="center"
        alignItems="center">

      <form style={{marginTop: 300, width: 400 }} onSubmit={createRoom}>
        <Input value={userName} onChange={handleUserNameChange} placeholder="Username" autoFocus fullWidth/>
      </form>
        <Button type="submit" disabled={!userNameIsValid} onClick={createRoom} variant="contained" color="primary" size="medium" style={{background: "#3dbd31", fontWeight: "bold", marginTop: "30px"}}> Créer une partie </Button>
      </Grid>
      
    </>
  );
};

export default CreateRoom;
