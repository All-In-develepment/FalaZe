import React, { useState, useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
//import { createTheme } from "@material-ui/core/styles";



import {
  //Avatar,
  Button,
  CssBaseline,
  TextField,
  Grid,
  //Box,
  Typography,
  Container,
  InputAdornment,
  IconButton,
  Link
} from '@material-ui/core';

import { LockOutlined, Visibility, VisibilityOff } from '@material-ui/icons';

import { makeStyles } from "@material-ui/core/styles";

import { i18n } from "../../translate/i18n";

import { AuthContext } from "../../context/Auth/AuthContext";

// const Copyright = () => {
// 	return (
// 		<Typography variant="body2" color="textSecondary" align="center">
// 			{"Copyleft "}
// 			<Link color="inherit" href="https://github.com/canove">
// 				Canove
// 			</Link>{" "}
// 			{new Date().getFullYear()}
// 			{"."}
// 		</Typography>
// 	);
// };


const useStyles = makeStyles((theme) => ({
  body: {
    backgroundColor: theme.palette.background.main,
    //boxShadow: '0px 15px 35px #000000',
    //border: '1px solid #ff0000',
    
    
  },

  pagina: {
    backgroundColor: '#F5F5F5',
    height: '100vh',
    paddingTop: '15em'
  },

  container: {
    backgroundColor: '#FFFFFF',
    width: '31.25em',
    height: '37.5em',
    borderRadius: '31px',
    boxShadow: '0px 15px 35px 0px rgba(4,3,82,0.03)',
    border: '1px solid #CFCFCF'
  },

  titlediv: {
    margin: 'inherit',
  },

  appName: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },

  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: '#ffffff',
    width: '31.25em',
    height: '37.5em',
    paddingTop: '2em',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: '#6885ff'
  },

  fundo:{
    backgroundColor: '#F5F5F5',
  },

  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    
  },

  field: {
    border: '1px solid #000000',
  },

  submit: {
    margin: theme.spacing(2, 0, 0),
    backgroundColor: '#6885FF',
    marginBottom: '1.5rem',
    borderRadius: '9px',
    height: '3.313rem',
    width: '25.75rem',    
  },
  
}));

const Login = () => {
  const classes = useStyles();

  const [user, setUser] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const { handleLogin } = useContext(AuthContext);

  const handleChangeInput = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handlSubmit = (e) => {
    e.preventDefault();
    handleLogin(user);
  };

  return (

    ///////////// NEW CODE /////////////
    <CssBaseline>
    <div className={classes.pagina}>
      <Container maxWidth="xs" className={classes.container}>
        <div className="titlediv">
          <Typography className="appName" component="h1" variant="h4">
            {i18n.t("login.appTitle")}
          </Typography>
        </div>
          

          <Typography component="h3" variant="h5">
            {i18n.t("login.title")}
          </Typography>

          <form className={classes.form} noValidate onSubmit={handlSubmit}>
            <TextField
              variant="outlined"
              fullWidth
              label={i18n.t("login.form.email")}
              name="email"
              value={user.email}
              required
              id="email"
              onChange={handleChangeInput}
              autoComplete="email"
              autoFocus
              className="field"              
            >
            </TextField>

            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth    
                name="password"
                label={i18n.t("login.form.password")}
                id="password"
                value={user.password}
                onChange={handleChangeInput}
                autoComplete="current-password"
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword((e) => !e)}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <Button
                type="submit"                
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                {i18n.t("login.buttons.submit")}
              </Button>

              <Grid container>
                <Grid item>
                  <Link
                    href="#"
                    variant="body2"
                    component={RouterLink}
                    to="/signup"
                  >
                    {i18n.t("login.buttons.register")}
                  </Link>
                </Grid>
              </Grid>
          </form>  
      </Container>
    </div>
    </CssBaseline>

    ///////////// OLD CODE /////////////
     /* <div className={classes.fundo}>

      <Container className={classes.body} maxWidth='xs'>
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlined />
          </Avatar>
          <Typography component="h1" variant="h5">
            {i18n.t("login.title")}
          </Typography>
          
          <div className={classes.box}>
            <form className={classes.form} noValidate onSubmit={handlSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label={i18n.t("login.form.email")}
                name="email"
                value={user.email}
                onChange={handleChangeInput}
                autoComplete="email"
                autoFocus
                className="field"
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label={i18n.t("login.form.password")}
                id="password"
                value={user.password}
                onChange={handleChangeInput}
                autoComplete="current-password"
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword((e) => !e)}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                {i18n.t("login.buttons.submit")}
              </Button>
              <Grid container>
                <Grid item>
                  <Link
                    href="#"
                    variant="body2"
                    component={RouterLink}
                    to="/signup"
                  >
                    {i18n.t("login.buttons.register")}
                  </Link>
                </Grid>
              </Grid>
            </form>
          </div> 
        //</div>
        //<Box mt={8}>{ <Copyright /> }</Box>
      //</Container>
    //</div> }*/
  );
};

export default Login;
