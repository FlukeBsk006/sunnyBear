import React, { useState } from 'react';
import FacebookLogin from 'react-facebook-login';
import { Card, Image } from 'react-bootstrap';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import swal from 'sweetalert';
// import '../App';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

async function loginUser(credentials) {
  return fetch('https://www.mecallapi.com/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
  .then(data => data.json())
}

export default function SignInSide() {
  const [login, setLogin] = useState(false);
  const [data, setData] = useState({});
  const [picture, setPicture] = useState('');

  const classes = useStyles();

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();


  const handleSubmit = async e => {
    e.preventDefault();
    
    const response = await loginUser({
      username,
      password
    })
    console.log(response);
    if ('accessToken' in response) {
      swal("Success", response.message, "success", {
        buttons: false,
        timer: 2000,
      })
      .then((value) => {
        localStorage.setItem('userid', response['user']['id']);
        localStorage.setItem('accessToken', response['accessToken']);
        localStorage.setItem("userName", response['user']['username']);
        localStorage.setItem("picture", response['user']['avatar']);
        window.location.href = "/";
      });
    } else {
      swal("Failed", response.message, "error");
    }
    
  }


  const responseFacebook = (response) => {
    console.log(response);
    fetch('http://localhost:3004/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
      body: JSON.stringify(response)
    })
    .then(data => data.json())
    setData(response);
    setPicture(response.picture.data.url);
    if (response.accessToken) {
      localStorage.setItem('userid', response['userID']);
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("userName", response.name);
      localStorage.setItem("picture", response.picture.data.url);
      setLogin(true);
      window.location.reload();
    } else {
      setLogin(false);
    }
  }

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate 
            onSubmit={handleSubmit}
            >
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={(e => setUsername(e.target.value))}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e => setPassword(e.target.value))}
            />
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              LogIn
            </Button>

            
            {/* <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid> */}
          </form>
          <Card fullWidth>
              <Card.Header>
                {!login &&
                  <FacebookLogin
                    appId="2955262598048335"
                    autoLoad={true}
                    fields="name,email,picture"
                    scope="public_profile,user_friends,email"
                    callback={responseFacebook}
                    icon="fa-facebook" />
                }
                {login &&
                  <Image src={picture} roundedCircle />
                }
              </Card.Header>
              {login &&
                <Card.Body>
                  <Card.Title>{data.name}</Card.Title>
                  <Card.Text>
                    
                    {data.email}
                  </Card.Text>
                </Card.Body>
              }
            </Card>
        </div>
      </Grid>
    </Grid>
  );
}