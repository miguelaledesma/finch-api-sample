import { useState, useEffect } from "react";
import axios from "axios";
import EmployeeAccordion from "./components/EmployeeAccordian";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Alert, Button, Typography } from "@mui/material";

const App = () => {
  const [providerId, setProviderId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [companyInfo, setCompanyInfo] = useState(null);
  const [providerName, setProviderName] = useState("");
  const [employeeDirectory, setEmployeeDirectory] = useState(null);
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [error, setError] = useState("");
  const [paymentError, setPaymentError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const providers = [
    { id: "gusto", name: "Gusto" },
    { id: "justworks", name: "Justworks" },
    { id: "bamboo_hr", name: "Bamboo HR" },
    { id: "adp_run", name: "ADP Run" },
    { id: "testFailingProvider", name: "Test Failure" },
  ];

  useEffect(() => {
    if (providerId) {
      handleCreateSandbox();
    }
    setAccessToken("");
    setCompanyInfo(null);
    setEmployeeDirectory(null);
    setEmployeeDetails({});
    setError("");
    setPaymentError("");
  }, [providerId]);

  const handleCreateSandbox = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/create-sandbox`, {
        provider_id: providerId,
      });
      setAccessToken(response.data.access_token);
      setProviderName(response.data.payroll_provider_id);
      setError("");
    } catch (error) {
      setError("Failed to create sandbox");
    }
  };

  const fetchCompanyInfo = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/company`, {
        params: { access_token: accessToken },
      });
      setCompanyInfo(response.data);
      setError("");
    } catch (error) {
      const customMessage =
        error.response?.data?.message || "Failed to fetch company info";
      setError(customMessage);
    }
  };

  const fetchEmployeeDirectory = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/directory`, {
        params: { access_token: accessToken },
      });
      setEmployeeDirectory(response.data.individuals);
      setError("");
    } catch (error) {
      const customMessage =
        error.response?.data?.message || "Failed to fetch employee directory";
      setError(customMessage);
    }
  };

  const fetchEmployeeDetails = async (employeeId) => {
    try {
      const response = await axios.post(`${API_URL}/api/employee-details`, {
        individual_id: employeeId,
        access_token: accessToken,
      });

      if (response.data) {
        setEmployeeDetails((prevDetails) => ({
          ...prevDetails,
          [employeeId]: response.data,
        }));
        setError("");
      } else {
        setError("No employee details found");
      }
    } catch (error) {
      const customMessage =
        error.response?.data?.message || "Failed to fetch employee details";
      setError(customMessage);
    }
  };

  // Function to test /payment endpoint
  const testPaymentEndpoint = async (employeeId) => {
    setPaymentError(""); // Reset any previous error
    const employee = employeeDetails[employeeId];

    if (!employee || !employee.start_date || !employee.end_date) {
      setPaymentError("Employee start or end date is not available.");
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/api/payment`, {
        params: {
          access_token: accessToken,
          start_date: employee.start_date,
          end_date: employee.end_date,
        },
      });

      // If the request somehow succeeds (which it shouldn't)
      if (response.status === 200) {
        setPaymentError("Payment endpoint request succeeded (unexpected).");
      }
    } catch (error) {
      const customMessage =
        error.response?.status === 403
          ? error.response?.data?.message
          : "Error testing payment endpoint (expected)";
      setPaymentError(customMessage);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Finch Take Home Assignment</h1>

      <FormControl fullWidth>
        <InputLabel id="provider-label">Provider</InputLabel>
        <Select
          labelId="provider-label"
          id="provider"
          value={providerId}
          label="Provider"
          onChange={(e) => setProviderId(e.target.value)}
        >
          <MenuItem value="">
            <em>Select a provider</em>
          </MenuItem>
          {providers.map((provider) => (
            <MenuItem key={provider.id} value={provider.id}>
              {provider.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {accessToken && (
        <>
          <h2>Provider: {providerName}</h2>
          <Button variant="contained" onClick={fetchCompanyInfo}>
            Get Company Info
          </Button>
          <Button variant="contained" onClick={fetchEmployeeDirectory}>
            Get Employee Directory
          </Button>
        </>
      )}

      {companyInfo && (
        <div>
          <h2>Company Information</h2>
          <Typography>ID: {companyInfo.id}</Typography>
          <Typography>Legal Name: {companyInfo.legal_name}</Typography>
          <Typography>
            Email: {companyInfo.primary_email || "Not available"}
          </Typography>
          <Typography>
            Phone: {companyInfo.primary_phone_number || "Not available"}
          </Typography>
        </div>
      )}

      {paymentError && <Alert severity="error">{paymentError}</Alert>}

      {employeeDirectory && (
        <div>
          <h2>Employee Directory</h2>
          <p>Click an Employee to view more details</p>
          {employeeDirectory.map((employee) => (
            <EmployeeAccordion
              key={employee.id}
              employee={employee}
              details={employeeDetails[employee.id]}
              fetchEmployeeDetails={fetchEmployeeDetails}
              testPaymentEndpoint={testPaymentEndpoint}
            />
          ))}
        </div>
      )}

      {error && <Alert severity="error">{error}</Alert>}
    </div>
  );
};

export default App;
