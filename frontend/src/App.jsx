import { useState, useEffect } from "react";
import axios from "axios";
import EmployeeAccordion from "./components/EmployeeAccordian";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const App = () => {
  const [providerId, setProviderId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [companyInfo, setCompanyInfo] = useState(null);
  const [providerName, setProviderName] = useState("");
  const [employeeDirectory, setEmployeeDirectory] = useState(null);
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const providers = [
    { id: "gusto", name: "Gusto" },
    { id: "justworks", name: "Justworks" },
    { id: "bamboo_hr", name: "Bamboo HR" },
    { id: "adp_run", name: "ADP Run" },
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
      setError("Failed to fetch company info");
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
      setError("Failed to fetch employee directory");
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
      setError("Failed to fetch employee details");
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
          <button onClick={fetchCompanyInfo}>Get Company Info</button>
          <button onClick={fetchEmployeeDirectory}>
            Get Employee Directory
          </button>
        </>
      )}

      {companyInfo && (
        <div>
          <h2>Company Info</h2>
          <p>Company ID: {companyInfo.id}</p>
          <p>Company Name: {companyInfo.legal_name}</p>
          <p>
            Location: {companyInfo.locations?.[0]?.state || "Not available"}
          </p>
        </div>
      )}

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
            />
          ))}
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default App;
