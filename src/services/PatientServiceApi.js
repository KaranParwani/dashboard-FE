import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem("access_token");
  return { Authorization: `Bearer ${token}` };
};

export const fetchPatients = async () => {
  const response = await axios.get(`${API_BASE_URL}/patients`, {
    headers: getAuthHeader(),
  });
  console.log("response", response);
  return response;
};

export const getPatientDetailsById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/patients/?patient_id=${id}`, {
    headers: getAuthHeader(),
  });
  console.log("response", response.data);
  return response.data;
}

export const addPatient = async (patientDetails, navigate) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/patients`,
      patientDetails,
      { headers: getAuthHeader() }
    );

    return response.data;
  } catch (error) {
    // Check if the error has a response and the status code/message matches
    if (
      error.response &&
      error.response.data.status_code === 500 &&
      error.response.data.message.includes("Invalid token")
    ) {
      // Clear session storage and navigate to admin login page
      sessionStorage.clear();
      navigate("/admin-login");
    }

    // Re-throw the error if it's not a token-related issue
    throw error;
  }
};


export const updatePatient = async (patientDetails) => {
  console.log("Patient Details", patientDetails);
  const response = await axios.put(
    `${API_BASE_URL}/patients/update`,
    patientDetails,
    { headers: getAuthHeader() }
  );
  return response.data;
};

export const deletePatient = async (patientId) => {
  const response = await axios.delete(`${API_BASE_URL}/patients/delete?patient_id=${patientId}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};
