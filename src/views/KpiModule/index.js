import { Fragment, useState } from "react"
import {TabContent, TabPane, Nav, NavItem, NavLink} from "reactstrap"
import EmployeeKpi from "./EmployeeKpi/index"
import EvaluationRequests from "./EvaluatorKpi/index"
 
const KpiModule = () => {
    
    const [active, setActive] = useState('1')
  
    const toggle = tab => {
        setActive(tab)
      }
   return (
        <div className='nav-vertical configuration_panel'>
      <Nav tabs className=''>
                                {/* <div className='col-md-6'> */}
                                    <NavItem >
                                    <NavLink
                                        active={active === '1'}
                                        onClick={() => {
                                        toggle('1')
                                        }}
                                    >
                                    Add KPI
                                    </NavLink>
                                    </NavItem>
                                {/* </div>
                                <div className='col-md-6'> */}
                                    <NavItem >
                                    <NavLink
                                        active={active === '2'}
                                        onClick={() => {
                                        toggle('2')
                                        }}
                                    >
                                        Evaluation Requests
                                    </NavLink>
                                    </NavItem>
                                
                                {/* </div> */}
                        </Nav>
                        <TabContent className='py-50' activeTab={active}>
                        <TabPane tabId={'1'} className='tab-pane'>
                                <EmployeeKpi />
                        </TabPane>
                        <TabPane tabId={'2'} className='tab-pane'>
                                <EvaluationRequests />
                        </TabPane>
                    </TabContent>
                    </div>
   )
}
export default KpiModule