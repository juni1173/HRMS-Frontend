import React from 'react'
import JoinMeeting from './join'
import { Row, Col } from 'reactstrap'
import {useParams} from "react-router-dom" 
const index = () => {
  
  const { id, pass, token, role } = useParams()
    const payload = {
        meetingNumber: id,
        role,
        sdkKey: 'wXCGLC6OQVyFn0wwj64zqA',
        sdkSecret: '74EmdEf1g9Rbj2Q3pR28LK7C8SjCPrVf',
        passWord: pass,
        userName: 'Muhammad Junaid',
        userEmail: '',
        leaveUrl: 'http://localhost:3000/zoom',
        Token: role === 0 !== '' ? token : ''
    }
  return (
    <div> {/* Set the container's height to 100% */}
       <Row>
        <Col md='12'>
          <JoinMeeting payload={payload}/>
        </Col>
       </Row>
       
      
    </div>
    
  )
}

export default index