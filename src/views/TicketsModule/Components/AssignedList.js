// ** React Imports
// import { useState } from 'react'
// import { Settings } from 'react-feather'

// ** Reactstrap Imports
// import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import AssignedTickets from './Admin/AssignedTickets'
// import GeneralTickets from './Admin/GeneralTickets'
// import ProcurementTickets from './Admin/ProcurementTickets'

const AssignedList = () => {
  // ** State
  // const [active, setActive] = useState('1')

  // const toggle = tab => {
  //   if (active !== tab) {
  //     setActive(tab)
  //   }
  // }

  return (
    <div className='nav-vertical configuration_panel'>
      <AssignedTickets />
      {/* <Nav tabs className='nav-left'>
        <NavItem>
           <h3 className='brand-text'> <Settings/> Tickets</h3>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '1'}
            onClick={() => {
              toggle('1')
            }}
          >
            General Tickets
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '2'}
            onClick={() => {
              toggle('2')
            }}
          >
            Procurement
          </NavLink>
        </NavItem>
       
      </Nav>

      <TabContent activeTab={active}>
        <TabPane tabId='1' className='tab-pane-blue'>
        {active === '1' ? <GeneralTickets type='assign'/> : null }
        </TabPane>
        <TabPane tabId='2' className='tab-pane-blue'>
        {active === '2' ? <ProcurementTickets type='assign'/> : null }
        </TabPane>
        
      </TabContent> */}
    </div>
  )
}
export default AssignedList
