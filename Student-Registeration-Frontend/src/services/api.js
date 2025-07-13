import axios from 'axios';
import { mockStudents } from '../data/mockStudents';

/* === BACKEND ROUTES (FOR FUTURE INTEGRATION) ===
const API_BASE_URL = 'http://localhost:3030';  // Updated port to 3030 for backend

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.');
    }
    
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      switch (status) {
        case 400:
          throw new Error(data.message || 'Invalid request data');
        case 404:
          throw new Error('Student not found');
        case 500:
          throw new Error('Server error. Please try again later.');
        default:
          throw new Error(data.message || 'An unexpected error occurred');
      }
    } else if (error.request) {
      // Network error
      throw new Error('Unable to connect to server. Please check your connection.');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
);

// REAL API METHODS (COMMENTED FOR FUTURE USE)
// export const studentApi = {
//   // Get all students
//   getAllStudents: async () => {
//     const response = await api.get('/students');
//     return response.data;
//   },

//   // Get single student by rollNo
//   getStudent: async (rollNo) => {
//     const response = await api.get(`/student/${rollNo}`);
//     return response.data;
//   },

//   // Create new student
//   createStudent: async (studentData) => {
//     const response = await api.post('/student/add', studentData);
//     return response.data;
//   },

//   // Update student
//   updateStudent: async (rollNo, studentData) => {
//     const response = await api.put(`/student/update/${rollNo}`, studentData);
//     return response.data;
//   },

//   // Delete student
//   deleteStudent: async (rollNo) => {
//     const response = await api.delete(`/student/delete/${rollNo}`);
//     return response.data;
//   },
// };
*/

/* === MOCK IMPLEMENTATION (CURRENTLY ACTIVE) === */

// In-memory storage for mock data (simulates database)
let studentsData = [...mockStudents];

// Simulate network delay with reduced time for better performance
const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API methods
export const studentApi = {
  // Get all students
  getAllStudents: async () => {
    await delay(150); // Reduced delay
    console.log('Mock API: Fetching all students');
    return [...studentsData];
  },

  // Get single student by rollNo
  getStudent: async (rollNo) => {
    await delay(100); // Reduced delay
    console.log(`Mock API: Fetching student with rollNo: ${rollNo}`);
    const student = studentsData.find(s => s.rollNo === parseInt(rollNo));
    if (!student) {
      throw new Error('Student not found');
    }
    return student;
  },

  // Create new student
  createStudent: async (studentData) => {
    await delay(200); // Reduced delay
    console.log('Mock API: Creating new student', studentData);
    
    // Check if rollNo already exists
    const existingStudent = studentsData.find(s => s.rollNo === parseInt(studentData.rollNo));
    if (existingStudent) {
      throw new Error('Student with this roll number already exists');
    }

    const newStudent = {
      ...studentData,
      rollNo: parseInt(studentData.rollNo)
    };
    
    studentsData.push(newStudent);
    return newStudent;
  },

  // Update student
  updateStudent: async (rollNo, studentData) => {
    await delay(200); // Reduced delay
    console.log(`Mock API: Updating student ${rollNo}`, studentData);
    
    const index = studentsData.findIndex(s => s.rollNo === parseInt(rollNo));
    if (index === -1) {
      throw new Error('Student not found');
    }

    const updatedStudent = {
      ...studentData,
      rollNo: parseInt(rollNo)
    };
    
    studentsData[index] = updatedStudent;
    return updatedStudent;
  },

  // Delete student
  deleteStudent: async (rollNo) => {
    await delay(150); // Reduced delay
    console.log(`Mock API: Deleting student with rollNo: ${rollNo}`);
    
    const index = studentsData.findIndex(s => s.rollNo === parseInt(rollNo));
    if (index === -1) {
      throw new Error('Student not found');
    }

    studentsData.splice(index, 1);
    return { message: 'Student deleted successfully' };
  },
};

export default studentApi;

/* === MIGRATION INSTRUCTIONS ===
When your Spring Boot backend is ready:

1. Uncomment the real API implementation above
2. Comment out or delete the mock implementation
3. Remove the mockStudents.js file
4. Update the export to use the real studentApi

No changes needed in any React components - they're already wired for the real endpoints!
*/