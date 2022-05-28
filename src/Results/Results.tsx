import React from "react";
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { Card, CardContent, Grid } from "@material-ui/core";
import { Mic, Album } from "@material-ui/icons";

import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: "350px",
    height: "200px",
    textAlign: "center"
  },
}));

const Results = (props:any) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  let podiumPoints: any[] = [];
  
  // const playerPointsSorted = props.guesses.sort(compare);


  if(props.guesses.length > 3)
  {
    podiumPoints.push(
      "1er : " + props.guesses[0].senderUserName + " (" + props.guesses[0].points + ")" + "\n"
    );

    podiumPoints.push(
      "2ème : " + props.guesses[1].senderUserName + " (" + props.guesses[1].points + ")" + "\n"
    );

    podiumPoints.push(
      "3ème : " + props.guesses[2].senderUserName + " (" + props.guesses[2].points + ")" + "\n"
    );
  }
  else
  {
    props.guesses.forEach((element: any, index: number) =>
    {
      let text = "";
      if(index === 0)
      {
        text = "1er : ";
      }
      else
      {
        text = (index + 1) + "ème : ";
      }

      podiumPoints.push(
        text + element.senderUserName + " (" + element.points + " pts)" + "\n"
      );
    });
  }


  const handleClose = () => {
    setOpen(false);
    props.resetGame();
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title">Le podium</h2>
            {podiumPoints}
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
export default Results;
