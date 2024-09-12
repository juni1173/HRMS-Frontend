import {Fragment, useState, useEffect} from 'react'
import { Button, Card, CardBody, Spinner, Row, Col, Table, Modal, ModalHeader, ModalBody, ModalFooter, Label, Badge, Input } from 'reactstrap'
import apiHelper from '../Helpers/ApiHelper'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { Download } from 'react-feather'
import { CSVLink } from "react-csv"
const Adminlist = ({data, month, year}) => {
    const yearoptions = []
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear() 
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [atndceData, setAtndceData] = useState([])
      // Generate options for the last 5 years and add them to the array
    for (let i = 0; i < 5; i++) {
        const year = currentYear - i
        yearoptions.push({ value: year, label: year.toString() })
    }
    // const notifyTL = async () => {
    //     if (notifyActive && notify) {
    //         if (teamLead !== '') {
    //             const formData = new FormData()
    //             formData['team_lead'] = teamLead
    //           await  Api.jsonPost(`/attendance/notify/`, formData).then(result => {
    //                 if (result.status === 200) {

    //                 } else Api.Toast('error', result.message)
    //             })
    //         } else Api.Toast('error', 'Please select team lead to notify!')
    //     }
    // }

    const getAttendanceData = async () => {
        setLoading(true)
        const formData = new FormData()
        formData['month'] = month
        formData['year'] = year
        formData['employee'] = data.id
        await Api.jsonPost(`/attendance/list/all/`, formData)
        .then(result => {
            if (result) {
                if (result.status === 200) {
                   setAtndceData(result.data)
                } else {
                    Api.Toast('error', result.message)
                }
            } else {
                Api.Toast('error', result.message)
            }
        })
        setTimeout(() => {
            setLoading(false)
        }, 1000)
       
    }

    useEffect(() => {
        getAttendanceData()
    }, [setAtndceData])
    const csvData = [
        ["Date", "Emp Code", "Name", "Check In", " Check Out", " Duration", "Type"],
        ...atndceData.map((item) => [
          item.date, 
          data.emp_code,
          data.employee_name ? data.employee_name : data.name,
          item.check_in,
          item.check_out,
          item.duration,
          item.attendance_type
        ])
      ]
  return (
    <Fragment>
        <Card>
            <CardBody>
                <Row>
                    <Col md={9}>
            <h3 className='mb-2'>{data.employee_name ? data.employee_name : data.name} Attendance </h3>
            </Col>
            <Col md ={3}>
            <CSVLink
  className="btn btn-primary btn-sm mb-2"
  filename={`HRMS_Attendance_Sheet_${data.employee_name ? data.employee_name : data.name}_${month}_${year}`}
  data={csvData}
>
  <Download />
</CSVLink>

            </Col>
            {/* <h6 className='mb-2'><Badge color='light-success'>{data.emp_name}</Badge></h6> */}
            </Row>
                <Table bordered striped responsive>
                    <thead className='table-dark text-center'>
                        <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Duration</th>
                        <th>Check In</th>
                        <th>Check Out</th>
                        </tr>
                    </thead>
                    {!loading ? (
                    Object.values(atndceData).length > 0 ? (
                        atndceData.sort((a, b) => {
                            // Assuming that item.date is a string in the "YYYY-MM-DD" format
                            const dateA = new Date(a.date)
                            const dateB = new Date(b.date)
                            return dateB - dateA // Sort in descending order by date
                          }).map((item, key) => (
                            <tbody key={key}>
                                <tr>
                                <td className='nowrap'>{item.date ? item.date : <Badge color='light-danger'>N/A</Badge>}</td>
                                <td>{item.attendance_type ? item.attendance_type : <Badge color='light-danger'>N/A</Badge>}</td>
                                <td>{item.duration ? <Badge color='light-success'>{item.duration}</Badge> : <Badge color='light-danger'>N/A</Badge>}</td>
                                <td>{item.check_in ? item.check_in : <Badge color='light-danger'>N/A</Badge>}</td>
                                <td>{item.check_out ? item.check_out : <Badge color='light-danger'>N/A</Badge>}</td>
                                </tr>
                            </tbody>
                        ))
                    ) : (
                        <tbody>
                            <tr>
                            <td colSpan={5}><div className='text-center'>No Data Found</div></td>
                            </tr>
                        </tbody>
                    )
                    ) : (
                        <tbody>
                            <tr>
                            <td colSpan={5}><div className='text-center'><Spinner /></div></td>
                            </tr>
                        </tbody>
                            
                    )
                    }
                </Table>
            </CardBody>
        </Card>
    </Fragment>
  )
}

export default Adminlist