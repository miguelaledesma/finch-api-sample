const request = require("supertest");
const express = require("express");
const app = express();
app.use(express.json());

//can be ignored just testing my thought process of how XSS vulnerability would occur here... Maybe sending a script to alert on the browser. Not exactly sure how this would occur unless you can write to the payroll_provider_id after its data has been returned.
// Mock the /api/create-sandbox route and return malicious file (XSS)
app.post("/api/create-sandbox", (req, res) => {
  res.json({
    payroll_provider_id: "<script>alert('XSS attack here!')</script>",
    company_id: "c9941f76-26fe-4d6a-aa56-5685263e1d60",
    access_token: "sandbox-token-d91210e5-57f2-4516-aa9d-4645cb119205",
    sandbox_time: {
      unix: 1727140253124,
      calendar: "Tue Sep 24 2024 01:10:53 GMT+0000",
    },
  });
});

describe("XSS Test for /api/create-sandbox", () => {
  it("should return a response that contains potential XSS payload", async () => {
    const response = await request(app)
      .post("/api/create-sandbox")
      .send({ payroll_provider_id: "gusto" });

    console.log(response);
    expect(response.statusCode).toBe(200);
    expect(response.body.payroll_provider_id).toBe(
      "<script>alert('XSS')</script>"
    );

    // Simulate frontend rendering
    const renderedContent = response.body.payroll_provider_id;

    // Check if the XSS content exists
    expect(renderedContent).toContain(
      "<script>alert('XSS attack here!')</script>"
    );
  });
});
