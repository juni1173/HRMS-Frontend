// ** React Imports
import { useState } from 'react'
import { Settings } from 'react-feather'

// ** Reactstrap Imports
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import EmailIndex from '../EmailModule'
import CandidateStages from './Candidatestages/Components/candidate_stages'
import EmployeeRequests from './EmployeeRequests/index'
import Roles from './RolesConfiguration/Roles'
import KpiSegmentationForm from './KpiSegmentations/SegmentationForm'
import Manuals from './ManualsSettings/index'
import Attendance from './AttendanceModule/index'
import Holidays from './Holidays/index'
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
            Candidate Stages
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '2'}
            onClick={() => {
              toggle('2')
            }}
          >
            Email Templates
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '3'}
            onClick={() => {
              toggle('3')
            }}
          >
            Set Employee Allowances
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '4'}
            onClick={() => {
              toggle('4')
            }}
          >
            Project Roles
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '5'}
            onClick={() => {
              toggle('5')
            }}
          >
            KPI Segmentation
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '6'}
            onClick={() => {
              toggle('6')
            }}
          >
            Manuals (SOP / EPM)
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '7'}
            onClick={() => {
              toggle('7')
            }}
          >
            Attendance
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '8'}
            onClick={() => {
              toggle('8')
            }}
          >
            Holidays
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent activeTab={active}>
        <TabPane tabId='1' className='tab-pane-blue'>
        {active === '1' ? <CandidateStages /> : null }
        </TabPane>
        <TabPane tabId='2' className='tab-pane-blue'>
        {active === '2' ? <EmailIndex/> : null }
        </TabPane>
        <TabPane tabId='3' className='tab-pane-blue'>
          {active === '3' ? <EmployeeRequests /> : null }
        </TabPane>
        <TabPane tabId='4' className='tab-pane-blue'>
          {active === '4' ? <Roles /> : null }
        </TabPane>
        <TabPane tabId='5' className='tab-pane'>
          {active === '5' ? <KpiSegmentationForm /> : null }
        </TabPane>
        <TabPane tabId='6' className='tab-pane-blue'>
          {active === '6' ? <Manuals /> : null }
        </TabPane>
      <TabPane tabId='7' className='tab-pane-blue'>
        {active === '7' ? <Attendance /> : null }
        </TabPane>
        <TabPane tabId='8' className='tab-pane-blue'>
          {active === '8' ? <Holidays /> : null }
        </TabPane>
      </TabContent>
    </div>
  )
}
export default Configuration
