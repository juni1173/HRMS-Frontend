import React from 'react'
import jwt from 'jsonwebtoken'
import { Button } from 'reactstrap'

const generateJoinUrl = (meetingId, userName, userEmail, pass) => {
  // Define JWT payload with user information
  const payload = {
    iss: 'wXCGLC6OQVyFn0wwj64zqA',  // Your Zoom API key
    exp: Math.floor(Date.now() / 1000) + (60 * 5),  // Token expiration time (5 minutes from now)
    name: userName,
    email: userEmail,
    password: pass
  }
console.warn(userName)
console.warn(payload.name)
  // Generate JWT token
  const token = jwt.sign(payload, '74EmdEf1g9Rbj2Q3pR28LK7C8SjCPrVf')  // Your Zoom API secret

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
      <h2>Meeting</h2>
      {host === userEmail ? (
        <Button onClick={handleStartMeeting} className='btn btn-success'>Start Zoom Meeting</Button>
      ) : (
        <Button onClick={handleJoinMeeting} className='btn btn-success'>Join Zoom Meeting</Button>
      )}
      
    </div>
  )
}

export default JoinMeeting
