import React, { Fragment, useState, useEffect, useCallback } from 'react'
import { Card, CardBody, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import Reimbursement from './Components/Reimbursement'
import Medical_Limit from './Components/Medical'
import Leaves from './Components/Leaves'
import apiHelper from '../../../Helpers/ApiHelper'
const index = () => {
    const Api = apiHelper()
    const [active, setActive] = useState('1')
    const [staffdropdown] = useState([])
    const [data, setData] = useState([])
    const [leaveData, setLeaveData] = useState({
        types: '',
        duration: ''
    })
    const toggle = tab => {
      if (active !== tab) {
        setActive(tab)
      }
    }
   
    const preDataApi = async () => {
        const response = await Api.get('/reimbursements/pre/data/')
        
        if (response.status === 200) {
            setData(response.data)
            setLeaveData(prevState => ({
                ...prevState,
                types : response.data.leave_types,
                duration : response.data.set_leave_duration
                
                }))
            const sc_data = await response.data.staff_classification            
            staffdropdown.splice(0, staffdropdown.length)
            for (let i = 0; i < sc_data.length; i++) {
                    staffdropdown.push({value:sc_data[i].id, label: sc_data[i].title })
            } 
        } else {
            return Api.Toast('error', 'staff Classifications not found')
        }
    }
    useEffect(() => {
        preDataApi()
        }, [])
        const handleDataProcessing = useCallback(() => {
            preDataApi()
          }, [data])
  return (
    <Fragment>
        <Card>
            <CardBody>
            <div className='nav-vertical configuration_panel'>
      <Nav tabs>
        <NavItem>
          <NavLink
            active={active === '1'}
            onClick={() => {
              toggle('1')
            }}
          >
            Gym Allowance
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '2'}
            onClick={() => {
              toggle('2')
            }}
          >
            Medical Allowance
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '3'}
            onClick={() => {
              toggle('3')
            }}
          >
            Leaves
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={active}>
        <TabPane tabId='1'>
          <Reimbursement staffdropdown={staffdropdown} data={data.gym_allowance} CallBack={handleDataProcessing}/>
        </TabPane>
        <TabPane tabId='2'>
          <Medical_Limit staffdropdown={staffdropdown} data={data.medical_allowance} CallBack={handleDataProcessing}/>
        </TabPane>
        <TabPane tabId='3'>
          <Leaves staffdropdown={staffdropdown} data={leaveData} CallBack={handleDataProcessing}/>
        </TabPane>
      </TabContent>
    </div>
            </CardBody>
        </Card>
    </Fragment>
  )
}

export default index