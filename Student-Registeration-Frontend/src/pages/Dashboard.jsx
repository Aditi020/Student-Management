import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Download, Moon, Sun, GraduationCap } from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import StudentTable from '../components/StudentTable';
import DeleteModal from '../components/DeleteModal';
import ToastNotification from '../components/ToastNotification';
import '../styles/pages/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    students,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    fetchStudents,
    deleteStudent,
    clearError,
    darkMode,
    toggleDarkMode,
  } = useStudent();

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    studentRollNo: null,
    studentName: '',
  });

  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'success',
  });

  const [hasInitialized, setHasInitialized] = useState(false);

  // Fetch students only once on component mount
  useEffect(() => {
    if (!hasInitialized && students.length === 0 && !loading) {
      setHasInitialized(true);
      fetchStudents();
    }
  }, [hasInitialized, students.length, loading, fetchStudents]);

  // Show toast for errors
  useEffect(() => {
    if (error) {
      showToast(error, 'error');
    }
  }, [error]);

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({
      isVisible: true,
      message,
      type,
    });
  };

  // Handle delete student
  const handleDeleteStudent = (rollNo) => {
    const student = students.find(s => s.rollNo === rollNo);
    setDeleteModal({
      isOpen: true,
      studentRollNo: rollNo,
      studentName: student ? student.name : 'Unknown',
    });
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      await deleteStudent(deleteModal.studentRollNo);
      setDeleteModal({ isOpen: false, studentRollNo: null, studentName: '' });
      showToast('Student deleted successfully', 'success');
    } catch (error) {
      showToast('Failed to delete student', 'error');
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, studentRollNo: null, studentName: '' });
  };

  // Export to CSV
  const exportToCSV = () => {
    if (students.length === 0) {
      showToast('No data to export', 'warning');
      return;
    }

    const csvHeader = 'Roll No,Name,Class,Address,Phone\n';
    const csvData = students.map(student => 
      `${student.rollNo},"${student.name}","${student.className}","${student.address}","${student.phone}"`
    ).join('\n');

    const csvContent = csvHeader + csvData;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `students_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('CSV exported successfully', 'success');
    }
  };

  // Filter students for search results count
  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.rollNo.toString().includes(searchQuery)
  );

  return (
    <div className={`dashboard ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="header-title">
              <GraduationCap className="header-logo" />
              Student Management System
            </div>
            <div className="header-actions">
              <button
                onClick={toggleDarkMode}
                className="theme-toggle"
                title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? <Sun className="theme-icon" /> : <Moon className="theme-icon" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          {/* Actions Bar */}
          <div className="filter-bar">
            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search by roll number or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-actions">
              <button onClick={exportToCSV} className="btn btn-outline">
                <Download className="btn-icon" />
                Export CSV
              </button>
              
              <button
                onClick={() => navigate('/add-student')}
                className="btn btn-primary"
              >
                <Plus className="btn-icon" />
                Add Student
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-content">
                <div className="stat-card-icon">
                  <GraduationCap style={{ color: '#2563eb' }} />
                </div>
                <div className="stat-card-info">
                  <div className="stat-card-label">Total Students</div>
                  <div className="stat-card-value">{students.length}</div>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-content">
                <div className="stat-card-icon">
                  <Search style={{ color: '#059669' }} />
                </div>
                <div className="stat-card-info">
                  <div className="stat-card-label">Search Results</div>
                  <div className="stat-card-value">{filteredStudents.length}</div>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-content">
                <div className="stat-card-icon">
                  <div style={{ 
                    width: '2rem', 
                    height: '2rem', 
                    backgroundColor: '#7c3aed', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: 'bold'
                  }}>
                    DB
                  </div>
                </div>
                <div className="stat-card-info">
                  <div className="stat-card-label">Database Status</div>
                  <div className="stat-card-value">
                    {loading ? 'Loading...' : error ? 'Error' : 'Connected'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && students.length === 0 && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <span className="loading-text">Loading students...</span>
            </div>
          )}

          {/* Error State */}
          {error && !loading && students.length === 0 && (
            <div className="error-container">
              <h3 className="error-title">Error loading students</h3>
              <div className="error-message">{error}</div>
              <div style={{ marginTop: '1rem' }}>
                <button
                  onClick={() => {
                    clearError();
                    setHasInitialized(false);
                  }}
                  className="btn btn-danger"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Students Table */}
          {!loading && !error && students.length > 0 && (
            <StudentTable onDeleteStudent={handleDeleteStudent} />
          )}

          {/* Empty State */}
          {!loading && !error && students.length === 0 && hasInitialized && (
            <div className="empty-state">
              <GraduationCap className="empty-state-icon" />
              <h3 className="empty-state-title">No students found</h3>
              <p className="empty-state-description">
                Get started by adding your first student.
              </p>
              <button
                onClick={() => navigate('/add-student')}
                className="btn btn-primary"
              >
                <Plus className="btn-icon" />
                Add Student
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        studentName={deleteModal.studentName}
        loading={loading}
      />

      {/* Toast Notification */}
      <ToastNotification
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
};

export default Dashboard;