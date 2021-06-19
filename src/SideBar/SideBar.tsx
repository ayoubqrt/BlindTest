import React, { useState } from "react";
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import TextsmsIcon from '@material-ui/icons/Textsms';
import PeopleIcon from '@material-ui/icons/People';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';

import { Box } from "@material-ui/core";
import ChatRoom from "../ChatRoom/ChatRoom";

const drawerWidth = 280;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  },
  title: {
    flexGrow: 1,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    background: "#202020",
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  },
  chatText: {
    color: "#FFF",
    textAlign: "center"
  },
  tabIcons: {
    width: "50%",
    borderRadius: 0,
  }
}));



const SideBar = (props: any) => {
  let usersConnected: any[] = [];

  const classes = useStyles();
  const [usersConnectedIsOpened, setUsersConnectedIsOpened] = useState(true);
  const [chatIsOpened, setChatIsOpened] = useState(false);

  props.users.forEach((user: any, index: number) =>
  {
    usersConnected.push(
      <div key={user + index} style={{marginRight: 10}}>
        <Typography className={classes.chatText} variant="body1"> {user} </Typography>
      </div>
    )
  });

  const openChat = () =>
  {
    if(usersConnectedIsOpened)
    {
      setUsersConnectedIsOpened(false);
      setChatIsOpened(true);
    }
  }

  const openOnlineUsers = () =>
  {
    if(chatIsOpened)
    {
      setUsersConnectedIsOpened(true);
      setChatIsOpened(false);
    }
  }

  let tabToRender = [];

  if(chatIsOpened) {
    tabToRender.push(
      <>
        <ChatRoom messages={props.messages} sendMessage={props.sendMessage}/>
      </>
    );
  }
  else
  {
    tabToRender.push(
      <>
        <Typography className={classes.chatText} variant="h6" style={{color: "white", margin: 15}}>
          Room : {props.roomId}
        </Typography>
        <Typography style={{padding: "15px"}} className={classes.chatText} variant="h6"> Joueurs connectés ({usersConnected.length})</Typography>
        <Divider style={{background: "white"}}/>
        {usersConnected}
      </>
    );
  }

  return (
    <>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="right">
        <Box style={{ height: "64px", marginTop: 0, background: "#404040"}}>
          <IconButton onClick={openChat} className={classes.tabIcons} style={chatIsOpened ? {color:"white", background: "#505050", height: "100%"} : {color:"#707371", height: "100%"}}>
            <TextsmsIcon />
          </IconButton>
          <IconButton onClick={openOnlineUsers} className={classes.tabIcons} style={usersConnectedIsOpened ? {color:"#34eb64", background: "#505050", height: "100%"} : {color:"#62cc90", height: "100%"}}>
            <PeopleIcon />
          </IconButton>
        </Box>

        {tabToRender}

      </Drawer>
    </>
  );
};

export default SideBar;
