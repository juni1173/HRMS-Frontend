import React, { Fragment, useState, lazy, Suspense, useEffect} from 'react'
import { Card, CardBody, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import { HelpCircle } from 'react-feather'
import apiHelper from '../Helpers/ApiHelper'
// Lazy-loaded components
const Gym = lazy(() => import('./Components/Gym'))
const Medical = lazy(() => import('./Components/Medical'))
const Leave = lazy(() => import('./Components/Leave'))
const PF = lazy(() => import('./Components/PF'))
const Loan = lazy(() => import('./Components/Loan'))
const ComTabs = lazy(() => import('./Components/comtabs'))

const Index = () => {
  const yearoptions = []
  const Api = apiHelper()
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const [active, setActive] = useState('1')
  // const [data, setData] = useState([])
  const [leaveData, setLeaveData] = useState({
    leave_types: ''
})
const [loanData, setLoanData] = useState({
  types: '',
  purpose_of_loan: '',
  time_frequency: '',
  time_period: '',
  set_loan_requirements: ''
})

  for (let i = 1; i >= -4; i--) {
    const year = currentYear + i
    yearoptions.push({ value: year, label: year.toString() })
  }

  const preDataApi = async () => {
    const response = await Api.get('/reimbursements/employee/pre/data/')
    if (response.status === 200) {
        // setData(response.data)
        // console.warn(response.data)
        setLeaveData(prevState => ({
          ...prevState,
          leave_types : response.data.leave_types
          // employee_leaves : response.data.employee_leaves
          
          }))
          setLoanData(prevState => ({
            ...prevState,
            types : response.data.loan_type,
            purpose_of_loan : response.data.purpose_of_loan,
            time_frequency: response.data.time_frequency,
            time_period: response.data.time_period
            // employee_loan: response.data.employee_loan
            
            }))
    } else {
        return Api.Toast('error', 'Pre server data not found')
    }
}
useEffect(() => {
    preDataApi()
    }, [])
    const toggle = (tab) => {
      if (active !== tab) {
        setActive(tab)
      }
    }
  const renderComponent = () => {
    switch (active) {
      case '1':
        return <Gym yearoptions={yearoptions}/>
      case '2':
        return <Medical yearoptions={yearoptions} />
      case '3':
        return <Leave leavedata={leaveData} yearoptions={yearoptions} />
      case '4':
        return <PF yearoptions={yearoptions} />
      case '5':
        return <Loan  loandata={loanData} yearoptions={yearoptions}/>
      case '6':
        return <ComTabs/>
      default:
        return null
    }
  }

  return (
    <Fragment>
      <Card className='bg-mirror'>
        <CardBody>
          <div className='nav-vertical overflow-inherit configuration_panel'>
            <Nav tabs className='nav-left'>
              <NavItem>
                <h3 className='brand-text'>
                  {' '}
                  <HelpCircle /> ESS
                </h3>
              </NavItem>
              {[1, 2, 3, 4, 5, 6].map((tabId) => (
                <NavItem key={tabId}>
                  <NavLink active={active === tabId.toString()} onClick={() => toggle(tabId.toString())}>
                    {tabId === 1 ? 'Gym' : tabId === 2 ? 'Medical' : tabId === 3 ? 'Leaves' : tabId === 4 ? 'Provident Fund' : tabId === 5 ? 'Loan' : 'Compensatory'}
                  </NavLink>
                </NavItem>
              ))}
            </Nav>
            <TabContent activeTab={active}>
              <TabPane tabId={active}>
                <Suspense fallback={<div>Loading...</div>}>{renderComponent()}</Suspense>
              </TabPane>
            </TabContent>
          </div>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default Index
