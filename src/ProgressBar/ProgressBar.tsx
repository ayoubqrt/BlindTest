import React, { useEffect} from "react";

import { LinearProgress } from "@material-ui/core";


const ProgressBar = (props: any) => {
  useEffect(() => {
    if(props.newTrack)
    {
      // console.log(props.value)
      props.timer.current = setInterval(() => {
        props.setProgress((oldProgress: number) => {
          if (oldProgress === 100) {
            return 0;
          }
          return oldProgress + 3.333;
        });
      }, 1000);
    } 
    return () => {
      clearInterval(props.timer.current);
    }
  }, [props.timer, props.newTrack]);

  return (
    <LinearProgress variant="determinate" value={props.value} />
  );
};

export default ProgressBar;
