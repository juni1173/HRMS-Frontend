import React, { useState } from 'react'
import { Input, Col, Row, Button } from 'reactstrap'
import axios from 'axios'

const CreateMeetingForm = ({accessToken}) => {
  const [meetingTitle, setMeetingTitle] = useState('')
  const [meetingDateTime, setMeetingDateTime] = useState('')
  // Add more state variables as needed for meeting details

  const createMeeting = async () => {
    try {
      const response = await axios.post(
        'https://api.zoom.us/v2/users/me/meetings',
        {
          topic: meetingTitle,
          start_date: meetingDateTime,
          timezone: 'Asia/Karachi'
          // Add other meeting details here
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'access-control-allow-origin': '*',
            'Content-Type': 'application/json'
          }
        }
      )
      console.log('Meeting created:', response.data)
      // Handle successful meeting creation (e.g., display success message)
    } catch (error) {
      console.error('Error creating meeting:', error.response.data)
      // Handle error (e.g., display error message)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    // Call createMeeting function to create the meeting
    createMeeting()
  }

  return (
    <div>
      <h2>Create Meeting</h2>
      <form onSubmit={handleSubmit}>
        <Row className='mb-2'>
          <Col md='4'>
            <Input
              type="text"
              id="meetingTitle"
              placeholder='Topic'
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              required
            />
          </Col>
          <Col md='4'>
            <Input
              type="datetime-local"
              id="meetingDateTime"
              placeholder='Schedule Date Time'
              value={meetingDateTime}
              onChange={(e) => setMeetingDateTime(e.target.value)}
              required
            />
          </Col>
          <Col md='4'>
            <Button type="submit" className='btn btn-primary'>Create Meeting</Button>
          </Col>
        </Row>
       
        {/* Add more input fields for meeting details as needed */}
        
      </form>
    </div>
  )
}

export default CreateMeetingForm
