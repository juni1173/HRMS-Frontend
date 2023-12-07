import React, { Fragment, useState, useEffect, Suspense } from 'react'
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min'
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Form,
  Label,
  Input,
  Button,
  Spinner,
  Badge,
  Table,
  CardTitle,
  Offcanvas,
  OffcanvasBody,
  OffcanvasHeader,
  Modal,
  ModalBody,
  ModalHeader,
  Collapse,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap'
import apiHelper from '../../../Helpers/ApiHelper'
import { Save, PlusCircle, CheckCircle, Lock, Unlock, Plus } from 'react-feather'
// import CreateBatch from './Createbatch'
import SalaryBatch from './SalaryBatchForm'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const HrProcess = () => {
  const Api = apiHelper()
  const location = useLocation()
  const [batchdata, setBatchData] = useState([])
  const [addondata, setaddonData] = useState([])
  const [deductiondata, setdeductiondata] = useState([])
  const [customizeddata, setcustomizeddata] = useState([])
  const [data, setdata] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedCustomizedItem, setSelectedCustomizedItem] = useState(null)
  const [shouldmakeapicall, setshouldmakeapicall] = useState(true)
  const [active, setActive] = useState('')
  const [show, setShow] = useState(false)
  const ViewRecord = React.lazy(() => import('./viewrecords'))
  const ListNav = React.lazy(() => import('./ListNav'))
  const MySwal = withReactContent(Swal)
  
  const handleCustomizedItemClick = (item) => {
    // Set the selected Customized item
    setSelectedCustomizedItem(item)
  }
  const DiscardModal = () => {
        setShow(false)
      }
  const getData = async () => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData['payroll_batch'] = location.state.batchData.id
      const response = await Api.jsonPost(`/payroll/get/salary/batch/`, formData)
      const hrviewResponse = await Api.jsonPost(`/payroll/salary/attributes/list/`, formData)
      if (hrviewResponse.status === 200) {
        setBatchData(hrviewResponse.data.predata)
        setaddonData(hrviewResponse.data.Addon)
        setdeductiondata(hrviewResponse.data.Deduction)
        setcustomizeddata(hrviewResponse.data.Customized)
        if (hrviewResponse.data.Customized.length > 0) {
          setSelectedCustomizedItem(hrviewResponse.data.Customized[0])
          setActive('customized-1')
        } else {
          setSelectedCustomizedItem(hrviewResponse.data.Addon[0])
          setshouldmakeapicall(false)
          setActive('addon-1')
        }
      } else {
        Api.Toast('error', hrviewResponse.message)
      }
      if (response.status === 200) {
        setLoading(false)
        setdata(response.data)
      } else {
        setLoading(false)
      Api.Toast('error', response.message)
      }
    } catch (error) {
      setLoading(false)
      Api.Toast('error', 'Server not responding')
    } finally {
      setLoading(false)
    }
  }
  const CallBack = () => {
    getData()
    setShow(false)
  }
  useEffect(() => {
    getData()
  }, [setcustomizeddata])


  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab)
    }
  }
  const LockBatch = () => {

        MySwal.fire({
            title: 'Are you sure?',
            text: "Do you want to lock salary batch?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Lock it!',
            customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-danger ms-1'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.value) {
              const formData = new FormData()
              formData['salary_batch'] = batchdata.salary.id
                Api.jsonPost(`/payroll/lock/salary/batch/`, formData)
                .then((result) => {
                    if (result.status === 200) {
                        MySwal.fire({
                            icon: 'success',
                            title: 'Salary batch is locked!',
                            customClass: {
                            confirmButton: 'btn btn-success'
                            }
                        }).then(function (result) {
                            if (result.isConfirmed) {
                                getData()
                            }
                        })
                    } else {
                        MySwal.fire({
                            icon: 'error',
                            title: result.message ? result.message : 'Salary batch cannot be changed!',
                            text: 'Salary batch  is not changed.',
                            customClass: {
                            confirmButton: 'btn btn-danger'
                            }
                        })
                    }
                        
                    })
            } 
        })
  }
  
  const UnlockBatch = () => {
    setLoading(true)
    const formData = new FormData()
    formData['salary_batch'] = batchdata.salary.id
          Api.jsonPost(`/payroll/unlock/salary/batch/`, formData).then(result => {
            if (result) {
                if (result.status === 200) {
                   getData()
                } else {
                    Api.Toast('error', result.message)
                }
            } else {
                Api.Toast('error', 'Server not responding')
            }
        })
        setTimeout(() => {
            setLoading(false)
        }, 1000)
  }
  return (
    <div className='nav-vertical configuration_panel'>
      {data.length > 0 ? <>
       <Card>
        <CardHeader>
       <CardTitle tag='h4'>Salary Batch</CardTitle>
       </CardHeader>
        <CardBody>
            <div className='row'>
                <div className='col-lg-3'>
                    <p>Batch No. <Badge color='light-success'>{data[0].batch_no}</Badge></p>
                </div>
                <div className='col-lg-3'>
                    <p>Date <Badge color='light-success'>{data[0].start_date}</Badge></p>
                </div>
                <div className='col-lg-3'>
                    <p>Status <Badge color='light-success'>{data[0].batch_status}</Badge></p>
                </div>
                <div className='col-lg-3'>
                {data[0].is_lock ? (
                                                    <Button className='btn btn-danger' onClick={UnlockBatch}>
                                                        <Unlock /> Unlock
                                                    </Button>
                                                ) : (
                                                    <Button className='btn btn-success' onClick={LockBatch}>
                                                       <Lock /> Lock
                                                    </Button>
                                                )   
                                            }
                                           </div>
            </div>
        </CardBody>
    </Card> 
      {!loading ? (
 <Fragment>
          <Nav tabs className='nav-left'>
            <NavItem>
              <h3 className='brand-text'>Addons</h3>
            </NavItem>
            {addondata.length > 0 ? (
              addondata.map((item, index) => (
                <NavItem key={index}>
                  <NavLink
                    active={active === `addon-${index + 1}`}
                    onClick={() => {
                      setshouldmakeapicall(false)
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
              <h3 className='brand-text'>Deductions</h3>
            </NavItem>
            {deductiondata.length > 0 ? (
              deductiondata.map((item, index) => (
                <NavItem key={index}>
                  <NavLink
                    active={active === `deduction-${index + 1}`}
                    onClick={() => {
                      setshouldmakeapicall(false)
                      toggle(`deduction-${index + 1}`)
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
              <h3 className='brand-text'>Customized</h3>
            </NavItem>
            {customizeddata.length > 0 ? (
              customizeddata.map((item, index) => (
                <NavItem key={index}>
                  <NavLink
                    active={active === `customized-${index + 1}`}
                    onClick={() => {
                      setshouldmakeapicall(true)
                      toggle(`customized-${index + 1}`)
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
          </Nav>
          <TabContent activeTab={active}>
            {addondata.map((item, index) => (
              <TabPane key={`addon-${index + 1}`} tabId={`addon-${index + 1}`} className='tab-pane-blue'>
                {/* <ListNav content={selectedCustomizedItem} apiCall={shouldmakeapicall} batch={batchdata}/>
                 */}
                {active === `addon-${index + 1}` && (
                <Suspense fallback={<div className="text-center"><Spinner color="primary" type="grow" /></div>}>
                <ListNav content={selectedCustomizedItem} apiCall={shouldmakeapicall} batch={batchdata}/>
                </Suspense>
              )}
              </TabPane>
            ))}
            {deductiondata.map((item, index) => (
              <TabPane key={`deduction-${index + 1}`} tabId={`deduction-${index + 1}`} className='tab-pane-blue'>
                {/* <ListNav content={selectedCustomizedItem} apiCall={shouldmakeapicall} batch={batchdata}/> */}
                {active === `deduction-${index + 1}` && (
                <Suspense fallback={<div className="text-center"><Spinner color="primary" type="grow" /></div>}>
                <ListNav content={selectedCustomizedItem} apiCall={shouldmakeapicall} batch={batchdata}/>
                </Suspense>
              )}
              </TabPane>       
            ))}
            {customizeddata.map((item, index) => (
              <TabPane key={`customized-${index + 1}`} tabId={`customized-${index + 1}`} className='tab-pane-blue'>
                {/* <ViewRecord content={selectedCustomizedItem} apiCall={shouldmakeapicall} batch={batchdata}/> */}
                {active === `customized-${index + 1}` && (
                <Suspense fallback={<div className="text-center"><Spinner color="primary" type="grow" /></div>}>
                 <ViewRecord content={selectedCustomizedItem} apiCall={shouldmakeapicall} batch={batchdata}/>
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
      )} </> : <Card>
       <CardBody>
           <div className='row'>
               <div className='col-lg-6'>
                   <p><Badge color='light-success'>No active batch exist. Create a batch first</Badge></p>
               </div>
               <div className='col-lg-6'>
               <Button className='btn btn-success'
                  onClick={e => {
                    e.preventDefault()
                    setShow(true)
               }}>
                                                       <Plus /> Create
                                                    </Button>
              </div>
           </div>
       </CardBody>
   </Card> }
    <Modal
        isOpen={show}
        // onClosed={handleModalClosed}
        toggle={() => setShow(!show)}
        className='modal-dialog-centered modal-lg'
      >
        <ModalHeader className='bg-transparent' toggle={() => setShow(!show)}></ModalHeader>
        <ModalBody className='px-5 pb-5'>
          <div className='text-center mb-2'>
            <h1>Salary Batch</h1>
          </div>
            <SalaryBatch batch={location.state.batchData} CallBack={CallBack} DiscardModal={DiscardModal}/>  
        </ModalBody>
      </Modal>
    </div>
  )
}

export default HrProcess
