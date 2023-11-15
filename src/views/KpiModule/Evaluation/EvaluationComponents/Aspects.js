import React, {Fragment, useState, useEffect} from 'react'
import { Card, CardBody, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import Parameters from './Parameters'
const Aspects = ({ data }) => {
    const [active, setActive] = useState('1')
    const [parameterData, setParameterData] = useState([])

  const toggle = (tab, parameter) => {
    if (active !== tab) {
      setActive(tab)
    }
    if (parameter.length > 0) {
        setParameterData(parameter)
    }
  }
   useEffect(() => (
    setParameterData([])
   ), [setParameterData])
  return (
    <Fragment>
            <div className='nav-vertical configuration_panel'>
            <Nav tabs className='nav-left'>
              <NavItem>
                 <h3 className='brand-text'> Aspects</h3>
              </NavItem>
              <NavItem>
              {data.map((item, index) => (
                <NavLink
                    key={index}
                    active={active === item.id}
                    onClick={() => {
                    toggle(item.id, item.aspect_parameters)
                    }}
                >
                   {item.title}
                </NavLink>
              ))}
                
              </NavItem>
            </Nav>
      
            <TabContent className='py-50' activeTab={active}>
                
            {data && data.length === 0 ? (
                <TabPane tabId='0'>
                <Card>
                    <CardBody>
                        <div className='text-center'><p>No Aspects found...</p></div>
                    </CardBody>
                </Card>
                </TabPane>
            ) : (
            active === '0' ? (
                   <TabPane tabId='0'>
                       <Card>
                           <CardBody>
                               <div className='text-center'><p>Select Aspect to get parameters...</p></div>
                           </CardBody>
                       </Card>
                 </TabPane>
               ) : (
                   <TabPane tabId={active}>
                       <Parameters data={parameterData} typeId={active}/>
                   </TabPane> 
               )
            )
               }   
           </TabContent>
          </div>        
    </Fragment>
  )
}

export default Aspects