// ** React Imports
import { Fragment } from 'react'

// ** Reactstrap Imports
import { Nav, NavItem, NavLink, TabContent, TabPane, Row, Col } from 'reactstrap'

// ** Icons Imports
import { User, Lock, Bookmark, Bell, Link } from 'react-feather'

// ** User Components
import PersonalDetail from './PersonalDetail'
import OfficeDetail from './OfficeDetail'
import ProjectDetail from './ProjectDetail'
import ContactDetail from './ContactDetail'
import BankDetail from './BankDetails'
import ExperienceDetail from './ExperienceDetail'
import EducationDetail from './EducationDetail'
import SkillDetail from './SkillDetail'
import DependentDetail from './DependentDetail'
import About from './About'
import Analytics from './Analytics'
const UserTabs = ({ active, toggleTab, empData, CallBack, url_params }) => {
  return (
    <Fragment>
      <Nav tabs className='mb-2'>
      <NavItem>
          <NavLink active={active === '1'} onClick={() => toggleTab('1')}>
            {/* <User className='font-medium-3 me-50' /> */}
            <span className='fw-bold'>About</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '2'} onClick={() => toggleTab('2')}>
            {/* <User className='font-medium-3 me-50' /> */}
            <span className='fw-bold'>Office</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '10'} onClick={() => toggleTab('10')}>
            {/* <User className='font-medium-3 me-50' /> */}
            <span className='fw-bold'>Analytics</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '3'} onClick={() => toggleTab('3')}>
            {/* <Lock className='font-medium-3 me-50' /> */}
            <span className='fw-bold'>Project</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '4'} onClick={() => toggleTab('4')}>
            {/* <Bookmark className='font-medium-3 me-50' /> */}
            <span className='fw-bold'>Contact</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '5'} onClick={() => toggleTab('5')}>
            {/* <Bell className='font-medium-3 me-50' /> */}
            <span className='fw-bold'>Bank</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '6'} onClick={() => toggleTab('6')}>
            {/* <Link className='font-medium-3 me-50' /> */}
            <span className='fw-bold'>Experience</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '7'} onClick={() => toggleTab('7')}>
            {/* <Link className='font-medium-3 me-50' /> */}
            <span className='fw-bold'>Education</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '8'} onClick={() => toggleTab('8')}>
            {/* <Link className='font-medium-3 me-50' /> */}
            <span className='fw-bold'>Skills</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '9'} onClick={() => toggleTab('9')}>
            {/* <Link className='font-medium-3 me-50' /> */}
            <span className='fw-bold'>Dependents</span>
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={active}>
      <TabPane tabId='1'>
          {/* <UserProjectsList />
          <UserTimeline />
          <InvoiceList /> */}
            <About empData={empData} CallBack={CallBack}/>
        </TabPane>
        <TabPane tabId='2'>
          {/* <UserProjectsList />
          <UserTimeline />
          <InvoiceList /> */}
            <OfficeDetail empData={empData} CallBack={CallBack}/>
        </TabPane>
        <TabPane tabId='10'>
          {/* <UserProjectsList />
          <UserTimeline />
          <InvoiceList /> */}
           {active === '10' ? (
              <Analytics empData={empData} CallBack={CallBack}/>
           ) : null}
            
        </TabPane>
        <TabPane tabId='3'>
          {/* <SecurityTab /> */}
          <ProjectDetail empData={empData} CallBack={CallBack}/>
        </TabPane>
        <TabPane tabId='4'>
          {/* <BillingPlanTab /> */}
          < ContactDetail empData={empData} CallBack={CallBack} url_params={url_params}/>
        </TabPane>
        <TabPane tabId='5'>
          {/* <Notifications /> */}
          < BankDetail empData={empData} CallBack={CallBack} url_params={url_params}/>
        </TabPane>
        <TabPane tabId='6'>
          {/* <Connections /> */}
          <ExperienceDetail empData={empData} CallBack={CallBack} url_params={url_params}/>
        </TabPane>
        <TabPane tabId='7'>
          {/* <Connections /> */}
          <EducationDetail empData={empData} CallBack={CallBack} url_params={url_params}/>
        </TabPane>
        <TabPane tabId='8'>
          {/* <Connections /> */}
          <SkillDetail empData={empData} CallBack={CallBack} url_params={url_params}/>
        </TabPane>
        <TabPane tabId='9'>
          {/* <Connections /> */}
          <DependentDetail empData={empData} CallBack={CallBack} url_params={url_params}/>
        </TabPane>
      </TabContent>
    </Fragment>
  )
}
export default UserTabs
