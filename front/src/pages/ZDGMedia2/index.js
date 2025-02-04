import React, { useEffect, useState } from "react";
import openSocket from "socket.io-client";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import api from "../../services/api";
import toastError from "../../errors/toastError";
import TextField from '@material-ui/core/TextField';
import Paper from "@material-ui/core/Paper";
import Button from '@material-ui/core/Button';

const http = require('https');

const init = {
  host: process.env.REACT_APP_BACKEND_URL.split("//")[1],
  path: '/sendMediaFALAZE',
  method: 'POST',
  headers: {
    'content-type': 'application/json; charset=utf-8'
  }
};

const callback = function(response) {
  let result = Buffer.alloc(0);
  response.on('data', function(chunk) {
    result = Buffer.concat([result, chunk]);
  });
  
  response.on('end', function() {
    console.log(result.toString());
  });
};

async function FALAZESender(number, url, title, iD, token) {
	const req = http.request(init, callback);
	const body = '{"number":"'+ number + '@c.us","url":"' + url + '","title":"' + title + '","token":"' + token + '","ticketwhatsappId":' + iD + '}';
	await req.write(body);
	req.end();
}

const init2 = {
	host: process.env.REACT_APP_BACKEND_URL.split("//")[1],
	path: '/whatsappfalaze'
  };
  
async function GETSender() {
	http.get(init2, function(res) {
		res.on("data", function(wppID) {
		  alert("ID instância ativa: " + wppID) ;
		});
	  }).on('error', function(e) {
		alert("Erro: " + e.message);
	  });
}

const useStyles = makeStyles(theme => ({
	root: {
		display: "flex",
		alignItems: "center",
		padding: theme.spacing(4),
		backgroundColor: theme.palette.background.default,
	},

	paper: {
		padding: theme.spacing(2),
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		textAlign: "center",
		verticalAlign: "middle",
		marginBottom: 12,
	},

	button: {
		padding: theme.spacing(2),
		display: "inline-flex",
		justifyContent: "center",
		alignItems: "center",
		textAlign: "center",
		verticalAlign: "middle",
		marginBottom: 12,
		marginRight: 12,
	},

	settingOption: {
		marginLeft: "auto",
	},
	margin: {
		margin: theme.spacing(1),
	},
}));

