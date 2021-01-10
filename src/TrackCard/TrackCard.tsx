import React from "react";
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles';

import { Card, CardContent, CardMedia } from "@material-ui/core";

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
      width: 120,
      height: 120
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

const TrackCard = (props: any) => {
  const classes = useStyles();
  const theme = useTheme();
  return (
    <Card className={classes.root}>
      <CardMedia
        image={props.track.album.cover_medium}
        className={classes.cover}
        title="Live from space album cover"
      />
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography component="h5" variant="h5">
            {props.track.title}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {props.track.artist.name}
          </Typography>
        </CardContent>
      </div>

    </Card>
  );
};

export default TrackCard;
