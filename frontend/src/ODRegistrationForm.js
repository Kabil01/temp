import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { Docxtemplater } from 'docxtemplater';
import * as XLSX from 'xlsx'; // Import XLSX library for Excel file parsing
import { IoPersonAdd } from "react-icons/io5";



const ODRegistrationForm = () => {
    const [odRegistrations, setODRegistrations] = useState([]);
    const [formData, setFormData] = useState({
        unitNumber: '',
        eventName: '',
        fromDate: '',
        toDate: '',
        reason: '',
        studentsList: [],
        newStudent: {
            rollNumber: '',
            name: '',
            dept: '',
            academicYearFrom: '',
            academicYearTo: ''
        }
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/downloadODRegistrations');
            setODRegistrations(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddStudent = () => {
        setFormData({
            ...formData,
            studentsList: [...formData.studentsList, formData.newStudent],
            newStudent: {
                rollNumber: '',
                name: '',
                dept: '',
                academicYearFrom: '',
                academicYearTo: ''
            }
        });
    };

    const handleDeleteStudent = (index) => {
        const updatedStudentsList = [...formData.studentsList];
        updatedStudentsList.splice(index, 1); // Remove the student at the specified index
        setFormData({ ...formData, studentsList: updatedStudentsList });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            alert('OD registered successfully');
            setFormData({
                unitNumber: '',
                eventName: '',
                fromDate: '',
                toDate: '',
                reason: '',
                studentsList: [],
                newStudent: {
                    rollNumber: '',
                    name: '',
                    dept: '',
                    academicYearFrom: '',
                    academicYearTo: ''
                }
            });
            fetchData();

        } catch (error) {
            console.error('Error:', error);
            alert('Failed to register OD');
        }

    };

    const handleDownloadEvent = async (eventId) => {
        try {
            const response = await axios.get('http://localhost:5000/downloadEvent/${eventId}', {
                responseType: 'blob'
            });
    
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'EventDetails.pdf'); // Changed filename to PDF
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Error downloading event data:', error);
            alert('Failed to download event data');
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        const confirmUpload = window.confirm("Are you sure you want to upload this file? Please ensure that the Excel file follows the required format.");
    
        reader.onload = async (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
    
            // Find the range of the sheet containing data
            const range = XLSX.utils.decode_range(sheet['!ref']);
            const lastRow = range.e.r; // Get the index of the last row with data
            range.e.r = lastRow; // Set the end row to the last row with data
            sheet['!ref'] = XLSX.utils.encode_range(range); // Update the sheet range
    
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    
            // Filter out empty rows
            const filteredData = jsonData.filter(row => row.some(cell => cell !== null && cell !== ''));
    
            const studentsData = filteredData.slice(1).map(row => ({
                rollNumber: row[1],
                name: row[2],
                dept: row[3],
                academicYearFrom: '', // You may need to add this field if it's required
                academicYearTo: '' // You may need to add this field if it's required
            }));
            setFormData({ ...formData, studentsList: [...formData.studentsList, ...studentsData] });
        };
    
        reader.readAsArrayBuffer(file);
    };
    
  


    return (
        <section className="od-registration-form">
            <div className="containerinpadding">
                <div className="containerin">
                    <h2>OD Registration Form</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form first">
                            <div className="details personal">
                                <span className="title">Enter OD Details</span>

                                <div className="fields">
                                    <div className="input-field">
                                        <label htmlFor="unitNumber">Unit Number:</label>
                                        <input type="text" id="unitNumber" name="unitNumber" placeholder="Enter Unit Number" value={formData.unitNumber} onChange={handleChange} required />
                                    </div>

                                    <div className="input-field">
                                        <label htmlFor="eventName">Event Name:</label>
                                        <input type="text" id="eventName" name="eventName" placeholder="Enter Event Name" value={formData.eventName} onChange={handleChange} required />
                                    </div>

                                    <div className="input-field">
                                        <label htmlFor="fromDate">From Date:</label>
                                        <input type="date" id="fromDate" name="fromDate" value={formData.fromDate} onChange={handleChange} required />
                                    </div>

                                    <div className="input-field">
                                        <label htmlFor="toDate">To Date:</label>
                                        <input type="date" id="toDate" name="toDate" value={formData.toDate} onChange={handleChange} required />
                                    </div>

                                    <div className="input-field">
                                        <label htmlFor="reason">Reason:</label>
                                        <textarea id="reason" name="reason" placeholder="Enter Reason" value={formData.reason} onChange={handleChange} required></textarea>
                                    </div>
                                </div>

                                <div className='fields'>

                                    <div className="input-field">
                                        <label htmlFor="rollNumber">Roll Number:</label>
                                        <input type="text" id="rollNumber" name="rollNumber" placeholder="Enter Roll Number" value={formData.newStudent.rollNumber} onChange={(e) => setFormData({ ...formData, newStudent: { ...formData.newStudent, rollNumber: e.target.value } })} />
                                    </div>

                                    <div className="input-field">
                                        <label htmlFor="name">Name:</label>
                                        <input type="text" id="name" name="name" placeholder="Enter Name" value={formData.newStudent.name} onChange={(e) => setFormData({ ...formData, newStudent: { ...formData.newStudent, name: e.target.value } })} />
                                    </div>

                                    <div className="input-field">
                                        <label htmlFor="dept">Department:</label>
                                        <input type="text" id="dept" name="dept" placeholder="Enter Department" value={formData.newStudent.dept} onChange={(e) => setFormData({ ...formData, newStudent: { ...formData.newStudent, dept: e.target.value } })} />
                                    </div>

                                    <div className="input-field">
                                        <label htmlFor="academicYearFrom">Academic Year From:</label>
                                        <input type="text" id="academicYearFrom" name="academicYearFrom" placeholder="Enter Academic Year From" value={formData.newStudent.academicYearFrom} onChange={(e) => setFormData({ ...formData, newStudent: { ...formData.newStudent, academicYearFrom: e.target.value } })} />
                                    </div>

                                    <div className="input-field">
                                        <label htmlFor="academicYearTo">Academic Year To:</label>
                                        <input type="text" id="academicYearTo" name="academicYearTo" placeholder="Enter Academic Year To" value={formData.newStudent.academicYearTo} onChange={(e) => setFormData({ ...formData, newStudent: { ...formData.newStudent, academicYearTo: e.target.value } })} />
                                    </div>

                                    <button type="button" onClick={handleAddStudent}>Add Student&nbsp;&nbsp;<IoPersonAdd /></button>


                                </div>
                                <div className="fields">
                                <div className="input-field">
                                        <label htmlFor="file">Upload Excel File:</label>
                                        <input type="file" id="file" accept=".xlsx,.xls" onChange={handleFileUpload} />

                                    </div>
                                    
                                    <button type="submit">Submit</button>
                                    
                                    <p className="file-upload-instructions">Please ensure that the Excel file follows the format where the first row contains the Serial Number, the second row contains the Name, the third row contains the Roll Number, and the fourth row contains the Department.</p>

                                    <table>
                                        <thead>
                                            <tr>
                                                <th>S.No</th>
                                                <th>Name</th>
                                                <th>Roll Number</th>
                                                <th>Dept</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {formData.studentsList.map((student, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{student.name}</td>
                                                    <td>{student.rollNumber}</td>
                                                    <td>{student.dept}</td>
                                                    <td>
                                                        <button type="button" onClick={() => handleDeleteStudent(index)}>Delete</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                       
                    </form>
                    
                    <div className="containerinpadding">
                        <div className="containerin">
                            <h2>OD Registrations</h2>
                            <div className="fields">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Unit Number</th>
                                            <th>Event Name</th>
                                            <th>From Date</th>
                                            <th>To Date</th>
                                            <th>Download</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                          {odRegistrations.map((registration, index) => (
                                              <tr key={index}>
                                                  <td>{registration.unitNumber}</td>
                                                  <td>{registration.eventName}</td>
                                                  <td>{registration.fromDate}</td>
                                                  <td>{registration.toDate}</td>
                                                  <td>
                                                      <button onClick={() => handleDownloadEvent(registration._id)}>Download</button>
                                                  </td>
                                              </tr>
                                          ))}
                                      </tbody>

                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ODRegistrationForm;
