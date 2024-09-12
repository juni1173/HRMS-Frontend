import React, { useEffect, useState } from 'react'
import { Input, Col, Row, Button, Form, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import { Users, UserPlus } from 'react-feather'
import apiHelper from '../../../Helpers/ApiHelper'
import EmployeeHelper from '../../../Helpers/EmployeeHelper'
import Select from 'react-select'
import ParticipantsComponent from '../../../Zoom/Components/ParticipantsComponent'
// import participantsComponent from '../../../Zoom/Components/ParticipantsComponent'
import OtherParticipants from '../../../Zoom/Components/OtherParticipants'
import ApiCalendar from 'react-google-calendar-api'
const CreateInterviewMeeting = ({cand_name, cand_email, interviewer, category, date, time, CallBack, selectedmedium}) => {
    console.log(interviewer)
  const Api = apiHelper()
  const EmpHelper = EmployeeHelper()
  const [meetingTitle, setMeetingTitle] = useState('')
  const [meetingDateTime, setMeetingDateTime] = useState('')
//   const [categories, setcategories] = useState([])
  const [medium, setmedium] = useState([])
  const [categoryvalue, setCategoryValue] = useState(category)
//   const [mediumvalue, setmediumvalue] = useState()
  // const [participantsData, setParticipantsData] = useState([])
  // const [meetingTitle, setMeetingTitle] = useState('')
  // const [meetingDateTime, setMeetingDateTime] = useState('')
  const [basicModal, setBasicModal] = useState(false)
  const [participantsModal, setParticipantsModal] = useState(false)
  const [othersModal, setOthersModal] = useState(false)
  const [employees, setEmployees] = useState([])
  const [systemParticipants, setSystemParticipants] = useState([])
  const [othersParticipants, setOthersParticipants] = useState([])
//   const [interview_url, setInterview_url] = useState('')
  useEffect(() => {
const others = [{name : cand_name, email: cand_email, is_host:'false'}]
setOthersParticipants(others)
const system = [{hrms_user : interviewer.value, label: interviewer.label, is_host:'false'}]
setSystemParticipants(system)
const meetingDate = date // Example date

// Assuming you have the time slot in a variable named 'timeSlot'
const timeSlot = time.label// Example time slot
console.log(meetingDate, timeSlot)

// Split the time slot into start and end times
const [startTime] = timeSlot.split(' - ')

// Construct the full date-time string
const fullDateTimeStart = `${meetingDate}T${startTime}`
setMeetingDateTime(fullDateTimeStart)
  }, [])
  const participantsCallback = (participants) => {
    setParticipantsModal(false)
    setSystemParticipants(participants)
  }
  const othersCallback = (otherParticipants) => {
    setOthersModal(false)
    setOthersParticipants(otherParticipants)
  }
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
  // const [canvasOpen, setCanvasOpen] = useState(false)
  // const toggleCanvasStart = () => {

  //   setCanvasOpen(!canvasOpen)
  // }
  // Add more state variables as needed for meeting details
  const predata = async() => {
  await Api.get(`/interview/medium/`).then(result => {
    if (result) {
        if (result.status === 200) {
          const options = result.data.map(medium => ({
            value: medium.id,  // Assuming category id is used as value
            label: medium.title  // Assuming category name is used as label
          }))
          setmedium(options)
        } else {
            Api.Toast('error', result.message)
        }
    } else (
    Api.Toast('error', 'Server not responding!')   
    )
}) 
  }
  const [config, setConfig] = useState({
    clientId: null,
    apiKey: null,
    scope: "https://www.googleapis.com/auth/calendar",
    discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
  })
  const apiCalendar = new ApiCalendar(config)
const getKeys = async() => {
    Api.get(`/organizations/apis/keys/`).then(result => {
        if (result) {
            if (result.status === 200) {       
                setConfig(prevConfig => ({
                    ...prevConfig,
                    clientId: result.data[0].client_id,
                    apiKey: result.data[0].google_api
                  }))
            } else {
                Api.Toast('error', result.message)
            }
        } else {
            Api.Toast('error', 'Server not responding')
        }
      })
}
  useEffect(() => {
    if (Object.values(employees).length === 0) {
      EmpHelper.fetchEmployeeDropdown().then(result => {
          setEmployees(result)
      })
  }
  setEmployees(EmpHelper.fetchEmployeeDropdown())
predata()
getKeys()
  }, [])
 const createMeeting = async () => {
    if (meetingTitle !== '' && meetingDateTime !== '' && selectedmedium) {
      const formData = new FormData()
      formData['topic'] = meetingTitle
      formData['start_time'] = formatDatetime(meetingDateTime)
      formData["hrms_user_list"] = systemParticipants
      formData["other_user_list"] = othersParticipants
      formData['meeting_medium'] = selectedmedium.value
      formData['meeting_category'] = categoryvalue
      if (selectedmedium.label === 'zoom' || selectedmedium.label === 'Zoom') {
        await Api.jsonPost(`/meetings/create/new/`, formData).then(result => {
          if (result) {
              if (result.status === 200) {
                //   const data = result.data
                setMeetingTitle('')
                setMeetingDateTime('')
                setSystemParticipants([])
                setOthersParticipants([])
                // setInterview_url(result.data.join_url)
                  // fetchMeetings()
                  CallBack(result.data.data.join_url)
              } else {
                  Api.Toast('error', result.message)
              }
          } else (
          Api.Toast('error', 'Server not responding!')   
          )
      }) 
    } else if (selectedmedium.label === 'Meet' || selectedmedium.label === 'meet') {
   
 const attendees = []
 systemParticipants.forEach(participant => {
  attendees.push(participant.email)
})

// Add other participants
othersParticipants.forEach(participant => {
  attendees.push(participant.email)
})
        await  apiCalendar.handleAuthClick()
        const endDateTime = new Date(meetingDateTime)
        endDateTime.setMinutes(endDateTime.getMinutes() + 30)
        const formattedEnd = endDateTime.toISOString()
          const conferenceData = {
            createRequest: {
              requestId: Math.random().toString(36).substring(7)
            },
            sendNotifications: true
          }
          const event = {
            summary: meetingTitle,
            description: meetingTitle,
            start: {
              dateTime: new Date(meetingDateTime).toISOString()
            },
            end: {
              dateTime: formattedEnd
            },
             attendees,
             conferenceData
          }
        
         await apiCalendar.createEvent(event)
            .then((result) => {
              formData['meeting_id'] = result.result.id
              formData['status'] = result.result.status
              formData['join_url'] = result.result.hangoutLink
              formData['start_url'] = result.result.hangoutLink
              formData['timezone'] = result.result.start.timeZone
              Api.jsonPost(`/meetings/create/meet/`, formData).then(response => {
                if (response) {
                    if (response.status === 200) {
                      //   const data = result.data
                      setMeetingTitle('')
                      setMeetingDateTime('')
                      setSystemParticipants([])
                      setOthersParticipants([])
                        // fetchMeetings()
                        CallBack(response.data.data.join_url)
                        console.log(response)
                    } else {
                        Api.Toast('error', response.message)
                    }
                } else (
                Api.Toast('error', 'Server not responding!')   
                )
            }) 
            })
            .catch((error) => {
              console.error(error)
              Api.Toast('error', 'Unable to create meeting')
            })
    } else {
      Api.Toast('Please contact technical team to schedule meeting')
    }
    } else {
      Api.Toast('error', 'All fields are required!')
    }
  }
  const handleSubmit = (event) => {
    event.preventDefault()
    // Call createMeeting function to create the meeting
    createMeeting()
  }

//   const handlemediumChange = (selectedOption) => {
//     setmediumvalue(selectedOption)
// }


  return (
    <div>
      {/* <h2>Create Meeting</h2> */}
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
          <Col md={4}>
          <Input
              type="text"
              id="meetingCategory"
              placeholder='Category'
              disabled={true}
              value={categoryvalue}
              onChange={(e) => setCategoryValue(e.target.value)}
              required
            />
</Col>
<Col md={4}>
            <Select
                options={[...medium]}
                className='react-select mb-1'
                classNamePrefix='select'
                placeholder="Select Medium"
                value={medium.find(option => option.value === selectedmedium.value)}
                // onChange={handlemediumChange}
                isDisabled={true}
            />
</Col>
          <Col md='4'>
            <Input
              type="datetime-local"
              id="meetingDateTime"
              placeholder='Schedule Date Time'
              value={meetingDateTime}
              disabled={true}
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
          <Col md='4'>
            <Button type="submit" className='btn btn-primary'>Create Meeting</Button>
          </Col>
        </Row>
       
        {/* Add more input fields for meeting details as needed */}
        
      </form>
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
        {/* <Offcanvas direction='end' isOpen={canvasOpen} toggle={toggleCanvasStart}>
        <OffcanvasBody>
          {Object.values(participantsData).length > 0 ? (
            <ParticipantsDetails data={participantsData}/>
          ) : null}
          
        </OffcanvasBody>
      </Offcanvas> */}
    </div>
  )
}

export default CreateInterviewMeeting
