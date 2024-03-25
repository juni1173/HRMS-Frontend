import React, { Fragment, useState, lazy, Suspense } from 'react'
import { Card, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, Row } from 'reactstrap'
// Lazy-loaded components
const Compensatory = lazy(() => import('./compensatory'))
const Approval = lazy(() => import('./compensatoryapproval'))

const ComTabs = () => {
    const [active, setActive] = useState('1')
    const toggle = (tab) => {
        if (active !== tab) {
            setActive(tab)
        }
    }
    const renderComponent = () => {
        switch (active) {
            case '1':
                return <Compensatory />
            case '2':
                return <Approval />
            default:
                return null
        }
    }

    return (
        <Fragment>
            <Row>
            <Card className='bg-mirror'>
                <CardBody>
                    <div className='configuration_panel'>
                        <Nav tabs className='nav-horizontal'>
                            {[1, 2].map((tabId) => (
                                <NavItem key={tabId}>
                                    <NavLink active={active === tabId.toString()} onClick={() => toggle(tabId.toString())}>
                                        {tabId === 1 ? 'Claimed Leaves' : 'Approvals'}
                                    </NavLink>
                                </NavItem>
                            ))}
                        </Nav>
                    </div>
                    <TabContent activeTab={active}>
                        <TabPane tabId={active}>
                            <Suspense fallback={<div>Loading...</div>}>{renderComponent()}</Suspense>
                        </TabPane>
                    </TabContent>
                </CardBody>
            </Card>
            </Row>
        </Fragment>
    )
}

export default ComTabs
