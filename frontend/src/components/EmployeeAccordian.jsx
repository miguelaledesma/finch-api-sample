import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const EmployeeAccordion = ({
  employee,
  details,
  fetchEmployeeDetails,
  testPaymentEndpoint,
}) => {
  return (
    <Accordion onChange={() => fetchEmployeeDetails(employee.id)}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel-${employee.id}-content`}
        id={`panel-${employee.id}-header`}
      >
        <Typography>
          {employee.first_name} {employee.last_name}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {details ? (
          <div style={{ marginLeft: "20px" }}>
            <p>Title: {details.title || "Not available"}</p>
            <p>
              Employment Type: {details.employment?.type || "Not available"}
            </p>
            <p>Department: {details.department?.name || "Not available"}</p>

            <p>Start Date: {details.start_date || "Not available"}</p>
            <p>End Date: {details.end_date || "Not available"}</p>

            <p>Location: {details.location?.line1 || "Not available"}</p>

            <Button
              variant="outlined"
              color="primary"
              onClick={() => testPaymentEndpoint(employee.id)}
              style={{ marginTop: "10px" }}
            >
              Test Payment Endpoint
            </Button>
          </div>
        ) : (
          <p>Loading details...</p>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default EmployeeAccordion;
