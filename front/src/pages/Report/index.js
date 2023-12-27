// MainComponent.jsx
import React, { useState } from "react";
import Tag from "../../components/Report/tag";
import { Attendants } from "../../components/Report/attendants";
import Button from "@material-ui/core/Button";
import { ButtonGroup } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

//Faça a documenteção  do componente abaixo
const Report = () => {
  const [actualReport, setActualReport] = useState("attendants");

  return (
    <div>
      <Container>
        <h1>Relatórios</h1>
      </Container>

      <Container>
        <Grid 
          container 
          spacing={2} 
          alignItems="center"
          justifyContent="center"
        >
          <ButtonGroup variant="contained" color="secondary" aria-label="contained button group">
            <Button 
              onClick={() => setActualReport("attendants")}
              variant="contained"
            >
              Atendentes
            </Button>
            <Button onClick={() => setActualReport("tag")}>Tags</Button>
          </ButtonGroup>
        </Grid>
      </Container>

      {actualReport === "tag" && <Tag />}
      {actualReport === "attendants" && <Attendants />}
    </div>
  );
};

export default Report;