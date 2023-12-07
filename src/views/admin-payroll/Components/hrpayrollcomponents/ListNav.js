import React, { Fragment, useState, useEffect, Suspense } from 'react'
import { Card, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, Spinner, Badge } from 'reactstrap'

const ListNav = ({ content, apiCall, batch }) => {
  const [active, setActive] = useState('1')
  const [loading, setLoading] = useState(true)

  const toggle = tab => {
    if (active !== tab) {
      setActive(tab)
    }
  }
  const Staffclassification = active === '1' ? React.lazy(() => import('./staffclassification')) : null
  const SelectEmployees = active === '2' ? React.lazy(() => import('./SelectEmployees')) : null
  const VariableAmount = active === '3' ? React.lazy(() => import('./VariableAmount')) : null
  const FixedAmount = active === '4' ? React.lazy(() => import('./FixedAmount')) : null

  useEffect(() => {
    if (content) {
      if (content.payroll_attribute_valueType_title === 'FFSC') {
        setActive('1') // Set "Staff Classification" as default tab
      }  else if (content.payroll_attribute_valueType_title === 'Variable') {
        setActive('3') // Set "Variable Bonuses" as default tab
      }  else if (content.payroll_attribute_valueType_title === 'Fixed') {
        setActive('4') // Set "Fixed Distributions" as default tab
      }
 //  else if (content.payroll_attribute_is_employee_base) {
      //   setActive('2') // Set "Employees" as default tab
      // }
      
      setLoading(false)
    } else {
      setLoading(true)
    }
  }, [])

  return (
    <Fragment>
      {!loading ? (
        <>
        <Card>
          <CardBody>
            <div className="nav-vertical configuration_panel">
              <Nav tabs>
              {content.payroll_attribute_valueType_title === 'FFSC' ? <NavItem>
                  <NavLink
                    active={active === '1'}
                    onClick={() => {
                      toggle('1')
                    }}
                  >
                  Staff Classification
                  </NavLink>
                </NavItem> : null }
                {/* {content.payroll_attribute_is_employee_base ? (
                  <NavItem>
                    <NavLink
                      active={active === '2'}
                      onClick={() => {
                        toggle('2')
                      }}
                    >
                    Employees
                    </NavLink>
                  </NavItem>
                ) : null} */}
                {content.payroll_attribute_valueType_title === 'Variable' ? <NavItem>
                  <NavLink
                    active={active === '3'}
                    onClick={() => {
                      toggle('3')
                    }}
                  >
                    Variable Allowances
                  </NavLink>
                </NavItem> : null}
                {content.payroll_attribute_valueType_title === 'Fixed' ?  <NavItem>
                  <NavLink
                    active={active === '4'}
                    onClick={() => {
                      toggle('4')
                    }}
                  >
                    Fixed Distrubutions
                  </NavLink>
                </NavItem> : null}
              </Nav>
              <TabContent activeTab={active}>
                <Suspense fallback={<div className="text-center"><Spinner color="primary" type="grow" /></div>}>
                {content.payroll_attribute_valueType_title === 'FFSC' ? (
                  <TabPane tabId="1">
                 {Staffclassification && <Staffclassification content={content} apiCall={apiCall} batch={batch}/>}
                  </TabPane>) : null}
                  {/* {content.payroll_attribute_is_employee_base ? (
                    <TabPane tabId="2">
                      {SelectEmployees && <SelectEmployees content={content} apiCall={apiCall} batch={batch}/>}
                    </TabPane>
                  ) : null} */}
                  {content.payroll_attribute_valueType_title === 'Variable' ? (
                  <TabPane tabId="3">
                    {VariableAmount && <VariableAmount content={content} apiCall={apiCall} batch={batch}/>}
                  </TabPane>) : null}
                  {content.payroll_attribute_valueType_title === 'Fixed' ? (
                  <TabPane tabId="4">
                   {FixedAmount && <FixedAmount content={content} apiCall={apiCall} batch={batch}/> }
                  </TabPane>) : null}
                </Suspense>
              </TabContent>
            </div>
          </CardBody>
        </Card>
        </>
      ) : (
        <div className="text-center">
          <Spinner color="primary" type="grow" />
        </div>
      )}
    </Fragment>
  )
}

export default ListNav
