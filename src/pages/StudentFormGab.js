import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Table, Alert } from 'react-bootstrap';
 
function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    dob: '',
    course: ''
  });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
 
  const fetchStudents = async (page = 1, limit = 100) => {
    try {
      const response = await axios.get(`https://api.barcelos.dev/lasalle-student/?page=${page}&limit=${limit}`);
      console.log('Students fetched:', response.data);
      setStudents(response.data.students);
    } catch (error) {
      console.error('Error fetching students:', error);
      setAlert({ type: 'danger', message: 'Error fetching student list. Please try again.' });
    }
  };
 
  useEffect(() => {
    fetchStudents();
  }, []);
 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
 
    try {
        const response = await axios.post('/lasalle-student/', formData);
        setAlert({ type: 'success', message: 'Student created successfully!' });
        fetchStudents();
        setFormData({ name: '', surname: '', dob: '', course: '' });
      } catch (error) {
        console.error('Error message:', error.message);
        console.error('Error response:', error.response ? error.response.data : 'No response');
       
        setAlert({ type: 'danger', message: 'Error creating student. Please try again.' });
      }
    };
 
  const validateForm = (data) => {
    const errors = {};
    if (!data.name) errors.name = 'Name is required';
    if (!data.surname) errors.surname = 'Surname is required';
    if (!data.dob) errors.dob = 'Date of birth is required';
    if (!data.course) errors.course = 'Course is required';
    return errors;
  };
 
  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">LaSalle Students</h1>
      {alert && <Alert variant={alert.type}>{alert.message}</Alert>}
      <Row>
        <Col md={6}>
          <h3>Add Student</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter First Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                isInvalid={errors.name}
              />
              <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
            </Form.Group>
           
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Last Name"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                isInvalid={errors.surname}
              />
              <Form.Control.Feedback type="invalid">{errors.surname}</Form.Control.Feedback>
            </Form.Group>
 
            <Form.Group className="mb-3">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                isInvalid={errors.dob}
              />
              <Form.Control.Feedback type="invalid">{errors.dob}</Form.Control.Feedback>
            </Form.Group>
 
            <Form.Group className="mb-3">
              <Form.Label>Course</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter course"
                name="course"
                value={formData.course}
                onChange={handleChange}
                isInvalid={errors.course}
              />
              <Form.Control.Feedback type="invalid">{errors.course}</Form.Control.Feedback>
            </Form.Group>
 
            <Button variant="primary" type="submit">
              Add Student
            </Button>
          </Form>
        </Col>
 
        <Col md={6}>
          <h3>Student List</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Surname</th>
                <th>DOB</th>
                <th>Course</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{student.name}</td>
                    <td>{student.surname}</td>
                    <td>{new Date(student.dob).toLocaleDateString()}</td>
                    <td>{student.course}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}
 
export default App;