import React, { Fragment, useState, Suspense, useEffect } from 'react'
import { Card, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, Spinner, Badge } from 'reactstrap'
import apiHelper from '../../../Helpers/ApiHelper'
import { useLocation } from 'react-router-dom'
const Tabs = () => {
    const Api = apiHelper()
  const location = useLocation()
//   const history = useHistory()
  const [active, setActive] = useState('1')
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const getData = () => {
    setLoading(true)
    const formData = new FormData()
    formData['salary_batch'] = location.state.batchData.id
    formData['payroll_batch'] = location.state.batchData.payroll_batch
    Api.jsonPost(`/payroll/accountant/view/`, formData).then((response) => {
      if (response.status === 200) {
      setData(response.data)
      // setSalaryBatch(response.data.salary)
      } else {
        Api.Toast('error', response.message)
      }
    })
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }
  useEffect(() => {
    getData()
  }, [])
  const toggle = tab => {
    if (active !== tab) {
      setActive(tab)
    }
  }
  const AllEmpSalary = React.lazy(() => import('./AllEmpSalary'))


  return (
    <Fragment>
      {!loading ? (
        <>
        <Card>
          <CardBody>
            <div className="nav-vertical configuration_panel">
              <Nav tabs>
               <NavItem>
                  <NavLink
                    active={active === '1'}
                    onClick={() => {
                      toggle('1')
                    }}
                  >
                   UnVerified
                  </NavLink>
                </NavItem>
               <NavItem>
                  <NavLink
                    active={active === '2'}
                    onClick={() => {
                      toggle('2')
                    }}
                  >
                    Unprocessed
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    active={active === '3'}
                    onClick={() => {
                      toggle('3')
                    }}
                  >
                    Processed
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={active}>
                <Suspense fallback={<div className="text-center"><Spinner color="primary" type="grow" /></div>}>
                  <TabPane tabId="1">
                 {AllEmpSalary && <AllEmpSalary data={data} active={active} batchData={location.state.batchData}/>}
                  </TabPane>
                  <TabPane tabId="2">
                    {AllEmpSalary && <AllEmpSalary data={data} active={active} batchData={location.state.batchData}/>}
                  </TabPane>
                  <TabPane tabId="3">
                   {AllEmpSalary && <AllEmpSalary data={data} active={active} batchData={location.state.batch}/>}
                  </TabPane>
                </Suspense>
              </TabContent>
            </div>
          </CardBody>
        </Card>
        </>
      ) : (
        <div className="text-center">
          <Spinner color="primary" type="grow" />
        </div>
      )}
    </Fragment>
  )
}

export default Tabs
