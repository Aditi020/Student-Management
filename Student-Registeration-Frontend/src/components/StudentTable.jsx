import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Eye, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import '../styles/components/Table.css';

const StudentTable = ({ onDeleteStudent }) => {
  const navigate = useNavigate();
  const {
    students,
    searchQuery,
    sortField,
    sortOrder,
    currentPage,
    studentsPerPage,
    setSort,
    setCurrentPage,
    darkMode,
  } = useStudent();

  // Filter and sort students
  const filteredAndSortedStudents = useMemo(() => {
    let filtered = students.filter(student =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNo.toString().includes(searchQuery)
    );

    // Sort students
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [students, searchQuery, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedStudents.length / studentsPerPage);
  const startIndex = (currentPage - 1) * studentsPerPage;
  const endIndex = startIndex + studentsPerPage;
  const currentStudents = filteredAndSortedStudents.slice(startIndex, endIndex);

  // Handle sort
  const handleSort = (field) => {
    const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSort(field, newOrder);
  };

  // Get sort icon
  const getSortIcon = (field) => {
    if (sortField !== field) return <ArrowUpDown className="sort-icon" />;
    return sortOrder === 'asc' ? 
      <ArrowUp className="sort-icon active" /> : 
      <ArrowDown className="sort-icon active" />;
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className={`table-wrapper ${darkMode ? 'dark' : ''}`}>
      {/* Table */}
      <div className="table-container">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th
                className="table-header-cell sortable"
                onClick={() => handleSort('rollNo')}
              >
                <div className="header-content">
                  <span>Roll No</span>
                  {getSortIcon('rollNo')}
                </div>
              </th>
              <th
                className="table-header-cell sortable"
                onClick={() => handleSort('name')}
              >
                <div className="header-content">
                  <span>Name</span>
                  {getSortIcon('name')}
                </div>
              </th>
              <th className="table-header-cell">Class</th>
              <th className="table-header-cell">Phone</th>
              <th className="table-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {currentStudents.length > 0 ? (
              currentStudents.map((student) => (
                <tr
                  key={student.rollNo}
                  className="table-row"
                  onClick={() => navigate(`/student/${student.rollNo}`)}
                >
                  <td className="table-cell font-medium">
                    {student.rollNo}
                  </td>
                  <td className="table-cell">
                    {student.name}
                  </td>
                  <td className="table-cell">
                    {student.className}
                  </td>
                  <td className="table-cell">
                    {student.phone}
                  </td>
                  <td className="table-cell">
                    <div className="action-buttons">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/student/${student.rollNo}`);
                        }}
                        className="action-btn view"
                        title="View Details"
                      >
                        <Eye className="action-icon" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/student/${student.rollNo}/edit`);
                        }}
                        className="action-btn edit"
                        title="Edit Student"
                      >
                        <Edit className="action-icon" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteStudent(student.rollNo);
                        }}
                        className="action-btn delete"
                        title="Delete Student"
                      >
                        <Trash2 className="action-icon" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="table-cell empty-state">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <div className="pagination-info">
            <span>
              Showing {startIndex + 1} to {Math.min(endIndex, filteredAndSortedStudents.length)} of{' '}
              {filteredAndSortedStudents.length} results
            </span>
          </div>
          <div className="pagination-controls">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentTable;