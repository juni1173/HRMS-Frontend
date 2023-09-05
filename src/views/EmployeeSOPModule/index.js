import React, { Fragment, useState, useEffect } from 'react'
import { Card, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, Col, CardHeader } from 'reactstrap'
import apiHelper from '../Helpers/ApiHelper'
import Manualpdfreader from './Manualpdfreader'
const index = () => {
    const Api = apiHelper()
    const [active, setActive] = useState('1')
    const [data, setData] = useState([])
    const [filePath, setFilePath] = useState('')
    
    const toggle = (tab, document) => {
      if (active !== tab) {
        setActive(tab)
      }
      if (document) {
        setFilePath(document)
      }
    }
   
    const preDataApi = async () => {
        const response = await Api.get('/manuals/')
        
        if (response.status === 200) {
            setData(response.data)
            
        } else {
            return Api.Toast('error', 'Pre server data not found')
        }
    }
    useEffect(() => {
        preDataApi()
        }, [setData])
        
  return (
    <Fragment>
        <Card>
            <CardHeader>
                <h2>Policy Manuals</h2>
            </CardHeader>
            <CardBody>
            <div className='row'>
                {Object.values(data).length > 0 && (
                    data.map((item, key) => (
                        <Col md={2} className='border-right mb-2'>
                        <Nav tabs className='justify-content-center'>
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
                        </Col>
                    ))
                )}
            </div>
      <TabContent activeTab={active}>
        <TabPane tabId={active}>
           {filePath && (
            <Manualpdfreader file={filePath} />
           )}                     
          
        </TabPane>
      </TabContent>
            </CardBody>
        </Card>
    </Fragment>
  )
}

export default index