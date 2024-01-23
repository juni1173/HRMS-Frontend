import { Fragment, useEffect, useState } from 'react'
import Select from 'react-select'
import { Button, Form, Label, Spinner, Badge, Offcanvas, OffcanvasHeader, OffcanvasBody } from 'reactstrap'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import apiHelper from '../../../Helpers/ApiHelper'
import CancelInterview from './InterviewActions.js/CancelInterview'
import RescheduleInterview from './InterviewActions.js/RescheduleInterview'
const ScheduleForm = ({ uuid, stage_id, CallBack }) => {
    const Api = apiHelper()
    const [interviewData, setInterviewData] = useState([])
    const [loading, setLoading] = useState(false)
    const [time_slots] = useState([])
    const [interviewers] = useState([])
    const [interviewModes] = useState([])
    const [startStatus, setStartStatus] = useState(false)
    const [canvasCancelPlacement, setCanvasCancelPlacement] = useState('end')
    const [canvasCancelOpen, setCanvasCancelOpen] = useState(false)
    const [canvasReschedulePlacement, setCanvasReschedulePlacement] = useState('end')
    const [canvasRescheduleOpen, setCanvasRescheduleOpen] = useState(false)
    const [InterviewDetail, setInterviewDetail] = useState({
        interviewer: '',
        interview_date: '',
        interview_mode: '',
        interview_time_slot: '',
        stage: stage_id

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
                            interviewers.push({value: interviewerList[i].hrmsuser, label: interviewerList[i].name})
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
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }
    const onSubmitHandler = async (e) => {
        setLoading(true)
        e.preventDefault()
        if (InterviewDetail.interviewer !== '' && InterviewDetail.interview_date !== '' 
        && InterviewDetail.interview_time_slot !== ''
        && InterviewDetail.interview_mode !== '') {
            const formData = new FormData()
            formData['interviewer'] = InterviewDetail.interviewer.value
            formData['interview_date'] =  InterviewDetail.interview_date
            formData['interview_time_slot'] = InterviewDetail.interview_time_slot.value
            formData['interview_mode'] = InterviewDetail.interview_mode.value
            formData['stage'] = InterviewDetail.stage
            formData['stage'] = InterviewDetail.stage
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
                    <div className='col-lg-6'>
                    <div className='row'>
                    <div className='col-lg-6'> 
                        <Label>
                            Interviewer
                        </Label>
                        <p><b>{interviewData.interviewer_name ? interviewData.interviewer_name : 'N/A'}</b></p>
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
                    <div className='col-lg-6'></div>
                    
                    <div className='col-lg-12'>
                    {interviewData.is_evaluation ? (
                        <p>This stage has Evaluation..</p>
                        ) : (
                            <p>No Evaluation found for this stage...</p>
                        )}
                        
                    </div>
                </div>
                    </div>
                    <div className='col-lg-6'>
                        <div className='row'>
                            <div className='col-lg-6 text-center'>
                                <Button className='btn btn-warning' onClick={toggleRescheduleCanvas}>
                                    Reschedule
                                </Button>
                            </div>
                            <div className='col-lg-6 text-center'>
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
                            <div className='col-lg-12 mt-3 text-center'>
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
                        <div className='col-lg-12 mb-1'>
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
            <RescheduleInterview uuid={uuid} interviewID={interviewData.id} stage_id={stage_id} CallBack={RescheduleCallBack}/>
          </OffcanvasBody>
        </Offcanvas>
    </Fragment>
    
  )
}

export default ScheduleForm