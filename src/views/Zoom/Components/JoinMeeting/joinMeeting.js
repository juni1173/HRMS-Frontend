import React from 'react'
import jwt from 'jsonwebtoken'
import { Button, Card, CardBody, Label, Row, Col } from 'reactstrap'

const generateJoinUrl = (meetingId, userName, userEmail, pass) => {
  // Define JWT payload with user information
  const payload = {
    iss: 'wXCGLC6OQVyFn0wwj64zqA',  // Your Zoom API key
    exp: Math.floor(Date.now() / 1000) + (60 * 5),  // Token expiration time (5 minutes from now)
    name: userName,
    email: userEmail,
    password: pass
  }

  // Generate JWT token
  const token = jwt.sign(payload, '74EmdEf1g9Rbj2Q3pR28LK7C8SjCPrVf', { algorithm: 'HS256' })  // Your Zoom API secret

  // Construct join URL with JWT token and meeting ID
  return `https://us05web.zoom.us/j/${meetingId}?jwt=${token}&pwd=${pass}`
}

const JoinMeeting = ({meetingId, userName, userEmail, pass, host, startUrl}) => {
  // Example meeting details

  const joinUrl = generateJoinUrl(meetingId, userName, userEmail, pass)

  const handleJoinMeeting = () => {
    window.open(joinUrl, '_blank') // Open the join URL in a new tab
  }

    
  const handleStartMeeting = () => {
    window.open(startUrl, '_blank') // Open the join URL in a new tab
  }

  return (
    <div>
        <Row>
            <Col md='6'>
                <Label>Meeting#: </Label>
                <b>{meetingId}</b>
            </Col>
            <Col md='6'>
                <Label>Password: </Label>
                <b>{pass}</b>
            </Col>
        </Row>
        <Card>
            <CardBody className='text-center'>
            
            {host === userEmail ? (
                <Button onClick={handleStartMeeting} className='btn btn-success text-center'>Start Zoom Meeting</Button>
            ) : (
                <Button onClick={handleJoinMeeting} className='btn btn-success text-center'>Join Zoom Meeting</Button>
            )}
            </CardBody>
        </Card>
      
      
    </div>
  )
}

export default JoinMeeting
