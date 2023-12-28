import React, { Fragment, useState, lazy, Suspense } from 'react'
import { Card, CardBody, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import { HelpCircle } from 'react-feather'

// Lazy-loaded components
const Gym = lazy(() => import('./Components/Gym'))
const Medical = lazy(() => import('./Components/Medical'))
const Leave = lazy(() => import('./Components/Leave'))
const PF = lazy(() => import('./Components/PF'))
const Loan = lazy(() => import('./Components/Loan'))

const Index = () => {
  const yearoptions = []

  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const [active, setActive] = useState('1')

  // for (let i = 0; i < 5; i++) {
  //   const year = currentYear - i
  //   yearoptions.push({ value: year, label: year.toString() })
  // }

  for (let i = 1; i >= -4; i--) {
    const year = currentYear + i
    yearoptions.push({ value: year, label: year.toString() })
  }
  
  const status_choices = [
    { value: 'in-progress', label: 'in-progress' },
    { value: 'under-review', label: 'under-review' },
    { value: 'not-approved', label: 'not-approved' },
    { value: 'approved', label: 'approved' }
  ]

  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  const renderComponent = () => {
    switch (active) {
      case '1':
        return <Gym status_choices={status_choices} yearoptions={yearoptions} />
      case '2':
        return <Medical status_choices={status_choices} yearoptions={yearoptions} />
      case '3':
        return <Leave status_choices={status_choices} yearoptions={yearoptions} />
      case '4':
        return <PF status_choices={status_choices} yearoptions={yearoptions} />
      case '5':
        return <Loan status_choices={status_choices} yearoptions={yearoptions} />
      default:
        return null
    }
  }

  return (
    <Fragment>
      <Card className='bg-mirror'>
        <CardBody>
          <div className='nav-vertical overflow-inherit configuration_panel'>
            <Nav tabs className='nav-left'>
              <NavItem>
                <h3 className='brand-text'>
                  {' '}
                  <HelpCircle /> ESS
                </h3>
              </NavItem>
              {[1, 2, 3, 4, 5].map((tabId) => (
                <NavItem key={tabId}>
                  <NavLink active={active === tabId.toString()} onClick={() => toggle(tabId.toString())}>
                    {tabId === 1 ? 'Gym' : tabId === 2 ? 'Medical' : tabId === 3 ? 'Leaves' : tabId === 4 ? 'Provident Fund' : 'Loan'}
                  </NavLink>
                </NavItem>
              ))}
            </Nav>
            <TabContent activeTab={active}>
              <TabPane tabId={active}>
                <Suspense fallback={<div>Loading...</div>}>{renderComponent()}</Suspense>
              </TabPane>
            </TabContent>
          </div>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default Index
