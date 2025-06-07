import React, { useState } from "react";
import { Box, TextField, Button, Typography, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { addPatient } from "../services/PatientServiceApi";
import { format } from "date-fns";


const formatDOB = (dob) => {
  const date = new Date(dob);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const AddPatientPage = () => {
  const [patientData, setPatientData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    date_of_birth: null,
    blood_type: "",
    gender: "",
    contacts: {
      phone_number: "",
      email: "",
      address_1: "",
      address_2: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatientData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setPatientData((prev) => ({
      ...prev,
      contacts: {
        ...prev.contacts,
        [name]: value,
      },
    }));
  };

  const handleDobChange = (date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    console.log("formattedDate", formattedDate);
    setPatientData((prev) => ({
      ...prev,
      date_of_birth: formattedDate,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await addPatient(patientData);
      console.log(response.status_code);

      if (response.status_code === 200) {
        console.log("Patient data submitted successfully:", response);
        alert("Patient added successfully!");
        window.location.href = "/patients";
      } else if (response.status_code === 500) {
        alert("Something went wrong!");
        sessionStorage.clear();
        window.location.href = "/";
      }

    } catch (err) {
      if (err.response) {
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
  

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box p={3}>
        <Typography variant="h5" mb={2}>
          Add New Patient
        </Typography>
        <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
          <TextField name="first_name" label="First Name" onChange={handleChange} required />
          <TextField name="middle_name" label="Middle Name" onChange={handleChange} />
          <TextField name="last_name" label="Last Name" onChange={handleChange} required />
          <DatePicker
            label="Date of Birth"
            value={patientData.dob}
            onChange={handleDobChange}
            renderInput={(params) => <TextField {...params} required />}
          />
          <TextField name="blood_type" label="Blood Type" onChange={handleChange} />
          <FormControl fullWidth required>
            <InputLabel>Gender</InputLabel>
            <Select
              name="gender"
              value={patientData.gender}
              onChange={handleChange}
              displayEmpty
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
          </FormControl>
          <Box display="flex" flexDirection="column" gap={2}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Contact Details
            </Typography>
            <TextField name="phone_number" label="Phone Number" onChange={handleContactChange} required />
            <TextField name="email" label="Email" onChange={handleContactChange} required />
            <TextField name="address_1" label="Address 1" onChange={handleContactChange} />
            <TextField name="address_2" label="Address 2" onChange={handleContactChange} />
          </Box>
          <Button type="submit" variant="contained" color="primary">
            Save Patient
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default AddPatientPage;
