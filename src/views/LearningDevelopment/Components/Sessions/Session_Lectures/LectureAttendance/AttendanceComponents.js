import React, { Fragment, useState } from 'react'
import { Button, Table, Badge, Spinner } from 'reactstrap'
import apiHelper from '../../../../../Helpers/ApiHelper'
const AttendanceComponents = ({ data, CallBack }) => {
    // console.warn(data)
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
  
    const MarkAttendance = async (index, id, status) => {
        setLoading(true)
        const formData = new FormData()
        formData['attendance_status'] = status
            await Api.jsonPatch(`/applicants/trainee/lecture/attendance/${id}/`, formData)
            .then(result => {
                if (result) {
                    if (result.status === 200) {
                        data.attendance[index] = { ...data.attendance[id], ...result.data}
                    } else {
                        Api.Toast('error', result.message)
                    }
                } else {
                    Api.Toast('error', 'Server not responding!')
                }
            })
        setTimeout(() => {
            setLoading(false)
        }, 200)
    }
    const CompleteLecture = async () => {
        setLoading(true)
            await Api.get(`/applicants/trainee/end/lecture/${data.lectures.id}/`)
            .then(result => {
                if (result) {
                    if (result.status === 200) {
                        Api.Toast('success', result.message)
                        CallBack()
                    } else {
                        Api.Toast('error', result.message)
                    }
                } else {
                    Api.Toast('error', 'Server not responding!')
                }
            })
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }

  return (
    <Fragment>
        <Table responsive bordered striped>
            <thead className='table-dark text-center'>
                <tr>
                <th>Trainee Name</th>
                <th>Attendance Status</th>
                </tr>
            </thead>
            <tbody className='text-center'>
                {!loading ? (
                data.attendance.length > 0 ? (
                    data.attendance.map((att, key) => (
                        <tr key={key}>
                            <td>{att.course_session_trainee_name ? att.course_session_trainee_name : 'N/A'}</td>
                            <td>
                                {att.attendance_status ? (
                                    <Badge color={att.attendance_status === 1 ? 'light-success' : 'light-danger'} className>
                                        {att.attendance_status_title}
                                    </Badge>
                                    
                                ) : (
                                    <div className='row'>
                                        <div className='col-lg-4 text-center border-right'>
                                            <Button className='btn btn-success' onClick={() => MarkAttendance(key, att.id, 1)}>
                                                Present
                                            </Button>
                                        </div>
                                        <div className='col-lg-4 text-center border-right'>
                                            <Button className='btn btn-danger' onClick={() => MarkAttendance(key, att.id, 2)}>
                                                Absent
                                            </Button>
                                        </div>
                                        <div className='col-lg-4 text-center'>
                                            <Button className='btn btn-warning' onClick={() => MarkAttendance(key, att.id, 3)}>
                                                Leave
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                      <td colSpan={2}>No Attendance data Found...</td>
                  </tr>
                )
                ) : (
                    <tr>
                        <td colSpan={2}>
                            <Spinner type='grow' color='green'/>
                        </td>
                    </tr>
                )
                }
            </tbody>
        </Table>
        {data.lectures.is_taken ? (
            <div className="row">
            <div className='col-lg-6'>
               <h3>Lecture was completed...</h3>
            </div>
        </div>
        ) : (
            <div className="row">
                <div className='col-lg-6'>
                    <Button className='btn btn-primary' onClick={() => CompleteLecture() }>
                        Complete Lecture
                    </Button>
                </div>
            </div>
        )}
        
    </Fragment>
  )
}

export default AttendanceComponents