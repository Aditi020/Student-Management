import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StudentProvider } from './context/StudentContext';
import Dashboard from './pages/Dashboard';
import StudentDetail from './pages/StudentDetail';
import StudentForm from './components/StudentForm';
import './styles/App.css';

function App() {
  return (
    <StudentProvider>
      <Router>
        <div className="app">
          {/* Routing */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add-student" element={<StudentForm />} />
            <Route path="/student/:rollNo" element={<StudentDetail />} />
            <Route path="/student/:rollNo/edit" element={<StudentForm isEdit={true} />} />
          </Routes>
        </div>
      </Router>
    </StudentProvider>
  );
}

export default App;
