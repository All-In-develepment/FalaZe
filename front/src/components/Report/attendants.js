import React, { useState, useEffect } from "react";

import moment from "moment";

import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Select from "@material-ui/core/Select";

import { makeStyles } from "@material-ui/core/styles";
import useDashboard from "../../hooks/useDashboard";
import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";
import { Container } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import ButtonWithSpinner from "../../components/ButtonWithSpinner";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as TitleChart,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  TitleChart,
  Tooltip,
  Legend
);
const useStyles = makeStyles((theme) => ({
  mainPaper: {
    flex: 1,
    padding: theme.spacing(1),
    overflowY: "scroll",
    ...theme.scrollbarStyles,
  },
  selectContainer: {
    width: "100%",
    textAlign: "left",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  alignRight: {
    textAlign: "right",
  },
}));

export const Attendants = () => {
  const classes = useStyles();

  const [selectedUser, setSelectedUser] = useState("");
  const [ticketsData, setTicketsData] = useState([]);
  const [userData, setUserData] = useState("");
  const [filterType, setFilterType] = useState(1);
  const [initialUserData, setInitialUserData] = useState(null);
  const [firstUser, setFirstUser] = useState();

  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(7);
  const [date_from, setDateFrom] = useState();
  const [date_to, setDateTo] = useState();

  const { getAttendants } = useDashboard();

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstUser, filterType]);

  async function fetchData() {
    setLoading(true);

    const companyId = localStorage.getItem("companyId");

    const attendants = await getAttendants({
      days: filterType === 1 ? days : undefined,
      date_from,
      date_to,
      companyId,
    });

    setTicketsData(attendants);

    const names = await attendants.map((attendant) => attendant.name);

    if (selectedUser === "") setSelectedUser(names[0]);

    setFirstUser(names[0]);

    if (selectedUser) {
      const user = ticketsData.find((user) => user.name === selectedUser);

      setUserData(user);
    }

    setInitialUserData(
      attendants.find((user) => user.name === selectedUser) || null,
      () => console.log({ userData, initialUserData })
    );

    setLoading(false);
  }

  useEffect(() => {
    setUserData(initialUserData);
  }, [initialUserData]);

  const createChartData = (property) => {
    if (!userData || !userData.ticketData) return null;

    const data = userData.ticketData[property] || {};

    const sortedDates = Object.keys(data).sort(
      (a, b) => new Date(a) - new Date(b)
    );

    const chartData = {
      labels: sortedDates.map((date) => {
        const formattedDate = new Date(date).toLocaleDateString("pt-BR", {
          year: "2-digit",
          month: "2-digit",
          day: "2-digit",
          timeZone: "UTC",
        }); // Formatar para "dia/mês/ano"

        return formattedDate;
      }),
      datasets: [
        {
          label: property === "closed" ? "Fechados" : "Abertos",
          data: sortedDates.map((date) => Number(data[date])),
          fill: true,
          backgroundColor: "rgba(118, 120, 237, 0.7)",
          borderColor: "rgb(75, 192, 192)",
        },
      ],
    };

    return chartData;
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
        text: "Chart.js Bar Chart",
      },
    },
  };

  async function handleChangeFilterType(value) {
    setFilterType(value);
    if (value === 1) {
      setDays(0);
    } else {
      setDateFrom(moment("1", "D").format("YYYY-MM-DD"));
      setDateTo(moment().format("YYYY-MM-DD"));
    }
  }

  async function handleChangePeriod(value) {
    setDays(value);
  }

  function renderFilters() {
    if (filterType === 1) {
      return (
        <Grid item xs={12} sm={6} md={4}>
          <FormControl className={classes.selectContainer}>
            <InputLabel id="period-selector-label">Período</InputLabel>
            <Select
              labelId="period-selector-label"
              id="period-selector"
              value={days}
              onChange={(e) => handleChangePeriod(e.target.value)}
            >
              <MenuItem value={7}>Últimos 7 dias</MenuItem>
              <MenuItem value={15}>Últimos 15 dias</MenuItem>
              <MenuItem value={30}>Últimos 30 dias</MenuItem>
              <MenuItem value={60}>Últimos 60 dias</MenuItem>
              <MenuItem value={90}>Últimos 90 dias</MenuItem>
            </Select>
            <FormHelperText>Selecione o período desejado</FormHelperText>
          </FormControl>
        </Grid>
      );
    } else {
      return (
        <>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Data Inicial"
              type="date"
              value={date_from}
              onChange={(e) => setDateFrom(e.target.value)}
              className={classes.fullWidth}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Data Final"
              type="date"
              value={date_to}
              onChange={(e) => setDateTo(e.target.value)}
              className={classes.fullWidth}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </>
      );
    }
  }

  return (
    <MainContainer>
      <MainHeader>
        <Title>Atendentes</Title>
      </MainHeader>
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={2} justifyContent="flex-end">
          <Grid item xs={12} sm={6} md={4}>
            <FormControl className={classes.selectContainer}>
              <InputLabel id="tag-selector-label">Atendentes</InputLabel>
              <Select
                labelId="tag-selector-label"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                {ticketsData.map((user) => (
                  <MenuItem key={user.id} value={user.name}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Selecione o nome</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl className={classes.selectContainer}>
              <InputLabel id="period-selector-label">Tipo de Filtro</InputLabel>
              <Select
                labelId="period-selector-label"
                value={filterType}
                onChange={(e) => handleChangeFilterType(e.target.value)}
              >
                <MenuItem value={1}>Filtro por Período</MenuItem>
                <MenuItem value={2}>Filtro por Data</MenuItem>
              </Select>
              <FormHelperText>Selecione o período desejado</FormHelperText>
            </FormControl>
          </Grid>
          {renderFilters()}

          <Grid item xs={12} className={classes.alignRight}>
            <ButtonWithSpinner
              loading={loading}
              onClick={() => fetchData()}
              variant="contained"
              color="secondary"
            >
              Filtrar
            </ButtonWithSpinner>
          </Grid>
        </Grid>
        <Grid>
          {userData && (
            <div>
              <h2>{`Gráficos para ${selectedUser}`}</h2>
              <Grid
                container
                spacing={6}
                justifyContent="center"
                alignItems="center"
              >
                <Grid item xs={12} sm={12} md={6}>
                <Bar data={createChartData("closed")} options={options} />
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                <Bar data={createChartData("open")} options={options} />
                </Grid>
              </Grid>
            </div>
          )}
        </Grid>
      </Container>
    </MainContainer>
  );
};
