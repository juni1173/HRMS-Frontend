import { Fragment, useEffect, useState, useCallback } from "react"
import { Row, Col, CardBody, Card, Spinner, CardHeader, TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap"
import Masonry from 'react-masonry-component'
import apiHelper from "../../Helpers/ApiHelper"
// import Notes from "./EmployeeComponents/KindNotes/Components/Notes"
import Attendance from "./EmployeeComponents/Attendance"
import Allowances from "./EmployeeComponents/Allowances"
import Leaves from "./EmployeeComponents/Leaves"
import Loan from "./EmployeeComponents/Loan"
import LearningDevelopment from "./EmployeeComponents/LearningDevelopment/index"
import JiraIssues from "./EmployeeComponents/JiraIssues/Issues"
import LeavesCount from "./EmployeeComponents/LeavesCount"
import MedicalLimit from "./EmployeeComponents/MedicalLimit"
const EmployeeDashboard = () => {
  const Api = apiHelper()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState(0)

  const toggleTab = (tabIndex) => {
    setActiveTab(tabIndex)
  }


//   const [kindNotes, setKindNotes] = useState({
//     recieved: '',
//     sent: ''
// })
  const preDataApi = async () => {
    setLoading(true)
    const response = await Api.get('/employees-self-service/homepage/')
    
    if (response.status === 200) {
        setData(response.data)
        
        // setKindNotes(prevState => ({
        //   ...prevState,
        //   recieved : response.data.receiver_kind_notes,
        //   sent : response.data.sender_kind_notes
        //   }))
    } else {
        return Api.Toast('error', 'Server not found')
    }
    setTimeout(() => {
      setLoading(false)
    }, 500)
}
  useEffect(() => {
    preDataApi()
    }, [])
    const handleDataProcessing = useCallback(() => {
        preDataApi()
      }, [data])
  return (
   <Fragment>
    {!loading ? (
      <>
      {process.env.REACT_APP_API_URL === 'http://3.249.98.208/api' && (
        <Row>
        <Col md={12}>
        {data.employee_project_roles && Object.values(data.employee_project_roles).length > 0 && (
          <Card>
             
            <CardBody>
            <Row className="mb-3">
                <Col md="3">
                  <h3>Jira Performance Status</h3>
                </Col>
                <Col md="9">
                <Nav tabs>
              {data.employee_project_roles.map((item, index) => (
                <NavItem key={index}>
                  <NavLink
                    className={activeTab === index ? 'active' : ''}
                    onClick={() => toggleTab(index)}
                  >
                    {item.project_title}
                  </NavLink>
                </NavItem>
              ))}
            </Nav>
                </Col>
              </Row>
            <TabContent activeTab={activeTab}>
              {data.employee_project_roles.map((item, index) => (
                <TabPane key={index} tabId={index}>
                <JiraIssues key={index} data={item} />
                </TabPane>
              ))}
            </TabContent>
              
            </CardBody>
          </Card>
        )}
        </Col>
      </Row>
      )}
      
      <Masonry className="row js-animation">
        
        <Col md={6}>
            <Attendance atndceData={data.last_week_attendance} CallBack={handleDataProcessing}/>
        </Col>
        <Col md={6}>
          <Allowances data={data} />
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
        <Col md={6}>
        {data.Leaves_count && Object.values(data.Leaves_count).length > 0 && (
          <Card>
            <CardBody>
              <LeavesCount data={data.Leaves_count}/>
            </CardBody>
          </Card>
        )}
        </Col>
        <Col md={6}>
          <Card>
            <CardBody>
              <MedicalLimit data={data.medical_count}/>
            </CardBody>
          </Card>
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
      </>
    ) : (
      <div className="text-center"><Spinner color="primary"/></div>
    )}
    
   </Fragment> 
  )
}

export default EmployeeDashboard