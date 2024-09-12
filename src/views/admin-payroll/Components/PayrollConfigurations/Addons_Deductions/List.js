import React, { Fragment, useState, useEffect, lazy, Suspense } from 'react'
// import { useLocation } from 'react-router-dom'
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Spinner,
  Badge
} from 'reactstrap'
import apiHelper from '../../../../Helpers/ApiHelper'
// import ListNav from './ListNav' // Import your ListNav component here
const LazyListNav = lazy(() => import('./ListNav'))
import { Save, PlusCircle, CheckCircle } from 'react-feather'

const HrProcess = ({batchData}) => {
  const Api = apiHelper()
  // const location = useLocation()
  const [batchdata, setBatchData] = useState([])
  const [addondata, setAddonData] = useState([])
  const [deductiondata, setDeductionData] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedCustomizedItem, setSelectedCustomizedItem] = useState(null)

  const handleCustomizedItemClick = (item) => {
    // Set the selected Customized item
    setSelectedCustomizedItem(item)
  }

  const getData = async () => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData['payroll_batch'] = batchData.id
      const hrviewResponse = await Api.jsonPost(
        `/payroll/batch/attributes/hrview/`,
        formData
      )
      if (hrviewResponse.status === 200) {
        setBatchData(hrviewResponse.data.predata)
        setAddonData(hrviewResponse.data.Addon)
        setDeductionData(hrviewResponse.data.Deduction)
        if (hrviewResponse.data.Addon.length > 0) {
          setSelectedCustomizedItem(hrviewResponse.data.Addon[0])
        }
      } else {
        Api.Toast('error', hrviewResponse.message)
      }
    } catch (error) {
      Api.Toast('error', 'Server not responding')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  // State
  const [active, setActive] = useState('addon-1')

  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab)
    }
  }
  return (
    <div className='nav-vertical configuration_panel'>
      {!loading ? (
        <Fragment>
          <Nav tabs className='nav-left'>
            <NavItem>
              <h3 className='brand-text text-light'>Add/Ons</h3>
            </NavItem>
            {addondata.length > 0 ? (
              addondata.map((item, index) => (
                <NavItem key={index}>
                  <NavLink
                    active={active === `addon-${index + 1}`}
                    onClick={() => {
                      toggle(`addon-${index + 1}`)
                      handleCustomizedItemClick(item) // Set the selected Customized item
                    }}
                  >
                    {item.payroll_attribute_title}
                  </NavLink>
                </NavItem>
              ))
            ) : (
              <div className='text-center'>No data found</div>
            )}

            <NavItem>
              <h3 className='brand-text text-light'>Deductions</h3>
            </NavItem>
            {deductiondata.length > 0 ? (
              deductiondata.map((item, index) => (
                <NavItem key={index}>
                  <NavLink
                    active={active === `deduction-${index + 1}`}
                    onClick={() => {
                      toggle(`deduction-${index + 1}`)
                      handleCustomizedItemClick(item) 
                    }}
                  >
                    {item.payroll_attribute_title}
                  </NavLink>
                </NavItem>
              ))
            ) : (
              <div className='text-center'>No data found</div>
            )}
          </Nav>
          <TabContent activeTab={active}>
            {addondata.map((item, index) => (
              <TabPane key={`addon-${index + 1}`} tabId={`addon-${index + 1}`} className='tab-pane-blue'>
                {/* <ListNav content={selectedCustomizedItem} batch={batchdata}/> */}
                {active === `addon-${index + 1}` && (
                  <Suspense fallback={<div className="text-center"><Spinner color="primary" type="grow" /></div>}>
                    <LazyListNav content={selectedCustomizedItem} batch={batchdata} />
                  </Suspense>
                )}
              </TabPane>
            ))}
            {deductiondata.map((item, index) => (
              <TabPane key={`deduction-${index + 1}`} tabId={`deduction-${index + 1}`} className='tab-pane-blue'>
                {/* <ListNav content={selectedCustomizedItem} batch={batchdata}/> */}
                {active === `deduction-${index + 1}` && (
                  <Suspense fallback={<div className="text-center"><Spinner color="primary" type="grow" /></div>}>
                    <LazyListNav content={selectedCustomizedItem} batch={batchdata} />
                  </Suspense>
                )}
              </TabPane>
            ))}
          </TabContent>
        </Fragment>
      ) : (
        <div className='text-center'>
          <Spinner type='grow' color='white' />
        </div>
      )}
    </div>
  )
}

export default HrProcess
