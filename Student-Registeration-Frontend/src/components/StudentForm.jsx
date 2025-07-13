import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, User, Car as IdCard, School, Home, Phone, AlertCircle } from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import '../styles/components/Form.css';

const StudentForm = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { rollNo } = useParams();
  const { 
    createStudent, 
    updateStudent, 
    fetchStudent, 
    currentStudent,
    students,
    loading, 
    error, 
    clearError,
    clearCurrentStudent,
    darkMode 
  } = useStudent();

  const [formData, setFormData] = useState({
    rollNo: '',
    name: '',
    className: '',
    address: '',
    phone: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear errors and current student when component mounts
  useEffect(() => {
    clearError();
    if (isEdit) {
      clearCurrentStudent();
    }
  }, [clearError, clearCurrentStudent, isEdit]);

  // Load student data for edit mode
  useEffect(() => {
    if (isEdit && rollNo) {
      // First check if student exists in students array
      const existingStudent = students.find(s => s.rollNo === parseInt(rollNo));
      if (existingStudent) {
        setFormData({
          rollNo: existingStudent.rollNo || '',
          name: existingStudent.name || '',
          className: existingStudent.className || '',
          address: existingStudent.address || '',
          phone: existingStudent.phone || '',
        });
      } else {
        // Fetch from API if not in array
        fetchStudent(rollNo);
      }
    }
  }, [isEdit, rollNo, fetchStudent, students]);

  // Populate form with current student data
  useEffect(() => {
    if (isEdit && currentStudent) {
      setFormData({
        rollNo: currentStudent.rollNo || '',
        name: currentStudent.name || '',
        className: currentStudent.className || '',
        address: currentStudent.address || '',
        phone: currentStudent.phone || '',
      });
    }
  }, [isEdit, currentStudent]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.rollNo.toString().trim()) {
      newErrors.rollNo = 'Roll number is required';
    } else if (isNaN(formData.rollNo) || formData.rollNo <= 0) {
      newErrors.rollNo = 'Roll number must be a positive number';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.className.trim()) {
      newErrors.className = 'Class is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEdit) {
        await updateStudent(rollNo, formData);
      } else {
        await createStudent(formData);
      }
      
      navigate('/');
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`form-container ${darkMode ? 'dark' : ''}`}>
      <div className="form-wrapper">
        <div className="form-card">
          {/* Header */}
          <div className="form-header">
            <h1 className="form-title">
              {isEdit ? 'Edit Student' : 'Add New Student'}
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="form-body">
            {/* Error Message */}
            {error && (
              <div className="form-alert">
                <div className="form-alert-content">
                  <AlertCircle className="form-alert-icon" />
                  <div className="form-alert-text">
                    <h3 className="form-alert-title">Error</h3>
                    <div className="form-alert-message">{error}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="form-grid">
              {/* Roll Number */}
              <div className="form-group">
                <label className="form-label">
                  <IdCard className="form-label-icon" />
                  Roll Number
                </label>
                <input
                  type="number"
                  name="rollNo"
                  value={formData.rollNo}
                  onChange={handleChange}
                  disabled={isEdit}
                  className={`form-input ${errors.rollNo ? 'error' : ''}`}
                  placeholder="Enter roll number"
                />
                {errors.rollNo && (
                  <div className="form-error">
                    <AlertCircle className="form-error-icon" />
                    {errors.rollNo}
                  </div>
                )}
              </div>

              {/* Name */}
              <div className="form-group">
                <label className="form-label">
                  <User className="form-label-icon" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="Enter full name"
                />
                {errors.name && (
                  <div className="form-error">
                    <AlertCircle className="form-error-icon" />
                    {errors.name}
                  </div>
                )}
              </div>

              {/* Class */}
              <div className="form-group">
                <label className="form-label">
                  <School className="form-label-icon" />
                  Class
                </label>
                <input
                  type="text"
                  name="className"
                  value={formData.className}
                  onChange={handleChange}
                  className={`form-input ${errors.className ? 'error' : ''}`}
                  placeholder="Enter class (e.g., 10th Grade)"
                />
                {errors.className && (
                  <div className="form-error">
                    <AlertCircle className="form-error-icon" />
                    {errors.className}
                  </div>
                )}
              </div>

              {/* Phone */}
              <div className="form-group">
                <label className="form-label">
                  <Phone className="form-label-icon" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`form-input ${errors.phone ? 'error' : ''}`}
                  placeholder="Enter phone number"
                />
                {errors.phone && (
                  <div className="form-error">
                    <AlertCircle className="form-error-icon" />
                    {errors.phone}
                  </div>
                )}
              </div>

              {/* Address */}
              <div className="form-group">
                <label className="form-label">
                  <Home className="form-label-icon" />
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className={`form-input form-textarea ${errors.address ? 'error' : ''}`}
                  placeholder="Enter complete address"
                />
                {errors.address && (
                  <div className="form-error">
                    <AlertCircle className="form-error-icon" />
                    {errors.address}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="form-btn form-btn-secondary"
              >
                <X className="form-btn-icon" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="form-btn form-btn-primary"
              >
                {isSubmitting || loading ? (
                  <div className="form-loading">
                    <div className="form-loading-spinner"></div>
                    {isEdit ? 'Updating...' : 'Creating...'}
                  </div>
                ) : (
                  <>
                    <Save className="form-btn-icon" />
                    {isEdit ? 'Update Student' : 'Create Student'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentForm;