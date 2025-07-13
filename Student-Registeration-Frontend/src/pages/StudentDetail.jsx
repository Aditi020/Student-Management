import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit, Trash2, ArrowLeft, User, Car as IdCard, School, Home, Phone } from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import DeleteModal from '../components/DeleteModal';
import ToastNotification from '../components/ToastNotification';
import '../styles/pages/StudentDetail.css';

const StudentDetail = () => {
  const { rollNo } = useParams();
  const navigate = useNavigate();
  const {
    currentStudent,
    students,
    loading,
    error,
    fetchStudent,
    deleteStudent,
    clearError,
    clearCurrentStudent,
    darkMode,
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

  // Clear current student and errors when component mounts
  useEffect(() => {
    clearError();
    clearCurrentStudent();
  }, [clearError, clearCurrentStudent]);

  // Fetch student data
  useEffect(() => {
    if (rollNo) {
      fetchStudent(rollNo).catch(() => {
        // Error is handled in context
      });
    }
  }, [rollNo, fetchStudent]);

  // Get current student - prioritize currentStudent from context
  const student = currentStudent || students.find(s => s.rollNo === parseInt(rollNo));

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({
      isVisible: true,
      message,
      type,
    });
  };

  // Handle delete student
  const handleDeleteStudent = () => {
    if (student) {
      setDeleteModal({
        isOpen: true,
        studentRollNo: student.rollNo,
        studentName: student.name,
      });
    }
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      await deleteStudent(deleteModal.studentRollNo);
      setDeleteModal({ isOpen: false, studentRollNo: null, studentName: '' });
      showToast('Student deleted successfully', 'success');
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      showToast('Failed to delete student', 'error');
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, studentRollNo: null, studentName: '' });
  };

  return (
    <div className={`student-detail ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="header-title">
              <button
                onClick={() => navigate('/')}
                className="back-btn"
              >
                <ArrowLeft className="back-icon" />
              </button>
              Student Details
            </div>
            {student && (
              <div className="header-actions">
                <button
                  onClick={() => navigate(`/student/${student.rollNo}/edit`)}
                  className="btn btn-primary"
                >
                  <Edit className="btn-icon" />
                  Edit
                </button>
                <button
                  onClick={handleDeleteStudent}
                  className="btn btn-danger"
                >
                  <Trash2 className="btn-icon" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          {/* Loading State */}
          {loading && !student && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <span className="loading-text">Loading student details...</span>
            </div>
          )}

          {/* Error State */}
          {error && !student && !loading && (
            <div className="error-container">
              <h3 className="error-title">Error loading student details</h3>
              <div className="error-message">{error}</div>
              <div style={{ marginTop: '1rem' }}>
                <button
                  onClick={() => {
                    clearError();
                    fetchStudent(rollNo);
                  }}
                  className="btn btn-danger"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Student Details */}
          {student && (
            <div className="detail-card">
              {/* Header */}
              <div className="detail-header">
                <div className="student-avatar">
                  <User className="avatar-icon" />
                </div>
                <div className="student-info">
                  <h2 className="student-name">{student.name}</h2>
                  <p className="student-id">Student ID: {student.rollNo}</p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="detail-body">
                <div className="detail-grid">
                  {/* Roll Number */}
                  <div className="detail-item">
                    <div className="detail-icon">
                      <IdCard className="icon" />
                    </div>
                    <div className="detail-content">
                      <h3 className="detail-label">Roll Number</h3>
                      <p className="detail-value">{student.rollNo}</p>
                    </div>
                  </div>

                  {/* Name */}
                  <div className="detail-item">
                    <div className="detail-icon">
                      <User className="icon" />
                    </div>
                    <div className="detail-content">
                      <h3 className="detail-label">Full Name</h3>
                      <p className="detail-value">{student.name}</p>
                    </div>
                  </div>

                  {/* Class */}
                  <div className="detail-item">
                    <div className="detail-icon">
                      <School className="icon" />
                    </div>
                    <div className="detail-content">
                      <h3 className="detail-label">Class</h3>
                      <p className="detail-value">{student.className}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="detail-item">
                    <div className="detail-icon">
                      <Phone className="icon" />
                    </div>
                    <div className="detail-content">
                      <h3 className="detail-label">Phone Number</h3>
                      <p className="detail-value">{student.phone}</p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="detail-item full-width">
                    <div className="detail-icon">
                      <Home className="icon" />
                    </div>
                    <div className="detail-content">
                      <h3 className="detail-label">Address</h3>
                      <p className="detail-value">{student.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="detail-actions">
                <button
                  onClick={() => navigate('/')}
                  className="btn btn-outline"
                >
                  Back to Dashboard
                </button>
                <button
                  onClick={() => navigate(`/student/${student.rollNo}/edit`)}
                  className="btn btn-primary"
                >
                  <Edit className="btn-icon" />
                  Edit Student
                </button>
              </div>
            </div>
          )}

          {/* Not Found State */}
          {!loading && !error && !student && (
            <div className="error-container">
              <h3 className="error-title">Student not found</h3>
              <div className="error-message">
                The student with roll number {rollNo} could not be found.
              </div>
              <div style={{ marginTop: '1rem' }}>
                <button
                  onClick={() => navigate('/')}
                  className="btn btn-primary"
                >
                  Back to Dashboard
                </button>
              </div>
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

export default StudentDetail;