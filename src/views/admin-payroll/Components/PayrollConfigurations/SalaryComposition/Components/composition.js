import React, { Fragment, useState, useEffect } from 'react'
import classnames from 'classnames'
import { Save, Lock, Unlock, Trash2, Plus } from 'react-feather'
import { Row, Col, Card, CardBody, Form, Label, Input, Button, Spinner, Badge, Table, Nav, NavItem, NavLink, TabContent, TabPane, Modal, ModalBody, ModalHeader } from 'reactstrap'
import apiHelper from '../../../../../Helpers/ApiHelper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import AddonRequests from './AddonRequests'
import DeductionRequests from './DeductionRequest'
import EssRequests from './EssRequests'
import PayrollBatch from './createBatch'
import TaxCountry from './SelectCountry'
const Composition = () => {
  const isSuperuser = JSON.parse(localStorage.getItem('is_superuser'))
  const Api = apiHelper()
  const MySwal = withReactContent(Swal)

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [percentage, setPercentage] = useState('')
  const [activeTab, setActiveTab] = useState(0)
  const [show, setShow] = useState(false)
 
  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  const getData = async () => {
    setLoading(true)
    await Api.get(`/payroll/pre/data/view/`).then((result) => {
      if (result) {
        if (result.status === 200) {
          setData(result.data)
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
  const DiscardModal = () => {
    getData()
    setShow(false)
  }
  const handleModalClosed = () => {
    setShow(false)
  }
  const CreateBatch = (batch_id) => {
    MySwal.fire({
        title: 'Are you sure?',
        text: "Do you want to lock salary composition?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, UnLock it!',
        customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger ms-1'
        },
        buttonsStyling: false
    }).then(function (result) {
        if (result.value) {
            const formData = new FormData()
            formData['payroll_batch'] = batch_id
            Api.jsonPost(`/payroll/unlock/batch/compositions/`, formData)
            .then((result) => {
                if (result.status === 200) {
                    MySwal.fire({
                        icon: 'success',
                        title: 'Payroll batch is unlocked!',
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
                        title: result.message ? result.message : 'Payroll batch cannot be changed!',
                        text: 'Payroll batch  is not changed.',
                        customClass: {
                        confirmButton: 'btn btn-danger'
                        }
                    })
                }
                    
                })
        } 
    })
  }
  const percentageValidation = (compositionData, percentage_value) => {
        if (Object.values(compositionData).length >= 0 && percentage_value) {
            const percentage_val = Math.round(percentage_value)
            let sum_composition = 0
            for (let i = 0; i < compositionData.length; i++) {
                sum_composition = sum_composition + Math.round(compositionData[i].attribute_percentage)
            }
            sum_composition = sum_composition + percentage_val
            // console.warn(sum_composition)
            if (sum_composition <= 100) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
  }
  const checkValidation = (compositionData) => {
    if (Object.values(compositionData).length > 0) {
        let sum_composition = 0
        for (let i = 0; i < compositionData.length; i++) {
            sum_composition = sum_composition + Math.round(compositionData[i].attribute_percentage)
        }
        if (sum_composition === 100) {
            return true
        } else {
            return false
        }
    } else {
        return false
    }
}
  const saveComposition = (attribute_id, batch_id) => {
    if (attribute_id !== '' && percentage !== '') {
    if (Object.values(data.composition).length > 0) {
        const compositionsForBatch = data.composition.filter(composition => composition.payroll_batch === batch_id)
        console.log(compositionsForBatch)
        console.log(batch_id)
        if (!percentageValidation(compositionsForBatch, percentage)) {
            Api.Toast('error', 'Composition accomulated percentage cannot be exceeded to 100%')
            return false
        }
    }
    setLoading(true)
    const formData = new FormData()
    formData['payroll_compositions_attribute'] = attribute_id
    formData['attribute_percentage'] = percentage
    formData['payroll_batch'] = batch_id
    Api.jsonPost(`/payroll/batch/compositions/view/`, formData).then(result => {
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
    } else {
        Api.Toast('error', 'Fields are required!')
    }
  }
  const removePercentage = (id) => {
    if (id) {
        setLoading(true)
    
        Api.deleteData(`/payroll/batch/compositions/${id}/`, {method: 'Delete'}).then(result => {
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
  }
  const LockBatch = (batch_id) => {
    const compositionsForBatch = data.composition.filter(composition => composition.payroll_batch === batch_id)
    if (checkValidation(compositionsForBatch)) {
        MySwal.fire({
            title: 'Are you sure?',
            text: "Do you want to lock salary composition?",
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
                formData['payroll_batch'] = batch_id
                Api.jsonPost(`/payroll/lock/batch/compositions/`, formData)
                .then((result) => {
                    if (result.status === 200) {
                        MySwal.fire({
                            icon: 'success',
                            title: 'Payroll batch is locked!',
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
                            title: result.message ? result.message : 'Payroll batch cannot be changed!',
                            text: 'Payroll batch  is not changed.',
                            customClass: {
                            confirmButton: 'btn btn-danger'
                            }
                        })
                    }
                        
                    })
            } 
        })

    } else {
        Api.Toast('error', 'Composition accomulated percentage must be equals to 100%..')
    }
  }
  useEffect(() => {
    getData()
  }, [])
  const callBack = () => {
    getData()
  }
  return (
<Fragment>
      {!loading ? (     
        <>
        {isSuperuser ?  <div className='row justify-content-end'>
            <div className='col-lg-4'>
          <Button color='success' className='mt-1 mb-1' onClick={() => setShow(true)}>
              <Plus className='mr-2' /> Create Batch
            </Button>
            </div>
            </div> : null}
          {(Object.values(data).length > 0 && data.batch !== null) && data.batch !== undefined ? (
            <>
              <Nav tabs>
                {data.batch.map((item, key) => (
                  <NavItem key={key}>
                    <NavLink className={classnames({ active: activeTab === key })} onClick={() => toggleTab(key)}>
                     {item.title ? item.title : 'Untitled'}
                    </NavLink>
                  </NavItem>
                ))}
              </Nav>
        
              <TabContent activeTab={activeTab}>
                {data.batch.map((item, key) => (
                  <TabPane tabId={key} key={key}>
                    {activeTab === key && (
                    <div className='row' key={key}>
                      <div className='col-lg-12'>
                      <Card>    
                                    <CardBody>
                                    <div className='col-lg-3'>
                                                <p>Batch Title. <Badge color='light-success'>{item.title}</Badge></p>
                                            </div>
                                        <div className='row'>
                                            <div className='col-lg-2'>
                                                <p>Batch No. <Badge color='light-success'>{item.batch_no}</Badge></p>
                                            </div>
                                            <div className='col-lg-2'>
                                                <p>Date <Badge color='light-success'>{item.start_date}</Badge></p>
                                            </div>
                                            <div className='col-lg-2'>
                                                <p>Status <Badge color='light-success'>{item.batch_status}</Badge></p>
                                            </div>
                                            <div className='col-lg-2'>
                                                <p>Country <Badge color='light-success'>{item.country}</Badge></p>
                                            </div>
                                            <div className='col-lg-3'>
                                            {item.is_lock ? (
                                                    <Button className='btn btn-danger' onClick={() => CreateBatch(item.id)}>
                                                        <Unlock /> Unlock
                                                    </Button>
                                                ) : (
                                                    <Button className='btn btn-success' onClick={() => LockBatch(item.id)}>
                                                       <Lock /> Lock
                                                    </Button>
                                                )   
                                            }
                                             
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                                <Card>
                            <CardBody>
                              {isSuperuser ? <TaxCountry batch_id={item.id} callBack={callBack}/> : null}
                            {data.composition.length > 0 ? (
                      <>
                        <h5>Composition</h5>
                        <div className='row'>
                          <div className='col-md-12'>
                            <Table bordered striped responsive>
                              <thead className='table-dark text-center'>
                                <tr>
                                  <th>Attribute</th>
                                  <th>Percentage</th>
                                  {!item.is_lock && <th>Delete</th>}
                                </tr>
                              </thead>
                              <tbody>
                                {data.composition
                                  .filter(composition => composition.payroll_batch === item.id)
                                  .map((composition, key) => (
                                    <tr key={key}>
                                      <td>{composition.payroll_compositions_attribute_title}</td>
                                      <td>{composition.attribute_percentage}%</td>
                                      {!item.is_lock && (
                                        <td className='text-center'>
                                          <Button className='btn btn-sm btn-danger' onClick={() => removePercentage(composition.id)}>
                                            <Trash2 />
                                          </Button>
                                        </td>
                                      )}
                                    </tr>
                                  ))}
                              </tbody>
                            </Table>
                          </div>
                        </div>
                      </>
                    ) : (
                      <h5>No Composition Data!</h5>
                    )}
                  {isSuperuser ? <>
                                {data.attributes.length > 0 && (
                                    data.attributes.map((attribute, key) => (
                                        data.composition.find(pre => pre.payroll_attribute === attribute.id) ? (
                                            null
                                        ) : (
                                            <Form key={key}>
                                            <Row className='justify-content-between align-items-center'>
                                                <Col md={4} className='mb-md-0 mb-1'>
                                                <Label className='form-label'>
                                                    Attribute
                                                </Label>
                                                <Input type='text' 
                                                defaultValue={attribute.title} disabled/>
                                                </Col>
                                                <Col md={4} className='mb-md-0 mb-1'>
                                                <Label className='form-label'>
                                                    Percentage
                                                </Label>
                                                <Input type='number' placeholder='10' 
                                                onChange={ e => setPercentage(e.target.value)} />
                                                </Col>
                                                <Col md={2} className='pt-2'>
                                                <Button color='success' className='text-nowrap px-1' onClick={() => saveComposition(attribute.id, item.id)} outline>
                                                    <Save size={14} className='me-50' />
                                                    <span>Save</span>
                                                </Button>
                                                </Col>
                                            </Row>
                                            </Form>
                                        )     
                                    ))
                                )} </> : null}
                            </CardBody>
                        </Card>
                        <div className='col-lg-12'>
                          {loading ? (
                            <div>Loading data...</div>
                          ) : (
                            <AddonRequests data={item} updatepredata={getData} />
                          )}
                        </div>
                        <div className='col-lg-12'>
                          {loading ? (
                            <div>Loading data...</div>
                          ) : (
                            <DeductionRequests data={item} updatepredata={getData} />
                          )}
                        </div>
                        <div className='col-lg-12'>
                          {loading ? (
                            <div>Loading data...</div>
                          ) : (
                            <EssRequests batchdata={item} updatepredata={getData} />
                          )}
                        </div>
                      </div>
                    </div>
                    )}
                  </TabPane>
                ))}
              </TabContent>
            </>
          ) : (
            <>
              <Card>
                <CardBody>
                  <p>No batch Found!</p>
                </CardBody>
              </Card>
            </>
          )}
        </>
      ) : (
        <div className='text-center'>
          <Spinner type='grow' color='white' />
        </div>
      )}
        <Modal
        isOpen={show}
        onClosed={handleModalClosed}
        toggle={() => setShow(!show)}
        className='modal-dialog-centered modal-lg'
      >
        <ModalHeader className='bg-transparent' toggle={() => setShow(!show)}></ModalHeader>
        <ModalBody className='px-5 pb-5'>
          <div className='text-center mb-2'>
            <h1>Create Batch</h1>
          </div>
            <PayrollBatch DiscardModal={DiscardModal}/> 
        </ModalBody>
      </Modal>
    </Fragment>
    
  )
}

export default Composition
