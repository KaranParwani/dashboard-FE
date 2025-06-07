import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLoginForm from "./components/AdminLoginForm";
import PatientDetails from "./components/PatientDetails";
import AddPatientPage from "./components/AddPatientPage";
import UpdatePatient from "./components/UpdatePatient";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLoginForm />} />
        <Route path="/patients" element={<PatientDetails />} />
        <Route path="/add-patient" element={<AddPatientPage />} />
        <Route path="/update-patient/:id" element={<UpdatePatient />} />
      </Routes>
    </Router>
  );
}

export default App;
