import { Fragment, useEffect, useState, useCallback } from "react"
import { Row, Col, CardBody, Card, Container } from "reactstrap"
import apiHelper from "../../Helpers/ApiHelper"
import Notes from "./EmployeeComponents/KindNotes/Components/Notes"
import Attendance from "./EmployeeComponents/Attendance"
import Allowances from "./EmployeeComponents/Allowances"
import Leaves from "./EmployeeComponents/Leaves"
import Loan from "./EmployeeComponents/Loan"
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
    <div className="row js-animation">
        <Col md={6} >
            <Attendance atndceData={data.last_week_attendance} CallBack={handleDataProcessing}/>
        </Col>
        <Col md={6}>
          <Allowances data={data} />
        </Col>
      </div>
      <Row>
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
      </Row>
     
   </Fragment> 
  )
}

export default EmployeeDashboard