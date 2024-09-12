import { Fragment, useEffect, useState } from 'react'
import Select from 'react-select'
import { Button, Form, Label, Spinner, Badge, Offcanvas, OffcanvasHeader, OffcanvasBody, Input, Modal, ModalBody, ModalHeader } from 'reactstrap'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import apiHelper from '../../../Helpers/ApiHelper'
import CancelInterview from './InterviewActions.js/CancelInterview'
import RescheduleInterview from './InterviewActions.js/RescheduleInterview'
import CreateInterviewMeeting from './CreateInterviewMeeting'
// import ApiCalendar from 'react-google-calendar-api'
const ScheduleForm = ({ email, name, uuid, stage_id, CallBack }) => {
    const Api = apiHelper()
    const [isUrlDisabled, setisUrlDisabled] = useState(false)
    const [interviewData, setInterviewData] = useState([])
    const [loading, setLoading] = useState(false)
    const [time_slots] = useState([])
    const [interviewers] = useState([])
    const [interviewModes] = useState([])
    const [mediums] = useState([])
    const [startStatus, setStartStatus] = useState(false)
    const [canvasCancelPlacement, setCanvasCancelPlacement] = useState('end')
    const [canvasCancelOpen, setCanvasCancelOpen] = useState(false)
    const [canvasReschedulePlacement, setCanvasReschedulePlacement] = useState('end')
    const [canvasRescheduleOpen, setCanvasRescheduleOpen] = useState(false)
    // const [modalMeetingPlacement, setmodalMeetingPlacement] = useState('end')
    const [modalMeetingOpen, setmodalMeetingOpen] = useState(false)
    // const [autoLink, setautoLink] = useState(false)
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
    // const [config, setConfig] = useState({
    //     clientId: null,
    //     apiKey: null,
    //     scope: "https://www.googleapis.com/auth/calendar",
    //     discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
    //   })
    // const getKeys = async() => {
    //     Api.get(`/organizations/apis/keys/`).then(result => {
    //         if (result) {
    //             if (result.status === 200) {       
    //                 setConfig(prevConfig => ({
    //                     ...prevConfig,
    //                     clientId: result.data[0].client_id,
    //                     apiKey: result.data[0].google_api
    //                   }))
    //             } else {
    //                 Api.Toast('error', result.message)
    //             }
    //         } else {
    //             Api.Toast('error', 'Server not responding')
    //         }
    //       })
    // }
    // useEffect(() => {
    //    getKeys()
    // }, [])
    const getInterviewData = async () => {
        setLoading(true)
        await Api.get(`/interviews/candidate/job/get/stage/${uuid}/${stage_id}/`).then(result => {
            if (result) {
                setInterviewData([])
                if (result.status === 200) {
                    const data = result.data
                   setInterviewData(data)
                   if (data.start_date_time) {
                    setStartStatus(true)
                   } else {
                    setStartStatus(false)
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
    
    const getPreData = async () => {
        setLoading(true)
        await Api.get(`/candidates/pre/data/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    const final = result.data
                    const timeSlots = final.time_slots
                    const interviewerList = final.employees
                    console.log(interviewerList)
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
                            interviewers.push({value: interviewerList[i].hrmsuser, label: interviewerList[i].name, email:interviewerList[i].official_email})
                        }
                    }
                    if (interviewModesList.length > 0) {
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
        await Api.get(`/interview/medium/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    const final = result.data
                    if (final.length > 0) {
                        mediums.splice(0, mediums.length)
                        for (let i = 0; i < final.length; i++) {
                            mediums.push({value: final[i].id, label: final[i].title})
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
    // const apiCalendar = new ApiCalendar(config)
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
            //Schedule Interview
            // if (autoLink) {
        //     const attendees = []
        //     // attendees.push({email: "muhammad19mehmood@gmail.com"})
        //     attendees.push({ email })
        //     attendees.push({ email: InterviewDetail.interviewer.email })
        // await  apiCalendar.handleAuthClick()
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
        //       formData['interview_url'] = InterviewDetail.interview_link
        //     })
        //     .catch((error) => {
        //       console.error(error)
        //       if (error.message) {
        //       }
        //     })
        // }
            //Schedule Interview End
           
            formData['interviewer'] = InterviewDetail.interviewer.value
            formData['interview_date'] =  InterviewDetail.interview_date
            formData['interview_time_slot'] = InterviewDetail.interview_time_slot.value
            formData['interview_mode'] = InterviewDetail.interview_mode.value
            formData['stage'] = InterviewDetail.stage
            formData['stage'] = InterviewDetail.stage
            formData['comments'] = InterviewDetail.comments
            formData['interview_medium'] = InterviewDetail.interview_medium.value
            formData['interview_url'] = InterviewDetail.interview_link
            
           await Api.jsonPost(`/interviews/candidate/job/${uuid}/`, formData).then(result => {
                if (result) {
                    if (result.status === 200) {
                        getInterviewData()
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
    const toggleCancelCanvas = () => {
        setCanvasCancelPlacement('end')
        setCanvasCancelOpen(!canvasCancelOpen)
        // CallBack()
      }
    const CancelCallBack = () => {
        setCanvasCancelOpen(false)
        getInterviewData()
    }
    const toggleRescheduleCanvas = () => {
        setCanvasReschedulePlacement('end')
        setCanvasRescheduleOpen(!canvasRescheduleOpen)
        // CallBack()
      }
    const RescheduleCallBack = () => {
        setCanvasRescheduleOpen(false)
        getInterviewData()
    }
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
    const onStartInterview = async () => {
        await Api.get(`/interviews/candidate/job/start/${uuid}/${interviewData.id}/`)
        .then(result => {
            if (result) {
                if (result.status === 200) {
                    getInterviewData()
                    setStartStatus(true)
                } else {
                    Api.Toast('error', result.message)
                }
            } else {
                Api.Toast('error', 'Server not responding!')
            }
        })
        
    }
    const onCompleteInterview = async () => {
        await Api.get(`/interviews/candidate/job/mark/complete/${uuid}/${interviewData.id}/`)
        .then(result => {
            if (result) {
                if (result.status === 200) {
                    getInterviewData()
                } else {
                    Api.Toast('error', result.message)
                }
            } else {
                Api.Toast('error', 'Server not responding!')
            }
        })
    }
    // const handleCheckboxChange = () => {
    //     setautoLink(!autoLink)
    //   }   
     
    useEffect(() => {
        getInterviewData()
        getPreData()
      
    }, [])
  return (
    <Fragment>
        {!loading ? (
            
            Object.values(interviewData).length ? (
                <>
                {interviewData.start_date_time && (
                    <div className='row bg-blue mb-1'>
                        <div className='col-lg-12 text-center'>
                            <p className='text-white'>Interview started at {interviewData.start_date_time}</p>
                        </div>
                    </div>
                )}
                <div className='row'>
                    <div className='col-lg-12'>
                    <div className='row'>
                    <div className='col-lg-12'>
                    {/* <Label>
                            Position
                        </Label> */}
                        <h3>{interviewData.position_title ? interviewData.position_title : 'N/A'}</h3>
                    </div>

                    <div className='col-lg-6'> 
                        <Label>
                            Interviewer
                        </Label>
                        <p><b>{interviewData.interviewer_name ? interviewData.interviewer_name : 'N/A'}</b></p>
                    </div>
                    <div className='col-lg-6'> 
                        <Label>
                            Candidate
                        </Label>
                        <p><b>{interviewData.candidate_name ? interviewData.candidate_name : 'N/A'}</b></p>
                    </div>
                    <div className='col-lg-6'> 
                        <Label>
                            Interview Stage
                        </Label>
                        <p><b>{interviewData.stage_title ? interviewData.stage_title : 'N/A'}</b></p>
                    </div>
                    <div className='col-lg-6'> 
                        <Label>
                            Date
                        </Label>
                        <p> <b>{interviewData.interview_date ? interviewData.interview_date : 'N/A'}</b></p>
                    </div>
                    <div className='col-lg-6'> 
                        <Label>
                            Time Slot
                        </Label>
                        <p><b>{interviewData.time_slot_title ? interviewData.time_slot_title : 'N/A'}</b></p>
                    </div>
                    <div className='col-lg-6'><Label>
                            Interview  Mode
                        </Label>
                        <p><b>{interviewData.mode_title ? interviewData.mode_title : 'N/A'}</b></p></div>
                        <div className='col-lg-6'><Label>
                            Interview  Medium
                        </Label>
                        <p><b>{interviewData.interview_medium_title ? interviewData.interview_medium_title : 'N/A'}</b></p></div>
                    <div className='col-lg-6'> 
                        <Label>
                            Meeting Link
                        </Label>
                        <p> <b>{interviewData.interview_url ? interviewData.interview_url : 'N/A'}</b></p>
                    </div>
                    <div className='col-lg-6'> 
                        <Label>
                            Comments
                        </Label>
                        <p> <b>{interviewData.comments ? interviewData.comments : 'N/A'}</b></p>
                    </div>
                    
                    <div className='col-lg-12'>
                    {interviewData.is_evaluation ? (
                        <p>This stage has Evaluation..</p>
                        ) : (
                            <p>No Evaluation found for this stage...</p>
                        )}
                        
                    </div>
                </div>
                    </div>
                    <div className='col-lg-12'>
                        <div className='row'>
                            <div className='col-lg-4 text-center'>
                                <Button className='btn btn-warning' onClick={toggleRescheduleCanvas}>
                                    Reschedule
                                </Button>
                            </div>
                            <div className='col-lg-4 text-center'>
                                {!startStatus ? (
                                    <Button className='btn btn-danger' onClick={toggleCancelCanvas}>
                                        Cancel
                                    </Button>
                                ) : (
                                    <Button className='btn btn-danger' disabled>
                                        Cancel
                                    </Button>
                                )}
                                
                            </div>
                            <div className='col-lg-4 text-center'>
                                {
                                interviewData.complete_date_time ? (
                                    <>
                                    <Label>
                                        <p>Interview Completed at</p>
                                    </Label>
                                    <p><b>{interviewData.complete_date_time}</b></p>
                                    </>
                                ) : (
                                    !startStatus ? (
                                        <Button className='btn btn-success text-center' onClick={onStartInterview} >
                                            Start Interview
                                        </Button>
                                    ) : (
                                        <Button className='btn btn-success text-center' onClick={onCompleteInterview} >
                                            Complete Interview
                                        </Button>
                                    )
                                )
                                }
                                
                            </div>
                        </div>
                    </div>
                </div>
                </>
            ) : (
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
                            </Label><Badge color='light-success'>Checking auto link will automatically schedule a meeting</Badge><br></br>
                               <Input type='checkbox' 
                               onChange={handleCheckboxChange}
                               />
                        </div> */}
                        
                        {/* <div className='col-lg-2 mb-1'> */}
                        {/* {autoLink ? <div style={{ padding: "0.5em" }}>
         <button onClick={(e) => handleItemClick(e, "sign-in")}>Generate Link</button>
      </div>    : null} */}
       {/* </div> */}
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
                            <Label>
                                Comments
                            </Label>
                        <Input type='text' 
                            //    disabled={autoLink}
                               onChange={ (e) => { onChangeInterviewDetailHandler('comments', 'input', e) }}
                               />
                        </div>
                        <div className='col-lg-12 mb-1'>
                        {InterviewDetail.interview_mode.label === 'Online interview' ? <>
                        <Button className='btn btn-primary float-right' onClick={toggleMeetingModal}>
                                Schedule Meeting
                            </Button> </> :  null } 
                            <Button className='btn btn-primary float-right' onClick={onSubmitHandler}>
                                Set Interview
                            </Button>
                        </div>
                    </div> 
                </Form>
            )
        ) : (
            <div className="text-center"><Spinner color='primary'/></div>
        )}
        <Offcanvas direction={canvasCancelPlacement} isOpen={canvasCancelOpen} toggle={toggleCancelCanvas} className="Interview-Form-Canvas">
          <OffcanvasHeader toggle={toggleCancelCanvas}></OffcanvasHeader>
          <OffcanvasBody className=''>
            <CancelInterview uuid={uuid} interviewID={interviewData.id} CallBack={CancelCallBack}/>
          </OffcanvasBody>
        </Offcanvas>
        <Offcanvas direction={canvasReschedulePlacement} isOpen={canvasRescheduleOpen} toggle={toggleRescheduleCanvas} className="Interview-Form-Canvas">
          <OffcanvasHeader toggle={toggleRescheduleCanvas}></OffcanvasHeader>
          <OffcanvasBody className=''>
            <RescheduleInterview cand_name={name} cand_email={email} mediums={mediums}  uuid={uuid} interviewID={interviewData.id} stage_id={stage_id} CallBack={RescheduleCallBack}/>
          </OffcanvasBody>
        </Offcanvas>
        <Modal isOpen={modalMeetingOpen} toggle={modalMeetingOpen} className="Interview-Form-Modal">
  <ModalHeader toggle={toggleMeetingModal}></ModalHeader>
  <ModalBody className=''>
    <CreateInterviewMeeting cand_name={name} cand_email={email} interviewer={InterviewDetail.interviewer} category="Recruitment" date={InterviewDetail.interview_date} time={InterviewDetail.interview_time_slot} CallBack={meetingcallback} selectedmedium={InterviewDetail.interview_medium}/>
  </ModalBody>
</Modal>
    </Fragment>
    
  )
}

export default ScheduleForm