const axios = require("axios");
require("dotenv").config();
const FormData = require("form-data");

// =======================================
// START OF DATA TO BE ADDED BY THE USER
// =======================================

// The SILVERFIN_TOKEN is a valid access token for the Silverfin API that's created through another application like Postman before running the script
// The SILVERFIN_FIRM_ID is the id of the firm that can be found in the URL of the Silverfin web application (e.g. https://live.getsilverfin.com/f/13827/)
const { SILVERFIN_TOKEN, SILVERFIN_FIRM_ID, RECONCILIATION_HANDLE } =
  process.env;

// =======================================
// END OF DATA TO BE ADDED BY THE USER
// =======================================

// Create an axios instance with the base URL and the authorization header that should be used for each Silverfin API request
const defaultHeaders = {
  Authorization: `Bearer ${SILVERFIN_TOKEN}`,
  Accept: "application/json",
};
const axiosInstance = axios.create({
  baseURL: "https://live.getsilverfin.com/api/v4",
  Accept: "application/json",
  headers: {
    ...defaultHeaders,
  },
});

const starReconciliation = async () => {
  try {
    // Loop through each company
    let page = 1;
    let perPage = 10;
    let companies = [];

    do {
      companies = await axiosInstance.get(`/f/${SILVERFIN_FIRM_ID}/companies`, {
        params: {
          page,
          per_page: perPage,
        },
      });

      for (let company of companies.data) {
        // Run through each period of the company
        const periods = await axiosInstance.get(
          `/f/${SILVERFIN_FIRM_ID}/companies/${company.id}/periods`
        );

        for (let period of periods.data) {
          let reconsPage = 1;
          let reconsPerPage = 30;
          let reconciliations = [];

          // Search through the reconciliations for each period to find the reconciliation with a specific handle
          do {
            reconciliations = await axiosInstance.get(
              `/f/${SILVERFIN_FIRM_ID}/companies/${company.id}/periods/${period.id}/reconciliations`,
              {
                params: {
                  page: reconsPage,
                  per_page: reconsPerPage,
                },
              }
            );

            const starredRecon = reconciliations.data.find(
              (recon) => recon.handle === RECONCILIATION_HANDLE
            );

            // Star the reconciliation in non-locked ledgers
            if (starredRecon) {
              let data = new FormData();
              data.append("starred", "true");

              const response = await axiosInstance.post(
                `/f/${SILVERFIN_FIRM_ID}/companies/${company.id}/periods/${period.id}/reconciliations/${starredRecon.id}`,
                data,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                    ...defaultHeaders,
                  },
                }
              );

              console.log(
                `Starred status of reconciliation '${RECONCILIATION_HANDLE}' in company ${company.name} and period ${period.id} set to ${response.data.starred}`
              );
              console.log("");
              break;
            }

            reconsPage++;
          } while (reconciliations.data.length === reconsPerPage);
        }
      }

      page++;
    } while (companies.data.length === perPage);
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("An error occured");
  }
};

starReconciliation();