const FALAZEMedia = () => {
	const classes = useStyles();
	const [inputs, setInputs] = useState({});
	const [settings, setSettings] = useState([]);

	useEffect(() => {
		const fetchSession = async () => {
			try {
				const { data } = await api.get("/settings");
				setSettings(data);
			} catch (err) {
				toastError(err);
			}
		};
		fetchSession();
	}, []);

	const getSettingValue = key => {
		const { value } = settings.find(s => s.key === key);
		return value;
	};

	const handleChange = (event) => {
		const name = event.target.name;
		const value = event.target.value;
		setInputs(values => ({...values, [name]: value}))
	  }
	
	  const handleSubmit = async (event) => {
		event.preventDefault();
		alert('As mensagens estão sendo carregadas! Esta página deve ficar aberta enquanto os disparos são realizados. Aguarde...');
		const usersTextArea = inputs.user.split('\n');
		const token = settings && settings.length > 0 && getSettingValue("userApiToken");
		const timer = ms => new Promise(res => setTimeout(res, ms))
		function randomIntFromInterval(min, max) {
			return Math.floor(Math.random() * (max - min + 1) + min)
		}
		for (const user of usersTextArea){
			const rndInt = randomIntFromInterval(inputs.min, inputs.max)
			const numberDDI = user.substring(0, 2);
			const numberDDD = user.substring(2, 4);
			await timer(rndInt * 1000)
			if (numberDDI !== "55") {
				FALAZESender(user, inputs.url, inputs.title, inputs.id, token);
				await timer(rndInt * 1000)
				alert('Mensagem enviada para o número DDI: ' + user);
			}
			else if (numberDDI === "55" && parseInt(numberDDD) <= 30) {
				const numberUser = user.substr(-8,8);
				await timer(rndInt * 1000)
				FALAZESender(numberDDI.toString() + numberDDD.toString() + "9" + numberUser.toString(), inputs.url, inputs.title, inputs.id, token);
				alert('Mensagem enviada para o número: ' + numberDDI.toString() + numberDDD.toString() + "9" + numberUser.toString());
			}
			else if (numberDDI === "55" && parseInt(numberDDD) > 30) {
				const numberUser = user.substr(-8,8);
				await timer(rndInt * 1000)
				FALAZESender(numberDDI.toString() + numberDDD.toString() + numberUser.toString(), inputs.url, inputs.title, inputs.id, token);
				alert('Mensagem enviada para o número: ' + numberDDI.toString() + numberDDD.toString() + numberUser.toString());
			}
			// FALAZESender(user, inputs.message, inputs.id, token);
			// alert(rndInt + ' Mensagem enviada para o número DDI: ' + user);
		}

		// usersTextArea.forEach(async (user) => {
		// 	const numberDDI = user.substring(0, 2);
		// 	const numberDDD = user.substring(2, 4);
		// 	const rndInt = randomIntFromInterval(1, 6)
		// 	console.log(rndInt)		
			
		// 	setTimeout(function() {
		// 		if (numberDDI !== "55") {
		// 		setTimeout(function() {
		// 		FALAZESender(user, inputs.message, inputs.id, token);
		// 		await timer(rndInt * 1000)
		// 		alert(rndInt + 'Mensagem enviada para o número DDI: ' + user);
		// 		},5000 + Math.floor(Math.random() * 3000))
		// 		}
		// 		else if (numberDDI === "55" && parseInt(numberDDD) <= 30) {
		// 		setTimeout(function() {
		// 		const numberUser = user.substr(-8,8);
		// 		await timer(rndInt * 1000)
		// 		FALAZESender(numberDDI.toString() + numberDDD.toString() + "9" + numberUser.toString(), inputs.message, inputs.id, token);
		// 		alert(rndInt + 'Mensagem enviada para o número com 9: ' + numberDDI.toString() + numberDDD.toString() + "9" + numberUser.toString());
		// 		},5000 + Math.floor(Math.random() * 3000))  
		// 		}
		// 		else if (numberDDI === "55" && parseInt(numberDDD) > 30) {
		// 		setTimeout(function() {
		// 		const numberUser = user.substr(-8,8);
		// 		await timer(rndInt * 1000)
		// 		FALAZESender(numberDDI.toString() + numberDDD.toString() + numberUser.toString(), inputs.message, inputs.id, token);
		// 		alert(rndInt + 'Mensagem enviada para o número sem 9: ' + numberDDI.toString() + numberDDD.toString() + numberUser.toString());
		// 		},5000 + Math.floor(Math.random() * 3000)) 
		// 		}
		// 	},5000 + Math.floor(Math.random() * 10000))            
		// });
	}
	
	useEffect(() => {
		const socket = openSocket(process.env.REACT_APP_BACKEND_URL);
		return () => {
			socket.disconnect();
		};
	}, []);

	return (
		<div className={classes.root}>  
			<Container className={classes.container} maxWidth="sm">
			<Paper className={classes.paper}>
			<h1> Disparo automátio de arquivos</h1>
			</Paper>
			<Paper className={classes.paper}>
			<h3><span role="img" aria-label="warning">⚠️</span> Por segurança envie seus arquivos em blocos de 30 contatos.</h3>
			</Paper>
			<Paper className={classes.paper}>
			<h3><span role="img" aria-label="warning">📁</span> Caminho absoluto usa / ao invés de \ - C:/Users/Pedro/Downloads/boleto_1335016050.pdf</h3>
			</Paper>
			{/* <Paper className={classes.paper}>
			<h3><span role="img" aria-label="rule">📜</span> REGRA do DDD para o BRASIL <br></br> DDD menor ou igual a 30, usa o 9 | ex.: 55119012345678 <br></br> DDD maior que 30 não usa o 9 | ex.: 553512345678</h3>
			</Paper> */}
			<form onSubmit={handleSubmit}>
				<Paper className={classes.paper}>
				<TextField 
					id="outlined-basic" 
					label="Números" 
					variant="outlined" 
					name="user" 
					value={inputs.user || ""} 
					onChange={handleChange}
					required
					fullWidth
					multiline
					margin="dense"
					placeholder="553588754197&#13;&#10;553588754197&#13;&#10;553588754197&#13;&#10;553588754197"
				/>
				</Paper>
				<Paper className={classes.paper}>
				<TextField 
					id="outlined-basic" 
					label="Caminho - C:/Users/Pedro/Downloads/boleto_1335016050.pdf" 
					variant="outlined" 
					name="url" 
					value={inputs.url || ""} 
					onChange={handleChange}
					required
					fullWidth
					margin="dense"
					placeholder="URL do Arquivo"
				/>
				</Paper>
				<Paper className={classes.paper}>
				<TextField 
					id="outlined-basic" 
					label="Título" 
					variant="outlined" 
					name="title" 
					value={inputs.title || ""} 
					onChange={handleChange}
					required
					fullWidth
					margin="dense"
					placeholder="URL do Arquivo"
				/>
				</Paper>
				<Paper className={classes.paper}>
				<TextField 
					id="outlined-basic" 
					label="ID de Disparo" 
					variant="outlined" 
					name="id" 
					value={inputs.id || ""} 
					onChange={handleChange}
					required
					fullWidth
					margin="dense"
				/>
				</Paper>
				<Paper className={classes.paper}>
				<TextField style={{marginRight: 5}}
					id="outlined-basic" 
					label="Intervalo minímo (Segundos)" 
					variant="outlined" 
					name="min" 
					value={inputs.min || ""} 
					onChange={handleChange}
					required
					fullWidth
					margin="dense"
				/>
				<TextField style={{marginLeft: 5}}
					id="outlined-basic" 
					label="Intervalo máximo (Segundos)" 
					variant="outlined" 
					name="max" 
					value={inputs.max || ""} 
					onChange={handleChange}
					required
					fullWidth
					margin="dense"
				/>
				</Paper>
				<Button variant="contained" color="primary" className={classes.button} onClick={GETSender}>
				Mostrar ID de Disparo
				</Button>
				<Button variant="contained" color="secondary" className={classes.button} type="submit">
				DISPARAR
				</Button>
			</form>
			</Container>
		</div>
	);
};

export default FALAZEMedia;