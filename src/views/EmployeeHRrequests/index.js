import React, { Fragment, useState } from 'react'
import { Card, CardBody, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import { HelpCircle } from 'react-feather'
const index = () => {
    const [active, setActive] = useState('1')
    const toggle = tab => {
      if (active !== tab) {
        setActive(tab)
      }
    }

  return (
    <Fragment>
        <Card>
            <CardBody>
            <div className='nav-vertical configuration_panel'>
      <Nav tabs className='nav-left'>
      <NavItem>
           <h3 className='brand-text'> <HelpCircle/> Requests</h3>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '1'}
            onClick={() => {
              toggle('1')
            }}
          >
            Gym
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '2'}
            onClick={() => {
              toggle('2')
            }}
          >
            Medical
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '3'}
            onClick={() => {
              toggle('3')
            }}
          >
            Leaves
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={active}>
        <TabPane tabId='1'>
         <p>Gym</p>
        </TabPane>
        <TabPane tabId='2'>
        <p>Medical</p>
        </TabPane>
        <TabPane tabId='3'>
        <p>Leave</p>
        </TabPane>
      </TabContent>
    </div>
            </CardBody>
        </Card>
    </Fragment>
  )
}

export default index