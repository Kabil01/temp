import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa'; // Import the delete icon
import './css/modal.css';

function CampDetailsForm() {
  const [eventDate, setEventDate] = useState('');
  const handleDateChange = (e) => {
    setEventDate(e.target.value);
  };
  const [formData, setFormData] = useState({
    unitNumber: '',
    campSiteName: '',
    numberOfDays: '',
    campSchedule: [],
  });

  const handleEventChange = (dayIndex, eventIndex, field, value) => {
    const updatedSchedule = [...formData.campSchedule];
    const updatedEvent = { ...updatedSchedule[dayIndex].events[eventIndex] };
  
    // Update the specified field with the provided value
    updatedEvent[field] = value;
  
    // Preserve the existing value of the date field
    if (field !== 'date') {
      updatedEvent.date = updatedSchedule[dayIndex].events[eventIndex].date;
    }
  
    // Update the event object in the schedule
    updatedSchedule[dayIndex].events[eventIndex] = updatedEvent;
  
    // Update the formData state
    setFormData({ ...formData, campSchedule: updatedSchedule });
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddDaysAndEvents = () => {
    const { numberOfDays } = formData;
    const newCampSchedule = [];
    for (let i = 0; i < numberOfDays; i++) {
      newCampSchedule.push({
        day: `Day ${i + 1}`,
        events: [{ date: '', time: '', eventName: '', content: '' }], // Include date field for each event
      });
    }
    setFormData({ ...formData, campSchedule: newCampSchedule });
  };

  const handleRemoveDay = (dayIndex) => {
    const updatedSchedule = [...formData.campSchedule];
    updatedSchedule.splice(dayIndex, 1);
    setFormData({ ...formData, campSchedule: updatedSchedule });
  };

  const handleRemoveEvent = (dayIndex, eventIndex) => {
    const updatedSchedule = [...formData.campSchedule];
    updatedSchedule[dayIndex].events.splice(eventIndex, 1);
    setFormData({ ...formData, campSchedule: updatedSchedule });
  };

  const handleAddEvent = (dayIndex) => {
    const updatedSchedule = [...formData.campSchedule];
    updatedSchedule[dayIndex].events.push({ 
      date: '', // Add date field
      time: '', 
      eventName: '', 
      content: '' 
    });
    setFormData({ ...formData, campSchedule: updatedSchedule });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Form Data:", formData); // Log the form data before sending the request
      const response = await fetch('http://localhost:5000/insertCampDetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
  
      // Check if the response indicates success
      if (response.ok) {
        window.alert('Camp details inserted successfully');
        setFormData({
          unitNumber: '',
          campSiteName: '',
          numberOfDays: '',
          campSchedule: [],
        });
      } else {
        window.alert('Failed to insert camp details. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      window.alert('An error occurred. Please try again later.');
    }
  };

  return (
    <section>
      <div className='containerinpading'>
        <div className="containerin">
          <h1>Add Camp Details</h1>
          <form onSubmit={handleSubmit}>
            <div className="form first">
              <div className="details personal">
                <span className='title'>Enter Camp Details</span>

                <div className="fields">
                  <div className="input-field">
                    <label htmlFor="unitNumber">NSS Unit Number:</label>
                    <input
                      type="text"
                      id="unitNumber"
                      name="unitNumber"
                      value={formData.unitNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="input-field">
                    <label htmlFor="campSiteName">Camp Site Name:</label>
                    <input
                      type="text"
                      id="campSiteName"
                      name="campSiteName"
                      value={formData.campSiteName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="input-field">
                    <label htmlFor="numberOfDays">Number of Days:</label>
                    <input
                      type="number"
                      id="numberOfDays"
                      name="numberOfDays"
                      value={formData.numberOfDays}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <button type="button" onClick={handleAddDaysAndEvents}>
                    Add Days and Events
                  </button>
                  <button type="submit">Insert</button>
                </div>
              </div>
            </div>
            {formData.campSchedule.map((day, dayIndex) => (
              <div key={dayIndex}>
                <h3>{day.day}</h3>
                <button type="button" onClick={() => handleRemoveDay(dayIndex)}>
                  Remove Day
                </button>
                <button type="button" onClick={() => handleAddEvent(dayIndex)}>
                  Add Event
                </button>
                <div className="event-container">
                  {day.events.map((event, eventIndex) => (
                    <div key={eventIndex}>
                       <h4>Event {eventIndex + 1}</h4>
                      <div className="button-container">
                     
                      
                      <button className='delete-button'
                        type="button"
                        onClick={() => handleRemoveEvent(dayIndex, eventIndex)}
                      >
                        <FaTrash  className='icon'/> {/* Delete icon */}
                      </button>
                      </div>
                      <div className="fields">
                        <div className="input-field">
                          <label htmlFor={`date-${dayIndex}-${eventIndex}`}>Date:</label>
                          <input
                            type="date"
                            id={`date-${dayIndex}-${eventIndex}`}
                            value={event.date}
                            onChange={(e) => handleEventChange(dayIndex, eventIndex, 'date', e.target.value)}
                          />
                        </div>
                        <div className="input-field">
                          <label>{`Time:`}</label>
                          <input
                            type="time"
                            value={event.time}
                            onChange={(e) => handleEventChange(dayIndex, eventIndex, 'time', e.target.value)}
                          />
                        </div>
                        <div className="input-field">
                          <label>{`Event Name:`}</label>
                          <input
                            type="text"
                            value={event.eventName}
                            onChange={(e) => handleEventChange(dayIndex, eventIndex, 'eventName', e.target.value)}
                          />
                        </div>
                        <div className="input-field">
                          <label>{`Content`}</label>
                          <textarea
                            value={event.content}
                            onChange={(e) => handleEventChange(dayIndex, eventIndex, 'content', e.target.value)}
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </form>
        </div>
      </div>
    </section>
  );
}

export default CampDetailsForm;
