import React, { useEffect, useState } from "react";
import Button from '@material-ui/core/Button';
import "./Lobby.css";
import SideBar from "../SideBar/SideBar";
import { Box, Grid, Slider, TextField, Typography } from "@material-ui/core";
import useChat from "../useChat";
import { Album, Mic, VolumeDown, VolumeUp } from "@material-ui/icons";
import TrackCard from "../TrackCard/TrackCard";
import ProgressBar from "../ProgressBar/ProgressBar";
import PointsRoom from "../PointsRoom/PointsRoom";
import Results from "../Results/Results";


const Lobby = (props: any) => {
  const userName = String(localStorage.getItem('userName'));
  const { roomId } = props.match.params;

  let isCreatorOfTheRoom = true;

  if (!String(localStorage.getItem('creatorRoom')).includes(roomId) || !String(localStorage.getItem('creatorRoom')).includes("true"))
  {
    isCreatorOfTheRoom = false;
    localStorage.setItem('creatorRoom', `${roomId}: false`);
  }
  const [isCreatorRoom] = useState(isCreatorOfTheRoom);

  if(!userName || userName === "null")
  {
    localStorage.setItem('roomId', roomId);
    window.location.href = "/join";
  }

  const [volume, setVolume] = useState(75);
  const [guess, setGuess] = useState("");
  const [progress, setProgress] = useState(0);
  const [points, setPoints] = useState(0);
  const [gameIsStarted, setGameIsStarted] = useState(false);
  const [artistIsGuessed, setArtistIsGuessed] = useState(false);
  const [titleIsGuessed, setTitleIsGuessed] = useState(false);
  const [allTracks, setAllTracks] = useState([]);
  const { users, gameIsFinished, messages, guesses, codeError, track, newTrack, setGameIsFinish, sendMessage, sendGuess, launchParty } = useChat(roomId, userName);
  const timer = React.useRef<any>();
  let audioPlayer = new Audio();

  if(codeError)
  {
    window.location.href = "/"
  }

  const handleVolumeChange = (event: any, newValue: any) => {
    audioPlayer.volume = newValue / 100;
    setVolume(newValue);
  };

  const handleGuessChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGuess(event.target.value);
  };

  const startGame = () => {
    setGameIsStarted(true);
    launchParty();
    sendGuess(artistIsGuessed, titleIsGuessed, points);
  }

  const checkGuess = (event: any) => {
    event.preventDefault();

    const titleWithoutAccent = track.title_short.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const artistWithoutAccent = track.artist.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const guessWithoutAccent = guess.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    let newPoints: number = points;

    if(guessWithoutAccent.toLowerCase().includes(titleWithoutAccent))
    {
      setTitleIsGuessed(true);
      newPoints++;
    }
    if(guessWithoutAccent.toLowerCase().includes(artistWithoutAccent))
    {
      setArtistIsGuessed(true);
      newPoints++;
    }

    setPoints(newPoints);
    setGuess("");
  }

  const resetGame = () => {
    setGameIsStarted(false)
    setGameIsFinish(false)
  }

  useEffect(() => {
    sendGuess(artistIsGuessed, titleIsGuessed, points);
  }, [points])

  useEffect(() => {
    if(newTrack)
    {
      setGameIsStarted(true);
      setAllTracks(allTracks.concat(track));
      console.log(allTracks);
      if(!audioPlayer.paused) audioPlayer.pause(); 
      setGuess("");
      setTitleIsGuessed(false);
      setArtistIsGuessed(false);
      sendGuess(false, false, points);
      setProgress(0);
      audioPlayer.src = track.preview;
      audioPlayer.play(); 
    }

    return () => {
    };
  }, [track, newTrack]);

  useEffect(() => {
    console.log(guesses);
  }, [guesses])

  return (
    <>
      <audio ref={(ref:any) => audioPlayer = ref} />
      <Grid style={{width: "250px", margin: "5px"}} container spacing={2}>
        <Grid item>
          {
            volume >= 50 ? <VolumeUp/> : <VolumeDown />
          }
        </Grid>
        <Grid item xs>
          <Slider value={volume} onChange={handleVolumeChange} aria-labelledby="continuous-slider" />
        </Grid>
      </Grid>

      <div style={{width: "calc(100% - 280px)", marginTop: 200}}>
        {!gameIsFinished ? 
          <> {
            !gameIsStarted ? 
            <Box style={{padding: 10, position: "fixed", bottom: 0, width: "100%", textAlign: "center", marginBottom: 40}}>
              <Button disabled={!isCreatorRoom || String(isCreatorRoom) == "null"} onClick={startGame} variant="contained" color="primary" size="large" style={{background: "#3dbd31", fontWeight: "bold", marginRight: 280}}> Lancer la partie </Button>
            </Box>
            :
            <Grid 
              container
              direction="column">
              <div style={{alignSelf:"center", justifyContent:"center", textAlign:"center", alignItems:"center"}}>
                <form onSubmit={checkGuess}>
                    <TextField disabled={artistIsGuessed && titleIsGuessed} value={guess} style={{width: "40em"}} onChange={handleGuessChange} label={artistIsGuessed && titleIsGuessed ? "Bon toutou" : "Titre/Artiste bg ?"} autoFocus fullWidth/>
                </form>
                <ProgressBar value={progress} setProgress={setProgress} timer={timer} newTrack={newTrack} />
                {
                  artistIsGuessed ? <Mic style={artistIsGuessed ? {color:"red"}: {color:"black"}}/> : null
                }
                {
                  titleIsGuessed ? <Album style={titleIsGuessed ? {color:"green"}: {color:"black"}}/>: null
                }
              </div>
              <div style={{display:"flex", margin: "50px", justifyContent: "space-between"}}>
                <Box>
                  <Typography variant="h6" style={{color: "black"}}>
                    Scores 
                  </Typography>
                    <PointsRoom guesses={guesses} />
                </Box>
                {
                  allTracks.length > 1 ? 
                  <div style={{marginLeft: "100px"}}>
                    <Typography variant="h6" style={{color: "black"}}>
                      Tu viens d'écouter 
                    </Typography>
                    <TrackCard track={allTracks[allTracks.length - 2]}/>
                    
                  </div>
                  : null
                }
            </div>
          </Grid>
          } </>
        : <Results resetGame={resetGame} guesses={guesses} />
        }
      </div>

      <SideBar roomId={roomId} users={users} messages={messages} sendMessage={sendMessage}/>
    </>
  );
};

export default Lobby;
