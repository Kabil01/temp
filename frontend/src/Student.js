import React, { useState, useEffect } from 'react';
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { IoPersonAdd } from "react-icons/io5";
import { IoIosCloseCircle } from "react-icons/io";


function Student() {
  const [students, setStudents] = useState([]);
  const [sortCriteria, setSortCriteria] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('');
  const [searchTermName, setSearchTermName] = useState('');
  const [searchTermRollNumber, setSearchTermRollNumber] = useState('');
  const [searchTermBloodGroup, setSearchTermBloodGroup] = useState('');
  const [searchTermNssUnitNumber, setSearchTermNssUnitNumber] = useState('');
  const [searchTermFromYear, setSearchTermFromYear] = useState('');
  const [searchTermToYear, setSearchTermToYear] = useState('');
  const [searchTermContactNumber, setSearchTermContactNumber] = useState('');
  const [searchTermEmail, setSearchTermEmail] = useState('');
  const [searchTermDateOfBirth, setSearchTermDateOfBirth] = useState(''); // Define searchTermDateOfBirth state



  const [formData, setFormData] = useState({
    roll_number: '',
    name: '',
    nss_unit_number: '1',
    from_year: '',
    to_year: '',
    contact_number: '',
    email: '',
    dateofbirth:'',
    blood_group:'',
  });
  const [popupMessage, setPopupMessage] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false); // State variable to manage popup visibility

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    const searchResults = students.filter(student => {
      const nameMatch = student.name && student.name.toLowerCase().includes(searchTermName.toLowerCase());
      const rollNumberMatch = student.roll_number && student.roll_number.toLowerCase().includes(searchTermRollNumber.toLowerCase());
      const bloodGroupMatch = student.blood_group && student.blood_group.toLowerCase().includes(searchTermBloodGroup.toLowerCase());
      const nssUnitNumberMatch = student.nss_unit_number && student.nss_unit_number.toString().toLowerCase().includes(searchTermNssUnitNumber.toLowerCase());
      const fromYearMatch = student.from_year && student.from_year.toString().toLowerCase().includes(searchTermFromYear.toLowerCase());
      const toYearMatch = student.to_year && student.to_year.toString().toLowerCase().includes(searchTermToYear.toLowerCase());
      const contactNumberMatch = student.contact_number && student.contact_number.toLowerCase().includes(searchTermContactNumber.toLowerCase());
      const emailMatch = student.email && student.email.toLowerCase().includes(searchTermEmail.toLowerCase());
  
      return (
        nameMatch &&
        rollNumberMatch &&
        bloodGroupMatch &&
        nssUnitNumberMatch &&
        fromYearMatch &&
        toYearMatch &&
        contactNumberMatch &&
        emailMatch
      );
    });
    setFilteredStudents(searchResults);
  }, [searchTermName, searchTermRollNumber, searchTermBloodGroup, searchTermNssUnitNumber, searchTermFromYear, searchTermToYear, searchTermContactNumber, searchTermEmail, students]);
  
  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:5000/read');
      const data = await response.json();
      // Format dateofbirth to display only the date without time zone
      const formattedStudents = data.map(student => ({
        ...student,
        dateofbirth: new Date(student.dateofbirth).toLocaleDateString(),
      }));
      setStudents(formattedStudents);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
  };

  const handleSort = (criteria) => {
    console.log('Sorting criteria:', criteria);
  console.log('Current sort criteria:', sortCriteria);
  console.log('Current sort order:', sortOrder);
    // Toggle sort order if same criteria selected
    if (criteria === sortCriteria) {
      console.log('Toggling sort order');
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      console.log('Setting new sort criteria and order');
      // Default to ascending order if different criteria selected
      setSortCriteria(criteria);
      setSortOrder('asc');
    }
  };

  const sortedStudents = filteredStudents.sort((a, b) => {
    let comparison = 0;
    
    if (sortCriteria === 'roll_number') {
      comparison = parseInt(a.roll_number) - parseInt(b.roll_number);
    } else if (sortCriteria === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortCriteria === 'nss_unit_number') {
      comparison = parseInt(a.nss_unit_number) - parseInt(b.nss_unit_number);
    } else if (sortCriteria === 'blood_group') {
      if (a.blood_group && b.blood_group) {
        comparison = a.blood_group.localeCompare(b.blood_group);
      }
    } else if (sortCriteria === 'from_year') {
      comparison = parseInt(a.from_year) - parseInt(b.from_year);
    } else if (sortCriteria === 'to_year') {
      comparison = parseInt(a.to_year) - parseInt(b.to_year);
    } else if (sortCriteria === 'contact_number') {
      comparison = a.contact_number.localeCompare(b.contact_number);
    } else if (sortCriteria === 'email') {
      comparison = a.email.localeCompare(b.email);
    } else if (sortCriteria === 'dateofbirth') {
      // Check if both dates are defined
      if (a.dateofbirth && b.dateofbirth) {
        comparison = new Date(a.dateofbirth) - new Date(b.dateofbirth);
      }
    }
  
    // Apply sortOrder
    return sortOrder === 'asc' ? comparison : -comparison;
  });
  
  console.log('Sorted students:', sortedStudents);
  
  

 
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/insert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      setPopupMessage(data.msg);
      fetchStudents();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  
  const handleUpdate = async (event) => {
    console.log('Updating student:', formData);
    try {
      const response = await fetch('http://localhost:5000/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      console.log('Update response:', data);
      setPopupMessage(data.msg);
      fetchStudents();
      setEditModalVisible(false); // Close the edit modal after update
    } catch (error) {
      console.error('Error:', error);
    }
  };


  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/delete/${id}`, {
        method: 'DELETE'
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete student');
      }
  
      const data = await response.json();
      setPopupMessage(data.message);
      fetchStudents();
    } catch (error) {
      setPopupMessage('Failed to delete student. Please try again.');
      console.error('Error:', error);
      
      // Handle the error (e.g., display an error message to the user)
    }
  };

  
  

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const editStudent = (student) => {
  setFormData({
    id: student._id,
    roll_number: student.roll_number,
    name: student.name,
    nss_unit_number: student.nss_unit_number,
    from_year: student.from_year,
    to_year: student.to_year,
    contact_number: student.contact_number,
    email: student.email,
    dateofbirth: student.dateofbirth,
    blood_group:student.blood_group,
  });
  setEditModalVisible(true); // Set edit modal visibility to true
};

  const closeEditModal = () => {
    setEditModalVisible(false);
  };


  return (
    <section>
    <div className='containerinpading'>
      <div className="containerin ">
      <h1>Add Student Details</h1>
      <form onSubmit={handleSubmit}>
        <div className="form first">
          <div className="details personal">
            <span className='title'>Enter Profile Details</span>

            <div className="fields">
              <div className="input-field">
                <label htmlFor="roll_number">Roll Number:</label>
                <input type="text" id="roll_number" name="roll_number" placeholder='Enter Roll Number' value={formData.roll_number} onChange={handleChange} required />

              </div>
                

              <div className="input-field">
              <label htmlFor="name">Full Name:</label>
                <input type="text" id="name" name="name" placeholder="Enter Full Name" value={formData.name} onChange={handleChange} required />
              </div>

              <div className="input-field">
                <label htmlFor="date">Date of Birth:</label>
                <input type="date" id="dateofbirth" name="dateofbirth" value={formData.dateofbirth} onChange={handleChange}/>
              </div>

              <div className="input-field">
            <label htmlFor="nss_unit_number">NSS Unit Number:</label>
            <select
              id="editNssUnitNumber"
              name="nss_unit_number"
              value={formData.nss_unit_number || 1}
              onChange={handleChange}
            >
              {[...Array(12).keys()].map((num) => (
                <option key={num + 1} value={num + 1}>
                  {num + 1}
                </option>
              ))}
            </select>

          </div>


              <div className="input-field">
              <label htmlFor="from_year">From Year:</label>
                <input type="number" id="from_year" name="from_year" placeholder="Enter From Year" value={formData.from_year} onChange={handleChange} required />
              </div>
              
              <div className="input-field">
                <label htmlFor="to_year">To Year:</label>
                <input type="number" id="to_year" name="to_year" placeholder="Enter To Year" value={formData.to_year} onChange={handleChange} required />
              </div>

              <div className="input-field">
                <label htmlFor="blood_group">Blood Group:</label>
                <select id="blood_group" name="blood_group" value={formData.blood_group} onChange={handleChange}>
                  <option value="A+" selected>A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
 

              <div className="input-field">
                <label htmlFor="contact_number">Contact Number:</label>
                  <input type="text" id="contact_number" name="contact_number" placeholder='Enter Contact Number' value={formData.contact_number} onChange={handleChange} />
              </div>

              <div className="input-field">
                 <label htmlFor="email">Email:</label>
                 <input type="email" id="email" name="email" placeholder='Enter Email Address' value={formData.email} onChange={handleChange} />
              </div>
              
              <button className='nextbtn'>
                
                <span className='btnText'>Insert</span>&nbsp;&nbsp;
                <IoPersonAdd />
                
                
              </button>
            </div>
          </div>
        </div>
        
        </form>
      </div>
      <div>
      <h1>Search and Display</h1>
      <div className='containerin '>
      <h2>Filters</h2 >
        <form>
        <div className='fields'>

            
          <div className='input-field'>
              <input
                type="text"
                placeholder="Search by Roll Number..."
                value={searchTermRollNumber}
                onChange={(e) => setSearchTermRollNumber(e.target.value)}
              />
          </div>


          <div className='input-field'>
            <input
              type="text"
              placeholder="Search by Name..."
              value={searchTermName}
              onChange={(e) => setSearchTermName(e.target.value)}
            />
          </div>
          

          <div className='input-field'>
          <select
            value={searchTermNssUnitNumber}
            onChange={(e) => setSearchTermNssUnitNumber(e.target.value)}
          >
            <option value="">Select NSS Unit Number</option>
            {[...Array(12).keys()].map(num => (
              <option key={num + 1} value={num + 1}>{num + 1}</option>
            ))}
          </select>
        </div>

        <div className='input-field'>
          <select
    value={searchTermBloodGroup}
        onChange={(e) => setSearchTermBloodGroup(e.target.value)}
      >
        <option value="">All Blood Groups</option>
        <option value="A+">A+</option>
        <option value="A-">A-</option>
        <option value="B+">B+</option>
        <option value="B-">B-</option>
        <option value="AB+">AB+</option>
        <option value="AB-">AB-</option>
        <option value="O+">O+</option>
        <option value="O-">O-</option>
      </select>
          </div>


           <div className='input-field'>
            <input
              type="text"
              placeholder="Search by From Year..."
              value={searchTermFromYear}
              onChange={(e) => setSearchTermFromYear(e.target.value)}
            />
          </div>

          <div className='input-field'>
            <input
              type="text"
              placeholder="Search by To Year..."
              value={searchTermToYear}
              onChange={(e) => setSearchTermToYear(e.target.value)}
            />
          </div>

          <div className='input-field'>
            <input
              type="text"
              placeholder="Search by Contact Number..."
              value={searchTermContactNumber}
              onChange={(e) => setSearchTermContactNumber(e.target.value)}
            />
          </div>

          <div className='input-field'>
            <input
              type="text"
              placeholder="Search by Email..."
              value={searchTermEmail}
              onChange={(e) => setSearchTermEmail(e.target.value)}
            />
            </div>
          </div>
          </form>
        </div>
        
    
        <table>
        <thead>
        <tr>
              {/* Table headers with sorting functionality */}
              <th onClick={() => handleSort('roll_number')}>Roll Number</th>
              <th onClick={() => handleSort('name')}>Name</th>
              <th onClick={() => handleSort('nss_unit_number')}>NSS Unit Number</th>
              <th onClick={() => handleSort('blood_group')}>Blood Group</th>
              <th onClick={() => handleSort('from_year')}>From Year</th>
              <th onClick={() => handleSort('to_year')}>To Year</th>
              <th onClick={() => handleSort('contact_number')}>Contact Number</th>
              <th onClick={() => handleSort('email')}>Email</th>
              <th onClick={() => handleSort('dateofbirth')}>Date of Birth</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
        </thead>
        <tbody>
          {filteredStudents.map(student => (
            <tr key={student._id}>
              <td>{student.roll_number}</td>
              <td>{student.name}</td>
              <td>{student.nss_unit_number}</td>
              <td>{student.blood_group}</td>
              <td>{student.from_year}</td>
              <td>{student.to_year}</td>
              <td>{student.contact_number}</td>
              <td>{student.email}</td>
              <td>{student.dateofbirth}</td>
              
              <td>
              <button className="edit-button" onClick={() => editStudent(student)}>
              <FaRegEdit className="icon"/>
            </button>
            </td>
            <td>

            <button className="delete-button" onClick={() => handleDelete(student._id)}>
            <MdDeleteForever className="icon"/>
            </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editModalVisible && (
          <div id="editModal" className="modal" style={{ display: 'block' }}>
            <div className="modal-content">
            <span className="close" onClick={closeEditModal} style={{ float: 'right' }}><IoIosCloseCircle /></span>
              <div className="containerin ">
              <h2>Edit Student Details</h2>
              <form id="editForm" onSubmit={handleUpdate}>
              <div className="form first">
              <div className="details personal">
                <span className='title'>Student Details</span>

                <div className="fields">
                  
                <input type="hidden" name="id" value={formData.id} />

                <div className="input-field">
                <label htmlFor="roll_number">Roll Number:</label>
                <input type="text" id="editRollNumber" name="roll_number" value={formData.roll_number} onChange={handleChange} required />
                </div>

                <div className="input-field">
                <label htmlFor="name">Name:</label>
                <input type="text" id="editName" name="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="input-field">
                <label htmlFor="date">Date of Birth:</label>
                <input type="date" id="editdateofbirth" name="dateofbirth" value={formData.dateofbirth} onChange={handleChange} />
                </div>

                <div className="input-field">
                  <label htmlFor="nss_unit_number">NSS Unit Number:</label>
                  <input type="text" id="editNssUnitNumber" name="nss_unit_number" value={formData.nss_unit_number} onChange={handleChange} />
                  
                </div>

                <div className="input-field">
                <input
                  type="text"
                  placeholder="Search by Blood Group..."
                  value={searchTermBloodGroup}
                  onChange={(e) => setSearchTermBloodGroup(e.target.value)}
                />
                
              </div>

              <div className="input-field">
                <label htmlFor="from_year">From Year:</label>
                <input type="number" id="editFromYear" name="from_year" value={formData.from_year} onChange={handleChange} required />
                </div>

                <div className="input-field">
                <label htmlFor="to_year">To Year:</label>
                <input type="number" id="editToYear" name="to_year" value={formData.to_year} onChange={handleChange} required />
                </div>

                <div className="input-field">
                <label htmlFor="contact_number">Contact Number:</label>
                <input type="text" id="editContactNumber" name="contact_number" value={formData.contact_number} onChange={handleChange} />
                </div>

                <div className="input-field">
                <label htmlFor="email">Email:</label>
                <input type="email" id="editEmail" name="email" value={formData.email} onChange={handleChange} />
                </div>

                

                <button type="submit">Update</button>
                </div>
                </div>
                
                </div>
              </form>
              </div>
            </div>
          </div>
        )}
    {/* Popup message */}
    {popupMessage && <p className="popup-message">{popupMessage}</p>}

   </div>
    </div>
    </section>
   

   
  );
}

export default Student;