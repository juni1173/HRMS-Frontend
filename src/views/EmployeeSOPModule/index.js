import React, { Fragment, useState, useEffect } from 'react'
import { Card, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, Spinner } from 'reactstrap'
import apiHelper from '../Helpers/ApiHelper'
import ManualsList from './ManualsList'
const index = () => {
    const Api = apiHelper()
    const [contentLoad, setContentLoad] = useState(false)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [types] = useState([])
    const [active, setActive] = useState('0')

    const toggle =  tab => {
        setContentLoad(true)
      if (active !== tab) {
         setActive(tab)
      }
      setTimeout(() => {
        setContentLoad(false)
      }, 500)
    }
   
    const preDataApi = async () => {
        setLoading(true)
        const response = await Api.get('/manuals/')
        const typesRes = await Api.get('/manual/types/')

        if (response.status === 200) {
            setData(response.data)
        } else {
            return Api.Toast('error', 'Manuals data not found')
        }
        if (typesRes.status === 200) {
            types.splice(0, types.length)
            const typesData = typesRes.data
            if (typesData.length > 0) {
                for (let i = 0; i < typesData.length; i++) {
                    types.push({value: typesData[i].id, label: typesData[i].title})
                }
            }
            setTimeout(() => {
                setLoading(false)
            }, 500)
        } else {
            setLoading(false)
            return false
        }
    }
    useEffect(() => {
        preDataApi()
        }, [setData, types])
        
  return (
    <Fragment>
        {!loading ? (
            <>
        <Nav tabs>
            {types.map((item, key) => (
                <NavItem key={key}>
                    <NavLink
                    active={active === item.value}
                    onClick={() => {
                        toggle(item.value)
                    }}
                    >
                    {item.label}
                    </NavLink>
                </NavItem>
            ))}
        </Nav>
        {!contentLoad ? (
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
                               <div className='text-center'><p>Select type to get manuals...</p></div>
                           </CardBody>
                       </Card>
                 </TabPane>
               ) : (
                   <TabPane tabId={active}>
                       <ManualsList data={data} typeId={active}/>
                   </TabPane> 
               )
            )
               }   
           </TabContent>
        ) : (
            <div className='text-center'><Spinner color='primary'/></div>
        )}
    
    </>
    ) : (
        <div className='text-center'><Spinner type='grow' color='primary'/></div>
    )}
  </Fragment>
    
  )
}

export default index