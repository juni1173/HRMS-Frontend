import React, { Fragment } from 'react'
import Avatar from '@components/avatar'
import { Table } from 'reactstrap'
import { useHistory } from 'react-router-dom'
const EmployeeListData = ({ empData }) => {
    const history = useHistory()
    const onClickEmp = (uuid) => {
        history.push(`/employeeDetail/${uuid}`)
    }
  return (
    <Fragment>
        <Table striped responsive>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Attendance</th>
                </tr>
            </thead>
            <tbody>
                {(Object.values(empData.list) && Object.values(empData.list).length > 0) ? (
                    empData.list.map((item) => (
                        <tr key={item.id} onClick={() => onClickEmp(item.employee_uuid)} className='cursor-pointer' title="profile">
                            <td><Avatar img={item.profile_image} size='sm'/> {item.employee_name}</td>
                            {item.attendance_status === "L" && (
                                <td>Leave</td>
                            )}
                            {item.attendance_status === "P" && (
                                <td>Present</td>
                            )}
                            {item.attendance_status === "WFH" && (
                                <td>WFH</td>
                            )}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td rowSpan={2}>No data found!</td>
                    </tr>
                )}
                
            </tbody>
        </Table>
    </Fragment>
  )
}

export default EmployeeListData