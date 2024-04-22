// ** React Imports
import { useState } from 'react'
import { Trello } from 'react-feather'

// ** Reactstrap Imports
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import ESSReports from './Components/ESSReport/index'
import Attendance from './Components/Attendance/index'
import Organogram from './Components/Organogram/index'
import EmployeeReport from './Components/EmployeeReport/index'


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
        <NavItem>
          <NavLink
            active={active === '4'}
            onClick={() => {
              toggle('4')
            }}
          >
            Employee Report
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={active}>
        <TabPane tabId='1' className='tab-pane'>
        {active === '1' ?  <ESSReports /> : null}
        </TabPane>
        <TabPane tabId='2' className='tab-pane-blue'>
        {active === '2' ? <Attendance /> : null} 
          
        </TabPane>
        <TabPane tabId='3' className='tab-pane'>
        {active === '3' ? <Organogram /> : null}
        </TabPane>
        <TabPane tabId='4' className='tab-pane'>
         {active === '4' ? <EmployeeReport /> : null} 
        </TabPane>
      </TabContent>
    </div>
  )
}
export default index
