import React, { Fragment, useState, useEffect } from 'react'
import Avatar from '@components/avatar'
import { Badge, Table, Input } from 'reactstrap'
import { useHistory } from 'react-router-dom'
import ExportAttendance from './ExportAttendance'
const EmployeeListData = ({ empData, mode }) => {
    const history = useHistory()
    const [employeeName, setEmployeeName] = useState('')
    const [checkInTime, setCheckInTime] = useState('')
    const [filteredEmployees, setFilteredEmployees] = useState(empData.list)
    useEffect(() => {
        // Filter the employees whenever the search fields change
        const handleSearch = () => {
            const filteredData = empData.list.filter(item => {
                const isNameMatch = item.employee_name.toLowerCase().includes(employeeName.toLowerCase())
                const isTimeMatch = checkInTime ? new Date(`1970-01-01T${item.check_in_time}Z`) >= new Date(`1970-01-01T${String(checkInTime).padStart(2, '0')}:00:00Z`) : true

                return isNameMatch && isTimeMatch
            })

            setFilteredEmployees(filteredData)
        }

        handleSearch() // Call the search function
    }, [employeeName, checkInTime, empData.list])
    const onClickEmp = (uuid) => {
        history.push(`/employeeDetail/${uuid}`)
    }
    const ExportData = (list) => {
        const newArray = list.map(item => ({
            Date: item.date,
            EmployeeID: item.employee,
            Name: item.employee_name,
            Position: item.position_title,
            Department: item.department_title,
            CheckIn: item.check_in_time,
            Mode: item.attendance_status // Renaming to attendance_type
        }))
        return newArray
    }
    const processedData = filteredEmployees ? ExportData(filteredEmployees) : []
  return (
    <Fragment>
        <div className='d-flex justify-content-center mb-1'>
            <div className='mr-1'>
            <Input
                type="text"
                placeholder="Employee Name"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
            />
            </div>
            <div className='mr-1'>
                <select class="form-select" value={checkInTime} onChange={(e) => setCheckInTime(e.target.value)}>
                    <option value="">From Hour</option>
                    {[...Array(24).keys()].map(hour => (
                        <option key={hour + 1} value={hour + 1}>{hour + 1}</option>
                    ))}
                </select>
            </div>
            <div className='w-20'><ExportAttendance list={processedData} mode={mode}/></div>
        </div>
        <Table striped responsive>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Mode</th>
                    <th>Check in</th>
                    <th>Position</th>
                    <th>Department</th>
                </tr>
            </thead>
            <tbody>
                {(Object.values(filteredEmployees) && Object.values(filteredEmployees).length > 0) ? (
                    filteredEmployees.map((item) => (
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
                            <td>{item.check_in_time ? item.check_in_time : <Badge>N/A</Badge>}</td>
                            <td>{item.position_title ? item.position_title : <Badge>N/A</Badge>}</td>
                            <td>{item.department_title ? item.department_title : <Badge>N/A</Badge>}</td>
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