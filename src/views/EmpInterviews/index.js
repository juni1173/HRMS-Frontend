import React, { Fragment, lazy, Suspense, useState} from 'react'
import { Card, CardBody, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import { HelpCircle } from 'react-feather'
// Lazy-loaded components
const Previous = lazy(() => import('./PreviousInterviews'))
const Upcoming = lazy(() => import('./UpcomingInterviews'))

const Index = () => {
    const [active, setActive] = useState('1')
    const toggle = (tab) => {
      if (active !== tab) {
        setActive(tab)
      }
    }
  const renderComponent = () => {
    switch (active) {
      case '1':
        return <Upcoming/>
      case '2':
        return <Previous/>
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
                  <HelpCircle /> Interviews
                </h3>
              </NavItem>
              {[1, 2].map((tabId) => (
                <NavItem key={tabId}>
                  <NavLink active={active === tabId.toString()} onClick={() => toggle(tabId.toString())}>
                    {tabId === 1 ? 'Upcoming' : 'Previous' }
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
