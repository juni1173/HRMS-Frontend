import React, { Fragment, useState, useEffect } from 'react'
import Select from 'react-select'
import { Button, Form, Label, Spinner, Badge } from 'reactstrap'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import apiHelper from '../../../../Helpers/ApiHelper'

const RescheduleInterview = ({ uuid, interviewID, stage_id, CallBack}) => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [time_slots] = useState([])
    const [interviewers] = useState([])
    const [interviewModes] = useState([])
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
    const getPreData = async () => {
        setLoading(true)
        await Api.get(`/candidates/pre/data/`).then(result => {
            if (result) {
                
                if (result.status === 200) {
                    const final = result.data
                    const timeSlots = final.time_slots
                    const interviewerList = final.hrmsusers
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
                            interviewers.push({value: interviewerList[i].id, label: interviewerList[i].full_name})
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
                    <div className='col-lg-12 mb-1'>
                        <Button className='btn btn-primary float-right' onClick={onSubmitHandler}>
                            Set Interview
                        </Button>
                    </div>
                </div> 
            </Form>
        ) : (
            <div className="text-center"><Spinner/></div>
        )}
        
    </Fragment>
  )
}

export default RescheduleInterview