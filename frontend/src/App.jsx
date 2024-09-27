import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [providerId, setProviderId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [companyInfo, setCompanyInfo] = useState(null);
  const [providerName, setProviderName] = useState("");
  const [employeeDirectory, setEmployeeDirectory] = useState(null);
  const [expandedEmployeeId, setExpandedEmployeeId] = useState(null);
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
    setExpandedEmployeeId(null);
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

  const toggleAccordion = (employeeId) => {
    if (expandedEmployeeId === employeeId) {
      setExpandedEmployeeId(null);
    } else {
      setExpandedEmployeeId(employeeId);
      if (!employeeDetails[employeeId]) {
        fetchEmployeeDetails(employeeId);
      }
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
          <p>Click an Employee to view more details</p>
          {employeeDirectory.map((employee) => (
            <div key={employee.id}>
              <h3
                onClick={() => toggleAccordion(employee.id)}
                style={{ cursor: "pointer", color: "white" }}
              >
                {employee.first_name} {employee.last_name}
              </h3>

              {expandedEmployeeId === employee.id &&
                employeeDetails[employee.id] && (
                  <div style={{ marginLeft: "20px" }}>
                    <p>
                      Title:{" "}
                      {employeeDetails[employee.id].title || "Not available"}
                    </p>
                    <p>
                      Employment Type:{" "}
                      {employeeDetails[employee.id].employment?.type ||
                        "Not available"}
                    </p>
                    <p>
                      Department:{" "}
                      {employeeDetails[employee.id].department?.name ||
                        "Not available"}
                    </p>
                    <p>
                      Start Date:{" "}
                      {employeeDetails[employee.id].start_date ||
                        "Not available"}
                    </p>
                    <p>
                      End Date:{" "}
                      {employeeDetails[employee.id].end_date || "Not available"}
                    </p>
                    <p>
                      Location:{" "}
                      {employeeDetails[employee.id].location?.line1 ||
                        "Not available"}
                    </p>
                    <p>
                      City:{" "}
                      {employeeDetails[employee.id].location?.city ||
                        "Not available"}
                    </p>
                    <p>
                      State:{" "}
                      {employeeDetails[employee.id].location?.state ||
                        "Not available"}
                    </p>
                    <p>
                      Postal Code:{" "}
                      {employeeDetails[employee.id].location?.postal_code ||
                        "Not available"}
                    </p>
                    <p>
                      Country:{" "}
                      {employeeDetails[employee.id].location?.country ||
                        "Not available"}
                    </p>
                    <p>
                      Income:{" "}
                      {employeeDetails[employee.id].income?.amount ||
                        "Not available"}{" "}
                      {employeeDetails[employee.id].income?.currency || "USD"}
                    </p>
                  </div>
                )}
            </div>
          ))}
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default App;
