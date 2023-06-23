import React, { useState, useEffect } from "react";

import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import { Chip } from "@material-ui/core";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";
import ButtonWithSpinner from "../../components/ButtonWithSpinner";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";

import { makeStyles } from "@material-ui/core/styles";
import useDashboard from "../../hooks/useDashboard";
import moment from "moment";

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

const Report = () => {
  const classes = useStyles();

  const [tagName, setTagName] = useState("Todos");
  const [loading, setLoading] = useState(false);
  const [stateTag, setStateTag] = useState([]);
  const [tagNumber, setTagNumber] = useState(0);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [filterButton, setFilterButton] = useState("Todos");

  const { findTag, getNumberTags } = useDashboard();
  const [date_from, setDate_from] = useState(
    moment("1", "D").format("YYYY-MM-DD")
  );
  const [date_to, setDate_to] = useState(moment().format("YYYY-MM-DD"));

  async function handleChangeTagName(value) {
    // getNumberTags(value)
    setTagName(value);
  }

  const button = async () => {
    setButtonClicked(true);
    tagName.toLowerCase() === "todos"
      ? setFilterButton("Todos")
      : setFilterButton(tagName);
    await fetchData();
  };

  async function fetchData() {
    setLoading(true);

    if (tagName.toLowerCase() === "todos") {
      const dataTag = await findTag({ tagName });
      const tag = await getNumberTags({ date_from, date_to, tagName });

      setTagNumber(tag);
      setStateTag(dataTag);
      setLoading(false);
    }

    if (tagName.toLowerCase() !== "todos") {
      const tag = await getNumberTags({ date_from, date_to, tagName });
      setTagNumber(tag);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function formatTime(minutes) {
    return moment()
      .startOf("day")
      .add(minutes, "minutes")
      .format("HH[h] mm[m]");
  }

  return (
    <MainContainer>
      <MainHeader>
        <Title>Relatórios</Title>
      </MainHeader>
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={2} justifyContent="flex-end">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Data Inicial"
              type="date"
              value={date_from}
              onChange={(e) => setDate_from(e.target.value)}
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
              onChange={(e) => setDate_to(e.target.value)}
              className={classes.fullWidth}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl>
              <InputLabel id="tag-selector-label">Filtrar por tags</InputLabel>
              <Select
                labelId="tag-selector-label"
                value={tagName}
                onChange={(e) => handleChangeTagName(e.target.value)}
              >
                <MenuItem value="Todos">Todos</MenuItem>
                {stateTag.map((state, index) => (
                  <MenuItem key={index} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Selecione a tag desejada</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} className={classes.alignRight}>
            <ButtonWithSpinner
              loading={loading}
              onClick={() => button()}
              variant="contained"
              color="secondary"
            >
              Filtrar
            </ButtonWithSpinner>
          </Grid>
        </Grid>
      </Container>
      <Paper className={classes.mainPaper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center">Nome</TableCell>
              <TableCell align="center">Atendimentos</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              // buttonClicked === false ? (
              //   stateTag.map((tag, index) => (
              //     <TableRow key={index}>
              //       <TableCell align="center">{tag}</TableCell>
              //       <TableCell align="center">2</TableCell>
              //     </TableRow>
              //   ))
              // ) :
              <TableRow>
                <TableCell align="center">{filterButton}</TableCell>
                <TableCell align="center">{tagNumber}</TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
      </Paper>
    </MainContainer>
  );
};

export default Report;
