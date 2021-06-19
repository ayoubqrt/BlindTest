import React from "react";
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { Card, CardContent, Grid } from "@material-ui/core";
import { Mic, Album } from "@material-ui/icons";


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      width: 450
    },
    details: {
      display: 'flex',
      flexDirection: 'column',
    },
    content: {
      flex: '1 0 auto',
    },
    cover: {
      width: 100,
    },
    controls: {
      display: 'flex',
      alignItems: 'center',
      paddingLeft: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    playIcon: {
      height: 38,
      width: 38,
    },
  }),
);

const PointsRoom = (props: any) => {
  let allPlayersPoints: any[] = [];  const classes = useStyles();
  
  // const playerPointsSorted = props.guesses.sort(compare);

  props.guesses.forEach((playerPoints: any) =>
  {
    allPlayersPoints.push(
      <PointsPlayerCard playerPoints={playerPoints}/>
    )
  });
  return (
    <div style={{overflow: "auto", height: 400}}>
      <Card className={classes.root}>
        <Grid container direction="column" >
          {allPlayersPoints}
        </Grid>
      </Card>
    </div>
    );
  };


  
  const PointsPlayerCard = (props: any) => {
  const classes = useStyles();
  // console.log(props);
  const player = props.playerPoints;
  return (
      <div className={classes.details} style={{margin: 20}}>
        {/* <CardContent className={classes.content}> */}
          <Typography component="h5" variant="h5">
            {props.playerPoints.senderUserName}
          </Typography>
          <Typography variant="subtitle1">
            {props.playerPoints.points} pts
            <div style={{float: "right"}}>
              <Mic style={player.artist ? {color:"red", marginRight: "5px"}: {color:"#707371", marginRight: "5px"}}/>
              <Album style={player.title ? {color:"green", marginRight: "5px"}: {color:"#707371", marginRight: "5px"}}/>
            </div>
          </Typography>
        {/* </CardContent> */}
      </div>
  );
}

export default PointsRoom;
