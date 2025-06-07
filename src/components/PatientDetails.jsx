import React, { useState, useEffect } from "react";
import { fetchPatients, addPatient, updatePatient, deletePatient } from "../services/PatientServiceApi";
import { Box, Typography, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ChatAssistant from "./ChatBot"; // Import the ChatAssistant component=

const formatCreatedAt = (createdAt) => {
    const date = new Date(createdAt);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    });
  };
  
const PatientPage = () => {
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const data = await fetchPatients();
        console.log(data.data.status_code);
        if (data.data.status_code === 200) {
          console.log("data", data.data.data)
          setPatients(data.data.data);
        } else if (data.data.status_code === 500) {
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
    loadPatients();
  }, []);

  const handleDelete = async (patientId) => {
    try {
      await deletePatient(patientId);
      setPatients(patients.filter((p) => p.id !== patientId));
      const data = await fetchPatients();
      if (data.data.status_code === 200) {
        setPatients(data.data.data);
        window.location.href = "/patients";
      }
    } catch (err) {
      setError("Failed to delete patient.");
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2} fontWeight="bold">
        Patient Assistant Dashboard
      </Typography>
      {error && (
        <Typography color="error" mb={2}>
          {error}
        </Typography>
      )}
            <Box mb={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/add-patient")}
        >
          Add Patient
        </Button>
      </Box>
      <Box>
        {patients.length === 0 ? (
          <Typography>No patients found.</Typography>
        ) : (
          patients.map((patient) => {
            // Log each patient during mapping
            console.log("Patient in Render:", patient);

            return (
              <Box key={patient.id} p={2} border="1px solid #ccc" mb={2}>
                <Typography>First Name: {patient.first_name}</Typography>
                <Typography>Middle Name: {patient.middle_name}</Typography>
                <Typography>Last Name: {patient.last_name}</Typography>
                <Typography>Blood Type: {patient.blood_type}</Typography>
                <Typography>Date of Birth: {patient.date_of_birth}</Typography>
                <Typography>Created On: {formatCreatedAt(patient.created_at)}</Typography>

                <Box mt={2}>
                    <Typography>Contact Details</Typography>  
                    <Typography>Phone Number: {patient.contacts.phone_number}</Typography>
                    <Typography>Email: {patient.contacts.email}</Typography>
                    <Typography>Address 1: {patient.contacts.address_1}</Typography>
                    <Typography>Address 2: {patient.contacts.address_2}</Typography>
                </Box>
                           
                <Box mt={2} display="flex" gap={2}>
                  <Button
                      onClick={() => {
                          const confirmDelete = window.confirm("Are you sure you want to delete this?");
                          if (confirmDelete) {
                              handleDelete(patient.patient_id);
                          }
                      }}
                      color="error"
                      variant="contained"
                      size="small"
                  >
                      Delete
                  </Button>

                <Button
                    onClick={() => navigate(`/update-patient/${patient.patient_id}`)}
                    variant="contained"
                    size="small"
                    style={{ backgroundColor: "white", color: "blue", border: "1px solid blue" }}
                  >
                    Update
                </Button>
                </Box>
              </Box>
            );
          })
        )}
      </Box>
      <ChatAssistant />
    </Box>
  );
};

export default PatientPage;
