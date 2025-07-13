import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { studentApi } from '../services/api';

const StudentContext = createContext();

// Initial state
const initialState = {
  students: [],
  loading: false,
  error: null,
  currentStudent: null,
  searchQuery: '',
  sortField: 'rollNo',
  sortOrder: 'asc',
  currentPage: 1,
  studentsPerPage: 10,
  darkMode: localStorage.getItem('darkMode') === 'true',
};

// Action types
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_STUDENTS: 'SET_STUDENTS',
  SET_CURRENT_STUDENT: 'SET_CURRENT_STUDENT',
  ADD_STUDENT: 'ADD_STUDENT',
  UPDATE_STUDENT: 'UPDATE_STUDENT',
  DELETE_STUDENT: 'DELETE_STUDENT',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  SET_SORT: 'SET_SORT',
  SET_CURRENT_PAGE: 'SET_CURRENT_PAGE',
  TOGGLE_DARK_MODE: 'TOGGLE_DARK_MODE',
  CLEAR_ERROR: 'CLEAR_ERROR',
  CLEAR_CURRENT_STUDENT: 'CLEAR_CURRENT_STUDENT',
};

// Reducer function
const studentReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case actionTypes.SET_STUDENTS:
      return { ...state, students: action.payload, loading: false, error: null };
    
    case actionTypes.SET_CURRENT_STUDENT:
      return { ...state, currentStudent: action.payload, loading: false };
    
    case actionTypes.CLEAR_CURRENT_STUDENT:
      return { ...state, currentStudent: null };
    
    case actionTypes.ADD_STUDENT:
      return {
        ...state,
        students: [...state.students, action.payload],
        loading: false,
        error: null,
      };
    
    case actionTypes.UPDATE_STUDENT:
      return {
        ...state,
        students: state.students.map(student =>
          student.rollNo === action.payload.rollNo ? action.payload : student
        ),
        currentStudent: action.payload,
        loading: false,
        error: null,
      };
    
    case actionTypes.DELETE_STUDENT:
      return {
        ...state,
        students: state.students.filter(student => student.rollNo !== action.payload),
        currentStudent: state.currentStudent?.rollNo === action.payload ? null : state.currentStudent,
        loading: false,
        error: null,
      };
    
    case actionTypes.SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload, currentPage: 1 };
    
    case actionTypes.SET_SORT:
      return {
        ...state,
        sortField: action.payload.field,
        sortOrder: action.payload.order,
        currentPage: 1,
      };
    
    case actionTypes.SET_CURRENT_PAGE:
      return { ...state, currentPage: action.payload };
    
    case actionTypes.TOGGLE_DARK_MODE:
      const newDarkMode = !state.darkMode;
      localStorage.setItem('darkMode', newDarkMode.toString());
      return { ...state, darkMode: newDarkMode };
    
    case actionTypes.CLEAR_ERROR:
      return { ...state, error: null };
    
    default:
      return state;
  }
};

// Context provider component
export const StudentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(studentReducer, initialState);

  // Apply dark mode to document
  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkMode]);

  // Memoized actions to prevent unnecessary re-renders
  const fetchStudents = useCallback(async () => {
    if (state.loading) return; // Prevent multiple simultaneous requests
    
    dispatch({ type: actionTypes.SET_LOADING, payload: true });
    try {
      const students = await studentApi.getAllStudents();
      dispatch({ type: actionTypes.SET_STUDENTS, payload: students });
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
    }
  }, [state.loading]);

  const fetchStudent = useCallback(async (rollNo) => {
    if (state.loading) return;
    
    // First check if student exists in students array
    const existingStudent = state.students.find(s => s.rollNo === parseInt(rollNo));
    if (existingStudent) {
      dispatch({ type: actionTypes.SET_CURRENT_STUDENT, payload: existingStudent });
      return existingStudent;
    }
    
    dispatch({ type: actionTypes.SET_LOADING, payload: true });
    try {
      const student = await studentApi.getStudent(rollNo);
      dispatch({ type: actionTypes.SET_CURRENT_STUDENT, payload: student });
      return student;
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      throw error;
    }
  }, [state.loading, state.students]);

  const createStudent = useCallback(async (studentData) => {
    if (state.loading) return;
    
    dispatch({ type: actionTypes.SET_LOADING, payload: true });
    try {
      const newStudent = await studentApi.createStudent(studentData);
      dispatch({ type: actionTypes.ADD_STUDENT, payload: newStudent });
      return newStudent;
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      throw error;
    }
  }, [state.loading]);

  const updateStudent = useCallback(async (rollNo, studentData) => {
    if (state.loading) return;
    
    dispatch({ type: actionTypes.SET_LOADING, payload: true });
    try {
      const updatedStudent = await studentApi.updateStudent(rollNo, studentData);
      dispatch({ type: actionTypes.UPDATE_STUDENT, payload: updatedStudent });
      return updatedStudent;
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      throw error;
    }
  }, [state.loading]);

  const deleteStudent = useCallback(async (rollNo) => {
    if (state.loading) return;
    
    dispatch({ type: actionTypes.SET_LOADING, payload: true });
    try {
      await studentApi.deleteStudent(rollNo);
      dispatch({ type: actionTypes.DELETE_STUDENT, payload: rollNo });
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      throw error;
    }
  }, [state.loading]);

  const setSearchQuery = useCallback((query) => {
    dispatch({ type: actionTypes.SET_SEARCH_QUERY, payload: query });
  }, []);

  const setSort = useCallback((field, order) => {
    dispatch({ type: actionTypes.SET_SORT, payload: { field, order } });
  }, []);

  const setCurrentPage = useCallback((page) => {
    dispatch({ type: actionTypes.SET_CURRENT_PAGE, payload: page });
  }, []);

  const toggleDarkMode = useCallback(() => {
    dispatch({ type: actionTypes.TOGGLE_DARK_MODE });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: actionTypes.CLEAR_ERROR });
  }, []);

  const clearCurrentStudent = useCallback(() => {
    dispatch({ type: actionTypes.CLEAR_CURRENT_STUDENT });
  }, []);

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = React.useMemo(() => ({
    ...state,
    fetchStudents,
    fetchStudent,
    createStudent,
    updateStudent,
    deleteStudent,
    setSearchQuery,
    setSort,
    setCurrentPage,
    toggleDarkMode,
    clearError,
    clearCurrentStudent,
  }), [
    state,
    fetchStudents,
    fetchStudent,
    createStudent,
    updateStudent,
    deleteStudent,
    setSearchQuery,
    setSort,
    setCurrentPage,
    toggleDarkMode,
    clearError,
    clearCurrentStudent,
  ]);

  return (
    <StudentContext.Provider value={contextValue}>
      {children}
    </StudentContext.Provider>
  );
};

// Custom hook to use the context
export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
};

export default StudentContext;