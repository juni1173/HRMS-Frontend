import React, { Fragment } from 'react'
import { Card, CardBody, CardTitle } from 'reactstrap'
import { IoAnalyticsOutline } from "react-icons/io5"
import EmployeeAttendanceChart from "./EmployeeCharts/Attendance/index"
import EmployeePerformanceChart from "./EmployeeCharts/Performance/index"
const Analytics = ({ empData}) => {
console.warn(empData)
  return (
    <Fragment>
        <Card className="emplyee_office_detail mb-0">
            <CardTitle>
                        <div className="d-flex justify-content-between bg-lightgrey">
                            <div className="d-flex">
                                <IoAnalyticsOutline color="#315180" size={'18px'}/> <h4>Analytics</h4>
                            </div>
                            <div>
                            
                            </div>
                        </div>
                        
            </CardTitle>
        </Card> 
        <Card>
            <CardBody className='p-0'>
                <EmployeeAttendanceChart id={empData.employee.id} />
            </CardBody>
        </Card>
        <Card>
            <CardBody className='p-0'>
                <EmployeePerformanceChart id={empData.employee.id} />
            </CardBody>
        </Card>
    </Fragment>
  )
}

export default Analytics