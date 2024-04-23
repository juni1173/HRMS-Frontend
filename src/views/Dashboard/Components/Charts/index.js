// ** React Imports
import { useState } from 'react'

// ** Reactstrap Imports
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import EmployeeReport from '../../../Reports/Components/EmployeeReport/index'
import AttendanceReport from '../../../Reports/Components/Attendance/index'
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
      <Nav tabs className='organization-tabs'>
        
        <NavItem className='mr-1 border-right pr-1'>
          <NavLink
            active={active === '1'}
            onClick={() => {
              toggle('1')
            }}
            className='p-2 border-right'
          >
            Employee Charts
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
            Attendance Charts
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={active}>
        <TabPane tabId='1' className='tab-pane-blue'>
          {active === '1' ? <EmployeeReport /> : null}
          
        </TabPane>
        <TabPane tabId='2' className='tab-pane-blue'>
        {active === '2' ?  <AttendanceReport /> : null}
        </TabPane>
      </TabContent>
    </div>
  )
}
export default index
