import { Fragment, useEffect, useState } from 'react'
import Select from 'react-select'
import { Button, Form, Label, Spinner } from 'reactstrap'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import apiHelper from '../../../Helpers/ApiHelper'
const ScheduleForm = ({ uuid, stage_id }) => {
    const Api = apiHelper()
    const [interviewData, setInterviewData] = useState([])
    const [loading, setLoading] = useState(false)
    const interviewer = [
        {value:0, label:'Name1'},
        {value:1, label:'Name2'},
        {value:2, label:'Name3'}
    ]
    const time_slot = [
        {value:0, label: '05:00 pm - 06:00 pm'},
        {value:1, label: '06:00 pm - 07:00 pm'},
        {value:2, label: '07:00 pm - 08:00 pm'}
    ]
    const getInterviewData = async () => {
        setLoading(true)
        await Api.get(`/interviews/candidate/job/get/stage/${uuid}/${stage_id}/`).then(result => {
            if (result) {
                
                if (result.status === 200) {
                    setInterviewData(result.data)
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
    useEffect(() => {
        getInterviewData()
    }, [])
  return (
    <Fragment>
        {!loading ? (
            Object.values(interviewData).length > 0 ? (
                interviewData.map((data, index) => (
                    <div className='row' key={index}>
                    <div className='col-lg-6'> 
                        <Label>
                            Interviewer
                        </Label>
                        <p>{data.interviewer_name}</p>
                    </div>
                    <div className='col-lg-6'> 
                        <Label>
                            Date
                        </Label>
                        <p>{data.interview_date}</p>
                    </div>
                    <div className='col-lg-6'> 
                        <Label>
                            Time Slot
                        </Label>
                        <p>{data.time_slot_title}</p>
                    </div>
                </div>
                )
            )
                
            ) : (
                <Form>
                    <div className='row'>
                        <div className='col-lg-6 mb-1'>
                            <Label>
                                Interviewer
                            </Label>
                            <Select
                                type="text"
                                name="interviewer"
                                options={interviewer}
                                defaultValue={interviewer[0]}
                                // onChange={ (e) => { onChangeBankDetailHandler('bankName', 'select', e) }}
                            />
                        </div>
                        <div className='col-lg-6 mb-1'>
                            <Label>
                                Date
                            </Label>
                            <Flatpickr 
                                className='form-control'
                                id='default-picker'
                                options={{
                                    altInput: true,
                                    altFormat: 'F j, Y',
                                    dateFormat: 'Y-m-d'
                                }}
                                // onChange={ (date) => { onChangeEducationHandler('degreeCompletionDate', 'date', Api.formatDate(date)) }}
                            />
                        </div>
                        <div className='col-lg-6 mb-1'>
                            <Label>
                                Time Slot
                            </Label>
                            <Select 
                                type="text"
                                name="time-slot"
                                options={time_slot}
                                defaultValue={time_slot[0]}
                            />
                        </div>
                        <div className='col-lg-6 mb-1'></div>
                        <div className='col-lg-12 mb-1'>
                            <Button className='btn btn-primary float-right'>
                                Set Interview
                            </Button>
                        </div>
                    </div> 
                </Form>
            )
        ) : (
            <div className="text-center"><Spinner/></div>
        )}
    </Fragment>
    
  )
}

export default ScheduleForm