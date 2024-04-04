import React, { Fragment, useState, useEffect, useCallback } from 'react'
import { Row, Col, Table, Modal, ModalHeader, ModalBody, Spinner, Button, Badge, CardBody, Card, CardTitle, Offcanvas, OffcanvasHeader, OffcanvasBody } from 'reactstrap'
import { Edit2, Eye, Trash2 } from 'react-feather'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import apiHelper from '../../Helpers/ApiHelper'
import UpdateKpi from '../UpdateKpi/update'
import EvaluationForm from './EvaluationForm'
import Comments from '../Comments'
import ViewKpiEvaluation from '../EmployeeKpi/ViewKpiEvaluation'
const KpiRequests = ({ data, EmployeeCallBack, dropdownData, type }) => {
    const Api = apiHelper()
    const MySwal = withReactContent(Swal)
    const [loading, setLoading] = useState(false)
    const [kpiData, setKpiData] = useState([])
    const [UpdateModal, setUpdateModal] = useState(false)
    const [evaluationModal, setEvaluationModal] = useState(false)
    const [checkedItems, setCheckedItems] = useState([])
    const [UpdateData, setUpdateData] = useState([])
    const [evaluationState, setEvaluationState] = useState([])
    const [canvasPlacement, setCanvasPlacement] = useState('end')
    const [canvasOpen, setCanvasOpen] = useState(false)
    const [canvasEvaluationPlacement, setCanvasEvaluationPlacement] = useState('end')
    const [canvasEvaluationOpen, setCanvasEvaluationOpen] = useState(false)
    const [evaluationDetailspreData, setEvaluationDetailspreData] = useState([])
   
    const getPreData = async () => {
        setLoading(true)
        let url = ''
        if (type !== 'cancel' && type !== 'recheck') {
            url = `/kpis/requests/to/team/lead/data/${data.id}/`
        }
        if (type === 'recheck') {
            url = `/kpis/recheck/requests/to/team/lead/data/${data.id}/`
        }
        if (type === 'cancel') {
           url = `/kpis/cancel/requests/to/team/lead/data/${data.id}/`
        }

        if (url !== '') {
            await Api.get(`${url}`).then(result => {
                if (result) {
                    if (result.status === 200) {
                        setKpiData(result.data)
                        console.warn(result.data)
                    } else {
                        // Api.Toast('error', result.message)
                    }
                } else (
                Api.Toast('error', 'Server not responding!') 
                )
            })  
        }
        
        setTimeout(() => {
            setLoading(false)
        }, 1000)
        
    }

    const handleCheck = (event) => {
        const { id } = event.target
        const isChecked = event.target.checked
        
        if (isChecked) {
          setCheckedItems([...checkedItems, id])
        } else {
          setCheckedItems(checkedItems.filter((item) => item !== id))
        }
       
      }
      const handlecheckall = (event, tableData) => {
        const isChecked = event.target.checked
        
        if (isChecked) {
          // Select all checkboxes in the current table
          const allIds = []
          // = tableData.map((i) => i.id.toString())
          if (type === 'cancel') {
            tableData.map((item) => {
              const allkpis = item.employee_kpis_data 
              if (allkpis !== null && allkpis !== undefined && allkpis.length > 0) {
              allkpis.map((nestedItem) => {
                if (nestedItem.kpis_status_level === 11) {
    allIds.push(nestedItem.id.toString())
                }
              })
            }
            })
          } else {
            tableData.map((item) => {
              const allkpis = item.employee_kpis_data 
              if (allkpis !== null && allkpis !== undefined && allkpis.length > 0) {
              allkpis.map((nestedItem) => {
                if (nestedItem.kpis_status_level === 2) {
    allIds.push(nestedItem.id.toString())
                }
              })
            }
            })
          }
         
    setCheckedItems(allIds)
          setCheckedItems([...checkedItems, ...allIds])
        } else {
          // Deselect all checkboxes in the current table
          // const tableIds = tableData.map((item) => item.id.toString())// Convert to strings
          setCheckedItems([])
        }
      }
      const multipleKpiSend = async () => {
        // return false
        if (checkedItems.length > 0) {  
            setLoading(true)
                await Api.jsonPost(`/kpis/team/lead/approval/list/`, {kpis_array: checkedItems})
                .then(result => {
                    if (result) {
                        if (result.status === 200) {
                        Api.Toast('success', result.message)
                        EmployeeCallBack()
                        } else {
                            Api.Toast('error', result.message)
                        }
                    } else {
                        Api.Toast('error', 'Server not responding!')
                    }
                })
        setTimeout(() => {
            setLoading(false)
        }, 500)
        } else {
            Api.Toast('error', 'Please select a kpi to send!')
        }
    }
    // const removeAction = (id) => {
    //     MySwal.fire({
    //         title: 'Are you sure?',
    //         text: "Do you want to delete Kpi!",
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonText: 'Yes, delete it!',
    //         customClass: {
    //         confirmButton: 'btn btn-primary',
    //         cancelButton: 'btn btn-danger ms-1'
    //         },
    //         buttonsStyling: false
    //     }).then(function (result) {
    //         if (result.value) {
    //             Api.deleteData(`/kpis/employees/${id}/`, {method: 'Delete'})
    //             .then((deleteResult) => {
    //                 if (deleteResult.status === 200) {
    //                     MySwal.fire({
    //                         icon: 'success',
    //                         title: 'Kpi Deleted!',
    //                         text: 'Kpi is deleted.',
    //                         customClass: {
    //                         confirmButton: 'btn btn-success'
    //                         }
    //                     }).then(function (result) {
    //                         if (result.isConfirmed) {
    //                             CallBack()
    //                         }
    //                     }) 
    //                 } else {
    //                     MySwal.fire({
    //                         icon: 'error',
    //                         title: 'Kpi can not be deleted!',
    //                         text: deleteResult.message ? deleteResult.message : 'Kpi is not deleted.',
    //                         customClass: {
    //                         confirmButton: 'btn btn-danger'
    //                         }
    //                     })
    //                 }
                            
    //                 })
    //         } 
    //     })
    // }
    const evaluationAction = (employee, kpi_details, evaluationData) => {
      setEvaluationState({employee, kpi_details, evaluationData})
      setEvaluationModal(!evaluationModal)
    }
    const UpdateKpiFunc = (item) => {
        setUpdateData(item)
        setUpdateModal(!UpdateModal)
    }
    const CommentToggle = (item) => {
      if (item !== null) {
          setUpdateData(item)
      }
      setCanvasPlacement('end')
      setCanvasOpen(!canvasOpen)
      
    }
    const toggleCanvasEnd = () => {
      setCanvasPlacement('end')
      setCanvasOpen(!canvasOpen)
    }
    const getEvaluationDetails = (employee, kpi_id) => {
      if (employee !== null && kpi_id !== null) {
          setEvaluationDetailspreData({employee, kpi_id})
      }
      setCanvasEvaluationPlacement('end')
      setCanvasEvaluationOpen(!canvasEvaluationOpen)
      
    }
    const toggleCanvasEvaluationEnd = () => {
      setCanvasEvaluationPlacement('end')
      setCanvasEvaluationOpen(!canvasEvaluationOpen)
    }
    const cancelAction = (id) => {
      MySwal.fire({
          title: 'Are you sure?',
          text: "Do you want to cancel Kpi!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, cancel it!',
          customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-danger ms-1'
          },
          buttonsStyling: false
      }).then(function (result) {
          if (result.value) {
              Api.jsonPatch(`/kpis/cancel/requests/by/team/lead/${id}/`, {}, false)
              .then((deleteResult) => {
                  if (deleteResult.status === 200) {
                      MySwal.fire({
                          icon: 'success',
                          title: 'Kpi Cancelled!',
                          text: 'Kpi is cancelled successfully.',
                          customClass: {
                          confirmButton: 'btn btn-success'
                          }
                      }).then(function (result) {
                          if (result.isConfirmed) {
                            EmployeeCallBack()
                          }
                      }) 
                  } else {
                      MySwal.fire({
                          icon: 'error',
                          title: 'Kpi can not be cancelled!',
                          text: deleteResult.message ? deleteResult.message : 'Kpi is not cancelled.',
                          customClass: {
                          confirmButton: 'btn btn-danger'
                          }
                      })
                  }
                          
                  })
          } 
      })
    }
    useEffect(() => {
        getPreData()
       }, [])

       const CallBack = useCallback(() => {
           getPreData()
         }, [kpiData])
  return (
    <Fragment>
        <h5 className='text-center'>Kpi's of <b>{data.name ? data.name : 'Name not Found!'}</b></h5> 
        {checkedItems.length > 0 && (
            <Button className='btn btn-warning mb-1' onClick={multipleKpiSend}>
                Approve & Send Kpi's to HR
            </Button>
        )}
    {!loading ? (  
    (kpiData && Object.values(kpiData).length > 0) ? (
    <>
    <input
        type="checkbox"
        onChange={(event) => handlecheckall(event, kpiData)}
        
        disabled={
            
            // dataItem.employee_kpis_data.every(
            //   (item) => console.log(item.employee_kpis_data)
            //   //  item.employee_kpis_data.kpis_status !== 2
            //   // 
            // )
            type !== 'cancel' ? kpiData.every(
            
            (item) => item.kpis_status !== 2
            
            ) : kpiData.every(
            
            (item) => item.kpis_status !== 11
            )
            
        }
        />
        {Object.values(kpiData).map((kpi, key) => (
            <div className="row" key={key}>
                    <Col md={1} className="d-flex align-items-center">
                        {type === 'cancel' ? (
                            (kpi.kpis_status_level !== 11 && kpi.kpis_status_level !== 12) ? <input
                            className='form-check-primary'
                            type="checkbox"
                            id={kpi.id}
                            onChange={handleCheck}
                            checked={checkedItems.includes(kpi.id.toString())}
                          />  : <input className='form-check-primary' type="checkbox" disabled/>
                        ) : (
                            kpi.kpis_status_level === 2 ? <input
                                className='form-check-primary'
                                type="checkbox"
                                id={kpi.id}
                                onChange={handleCheck}
                                checked={checkedItems.includes(kpi.id.toString())}
                            />  : <input className='form-check-primary' type="checkbox" disabled/>
                        )}
                    </Col>
                    <Col md={11} className='p-0'>
                        <Card bg="light" style={{ backgroundColor: '#F2F3F4' }} className='text-nowrap'>    
                            <CardBody>
                                <Row>
                                    <Col md={6}><CardTitle>{kpi.title ? (kpi.title).substring(0, 20) : 'N/A'}</CardTitle></Col>
                                    <Col md={3}>
                                    {(kpi.kpis_status_level === 4 || kpi.kpis_status_level === 5 || kpi.kpis_status_level === 7 || kpi.kpis_status_level === 8) && (
                                            <button
                                            className="btn btn-primary btn-sm border-0"
                                            onClick={() => evaluationAction(data.name, kpi.title, kpi)}
                                            >
                                            {`${kpi.scale_group_title} Evaluation`}
                                            </button>
                                    )}
                                    </Col>
                                    <Col md={3} className='d-flex justify-content-end'>
                                        <Eye onClick={() => CommentToggle(kpi)}/>
                                        
                                    </Col>
                                    <Col md={5}>
                                        <Badge color="light-success">{kpi.kpis_status_title ? kpi.kpis_status_title : 'N/A'}</Badge>
                                    </Col>
                                    <Col md={3}>
                                        <Badge color='light-warning'>{kpi.ep_type_title ? kpi.ep_type_title : 'N/A'}</Badge>
                                    </Col>
                                    <Col md={2}>
                                        <Badge color='light-success'>{kpi.mode_of_kpis_title ? kpi.mode_of_kpis_title : 'N/A'}</Badge>
                                    </Col>
                                    <Col md={2} className='d-flex justify-content-end'>
                                            {kpi.kpis_status_level === 2 && (
                                                <Edit2 color="orange" onClick={() => UpdateKpiFunc(kpi)} />
                                            ) }
                                    </Col>
                                    <Col md={5}>
                                        {kpi.evaluator_name ? kpi.evaluator_name : 'N/A'}
                                    </Col>
                                    <Col md={3}>
                                        <Badge color='light-danger'>
                                            {kpi.ep_complexity_title ? kpi.ep_complexity_title : 'N/A'}
                                        </Badge>
                                    </Col>
                                    <Col md={2}>
                                        {/* <Badge color='light-info'> */}
                                        {kpi.kpis_status_level && kpi.kpis_status_level > 5 && kpi.kpis_status_level !== 11 && <Button className='btn btn-sm btn-primary' onClick={() => getEvaluationDetails(kpi.employee, kpi.id)}>View Ratings</Button>}
                                                                        
                                        {/* </Badge> */}
                                    </Col>
                                    <Col md={2} className='d-flex justify-content-end'>
                                        {type !== 'cancel' && (
                                                <Trash2 color='red' onClick={() => cancelAction(kpi.id)} title='delete'/>
                                        )}
                                    </Col>
                                </Row>
                        
                            </CardBody>
                        </Card>
                    </Col>
        </div>
        ))}
    </>
    ) : (
      <Card>
        <CardBody>
            <div className="text-center"><b>No Evaluation Request Found!</b></div>
        </CardBody>
      </Card>
        
    )
  ) : (
    <div className='text-center'><Spinner type='grow'/></div>
    )}
    <div className='vertically-centered-modal'>
        <Modal isOpen={UpdateModal} toggle={() => setUpdateModal(!UpdateModal)} className='modal-dialog-Update modal-lg'>
          <ModalHeader toggle={() => setUpdateModal(!UpdateModal)}>Update Kpi</ModalHeader>
          <ModalBody>
            {UpdateData && Object.values(UpdateData).length > 0 && (
                <UpdateKpi data={UpdateData} dropdownData={dropdownData} CallBack={CallBack} type='evaluation' />
            )}
            
          </ModalBody>
        </Modal>
      </div>

      <div className='vertically-centered-modal'>
        <Modal isOpen={evaluationModal} toggle={() => setEvaluationModal(!evaluationModal)} className='modal-dialog-Update modal-lg'>
          <ModalHeader toggle={() => setEvaluationModal(!evaluationModal)}></ModalHeader>
          <ModalBody>
            {evaluationState && Object.values(evaluationState).length > 0 && (
                <EvaluationForm data={evaluationState} CallBack={CallBack} />
            )}
          </ModalBody>
        </Modal>
      </div>
      <Offcanvas direction={canvasPlacement} isOpen={canvasOpen} toggle={toggleCanvasEnd} >
          <OffcanvasHeader toggle={toggleCanvasEnd}></OffcanvasHeader>
          <OffcanvasBody className=''>
            {UpdateData && Object.values(UpdateData).length > 0 && (
                <Comments data={UpdateData} by='tl' callBack={EmployeeCallBack}/>
                )}
            
          </OffcanvasBody>
        </Offcanvas>
        <Offcanvas direction={canvasEvaluationPlacement} isOpen={canvasEvaluationOpen} toggle={toggleCanvasEvaluationEnd} >
          <OffcanvasHeader toggle={toggleCanvasEvaluationEnd}></OffcanvasHeader>
          <OffcanvasBody className=''>
            {evaluationDetailspreData && Object.values(evaluationDetailspreData).length > 0 ? (
                <ViewKpiEvaluation data={evaluationDetailspreData} />
                ) : (
                    <Card>
                        <CardBody>
                            <p className='text-white'>No data found!</p>
                        </CardBody>
                    </Card>
                )}
            
          </OffcanvasBody>
        </Offcanvas>
    </Fragment>
  )
}

export default KpiRequests