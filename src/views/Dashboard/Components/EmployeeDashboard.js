import { Fragment } from "react"
import { Row, Col, CardBody, Card, Container } from "reactstrap"
import Notes from "../../Kind-Notes/Components/Notes"
import Attendance from "../../EmployeeAttendance/index"
const EmployeeDashboard = () => {
  
  return (
   <Fragment>
    <Container>
    <div className="row js-animation">
        <Col md={6} >
            <Attendance />
        </Col>
        <Col md={6}>
          <Card>
            <CardBody>
              <Notes />
            </CardBody>
          </Card>
          
        </Col>
      </div>
      <Row>
      <Col md={4}>
            <Card>
              <CardBody>
                  <p>Learning Deve</p>
              </CardBody>
            </Card>
        </Col>
      </Row>
      </Container>
     
   </Fragment> 
  )
}

export default EmployeeDashboard