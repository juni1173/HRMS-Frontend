import React, { Fragment, useState } from 'react'
// import PermissionsHelper from '../../Helpers/PermissionsHelper'
import { Card, Row, Col, CardBody, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import Configuration from './Components/PayrollConfigurations'
import EmployeeSalary from './Components/emp-salary'
import Index from './Components/hrpayrollcomponents/AllPayrollBatches'
import SalaryBatches from './Components/AccountantView.js/AllSalaryBatches' 
import RecordBatches from './Components/SalaryRecords/SalaryBatches'
const Tabs = () => {
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
                    {active === '1' && <h3 style={{paddingTop:'0.5rem'}}>Confiuration</h3>}
                    {active === '2' &&  <h3 style={{paddingTop:'0.5rem'}}>Permission</h3>}
                    {active === '3' &&  <h3 style={{paddingTop:'0.5rem'}}>Batch</h3>}
                    {active === '4' &&  <h3 style={{paddingTop:'0.5rem'}}>Salaries</h3>}
                    {active === '5' &&  <h3 style={{paddingTop:'0.5rem'}}>Records</h3>}
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
                        Configuration
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        active={active === '2'}
                        onClick={() => {
                          toggle('2')
                        }}
                      >
                        Permission
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        active={active === '3'}
                        onClick={() => {
                          toggle('3')
                        }}
                      >
                        Batch
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        active={active === '4'}
                        onClick={() => {
                          toggle('4')
                        }}
                      >
                        Salaries
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        active={active === '5'}
                        onClick={() => {
                          toggle('5')
                        }}
                      >
                        Records
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
                      <Configuration />
                    </>
                  ) : (
                    <Card>
                      <CardBody>
                        <p>No Configuration Found!</p>
                      </CardBody>
                    </Card>
                  )}
                 
                </TabPane>
                <TabPane tabId='2'>
                  {active === '2' ? (
                    <>
                      <EmployeeSalary />
                    </>
                  ) : (
                    <Card>
                      <CardBody>
                        <p>No Permission Found!</p>
                      </CardBody>
                    </Card>
                  )}
                </TabPane>
                <TabPane tabId='3'>
                {active === '3' ? (
                    <>
                     {/* <Card>
                      <CardBody> */}
                        <Index />
                      {/* </CardBody>
                      </Card> */}
                    </>
                  ) : (
                    <Card>
                      <CardBody>
                        <p>No Batch Found!</p>
                      </CardBody>
                    </Card>
                  )}        
                </TabPane>
                <TabPane tabId='4'>
                {active === '4' ? (
                    <>
                     {/* <Card>
                      <CardBody> */}
                        <SalaryBatches />
                      {/* </CardBody>
                      </Card> */}
                    </>
                  ) : (
                    <Card>
                      <CardBody>
                        <p>No Batch Found!</p>
                      </CardBody>
                    </Card>
                  )}        
                </TabPane>
                <TabPane tabId='5'>
                {active === '5' ? (
                    <>
                     {/* <Card>
                      <CardBody> */}
                        <RecordBatches />
                      {/* </CardBody>
                      </Card> */}
                    </>
                  ) : (
                    <Card>
                      <CardBody>
                        <p>No Batch Found!</p>
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

export default Tabs