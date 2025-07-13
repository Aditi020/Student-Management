# Student Management System

![Application Screenshot](/Student-Management-Application.png)


A full-stack Student Management System built with React.js for the frontend and Spring Boot for the backend.

## Features

- **Create**: Add a new student.
- **Read**: View all students or a specific student based on `rollNo`.
- **Update**: Modify student details.
- **Delete**: Remove a student by `rollNo`.

## Endpoints

### Backend API Endpoints

1. **Get All Students**:  
   `GET http://localhost:8080/students`

2. **Get Student by Roll Number**:  
   `GET http://localhost:8080/student/{rollNo}`

3. **Create Student**:  
   `POST http://localhost:8080/student/add`

4. **Update Student Details**:  
   `PUT http://localhost:8080/student/update/{rollNo}`

5. **Delete Student**:  
   `DELETE http://localhost:8080/student/delete/{rollNo}`

## Backend Setup

1. Clone the repository and navigate to the backend folder.
2. Add the following dependencies to `pom.xml`:
   - Spring Data JPA
   - MySQL Connector
   - DevTools
   - Spring Web
3. Update the `application.properties` file with the MySQL database configuration:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/student_db
   spring.datasource.username=root
   spring.datasource.password=yourpassword
   spring.jpa.hibernate.ddl-auto=update

```markdown
## Run the Spring Boot application:
```bash
mvn spring-boot:run
```

## Frontend Setup
Navigate to the frontend folder and install dependencies:
```bash
npm install
```
Start the React application:
```bash
npm start
```

## Project Structure

### Backend (Spring Boot)
- **StudentController**: Handles REST API endpoints.
- **StudentService**: Contains business logic for managing students.
- **StudentRepository**: Interface for database operations.
- **Student**: Entity class representing a student.

### Frontend (React.js)
- **App.jsx**: Main component containing the UI logic.
- **index.css**: Styles for the application.

## Usage
Start the backend server:
```bash
mvn spring-boot:run
```
Start the frontend server:
```bash
npm start
```
Open `http://localhost:5173` in your browser.
Use the UI to manage student data.

## Technologies Used
- **Frontend**: React.js
- **Backend**: Spring Boot
- **Database**: MySQL
```

