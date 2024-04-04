import React, { Fragment } from 'react'
import { Table, Card, CardBody } from 'reactstrap'

const EmployeeDataTable = ({data}) => {
    console.warn(data)
  return (
    <Fragment>
        <Card>
            <CardBody>
                <Table striped responsive bordered>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Department</th>
                            <th>Designation</th>
                            <th>Joining Date</th>
                            <th>Experience</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(data && Object.values(data).length > 0) ? (
                            data.map((item, key) => (
                                <tr key={key}>
                                <td>{item.employee_name ? item.employee_name : 'N/A'}</td>
                                <td>{item.email ? item.email : 'N/A'}</td>
                                <td>{item.department ? item.department : 'N/A'}</td>
                                <td>{item.desgination ? item.desgination : 'N/A'}</td>
                                <td>{item.joining_date ? item.joining_date : 'N/A'}</td>
                                <td>{item.tenure ? item.tenure : 'N/A'}</td>
                                </tr>
                            ))
                           
                        ) : <p>No Data Found</p>}
                    </tbody>
                </Table>
            </CardBody>
        </Card>
        
    </Fragment>
  )
}

export default EmployeeDataTable