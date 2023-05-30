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
    const [leaveData, setLeaveData] = useState({
      leave_types: '',
      employee_leaves: ''
  })
  const [loanData, setLoanData] = useState({
    types: '',
    purpose_of_loan: '',
    time_frequency: '',
    time_period: '',
    set_loan_requirements: ''
})
    const toggle = tab => {
      if (active !== tab) {
        setActive(tab)
      }
    }
    const preDataApi = async () => {
      const response = await Api.get('/reimbursements/employee/pre/data/')
      if (response.status === 200) {
          setData(response.data)
          console.warn(response.data)
          setLeaveData(prevState => ({
            ...prevState,
            leave_types : response.data.leave_types,
            employee_leaves : response.data.employee_leaves
            
            }))
            setLoanData(prevState => ({
              ...prevState,
              types : response.data.loan_type,
              purpose_of_loan : response.data.purpose_of_loan,
              time_frequency: response.data.time_frequency,
              time_period: response.data.time_period,
              employee_loan: response.data.employee_loan
              
              }))
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
        <Card>
            <CardBody>
            {/* <h3 className='brand-text text-center'> <HelpCircle/> ESS</h3> */}
            <div className='nav-vertical configuration_panel'>
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
         <Gym data={data.employee_gym_allowance} CallBack={handleDataProcessing}/>
        </TabPane>
        <TabPane tabId='2'>
        <Medical data={data.employee_medical_allowance} CallBack={handleDataProcessing}/>
        </TabPane>
        <TabPane tabId='3'>
        <Leave data={leaveData} CallBack={handleDataProcessing} />
        </TabPane>
        <TabPane tabId='4'>
        <PF data={data.employee_provident_fund} CallBack={handleDataProcessing} />
        </TabPane>
        <TabPane tabId='5'>
        <Loan data={loanData} CallBack={handleDataProcessing} />
        </TabPane>
      </TabContent>
    </div>
            </CardBody>
        </Card>
    </Fragment>
  )
}

export default index