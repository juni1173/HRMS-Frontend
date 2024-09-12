import React, { Fragment, useEffect, useState } from 'react'
import apiHelper from '../../Helpers/ApiHelper'
import { Card, Table, Row, Input, Col, Button, Spinner, Modal, ModalBody, ModalHeader, Badge, Offcanvas, OffcanvasBody, CardHeader } from 'reactstrap'
import { Airplay, Clock, Copy, ExternalLink, UserPlus, Users } from 'react-feather'
// import Swal from 'sweetalert2'
// import withReactContent from 'sweetalert2-react-content'
// import JoinMeeting from './JoinMeeting/joinMeeting'
// import EmployeeHelper from '../../Helpers/EmployeeHelper'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
// import ParticipantsComponent from './ParticipantsComponent'
// import OtherParticipants from './OtherParticipants'
import ParticipantsDetails from './ParticipantsDetails'
import CreateMeetingForm from './CreateMeeting'
import zoomus from '../../../assets/images/illustration/zoomus.svg'
import meet from '../../../assets/images/illustration/meet.svg'
const MeetingList = ({accessToken}) => {
    const Api = apiHelper()
    // const Employees = EmployeeHelper()
    // const MySwal = withReactContent(Swal)
    const history = useHistory()
    const [loading, setLoading] = useState(false)
  const [meetings, setMeetings] = useState([])
  const [participantsData, setParticipantsData] = useState([])
  // const [meetingTitle, setMeetingTitle] = useState('')
  // const [meetingDateTime, setMeetingDateTime] = useState('')
  const [basicModal, setBasicModal] = useState(false)
  // const [participantsModal, setParticipantsModal] = useState(false)
  // const [othersModal, setOthersModal] = useState(false)
  // const [employees, setEmployees] = useState([])
  // const [systemParticipants, setSystemParticipants] = useState([])
  // const [othersParticipants, setOthersParticipants] = useState([])
  const [canvasOpen, setCanvasOpen] = useState(false)
  const [showCreateMeeting, setShowCreateMeeting] = useState(false)
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
    // if (Object.values(employees).length === 0) {
    //     Employees.fetchEmployeeDropdown().then(result => {
    //         setEmployees(result)
    //     })
    // }
    // setEmployees(Employees.fetchEmployeeDropdown())
    fetchMeetings()
  }, [])
  // const formatDatetime = (meetingDatetime) => {
  //   // Create a Date object from the meetingDatetime string
  //   const datetime = new Date(meetingDatetime)
  
  //   // Get the date components
  //   const year = datetime.getFullYear()
  //   const month = String(datetime.getMonth() + 1).padStart(2, '0')
  //   const day = String(datetime.getDate()).padStart(2, '0')
  
  //   // Get the time components
  //   const hours = String(datetime.getHours()).padStart(2, '0')
  //   const minutes = String(datetime.getMinutes()).padStart(2, '0')
  //   const seconds = String(datetime.getSeconds()).padStart(2, '0')
  //   // const milliseconds = String(datetime.getMilliseconds()).padStart(2, '0')
  
  //   // Assemble the datetime string in the desired format
  //   const formattedDatetime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`
  
  //   return formattedDatetime
  // }
  // const createMeeting = async () => {
    
  //   if (meetingTitle !== '' && meetingDateTime !== '') {
  //     const formData = new FormData()
  //     formData['topic'] = meetingTitle
  //     formData['start_time'] = formatDatetime(meetingDateTime)
  //     formData["hrms_user_list"] = systemParticipants
  //     formData["other_user_list"] = othersParticipants
  //       await Api.jsonPost(`/meetings/create/new/`, formData).then(result => {
  //         if (result) {
  //             if (result.status === 200) {
  //               //   const data = result.data
  //               setMeetingTitle('')
  //               setMeetingDateTime('')
  //               setSystemParticipants([])
  //               setOthersParticipants([])
  //                 fetchMeetings()
  //             } else {
  //                 Api.Toast('error', result.message)
  //             }
  //         } else (
  //         Api.Toast('error', 'Server not responding!')   
  //         )
  //     }) 
  //   } else {
  //     Api.Toast('error', 'All fields are required!')
  //   }
  // }

  // const handleSubmit = (event) => {
  //   event.preventDefault()
  //   // Call createMeeting function to create the meeting
  //   createMeeting()
  // }
  
  const redirectToMeeting = async (meeting) => {
    if (meeting.meeting_id !== null) {
    let role = 0
        if (meeting.is_host === true) {
            role = 1
        } else {
            role = 0
        }
    const redirectUrl = `/zoommeeting/${meeting.meeting_id}/${meeting.password}/${accessToken}/${role}`
    history.push(redirectUrl) 
      } else {
      const redirectUrl = meeting.join_url
      window.location.href = redirectUrl
      }
  }
  // const participantsCallback = (participants) => {
  //   setParticipantsModal(false)
  //   setSystemParticipants(participants)
  // }
  // const othersCallback = (otherParticipants) => {
  //   setOthersModal(false)
  //   setOthersParticipants(otherParticipants)
  // }
  
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
    const CallBack = () => {
      fetchMeetings()
    }
    const handleShow = () => {
      setShowCreateMeeting(!showCreateMeeting)
    }
  
  return (
    <Fragment>
        <div>
      <h2>Create Meeting</h2>
      <Button className='mt-2 mb-3 btn btn-primary' onClick={() => { handleShow() }}>
        Create Meeting
      </Button>
      {showCreateMeeting ? <>
      <CreateMeetingForm CallBack={CallBack}/>
      </> : null}
        </div>
        {!loading ? (
            <div className="meeting-list">
              <Row>
              {Object.values(meetings).length > 0 ? (
                                        meetings.slice().reverse().map(meeting => (
                                          <Col md={4} className="d-flex align-items-center justify-content-center">
                                          <Card className="px-1">
                                          
                                            <Badge pill color='primary' className='badge-up'>
          {meeting.status}
        </Badge>
                                            <Row>
                                            <Col md={12} className='text-center' style={{marginTop: -20}}>
                                          
                                              {meeting.meeting_medium_title === 'zoom' || meeting.meeting_medium_title === 'Zoom' ?   <img role='button' onClick={() => redirectToMeeting(meeting)} src={zoomus} alt='Zoom' className='mr-2' style={{ width: '50px', height: '50px' }}/>  : meeting.meeting_medium_title === 'meet' || meeting.meeting_medium_title === 'Meet' ?  <img role='button' src={meet} onClick={() => { redirectToMeeting(meeting) }} alt='Meet' className='mr-2' style={{ width: '50px', height: '50px' }}/>  :  <Airplay role='button' color='blue' onClick={() => redirectToMeeting(meeting)}/>} 
                                             
                                              </Col>
                                              <div style={{marginTop: -30}}>
                                             <Users  onClick={() => participantsDetails(meeting.meeting)} color='blue' className='mt-1'/>
                                            </div>
                                              <Col md={12} className="mt-1 text-center">{meeting.topic}</Col>
                                            <Col md={12} className='text-center Small-font mt-1'>{meeting.start_time ? meeting.start_time : 'No Time Found'} {meeting.date ? meeting.date : 'No Time Found'}</Col>
                                            
                                            {/* <Col md={6} className="mt-1 ">Status : {meeting.status ? <Badge className='badge-glow' color='success'>{meeting.status.toUpperCase()}</Badge> : 'N/A'}</Col> */}
                                           
                                            <Col md={6} className="mt-1 mb-1">Join Url : <a title='Redirect to meeting link' href={meeting.join_url}><ExternalLink color='blue' size={20}/></a> | <Copy alt="copy link" color='gray' size={20} onClick={() => handleCopy(meeting.join_url)}/></Col>
                                            <Col md={6} className="mt-1 mb-1">
                                              {meeting.is_host && (
                                                <>
                                                Host Url : <a title='Redirect to meeting link' href={meeting.start_url}><ExternalLink color='blue' size={20}/></a> | <Copy alt="copy link" color='gray' size={20} onClick={() => handleCopy(meeting.start_url)}/>
                                                </>
                                              )}
                                            </Col>
                                            {/* <Col md={12} className="d-flex justify-content-center mt-2 mb-2">
                                            <button className='border-0' onClick={() => redirectToMeeting(meeting)}>
                                                <Airplay color='blue'/></button>
                                            </Col> */}
                                            </Row>
                                          </Card>
                                        </Col>
                                        
                                        ))) : <div className='text-center'>No data found</div>  }
      </Row>
            {/* <Table responsive bordered striped>
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
                                            <tr key={meeting.meeting}>
                                            <td>{meeting.date ? meeting.date : 'no date found'}<br></br>{meeting.start_time ? meeting.start_time : 'No Time Found'}</td>
                                            <td>{meeting.topic}</td>
                                            <td className='text-center'>{meeting.status ? <Badge className='badge-glow' color='success'>{meeting.status.toUpperCase()}</Badge> : 'N/A'}</td>
                                          
                                            <td className='text-center'>
                                                <Users onClick={() => participantsDetails(meeting.meeting)} color='blue'/>
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
                        </Table> */}
    
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
        {/* <Modal isOpen={participantsModal} toggle={() => setParticipantsModal(!participantsModal)} className='modal-xl'>
          <ModalHeader toggle={() => setParticipantsModal(!participantsModal)}>Add Zoom Meeting Participants</ModalHeader>
          <ModalBody>
            {participantsModal ? (
                <ParticipantsComponent CallBack={(participants) => participantsCallback(participants)} data={systemParticipants}/>
            ) : null}
                
          </ModalBody>
        </Modal>  */}
        {/* <Modal isOpen={othersModal} toggle={() => setOthersModal(!othersModal)} className='modal-lg'>
          <ModalHeader toggle={() => setOthersModal(!othersModal)}>Add Zoom Meeting Participants</ModalHeader>
          <ModalBody>
            {othersModal ? (
                <OtherParticipants CallBack={(otherParticipants) => othersCallback(otherParticipants)} data={othersParticipants}/>
            ) : null}
                
          </ModalBody>
        </Modal>  */}
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
