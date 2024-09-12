import React, { Fragment, useState } from 'react'
// import PermissionsHelper from '../../Helpers/PermissionsHelper'
import { Card, Row, Col, CardBody, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import AttendanceHours from './AttendanceHours'
import AttendanceTable from './AttendanceTable'
const index = () => {
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
            {/* <Card>
              <CardBody style={{padding:'0.5rem 1.5rem'}}> */}
                <Row>
                  <Col md='3'>
                    {/* {active === '1' && <h3 style={{paddingTop:'0.5rem'}}>Attendance Overview</h3>}
                    {active === '2' &&  <h3 style={{paddingTop:'0.5rem'}}>Time Tracking</h3>} */}
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
                        Attendance Overview
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        active={active === '2'}
                        onClick={() => {
                          toggle('2')
                        }}
                      >
                        Time Tracking
                      </NavLink>
                    </NavItem>
                  </Nav>
      
                  </Col>
                  <Col md='3'>
                    {/* <Button color='gradient-secondary'>Secondary</Button> */}
                  </Col>
                </Row>
              {/* </CardBody>
            </Card> */}
            
              <TabContent className='py-50' activeTab={active}>
                <TabPane tabId='1'>
                
                {active === '1' ? (
                    <>
                      <AttendanceTable />
                    </>
                  ) : (
                    <Card>
                      <CardBody>
                        <p>No Attendance Found!</p>
                      </CardBody>
                    </Card>
                  )}
                 
                </TabPane>
                <TabPane tabId='2'>
                  {active === '2' ? (
                    <>
                      <AttendanceHours />
                    </>
                  ) : (
                    <Card>
                      <CardBody>
                        <p>No Attendance Found!</p>
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

export default index