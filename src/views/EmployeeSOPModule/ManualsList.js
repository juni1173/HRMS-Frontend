import {React, Fragment, useState} from 'react'
import { Card, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, Col, CardHeader } from 'reactstrap'
import Manualpdfreader from './Manualpdfreader'

const ManualsList = ({data, typeId}) => {
    const [active, setActive] = useState('1')
    const [filePath, setFilePath] = useState('')
    const toggle = (tab, document) => {
        if (active !== tab) {
          setActive(tab)
        }
        if (document) {
          setFilePath(document)
        }
      }
  return (
    <Fragment>
        <Card>
            <CardHeader>
                <h2>Policy Manuals</h2>
            </CardHeader>
            <CardBody>
            <div className='row'>
                <Col md="3">
                {Object.values(data).length > 0 && (
                    data.map((item, key) => (
                        <div key={key}>
                        {item.manual_type === typeId && (
                        <Nav tabs className='nav-left'>
                            <NavItem>
                            <NavLink
                            active={active === key}
                                onClick={() => {
                                toggle(key, item.document)
                                }}
                            >
                                {item.title}<br></br>
                                click to view
                            </NavLink>
                            </NavItem>
                        </Nav>
                        )}
                        </div>
                    ))
                )}
                </Col>
                <Col md={9}>
                <TabContent activeTab={active}>
                    <TabPane tabId={active} className='tab-pane-blue'>
                    {filePath && (
                        <Manualpdfreader file={filePath} />
                    )}                     
                    
                    </TabPane>
                </TabContent>
                </Col>
                
            </div>
      
            </CardBody>
        </Card>
    </Fragment>
  )
}

export default ManualsList