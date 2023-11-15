import React, {Fragment, useEffect, useState} from 'react'
import { Card, CardBody, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import { Settings } from 'react-feather'
import apiHelper from '../../Helpers/ApiHelper'
import Aspects from './EvaluationComponents/Aspects'
const DefaultEvaluationForm = () => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [active, setActive] = useState('1')
    const [aspectData, setAspectData] = useState([])

  const toggle = (tab, aspects) => {
    if (active !== tab) {
      setActive(tab)
    }
    if (aspects.length > 0) {
        setAspectData(aspects)
    }
  }
    const getPreData = async () => {
        
        await Api.get(`/evaluation/scale/group/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    setLoading(true)
                    if (result.data.length > 0) {
                        setData(result.data)
                        setLoading(false)
                    } 
                    
                } else {
                    Api.Toast('error', 'Server response error!')
                }
            }
        })
    }
    useEffect(() => {
        getPreData()
        return false
    }, [setData])
  return (
    <Fragment>
         {!loading ? (
            <div className='nav-vertical configuration_panel'>
            <Nav tabs className='nav-left'>
              <NavItem>
                 <h3 className='brand-text'>  Groups</h3>
              </NavItem>
              <NavItem>
              {data.map((item, index) => (
                <NavLink
                    key={index}
                    active={active === item.id}
                    onClick={() => {
                    toggle(item.id, item.group_aspects)
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
                        <div className='text-center'><p>No data found...</p></div>
                    </CardBody>
                </Card>
                </TabPane>
            ) : (
            active === '0' ? (
                   <TabPane tabId='0'>
                       <Card>
                           <CardBody>
                               <div className='text-center'><p>Select Evaluation group to get aspects...</p></div>
                           </CardBody>
                       </Card>
                 </TabPane>
               ) : (
                   <TabPane tabId={active}>
                      {aspectData && aspectData.length > 0 && (
                        <Aspects data={aspectData} typeId={active}/>
                      )} 
                   </TabPane> 
               )
            )
               }   
           </TabContent>
          </div>        
         ) : (
            <Card>
                <CardBody>
                    <div className='text-center'>No Data Found!</div>
                </CardBody>
            </Card>
         )}
    </Fragment>
  )
}

export default DefaultEvaluationForm