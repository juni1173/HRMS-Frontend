import React, { Fragment, useState } from 'react'
// import PermissionsHelper from '../../Helpers/PermissionsHelper'
import { Card, Row, Col, CardBody, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import Charts from './Charts/EmployeeChart'
import EventsCalender from './Calender/index'
import EmployeeDash from './EmployeeComponents'
import Attendance from "./EmployeeComponents/Attendance"
import Allowances from "./EmployeeComponents/Allowances"
import Leaves from "./EmployeeComponents/Leaves"
import Loan from "./EmployeeComponents/Loan"
import LearningDevelopment from "./EmployeeComponents/LearningDevelopment/index"
import JiraIssues from "./EmployeeComponents/JiraIssues/Issues"
import LeavesCount from "./EmployeeComponents/LeavesCount"
import MedicalLimit from "./EmployeeComponents/MedicalLimit"
import GymLimit from "./EmployeeComponents/GymLimit"
import Calendar from "./EmployeeComponents/AttendanceCalendar"
const EmployeeDashboard = () => {
    // const Permissions = PermissionsHelper()
    const [active, setActive] = useState('1')
    const toggle = tab => {
      if (active !== tab) {
        setActive(tab)
      }
    }
  return (
    // Permissions.admin ? (
        <Fragment>
            <Card>
              <CardBody style={{padding:'0.5rem 1.5rem'}}>
                <Row>
                  <Col md='3'>
                    {active === '1' && <h3 style={{paddingTop:'0.5rem'}}>Dashboard</h3>}
                    {active === '2' &&  <h3 style={{paddingTop:'0.5rem'}}>Charts</h3>}
                    {active === '3' &&  <h3 style={{paddingTop:'0.5rem'}}>Calender</h3>}
                  </Col>
                  <Col md='6'>
                  <Nav className='justify-content-center' tabs>
                    <NavItem>
                      <NavLink
                        active={active === '1'}
                        onClick={() => {
                          toggle('1')
                        }}
                      >
                        Dashboard
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        active={active === '2'}
                        onClick={() => {
                          toggle('2')
                        }}
                      >
                        Charts
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        active={active === '3'}
                        onClick={() => {
                          toggle('3')
                        }}
                      >
                        Calender
                      </NavLink>
                    </NavItem>
                  </Nav>
      
                  </Col>
                  <Col md='3'>
                    {/* <Button color='gradient-secondary'>Secondary</Button> */}
                  </Col>
                </Row>
              </CardBody>
            </Card>
            
              <TabContent className='py-50' activeTab={active}>
                <TabPane tabId='1'>
                
                {active === '1' ? (
                    <>
                      <EmployeeDash />
                    </>
                  ) : (
                    <Card>
                      <CardBody>
                        <p>No Dashboard Found!</p>
                      </CardBody>
                    </Card>
                  )}
                 
                </TabPane>
                <TabPane tabId='2'>
                  {active === '2' ? (
                    <>
                      <Charts />
                    </>
                  ) : (
                    <Card>
                      <CardBody>
                        <p>No Charts Found!</p>
                      </CardBody>
                    </Card>
                  )}
                </TabPane>
                <TabPane tabId='3'>
                {active === '3' ? (
                    <>
                     <Card>
                      <CardBody>
                        <EventsCalender />
                      </CardBody>
                      </Card>
                    </>
                  ) : (
                    <Card>
                      <CardBody>
                        <p>No Calender Found!</p>
                      </CardBody>
                    </Card>
                  )}
                  
                 
                </TabPane>
              </TabContent>
            
        </Fragment>
    // ) : (
    //     <div>You do not have access...</div>
    // )
    
  )
}

export default EmployeeDashboard