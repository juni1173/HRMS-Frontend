import React, { Fragment, useState } from 'react'
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'
import CertificationFunction from './CertificationFunction'
import ApprovalsList from './Approvals/index'
const index = () => {
    const [active, setActive] = useState('1')
    const toggle = tab => {
        setActive(tab)
      }
  return (
    <Fragment>
    <h2>Certifications</h2>
    <div className='nav-vertical configuration_panel'>
        <Nav tabs className='nav-left'>
                            
                                <NavItem >
                                <NavLink
                                    active={active === '1'}
                                    onClick={() => {
                                    toggle('1')
                                    }}
                                >
                                Your Certifications
                                </NavLink>
                                </NavItem>
                            
                                <NavItem >
                                <NavLink
                                    active={active === '2'}
                                    onClick={() => {
                                    toggle('2')
                                    }}
                                >
                                    Approval Requests
                                </NavLink>
                               
                                </NavItem>
                            
                            {/* </div> */}
        </Nav>
        <TabContent className='py-50' activeTab={active}>
                    <TabPane tabId={'1'} className='tab-pane-blue'>
                         <CertificationFunction />
                    </TabPane>
                    <TabPane tabId={'2'} className='tab-pane-blue'>
                                    <ApprovalsList />
                    </TabPane>
                   
        </TabContent>
    </div>
    </Fragment>
  )
}

export default index