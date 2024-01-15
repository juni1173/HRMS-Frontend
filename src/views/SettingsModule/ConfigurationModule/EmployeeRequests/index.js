import React, { Fragment, useState, useEffect, useCallback } from 'react'
import { Card, CardBody, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import Reimbursement from './Components/Reimbursement'
import Medical_Limit from './Components/Medical'
import Leaves from './Components/Leaves'
import apiHelper from '../../../Helpers/ApiHelper'
import ProvidentFund from './Components/ProvidentFund'
import LoanRequirements from './Components/LoanRequirements'
const index = () => {
    const Api = apiHelper()
    const [active, setActive] = useState('1')
    const [staffdropdown] = useState([])
    const [data, setData] = useState([])
    const [leaveData, setLeaveData] = useState({
        types: '',
        duration: ''
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
        const response = await Api.get('/reimbursements/pre/data/')
        
        if (response.status === 200) {
           
            setLeaveData(prevState => ({
                ...prevState,
                types : response.data.leave_types,
                duration : response.data.set_leave_duration
                
                }))
            setLoanData(prevState => ({
                ...prevState,
                types : response.data.loan_type,
                purpose_of_loan : response.data.purpose_of_loan,
                time_frequency: response.data.time_frequency,
                time_period: response.data.time_period,
                set_loan_requirements: response.data.set_loan_requirements
                
                }))
            const sc_data = await response.data.staff_classification            
            staffdropdown.splice(0, staffdropdown.length)
            for (let i = 0; i < sc_data.length; i++) {
                    staffdropdown.push({value:sc_data[i].id, label: sc_data[i].title })
            } 
            setData(response.data)
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
          <Reimbursement staffdropdown={staffdropdown} data={data.gym_allowance} CallBack={handleDataProcessing}/>
        </TabPane>
        <TabPane tabId='2'>
          <Medical_Limit staffdropdown={staffdropdown} data={data.medical_allowance} CallBack={handleDataProcessing}/>
        </TabPane>
        <TabPane tabId='3'>
          <Leaves staffdropdown={staffdropdown} data={leaveData} CallBack={handleDataProcessing}/>
        </TabPane>
        <TabPane tabId='4'>
          <ProvidentFund  data={data.provident_fund} CallBack={handleDataProcessing}/>
        </TabPane>
        <TabPane tabId='5'>
          <LoanRequirements  data={loanData} CallBack={handleDataProcessing}/>
        </TabPane>
      </TabContent>
    </div>
            </CardBody>
        </Card>
    </Fragment>
  )
}

export default index