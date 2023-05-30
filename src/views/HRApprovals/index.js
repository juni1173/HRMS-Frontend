import React, { Fragment, useState, useEffect, useCallback } from 'react'
import { Card, CardBody, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import { HelpCircle } from 'react-feather'
import apiHelper from '../Helpers/ApiHelper'
import Gym from './Components/Gym'
import Medical from './Components/Medical'
import Leave from './Components/Leave'
import PF from './Components/PF'
import Loan from './Components/Loan'
const index = () => {
  const Api = apiHelper()
    const [active, setActive] = useState('1')
    const [data, setData] = useState([])
    const status_choices = [
      {value: 'un-processed', label: 'un-processed'},
      {value: 'in-progress', label: 'in-progress'},
      {value: 'not-approved', label: 'not-approved'},
      {value: 'approved', label: 'approved'}
  ]
 
    const toggle = tab => {
      if (active !== tab) {
        setActive(tab)
      }
    }
    const preDataApi = async () => {
      const response = await Api.get('/reimbursements/employee/requests/pre/data/')
      if (response.status === 200) {
          setData(response.data)
          console.warn(response.data)
      } else {
          return Api.Toast('error', 'Pre server data not found')
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
        <Card className='bg-mirror'>
            <CardBody>
            {/* <h3 className='brand-text text-center'> <HelpCircle/> ESS</h3> */}
            <div className='nav-vertical overflow-inherit configuration_panel'>
      <Nav tabs className='nav-left'>
      <NavItem>
           <h3 className='brand-text'> <HelpCircle/> ESS</h3>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '1'}
            onClick={() => {
              toggle('1')
            }}
          >
            Gym
          </NavLink>
        </NavItem>
         <NavItem>
          <NavLink
            active={active === '2'}
            onClick={() => {
              toggle('2')
            }}
          >
            Medical
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
        <NavItem>
          <NavLink
            active={active === '4'}
            onClick={() => {
              toggle('4')
            }}
          >
            Provident Fund
          </NavLink>
        </NavItem>
       <NavItem>
          <NavLink
            active={active === '5'}
            onClick={() => {
              toggle('5')
            }}
          >
            Loan
          </NavLink>
        </NavItem> 
      </Nav>
      <TabContent activeTab={active}>
        <TabPane tabId='1'>
         <Gym data={data.gym_allowance} status_choices={status_choices} CallBack={handleDataProcessing}/>
        </TabPane>
         <TabPane tabId='2'>
        <Medical data={data.medical_allowance} status_choices={status_choices} CallBack={handleDataProcessing}/>
        </TabPane>
        <TabPane tabId='3'>
        <Leave data={data.leaves} status_choices={status_choices} CallBack={handleDataProcessing} />
        </TabPane>
        <TabPane tabId='4'>
        <PF data={data.provident_fund} status_choices={status_choices} CallBack={handleDataProcessing} />
        </TabPane>
       <TabPane tabId='5'>
        <Loan data={data.loan} status_choices={status_choices} CallBack={handleDataProcessing} />
        </TabPane>
      </TabContent>
    </div>
            </CardBody>
        </Card>
    </Fragment>
  )
}

export default index