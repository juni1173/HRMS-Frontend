import { Fragment, useEffect, useState, useCallback } from "react"
import { Row, Col, CardBody, Card, Container, CardHeader } from "reactstrap"
import Masonry from 'react-masonry-component'
import apiHelper from "../../Helpers/ApiHelper"
import Notes from "./EmployeeComponents/KindNotes/Components/Notes"
import Attendance from "./EmployeeComponents/Attendance"
import Allowances from "./EmployeeComponents/Allowances"
import Leaves from "./EmployeeComponents/Leaves"
import Loan from "./EmployeeComponents/Loan"
import LearningDevelopment from "./EmployeeComponents/LearningDevelopment/index"
const EmployeeDashboard = () => {
  const Api = apiHelper()
  const [data, setData] = useState([])
  const [kindNotes, setKindNotes] = useState({
    recieved: '',
    sent: ''
})
  const preDataApi = async () => {
    const response = await Api.get('/employees-self-service/homepage/')
    
    if (response.status === 200) {
        setData(response.data)
        setKindNotes(prevState => ({
          ...prevState,
          recieved : response.data.receiver_kind_notes,
          sent : response.data.sender_kind_notes
          }))
    } else {
        return Api.Toast('error', 'Server not found')
    }
}
  useEffect(() => {
    preDataApi()
    }, [])
    const handleDataProcessing = useCallback(() => {
        preDataApi()
      }, [data])
  return (
   <Fragment>
    <Masonry className="row js-animation">
        <Col md={6} >
            <Attendance atndceData={data.last_week_attendance} CallBack={handleDataProcessing}/>
        </Col>
        <Col md={6}>
          <Allowances data={data} />
        </Col>
      
        <Col md={6}>
          <Card>
            <CardBody>
              <Notes notesList={kindNotes} CallBack={handleDataProcessing}/>
            </CardBody>
          </Card>
        </Col>
        <Col md={6}>
        {data.leaves && Object.values(data.leaves).length > 0 && (
          <Card>
            <CardBody>
              <Leaves data={data.leaves}/>
            </CardBody>
          </Card>
        )}
        {data.loan && Object.values(data.loan).length > 0 && (
          <Card>
            <CardBody>
              <Loan data={data.loan}/>
            </CardBody>
          </Card>
        )}
        </Col>
        <Col md={12}>
        {data.course_sessions && Object.values(data.course_sessions).length > 0 && (
          <Card>
            <CardHeader>
              <h3>Learning & Development</h3>
            </CardHeader>
            <CardBody>
              <LearningDevelopment sessions={data.course_sessions}/>
            </CardBody>
          </Card>
        )}
        </Col>
        </Masonry>
   </Fragment> 
  )
}

export default EmployeeDashboard