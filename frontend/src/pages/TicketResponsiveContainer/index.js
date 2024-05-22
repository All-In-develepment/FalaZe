import React from "react";
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";

import Tickets from "../TicketsCustom";
import TicketAdvanced from "../TicketsAdvanced";

function TicketResponsiveContainer(props) {
  console.log(props);

  if (isWidthUp("md", props.width)) {
    return <Tickets />;
  }
  return <TicketAdvanced props={props} />;
}

export default withWidth()(TicketResponsiveContainer);
