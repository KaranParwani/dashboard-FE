import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPatientDetailsById, updatePatient } from "../services/PatientServiceApi";
import { Box, TextField, Button, Typography } from "@mui/material";
import { da } from "date-fns/locale";

const UpdatePatient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    blood_type: "",
    date_of_birth: "",
    contacts: {
      phone_number: "",
      email: "",
      address_1: "",
      address_2: "",
    },
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const data = await getPatientDetailsById(id);
        if (data.status_code === 200) {
            console.log("data", data.data)
            setPatientData(data.data);
        } else if (data.status_code === 500) {
            alert("Something went wrong!");
            sessionStorage.clear();
            window.location.href = "/";
        }
        
      } catch (err) {
        if (err.response) {
            setError("Failed to load patient data.");
            if (err.response.status === 422) {
              console.error("Validation Error:", err.response.data);
              alert("Something went wrong!");
            } else if (err.response.status === 500 && err.response.data.message.includes("Invalid token")) {
              console.error("Invalid Token Error:", err.response.data);
              alert("Your session has expired. Please log in again.");
              sessionStorage.clear();
              window.location.href = "/";
            } else {
              console.error("Error:", err.response.data);
              alert("Something went wrong!");
            }
          } else {
            console.error("Unexpected Error:", err.message);
            alert("Something went wrong!");
          }
      }
    };

    fetchPatient();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatientData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setPatientData((prevData) => ({
      ...prevData,
      contact: {
        ...prevData.contacts,
        [name]: value,
      },
    }));
  };

  const handleUpdate = async () => {
    try {
        console.log("patient details", patientData)
        await updatePatient(patientData);
        alert("Patient updated successfully!");
        navigate("/patients"); // Redirect to patients list
    } catch (err) {
      setError("Failed to update patient.");
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={3}>
        Update Patient
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <TextField
        name="first_name"
        label="First Name"
        value={patientData.first_name}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="middle_name"
        label="Middle Name"
        value={patientData.middle_name}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="last_name"
        label="Last Name"
        value={patientData.last_name}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="phone_number"
        label="Phone Number"
        value={patientData.contacts.phone_number}
        onChange={handleContactChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="email"
        label="Email"
        value={patientData.contacts.email}
        onChange={handleContactChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="address_1"
        label="Address 1"
        value={patientData.contacts.address_1}
        onChange={handleContactChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="address_2"
        label="Address 2"
        value={patientData.contacts.address_2}
        onChange={handleContactChange}
        fullWidth
        margin="normal"
      />
      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={handleUpdate}>
          Update Patient
        </Button>
      </Box>
    </Box>
  );
};

export default UpdatePatient;
