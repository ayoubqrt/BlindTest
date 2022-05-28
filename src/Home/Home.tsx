import React from "react";
import Button from '@material-ui/core/Button';

import { Grid } from "@material-ui/core";
import { Link } from "react-router-dom";



const Home = () => {

  return (
    <>
      <Grid  
        container
        direction="row"
        alignContent="center"
        justify="center"
        alignItems="center">

      <div style={{marginTop: 300}} >
        <Link to={`/create`}>
          <Button variant="contained" color="primary" size="medium" style={{background: "#3dbd31", fontWeight: "bold", marginTop: "30px", margin: 20}}> Créer une partie </Button>
        </Link>
        <Link to={`/join`}>
          <Button variant="contained" color="primary" size="medium" style={{background: "#3dbd31", fontWeight: "bold", marginTop: "30px", margin: 20}}> Rejoindre une partie </Button>
        </Link>
      </div>

      </Grid>
      
    </>
  );
};

export default Home;
