// ** React Imports
import { useState } from 'react'
import { Trello } from 'react-feather'

// ** Reactstrap Imports
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import ESSReports from './Components/ESSReport/index'
import AttendanceReport from './Components/AttendanceReport'
import Organogram from './Components/Organogram/index'

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
      <Nav tabs className='nav-left border-right px-1'>
        <NavItem>
           <h3 className='brand-text'> <Trello/> Reports</h3>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '1'}
            onClick={() => {
              toggle('1')
            }}
          >
            ESS
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '2'}
            onClick={() => {
              toggle('2')
            }}
          >
            Attendance
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '3'}
            onClick={() => {
              toggle('3')
            }}
          >
            Organogram
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={active}>
        <TabPane tabId='1' className='tab-pane'>
          <ESSReports />
        </TabPane>
        <TabPane tabId='2' className='tab-pane-blue'>
          <AttendanceReport />
        </TabPane>
        <TabPane tabId='3' className='tab-pane'>
          <Organogram />
        </TabPane>
      </TabContent>
    </div>
  )
}
export default index
