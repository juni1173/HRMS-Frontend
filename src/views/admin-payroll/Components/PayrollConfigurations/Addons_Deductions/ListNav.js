import React, { Fragment, useState, useEffect, Suspense } from 'react'
import { Card, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, Spinner } from 'reactstrap'

const ListNav = ({ content }) => {
  const [active, setActive] = useState('1')
  const [loading, setLoading] = useState(true)

  const toggle = tab => {
    if (active !== tab) {
      setActive(tab)
    }
  }
  const Staffclassification = active === '1' ? React.lazy(() => import('./StaffClassification')) : null
  const SelectEmployees = active === '2' ? React.lazy(() => import('./SelectEmployees')) : null
  const FixedAmount = active === '3' ? React.lazy(() => import('./FixedAmount')) : null

  useEffect(() => {
    if (content) {
      setLoading(false)
      content.payroll_attribute_valueType_title === 'FFSC' ? setActive('1') : content.payroll_attribute_is_employee_base ? setActive('2') : content.payroll_attribute_valueType_title === 'Fixed' ? setActive('3') : setActive('4')
    } else {
      setLoading(true)
    }
  }, [content])

  return (
    <Fragment>
      {!loading ? (
        <Card>
          <CardBody>
            <div className="nav-vertical configuration_panel">
              <Nav tabs>
              {content.payroll_attribute_valueType_title === 'FFSC' ? (
                <NavItem>
                  <NavLink
                    active={active === '1'}
                    onClick={() => {
                      toggle('1')
                    }}
                  >
                  Staff Classification
                  </NavLink>
                </NavItem>) : null}
                {content.payroll_attribute_is_employee_base ? (
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
                ) : null}
                  {content.payroll_attribute_valueType_title === 'Fixed' ? (
                  <NavItem>
                    <NavLink
                      active={active === '3'}
                      onClick={() => {
                        toggle('3')
                      }}
                    >
                    Fixed Amount
                    </NavLink>
                  </NavItem>
                ) : null}
              </Nav>
              <TabContent activeTab={active}>
                <Suspense fallback={<div className="text-center"><Spinner color="primary" type="grow" /></div>}>
                {active === '4' ? (
                    <TabPane tabId="4">
                      <div>Nothing to display</div>
                    </TabPane>
                  ) : null}
                {active === '3' ? (
                    <TabPane tabId="3">
                       {FixedAmount && <FixedAmount content={content}/>}
                    </TabPane>
                  ) : null}
                {content.payroll_attribute_valueType_title === 'FFSC' ? (
                  <TabPane tabId="1">
                 {Staffclassification && <Staffclassification content={content}/>}
                  </TabPane>
                 ) : null}
                  {content.payroll_attribute_is_employee_base ? (
                    <TabPane tabId="2">
                      {SelectEmployees && <SelectEmployees content={content}/>}
                    </TabPane>
                  ) : null}
                </Suspense>
              </TabContent>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="text-center">
          <Spinner color="primary" type="grow" />
        </div>
      )}
    </Fragment>
  )
}

export default ListNav
