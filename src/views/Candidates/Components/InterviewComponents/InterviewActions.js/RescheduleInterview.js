import React, { Fragment, useState, useEffect } from 'react'
import Select from 'react-select'
import { Button, Form, Label, Spinner, Badge, Input, Modal, ModalBody, ModalHeader } from 'reactstrap'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import apiHelper from '../../../../Helpers/ApiHelper'
// import ApiCalendar from 'react-google-calendar-api'
import CreateInterviewMeeting from '../CreateInterviewMeeting'
const RescheduleInterview = ({ cand_name, cand_email, mediums, uuid, interviewID, stage_id, CallBack}) => {
    const Api = apiHelper()
    const [isUrlDisabled, setisUrlDisabled] = useState(false)
    const [loading, setLoading] = useState(false)
    const [time_slots] = useState([])
    const [interviewers] = useState([])
    const [interviewModes] = useState([])
    // const [autoLink, setautoLink] = useState(false)
    const [modalMeetingOpen, setmodalMeetingOpen] = useState(false)
    const [InterviewDetail, setInterviewDetail] = useState({
        interviewer: '',
        interview_date: '',
        interview_mode: '',
        interview_time_slot: '',
        stage: stage_id,
        interview_link: '',
        comments: '',
        interview_medium: ''
    })
    const onChangeInterviewDetailHandler = (InputName, InputType, e) => {
        let InputValue
        if (InputType === 'input') {
        InputValue = e.target.value
        } else if (InputType === 'select') {
        InputValue = e
        } else if (InputType === 'date') {
            // let dateFomat = e.split('/')
            // dateFomat = `${dateFomat[2]}-${dateFomat[1]}-${dateFomat[0]}`    
            InputValue = e
        } else if (InputType === 'file') {
            InputValue = e.target.files[0].name
        }
        setInterviewDetail(prevState => ({
        ...prevState,
        [InputName] : InputValue
        }))
    }
    const getPreData = async () => {
        setLoading(true)
        await Api.get(`/candidates/pre/data/`).then(result => {
            if (result) {
                
                if (result.status === 200) {
                    const final = result.data
                    const timeSlots = final.time_slots
                    const interviewerList = final.employees
                    const interviewModesList = final.interview_modes
                    if (timeSlots.length > 0) {
                        time_slots.splice(0, time_slots.length)
                        for (let i = 0; i < timeSlots.length; i++) {
                            time_slots.push({value: timeSlots[i].id, label: timeSlots[i].title})
                        }
                    }
                    if (interviewerList.length > 0) {
                        interviewers.splice(0, interviewers.length)
                        for (let i = 0; i < interviewerList.length; i++) {
                            interviewers.push({value: interviewerList[i].hrmsuser, label: interviewerList[i].name, email: interviewerList[i].official_email})
                        }
                    }
                    if (interviewModesList.length > 0) {
                    console.log(interviewModesList)
                        interviewModes.splice(0, interviewModes.length)
                        for (let i = 0; i < interviewModesList.length; i++) {
                            interviewModes.push({value: interviewModesList[i].id, label: interviewModesList[i].title})
                        }
                    }
                    

                } else {
                    // Api.Toast('error', result.message)
                }
            } else {
                Api.Toast('error', 'Server not responding')
            }
        })
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }
    // const handleCheckboxChange = () => {
    //     setautoLink(!autoLink)
    //   }   
    //   const apiCalendar = new ApiCalendar(config)
    //   const formatDateTime = (date, time) => {
    //     if (!date || !time) return null
    //     console.log(time)
    //     const [start, end] = time.split(' - ')
    //     console.warn(start)
    //     const [hours, minutes] = end.split(':')
    //     const formattedDate = new Date(date)
    //     formattedDate.setHours(parseInt(hours, 10))
    //     formattedDate.setMinutes(parseInt(minutes, 10))
    //     return formattedDate.toISOString()
    //   }
    const onSubmitHandler = async (e) => {
        setLoading(true)
        e.preventDefault()
        if (InterviewDetail.interviewer !== '' && InterviewDetail.interview_date !== '' 
        && InterviewDetail.interview_time_slot !== ''
        && InterviewDetail.interview_mode !== '') {
            const formData = new FormData()
            // if (autoLink) {
            //     const attendees = []
            //     attendees.push({ email })
            //     attendees.push({ email: InterviewDetail.interviewer.email })
            // await apiCalendar.handleAuthClick()
            // const formattedStart = formatDateTime(InterviewDetail.interview_date, InterviewDetail.interview_time_slot.label)
            // const endDateTime = new Date(formattedStart)
            // endDateTime.setMinutes(endDateTime.getMinutes() + 30)
            // const formattedEnd = endDateTime.toISOString()
            //   const conferenceData = {
            //     createRequest: {
            //       requestId: Math.random().toString(36).substring(7)
            //     },
            //     sendNotifications: true
            //   }
            //   const event = {
            //     summary: 'Interview',
            //     description: 'Interview',
            //     start: {
            //       dateTime: formattedStart
            //     },
            //     end: {
            //       dateTime: formattedEnd
            //     },
            //      attendees,
            //      conferenceData
            //   }
            
            //  await apiCalendar.createEvent(event)
            //     .then((result) => {
            //       console.log(result)
            //       // Handle success
            //       InterviewDetail.interview_link = result.result.hangoutLink
            //       formData['interview_url'] = result.result.hangoutLink
            //     })
            //     .catch((error) => {
            //       console.error(error)
            //       if (error.message) {
            //       }
            //     })
            // }
           
            formData['interviewer'] = InterviewDetail.interviewer.value
            formData['interview_date'] =  InterviewDetail.interview_date
            formData['interview_time_slot'] = InterviewDetail.interview_time_slot.value
            formData['interview_mode'] = InterviewDetail.interview_mode.value
            formData['interview_medium'] = InterviewDetail.interview_medium.value
            formData['stage'] = InterviewDetail.stage
            formData['comments'] = InterviewDetail.comments
            formData['interview_url'] = InterviewDetail.interview_link
            // console.log(formData)
           await Api.jsonPost(`/interviews/candidate/job/reschedule/${uuid}/${interviewID}/`, formData).then(result => {
                if (result) {
                    if (result.status === 200) {
                        CallBack()
                        Api.Toast('success', result.message)
                    } else {
                        Api.Toast('error', result.message)
                    }
                } else {
                    Api.Toast('error', 'Server Not Responding')
                }
            })
            
        } else {
            Api.Toast('error', 'All Fileds are required')
        }
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }
    useEffect(() => {
        getPreData()
    }, [])
    const toggleMeetingModal = () => {
        if (InterviewDetail.interview_medium !== '') {
        if (InterviewDetail.interviewer !== '' && InterviewDetail.interview_date !== '' && InterviewDetail.interview_time_slot !==  '') {
        // setmodalMeetingPlacement('end')
        setmodalMeetingOpen(!modalMeetingOpen)
        } else {
            Api.Toast('error', 'Please fill all required fields to schedule the meeting')
        } 
    } else {
            Api.Toast('error', 'Medium is required for meeting schedule')
        }
        // CallBack()
      }
      const meetingcallback = (url) => {
        if (url !== undefined && url !== null && url !== '') {
            setisUrlDisabled(true)
        }
        InterviewDetail.interview_link = url
        toggleMeetingModal()
    }
  return (
    <Fragment>
        {!loading ? (
            <Form>
                <div className='row'>
                    <div className='col-lg-6 mb-1'>
                        <Label>
                            Interviewer<Badge color='light-danger'>*</Badge>
                        </Label>
                        <Select
                            type="text"
                            name="interviewer"
                            options={interviewers}
                            onChange={ (e) => { onChangeInterviewDetailHandler('interviewer', 'select', e) }}
                        />
                    </div>
                    <div className='col-lg-6 mb-1'>
                        <Label>
                            Date<Badge color='light-danger'>*</Badge>
                        </Label>
                        <Flatpickr 
                            className='form-control'
                            id='default-picker'
                            options={{
                                altInput: true,
                                altFormat: 'F j, Y',
                                dateFormat: 'Y-m-d'
                            }}
                            onChange={ (date) => { onChangeInterviewDetailHandler('interview_date', 'date', Api.formatDate(date)) }}
                        />
                    </div>
                    <div className='col-lg-6 mb-1'>
                        <Label>
                            Time Slot<Badge color='light-danger'>*</Badge>
                        </Label>
                        <Select 
                            type="text"
                            name="time-slot"
                            options={time_slots}
                            onChange={ (e) => { onChangeInterviewDetailHandler('interview_time_slot', 'select', e) }}
                        />
                    </div>
                    <div className='col-lg-6 mb-1'>
                        <Label>
                            Mode<Badge color='light-danger'>*</Badge>
                        </Label>
                        <Select
                            type="text"
                            name="mode"
                            options={interviewModes}
                            onChange={ (e) => { onChangeInterviewDetailHandler('interview_mode', 'select', e) }}
                        />
                    </div>
                    <div className='col-lg-6 mb-1'>
                            <Label>
                                Interview Medium
                            </Label>
                            <Select
                                type="text"
                                name="medium"
                                options={mediums}
                                onChange={ (e) => { onChangeInterviewDetailHandler('interview_medium', 'select', e) }}
                            />
                        </div>
                    {InterviewDetail.interview_mode.label === 'Online interview' ? <>
                        {/* <div className='col-lg-6 mb-1'>
                            <Label>
                                Auto Link
                            </Label><Badge color='light-success'>Checking auto link will schedule a meeting</Badge><br></br>
                               <Input type='checkbox' 
                               onChange={handleCheckboxChange}
                               />
                        </div> */}
      <div className='col-lg-6 mb-1'>
                            <Label>
                               Interview Link
                            </Label><br></br>
                               <Input type='text' 
                               disabled={isUrlDisabled}
                            value={InterviewDetail.interview_link}
                               onChange={ (e) => { onChangeInterviewDetailHandler('interview_link', 'input', e) }}
                               />
                        </div> </>  : null}
                        <div className='col-lg-12 mb-1'>
                            <Label>Comments</Label>
                        <Input type='text' 
                               onChange={ (e) => { onChangeInterviewDetailHandler('comments', 'input', e) }}
                               />
                        </div>
                        <div className='col-lg-6 mb-1'>
                        {InterviewDetail.interview_mode.label === 'Online interview' ? <>
                        <Button className='btn btn-primary float-right' onClick={toggleMeetingModal}>
                            Schedule Meeting
                        </Button> </> : null }
                    </div>
                    <div className='col-lg-6 mb-1'>
                        <Button className='btn btn-primary float-right' onClick={onSubmitHandler}>
                            Set Interview
                        </Button>
                    </div>
                </div> 
            </Form>
        ) : (
            <div className="text-center"><Spinner/></div>
        )}
    <Modal isOpen={modalMeetingOpen} toggle={modalMeetingOpen} className="Interview-Form-Modal">
  <ModalHeader toggle={toggleMeetingModal}></ModalHeader>
  <ModalBody className=''>
  <CreateInterviewMeeting cand_name={cand_name} cand_email={cand_email} interviewer={InterviewDetail.interviewer} category="Recruitment" date={InterviewDetail.interview_date} time={InterviewDetail.interview_time_slot} CallBack={meetingcallback} selectedmedium={InterviewDetail.interview_medium}/>
    </ModalBody>
    </Modal>
    </Fragment>
  )
}

export default RescheduleInterview