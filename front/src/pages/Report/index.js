// MainComponent.jsx
import React, { useState } from "react";
import ReportSubMenu from "../../components/Report/subMenuItem";
import Tag from "../../components/Report/tag";
import { Attendants } from "../../components/Report/attendants";

const Report = () => {
  const [actualReport, setActualReport] = useState("tag");

  return (
    <div>
      <nav>
        <button onClick={() => setActualReport("attendants")}>
          Atendimentos
        </button>
        <button onClick={() => setActualReport("tag")}>Tags</button>
      </nav>

      {actualReport === "tag" && <Tag />}
      {actualReport === "attendants" && <Attendants />}
    </div>
  );
};

export default Report;
