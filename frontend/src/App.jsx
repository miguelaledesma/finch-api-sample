import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [providerId, setProviderId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [companyInfo, setCompanyInfo] = useState(null);
  const [providerName, setProviderName] = useState("");
  const [employeeDirectory, setEmployeeDirectory] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [error, setError] = useState("");

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
    setSelectedEmployee(null);
    setError("");
  }, [providerId]);

  const handleCreateSandbox = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/create-sandbox",
        {
          provider_id: providerId,
        }
      );
      setAccessToken(response.data.access_token);
      setProviderName(response.data.payroll_provider_id);
      setError("");
    } catch (error) {
      setError("Failed to create sandbox");
    }
  };

  const fetchCompanyInfo = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/company", {
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
      const response = await axios.get("http://localhost:5000/api/directory", {
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
      const response = await axios.post(
        "http://localhost:5000/api/employee-details",
        {
          individual_id: employeeId,
          access_token: accessToken,
        }
      );
      setSelectedEmployee(response.data);
      setError("");
    } catch (error) {
      setError("Failed to fetch employee details");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Finch Take Home Assignment</h1>

      <label htmlFor="provider">Provider:</label>
      <select
        id="provider"
        value={providerId}
        onChange={(e) => setProviderId(e.target.value)}
      >
        <option value="">Select a provider</option>
        {providers.map((provider) => (
          <option key={provider.id} value={provider.id}>
            {provider.name}
          </option>
        ))}
      </select>

      {accessToken && (
        <>
          <h2>Access Token: {accessToken}</h2>
          <h3>Provider: {providerName}</h3>
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
          {employeeDirectory.map((employee) => (
            <div key={employee.id}>
              <h3 onClick={() => fetchEmployeeDetails(employee.id)}>
                {employee.first_name} {employee.last_name}
              </h3>
              <p>
                Department:{" "}
                {employee.department?.name || "Department not available"}
              </p>
              <p>Manager ID: {employee.manager?.id || "No manager assigned"}</p>
              <p>Active: {employee.is_active ? "Yes" : "No"}</p>
            </div>
          ))}
        </div>
      )}

      {selectedEmployee && (
        <div>
          <h2>Employee Details</h2>
          <p>First Name: {selectedEmployee.person.first_name}</p>
          <p>Last Name: {selectedEmployee.person.last_name}</p>
          <p>Title: {selectedEmployee.employment.title || "Not available"}</p>
          <p>
            Start Date:{" "}
            {selectedEmployee.employment.start_date || "Not available"}
          </p>
          <p>
            Department:{" "}
            {selectedEmployee.person.department?.name ||
              "Department not available"}
          </p>
          <p>
            Location:{" "}
            {selectedEmployee.employment.location?.line1 ||
              "Location not available"}
          </p>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default App;
