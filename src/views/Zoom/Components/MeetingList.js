import React, { Fragment, useEffect, useState } from 'react'
import apiHelper from '../../Helpers/ApiHelper'
import { Table, Row, Input, Col, Button, Spinner, Modal, ModalBody, ModalHeader } from 'reactstrap'
import { Airplay, ExternalLink } from 'react-feather'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import JoinMeeting from './JoinMeeting/joinMeeting'
const MeetingList = () => {
    const Api = apiHelper()
    const MySwal = withReactContent(Swal)
    const [loading, setLoading] = useState(false)
  const [meetings, setMeetings] = useState([])
  const [meetingDetail, setMeetingDetails] = useState([])
  const [meetingTitle, setMeetingTitle] = useState('')
  const [meetingDateTime, setMeetingDateTime] = useState('')
  const [basicModal, setBasicModal] = useState(false)
  const fetchMeetings = async () => {
    setLoading(true)
    await Api.get(`/meetings/list/`).then(result => {
        if (result) {
            if (result.status === 200) {
                const data = result.data
                setMeetings(data) 
            } else {
                Api.Toast('error', result.message)
            }
        } else (
        Api.Toast('error', 'Server not responding!')   
        )
    }) 
    setTimeout(() => {
        setLoading(false)
      }, 500)
}

const joinMeeting = async (status) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: `Meeting Status is "${status}"!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Proceed!',
      customClass: {
      confirmButton: 'btn btn-primary',
      cancelButton: 'btn btn-danger ms-1'
      },
      buttonsStyling: false
  }).then(function (result) {
      if (result.value) {
            //    window.location.href = join_url
               setBasicModal(!basicModal)
              } else {
                  
              }
                      
              })
        
  }
const meetingDetails = async (id) => {
    await Api.get(`/meetings/details/${id}/`).then(result => {
        if (result) {
            if (result.status === 200) {
                const data = result.data
                setMeetingDetails(data)
               
                joinMeeting(data.status)
                
            } else {
                Api.Toast('error', result.message)
            }
        } else (
        Api.Toast('error', 'Server not responding!')   
        )
    }) 
}
  
  useEffect(() => {
    fetchMeetings()
  }, [])
  const createMeeting = async () => {
    
    if (meetingTitle !== '' && meetingDateTime !== '') {
      const formData = new FormData()
      formData['topic'] = meetingTitle
      formData['start_time'] = meetingDateTime
        await Api.jsonPost(`/meetings/create/new/`, formData).then(result => {
          if (result) {
              if (result.status === 200) {
                //   const data = result.data
                  fetchMeetings()
              } else {
                  Api.Toast('error', result.message)
              }
          } else (
          Api.Toast('error', 'Server not responding!')   
          )
      }) 
    } else {
      Api.Toast('error', 'All fields are required!')
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    // Call createMeeting function to create the meeting
    createMeeting()
  }

  return (
    <Fragment>
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
        {!loading ? (
            <div className="meeting-list">
            <Table responsive bordered striped>
                            <thead className='table-dark text-center'>
                                <tr>
                                    <th>Meeting ID</th>
                                    <th>Topic</th>
                                    <th>Start Time</th>
                                    {/* <th>Join Url</th> */}
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.values(meetings).length > 0 ? (
                                        meetings.slice().reverse().map(meeting => (
                                            <tr key={meeting.id}>
                                            <td>{meeting.id}</td>
                                            <td>{meeting.topic}</td>
                                            <td>{new Date(meeting.start_time).toLocaleString()}</td>
                                            {/* Remove the status field */}
                                            {/* <td><a href={meeting.join_url} target="_blank"><ExternalLink color='blue'/> Link</a></td> */}
                                            <td>
                                                <button onClick={() => meetingDetails(meeting.id)} className='border-0'>
                                                    <Airplay color='blue'/>
                                                </button>
                                            </td>
                                            </tr>
                                        ))                                  
                                        ) : (
                                            <tr>
                                                <td colSpan={3} className='text-center'> No Meeting Found</td>
                                            </tr>
                                        )
                                
                                }
                            </tbody>
                        </Table>
    
        </div>
        ) : <div className='text-center'><Spinner/></div>}

          <Modal isOpen={basicModal} toggle={() => setBasicModal(!basicModal)}>
          <ModalHeader toggle={() => setBasicModal(!basicModal)}>Zoom Meeting</ModalHeader>
          <ModalBody>
            {Object.values(meetingDetail).length > 0 ? (
                <JoinMeeting meetingId={meetingDetail.id} userName={`Ujala Arshad`} userEmail={`ujala.arshad@kavmails.net`} pass={meetingDetail.password} host={meetingDetail.host_email} startUrl={meetingDetail.start_url}/>
            ) : null}
            
          </ModalBody>
        </Modal> 
    </Fragment>
    
  )
}

export default MeetingList
