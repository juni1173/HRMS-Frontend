// ** React Imports
import { useState } from 'react'
import { Settings } from 'react-feather'

// ** Reactstrap Imports
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import Roles from './RolesConfiguration/Roles'
import EmailIndex from '../EmailModule'
import SalaryComposition from './SalaryComposition'

const Configuration = () => {
  // ** State
  const [active, setActive] = useState('1')

  const toggle = tab => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  return (
    <div className='nav-vertical configuration_panel'>
      <Nav tabs className='nav-left'>
        <NavItem>
           <h3 className='brand-text'> <Settings/> Configurations</h3>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '1'}
            onClick={() => {
              toggle('1')
            }}
          >
            Role Types
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '2'}
            onClick={() => {
              toggle('2')
            }}
          >
            Roles
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '3'}
            onClick={() => {
              toggle('3')
            }}
          >
            Email Templates
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '4'}
            onClick={() => {
              toggle('4')
            }}
          >
            Salary Composition
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={active}>
        <TabPane tabId='1' className='tab-pane-blue'>
          <p className='text-white'> Coming Soon...!</p>
        </TabPane>
        <TabPane tabId='2' className='tab-pane-blue'>
          <Roles />
        </TabPane>
        <TabPane tabId='3' className='tab-pane-blue'>
          <EmailIndex/>
        </TabPane>
        <TabPane tabId='4' className='tab-pane-blue'>
          <SalaryComposition />
        </TabPane>
      </TabContent>
    </div>
  )
}
export default Configuration
