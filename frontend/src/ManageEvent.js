import React, { useState, useEffect } from "react";
import axios from "axios";
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import { MdDelete } from "react-icons/md";
import { FaArrowAltCircleUp, FaArrowAltCircleDown } from "react-icons/fa";
import { IoIosCloseCircleOutline } from "react-icons/io";


function ManageEvent() {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");
  const [allImage, setAllImage] = useState([]);
  const [submissionStatus, setSubmissionStatus] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [deletePopup, setDeletePopup] = useState(false);
  const [priorityPopup, setPriorityPopup] = useState(false);
  const [lowPriorityPopup, setLowPriorityPopup] = useState(false);

  useEffect(() => {
    getImage();
  }, []); 

  const submitImage = async (e) => {
    e.preventDefault();
    setSubmissionStatus("Submitting...");
    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("date", date);
    formData.append("content", content);
    formData.append("priority", 1); // Default priority level

    try {
      const result = await axios.post(
        "http://localhost:5000/upload-image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(result.data);
      // Wait for a short time to allow the server to process the image
      await new Promise(resolve => setTimeout(resolve, 2000));
      getImage();
      setSubmissionStatus("");
      setPopupMessage("Image submitted successfully!");
      // Automatically clear popup message after 2 seconds
      setTimeout(() => {
        setPopupMessage("");
      }, 1000);
      // Refresh images after upload
    } catch (error) {
      setSubmissionStatus("");
      setPopupMessage("Error uploading image.");
      console.error("Error uploading image:", error);
    }
  };

  const onInputChange = (e) => {
    setImage(e.target.files[0]);
  };

  const getImage = async () => {
    try {
      const result = await axios.get("http://localhost:5000/get-image");
      setAllImage(result.data.data);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const prioritizeImage = async (index) => {
    const imageId = allImage[index]._id;
    try {
      await axios.put(`http://localhost:5000/prioritize-image/${imageId}`);
      getImage(); // Refresh images after prioritization
      setPriorityPopup(true);
    } catch (error) {
      console.error("Error prioritizing image:", error);
    }
  };

  const reducePriority = async (index) => {
    const imageId = allImage[index]._id;
    try {
      await axios.put(`http://localhost:5000/reduce-priority/${imageId}`);
      getImage(); // Refresh images after reducing priority
      setLowPriorityPopup(true);
    } catch (error) {
      console.error("Error reducing priority:", error);
    }
  };

  const deleteImage = async (index) => {
    const imageId = allImage[index]._id;
    try {
      await axios.delete(`http://localhost:5000/delete-image/${imageId}`);
      getImage(); // Refresh images after deletion
      setDeletePopup(true);
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  // Automatic clearing of popup messages after 2 seconds
  useEffect(() => {
    const clearPopups = () => {
      setTimeout(() => {
        setDeletePopup(false);
        setPriorityPopup(false);
        setLowPriorityPopup(false);
      }, 2000);
    };

    clearPopups();
  }, [deletePopup, priorityPopup, lowPriorityPopup]);

  return (
    <div>
      <div className="containerinpading">
        <div className="containerin">
          <h1>Add Event Gallery Details</h1>
          <form onSubmit={submitImage} className="form">
            <div className="form first">
              <div className="details personal">
                <span className='title'>Enter Image Details</span>
                <div className="fields">
                  <div className="input-field">
                    <label htmlFor="title">Event Title:</label>
                    <input type="text" id="title" placeholder="Event Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                  </div>
                  <div className="input-field">
                    <label htmlFor="date">Event Date:</label>
                    <input type="date" id="date" placeholder="Event Date" value={date} onChange={(e) => setDate(e.target.value)} />
                  </div>
                  <div className="input-field">
                    <label htmlFor="image">Image:</label>
                    <input type="file" accept="image/*" id="image" onChange={onInputChange} />
                  </div>
                </div>
                <div className="input-field">
                  <label htmlFor="content">Event Content:</label>
                  <textarea id="content" placeholder="Event Content" value={content} onChange={(e) => setContent(e.target.value)} />
                </div>
                <button type="submit">{submissionStatus ? submissionStatus : "Submit"}</button>
                {popupMessage && <p className="popup-message">{popupMessage}</p>}
              </div>
            </div>
          </form>
        </div>
      </div>
      <div style={{ display: 'block', width: '90%', margin: 'auto', marginTop: '50px' }}>
        <h4>Image Carousel</h4>
        {allImage.length > 0 ? (
          <Carousel style={{ width: '800px', height: '400px' }}>
            {allImage.map((data, index) => (
              <Carousel.Item key={index}>
                <img
                  className="d-block w-100"
                  src={require(`./images/${data.image}`)}
                  alt={`Slide ${index + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <Carousel.Caption>
                  <h3>{data.title}</h3>
                  <p>Date: {new Date(data.date).toLocaleDateString()}</p>
                  <div className="button-container">
                    <button className="edit-button" onClick={() => prioritizeImage(index)}>
                      <FaArrowAltCircleUp className="icon" />
                    </button>
                    <button className="low-button" onClick={() => reducePriority(index)}>
                      <FaArrowAltCircleDown className="icon" />
                    </button>
                    <button className="delete-button" onClick={() => deleteImage(index)}>
                      <MdDelete className="icon" />
                    </button>
                  </div>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        ) : (
          <div className="containerinpading">
            <div className="container">
              <form>
                <span className="title">No images in database.</span>
              </form>
            </div>
          </div>
        )}
      </div>
      {/* Popups */}
      {deletePopup && (
        <div className="popup">
          <p>Image deleted successfully!</p>
          <button className="event-button" onClick={() => setDeletePopup(false)}><IoIosCloseCircleOutline className="icon-cir"/></button>
        </div>
      )}
      {priorityPopup && (
        <div className="popup">
          <p>Image prioritized successfully!</p>
          <button className="event-button" onClick={() => setPriorityPopup(false)}><IoIosCloseCircleOutline className="icon-cir" /></button>
        </div>
      )}
      {lowPriorityPopup && (
        <div className="popup">
          <p>Priority reduced successfully!</p>
          <button className="event-button" onClick={() => setLowPriorityPopup(false)}><IoIosCloseCircleOutline className="icon-cir"/></button>
        </div>
      )}
    </div>
  );
}
export default ManageEvent;
