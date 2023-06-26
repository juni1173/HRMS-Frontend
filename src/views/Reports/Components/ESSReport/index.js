// ** React Imports
import { useState } from 'react'
import { Trello } from 'react-feather'

// ** Reactstrap Imports
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import GymReport from './Components/GymReport'
import MedicalReport from './Components/MedicalReport'
import LeavesReport from './Components/LeavesReport'

const index = () => {
  // ** State
  const [active, setActive] = useState('1')

  const toggle = tab => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  return (
    <div className='nav-vertical configuration_panel'>
        <h3 className='brand-text'> <Trello/> ESS Reports</h3>
      <Nav tabs className='organization-tabs'>
        
        <NavItem className='mr-1 border-right pr-1'>
          <NavLink
            active={active === '1'}
            onClick={() => {
              toggle('1')
            }}
            className='p-2 border-right'
          >
            Gym Report
          </NavLink>
        </NavItem>
        <NavItem className='mr-1 border-right pr-1'>
          <NavLink
            active={active === '2'}
            onClick={() => {
              toggle('2')
            }}
            className='p-2'
          >
            Medical Report
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '3'}
            onClick={() => {
              toggle('3')
            }}
            className='p-2'
          >
            Leaves Report
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={active}>
        <TabPane tabId='1' className='tab-pane-blue'>
          <GymReport />
        </TabPane>
        <TabPane tabId='2' className='tab-pane-blue'>
          <MedicalReport />
        </TabPane>
        <TabPane tabId='3' className='tab-pane-blue'>
          <LeavesReport />
        </TabPane>
      </TabContent>
    </div>
  )
}
export default index
