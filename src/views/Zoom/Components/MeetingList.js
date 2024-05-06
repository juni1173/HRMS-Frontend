import React, { Fragment, useEffect, useState } from 'react'
import apiHelper from '../../Helpers/ApiHelper'
import { Table, Row, Input, Col, Button, Spinner, Modal, ModalBody, ModalHeader, Badge, Offcanvas, OffcanvasBody } from 'reactstrap'
import { Airplay, Clock, Copy, ExternalLink, UserPlus, Users } from 'react-feather'
// import Swal from 'sweetalert2'
// import withReactContent from 'sweetalert2-react-content'
// import JoinMeeting from './JoinMeeting/joinMeeting'
import EmployeeHelper from '../../Helpers/EmployeeHelper'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import ParticipantsComponent from './ParticipantsComponent'
import OtherParticipants from './OtherParticipants'
import ParticipantsDetails from './ParticipantsDetails'
const MeetingList = ({accessToken}) => {
    const Api = apiHelper()
    const Employees = EmployeeHelper()
    // const MySwal = withReactContent(Swal)
    const history = useHistory()
    const [loading, setLoading] = useState(false)
  const [meetings, setMeetings] = useState([])
  const [participantsData, setParticipantsData] = useState([])
  const [meetingTitle, setMeetingTitle] = useState('')
  const [meetingDateTime, setMeetingDateTime] = useState('')
  const [basicModal, setBasicModal] = useState(false)
  const [participantsModal, setParticipantsModal] = useState(false)
  const [othersModal, setOthersModal] = useState(false)
  const [employees, setEmployees] = useState([])
  const [systemParticipants, setSystemParticipants] = useState([])
  const [othersParticipants, setOthersParticipants] = useState([])
  const [canvasOpen, setCanvasOpen] = useState(false)
  const toggleCanvasStart = () => {

    setCanvasOpen(!canvasOpen)
  }
  const fetchMeetings = async () => {
    setLoading(true)
    await Api.get(`/meetings/upcomings/`).then(result => {
        if (result) {
            if (result.status === 200) {
                const data = result.data
                console.warn(data)
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

// const joinMeeting = async (status) => {
//     MySwal.fire({
//       title: 'Are you sure?',
//       text: `Meeting Status is "${status}"!`,
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Yes, Proceed!',
//       customClass: {
//       confirmButton: 'btn btn-primary',
//       cancelButton: 'btn btn-danger ms-1'
//       },
//       buttonsStyling: false
//   }).then(function (result) {
//       if (result.value) {
//             //    window.location.href = join_url
//                setBasicModal(!basicModal)
//               } else {
                  
//               }
                      
//               })
        
//   }
const participantsDetails = async (id) => {
    await Api.get(`/meetings/participants/${id}/`).then(result => {
        if (result) {
            if (result.status === 200) {
                const data = result.data
                setParticipantsData(data)
                toggleCanvasStart()
                
            } else {
                Api.Toast('error', result.message)
            }
        } else (
        Api.Toast('error', 'Server not responding!')   
        )
    }) 
}
  
  useEffect(() => {
    if (Object.values(employees).length === 0) {
        Employees.fetchEmployeeDropdown().then(result => {
            setEmployees(result)
        })
    }
    setEmployees(Employees.fetchEmployeeDropdown())
    fetchMeetings()
  }, [])
  const formatDatetime = (meetingDatetime) => {
    // Create a Date object from the meetingDatetime string
    const datetime = new Date(meetingDatetime)
  
    // Get the date components
    const year = datetime.getFullYear()
    const month = String(datetime.getMonth() + 1).padStart(2, '0')
    const day = String(datetime.getDate()).padStart(2, '0')
  
    // Get the time components
    const hours = String(datetime.getHours()).padStart(2, '0')
    const minutes = String(datetime.getMinutes()).padStart(2, '0')
    const seconds = String(datetime.getSeconds()).padStart(2, '0')
    // const milliseconds = String(datetime.getMilliseconds()).padStart(2, '0')
  
    // Assemble the datetime string in the desired format
    const formattedDatetime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`
  
    return formattedDatetime
  }
  const createMeeting = async () => {
    
    if (meetingTitle !== '' && meetingDateTime !== '') {
      const formData = new FormData()
      formData['topic'] = meetingTitle
      formData['start_time'] = formatDatetime(meetingDateTime)
      formData["hrms_user_list"] = systemParticipants
      formData["other_user_list"] = othersParticipants
        await Api.jsonPost(`/meetings/create/new/`, formData).then(result => {
          if (result) {
              if (result.status === 200) {
                //   const data = result.data
                setMeetingTitle('')
                setMeetingDateTime('')
                setSystemParticipants([])
                setOthersParticipants([])
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
  
  const redirectToMeeting = async (meeting) => {
    let role = 0
        if (meeting.is_host === true) {
            role = 1
        } else {
            role = 0
        }
    const redirectUrl = `/zoommeeting/${meeting.meeting_id}/${meeting.password}/${accessToken}/${role}`
    history.push(redirectUrl) 
  }
  const participantsCallback = (participants) => {
    setParticipantsModal(false)
    setSystemParticipants(participants)
  }
  const othersCallback = (otherParticipants) => {
    setOthersModal(false)
    setOthersParticipants(otherParticipants)
  }
  
    const handleCopy = (text) => {
      navigator.clipboard.writeText(text)
        .then(() => {
            Api.Toast('success', 'Link copied to clipboard')
          console.log('Link copied to clipboard:', text)
          // Optionally, show a success message to the user
        })
        .catch(error => {
            Api.Toast('error', error)
          console.error('Error copying link to clipboard:', error)
          // Optionally, show an error message to the user
        })
    }
  
  return (
    <Fragment>
        <div>
      <h2>Create Meeting</h2>
      <Row>
        <Col md='12' className='border-right'>
        <form onSubmit={handleSubmit}>
            <Row className='mb-2'>
            <Col md='3' className='mb-2'>
                <Input
                type="text"
                id="meetingTitle"
                placeholder='Topic'
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                required
                />
            </Col>
            <Col md='2' className='mb-2'>
                <Input
                type="datetime-local"
                id="meetingDateTime"
                placeholder='Schedule Date Time'
                value={meetingDateTime}
                onChange={(e) => setMeetingDateTime(e.target.value)}
                required
                />
            </Col>
           
            <Col md='2'>
                {Object.values(systemParticipants).length > 0 ? (
                    <Button className='btn btn-success btn-sm' onClick={() => setParticipantsModal(!participantsModal)}><Users color='white' size={20}/> Employees</Button>
                ) : (
                    <Button className='btn btn-warning btn-sm' onClick={() => setParticipantsModal(!participantsModal)}><UserPlus color='white' size={20}/> Employees</Button>
                )}
            </Col>
            <Col md='2'>
            {Object.values(othersParticipants).length > 0 ? (
                <Button className='btn btn-success btn-sm' onClick={() => setOthersModal(!othersModal)}><Users color='white' size={20}/> Others</Button>
            ) : (
                <Button className='btn btn-warning btn-sm' onClick={() => setOthersModal(!othersModal)}><UserPlus color='white' size={20}/> Others</Button>
            )}
                
            </Col>
            <Col md='3'>
                <Button type="submit" className='btn btn-primary btn-sm'><Clock color='white' size={20} /> Schedule</Button>
            </Col>
            </Row>
        
            {/* Add more input fields for meeting details as needed */}
            
        </form>
        </Col>
      </Row>
      
        </div>
        {!loading ? (
            <div className="meeting-list">
            <Table responsive bordered striped>
                            <thead className='table-dark text-center'>
                                <tr>
                                    <th>Date/Time</th>
                                    <th>Topic</th>
                                    <th>Status</th>
                                    <th>Participants</th>
                                    <th>Links</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.values(meetings).length > 0 ? (
                                        meetings.slice().reverse().map(meeting => (
                                            <tr key={meeting.id}>
                                            <td>{meeting.date ? meeting.date : 'no date found'}<br></br>{meeting.start_time ? meeting.start_time : 'No Time Found'}</td>
                                            <td>{meeting.topic}</td>
                                            <td className='text-center'>{meeting.status ? <Badge className='badge-glow' color='success'>{meeting.status.toUpperCase()}</Badge> : 'N/A'}</td>
                                            {/* Remove the status field */}
                                            <td className='text-center'>
                                                <Users onClick={() => participantsDetails(meeting.id)} color='blue'/>
                                            </td>
                                            <td className='text-center'>
                                                {meeting.is_host && (
                                                    <>
                                                        <span style={{padding:'22px'}}>Host Url</span><a title='Redirect to meeting link' href={meeting.start_url}><ExternalLink color='blue' size={20}/></a> | <Copy alt="copy link" color='gray' size={20} onClick={() => handleCopy(meeting.start_url)}/>
                                                    </>
                                                )}
                                                
                                                <br></br>
                                                <br></br>
                                                <span style={{padding:'22px'}}>Join Url</span> <a title='Redirect to meeting link' href={meeting.join_url}><ExternalLink color='blue' size={20}/></a> | <Copy alt="copy link" color='gray' size={20} onClick={() => handleCopy(meeting.join_url)}/>
                                                {/* <a title='Redirect to meeting link' href={meeting.is_host === true ? meeting.start_url : meeting.join_url}><ExternalLink color='blue' size={20}/></a> | <Copy alt="copy link" color='gray' size={20} onClick={() => handleCopy(meeting.is_host === true ? meeting.start_url : meeting.join_url)}/> */}
                                            </td>
                                            <td className='text-center'>
                                            <button className='border-0' onClick={() => redirectToMeeting(meeting)}>
                                                <Airplay color='blue'/></button>
                                            </td>
                                            
                                            </tr>
                                        ))                                  
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className='text-center'> No Meeting Found</td>
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
            {/* {Object.values(meetingDetail).length > 0 ? (
                <JoinMeeting meetingId={meetingDetail.id} userName={`Muhammad Juanid`} userEmail={`junaid1173@gmail.com`} pass={meetingDetail.password} host={meetingDetail.host_email} startUrl={meetingDetail.start_url}/>
            ) : null} */}
          </ModalBody>
        </Modal> 
        <Modal isOpen={participantsModal} toggle={() => setParticipantsModal(!participantsModal)} className='modal-xl'>
          <ModalHeader toggle={() => setParticipantsModal(!participantsModal)}>Add Zoom Meeting Participants</ModalHeader>
          <ModalBody>
            {participantsModal ? (
                <ParticipantsComponent CallBack={(participants) => participantsCallback(participants)} data={systemParticipants}/>
            ) : null}
                
          </ModalBody>
        </Modal> 
        <Modal isOpen={othersModal} toggle={() => setOthersModal(!othersModal)} className='modal-lg'>
          <ModalHeader toggle={() => setOthersModal(!othersModal)}>Add Zoom Meeting Participants</ModalHeader>
          <ModalBody>
            {othersModal ? (
                <OtherParticipants CallBack={(otherParticipants) => othersCallback(otherParticipants)} data={othersParticipants}/>
            ) : null}
                
          </ModalBody>
        </Modal> 
        <Offcanvas direction='end' isOpen={canvasOpen} toggle={toggleCanvasStart}>
        <OffcanvasBody>
          {Object.values(participantsData).length > 0 ? (
            <ParticipantsDetails data={participantsData}/>
          ) : null}
          
        </OffcanvasBody>
      </Offcanvas>
    </Fragment>
    
  )
}

export default MeetingList
