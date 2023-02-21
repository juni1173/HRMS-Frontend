import { Fragment, useEffect, useState } from 'react'
import {  Badge, Spinner, Table } from 'reactstrap'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import apiHelper from '../../../Helpers/ApiHelper'

const InterviewDetail = ({uuid}) => {
    const Api = apiHelper()
    const [interviewData, setInterviewData] = useState([])
    const [loading, setLoading] = useState(false)
   
    const getInterviewData = async () => {
        setLoading(true)
        await Api.get(`/interviews/candidate/job/${uuid}/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    setInterviewData(result.data)
                } else {
                    Api.Toast('error', result.message)
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
                <Table bordered striped responsive>
                <thead className='table-dark text-center'>
                    <tr>
                        <th>Interviewer</th>
                        <th>Date</th>
                        <th>Time Slot</th>
                        <th>Mode</th>
                        <th>Stage</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
            {!loading ? (                    
            Object.values(interviewData).length > 0 ? (
                interviewData.map((data, index) => (
                    <tr key={index}>
                        <td>{data.interviewer_name}</td>
                        <td>{data.interview_date}</td>
                        <td>{data.time_slot_title}</td>
                        <td>{data.mode_title}</td>
                        <td>{data.stage_title}</td>
                        <td>{(!data.is_cancel && !data.reschedule_date && !data.start_date_time
                            && !data.complete_date_time) && 'N/A'}
                            {data.is_cancel && (
                                <p><Badge color='danger'>Cancelled</Badge> {data.reason_for_cancel && data.reason_for_cancel}</p>
                            )}
                            {/* <br/> */}
                            {data.reschedule_date && (
                                <p><Badge color='secondary'>Reschedule at</Badge> {Api.convertUTCtoDate(data.reschedule_date)}</p>
                            )}
                            {/* <br/> */}
                            {data.start_date_time && <p><Badge color='primary'>Started at</Badge> {Api.convertUTCtoDate(data.start_date_time)}</p>}
                            {/* <br/> */}
                            {data.complete_date_time && <p><Badge color='success'>Completed at</Badge> {Api.convertUTCtoDate(data.complete_date_time)}</p>}
                            </td>
                    </tr>
                )
            )
                
            ) : (
                
                <tr className="text-center">
                <td colSpan={6}>No Interview Data</td>
            </tr>
            )
        ) : (
            <tr className="text-center">
                <td colSpan={6}><Spinner/></td>
            </tr>
        )}
            </tbody>
        </Table>
    </Fragment>
  )
}

export default InterviewDetail