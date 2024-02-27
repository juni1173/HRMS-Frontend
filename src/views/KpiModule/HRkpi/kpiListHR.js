import React, { Fragment, useState, useEffect } from 'react'
import { Row, Col, Table, Spinner, Button, Badge, CardBody, Card, CardTitle, Offcanvas, OffcanvasHeader, OffcanvasBody } from 'reactstrap'
import { Eye } from 'react-feather'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import apiHelper from '../../Helpers/ApiHelper'
// import UpdateKpi from '../UpdateKpi/update'
import Comments from '../Comments'
import ViewKpiEvaluation from '../EmployeeKpi/ViewKpiEvaluation'
const KpiList = ({ data, CallBack, index, type }) => {

    const Api = apiHelper()
    const MySwal = withReactContent(Swal)
    const [loading, setLoading] = useState(false)
    // const [UpdateModal, setUpdateModal] = useState(false)
    const [kpiData, setKpiData] = useState([])
    const [checkedItems, setCheckedItems] = useState([])
    const [canvasPlacement, setCanvasPlacement] = useState('end')
    const [canvasOpen, setCanvasOpen] = useState(false)
    const [UpdateData, setUpdateData] = useState([])
    const [canvasEvaluationPlacement, setCanvasEvaluationPlacement] = useState('end')
    const [canvasEvaluationOpen, setCanvasEvaluationOpen] = useState(false)
    const [evaluationDetailspreData, setEvaluationDetailspreData] = useState([])
    const handleCheck = (event) => {
        const { id } = event.target
        const isChecked = event.target.checked
        if (isChecked) {
          // Add the ID to checkedItems if it's not already there
          setCheckedItems([...checkedItems, id])
        } else {
          // Remove the ID from checkedItems if it's already there
          setCheckedItems(checkedItems.filter((item) => item !== id))
        }
      }
      
      const handlecheckall = (event, tableData) => {
        console.warn(tableData)
        const isChecked = event.target.checked
      // console.warn(tableData)
        if (isChecked) {
          // Select all checkboxes in the current table
          const allIds = []
          tableData.map((item) => {
            const allkpis = item 
            if (allkpis !== null && allkpis !== undefined) {
              if (allkpis.kpis_status_level === 3 || allkpis.kpis_status_level === 11) {
                allIds.push(allkpis.id.toString())
              }
          }
          })
          console.warn(allIds)
            setCheckedItems(allIds)
            setCheckedItems([...checkedItems, ...allIds])
        } else {
          // // Deselect all checkboxes in the current table
          // const tableIds = tableData.map((item) => item.id.toString())// Convert to strings
          // setCheckedItems(checkedItems.filter((item) => !tableIds.includes(item)))
          setCheckedItems([])
        }
      }
    
      const multipleKpiApprove = async () => {
        // return false
        if (checkedItems.length > 0) {  
            setLoading(true)
                await Api.jsonPost(`/kpis/hr/approval/list/`, {kpis_array: checkedItems})
                .then(result => {
                    if (result) {
                        if (result.status === 200) {
                        Api.Toast('success', result.message)
                        CallBack()
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
    const multipleCancelKpiApprove = async () => {
      // return false
      if (checkedItems.length > 0) {  
          setLoading(true)
              await Api.jsonPost(`/kpis/hr/cancel/approval/list/`, {kpis_array: checkedItems})
              .then(result => {
                  if (result) {
                      if (result.status === 200) {
                      Api.Toast('success', result.message)
                      CallBack()
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
    const recheckAction = (id) => {
      MySwal.fire({
          title: 'Are you sure?',
          text: "Do you want to re-check Kpi!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, proceed!',
          customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-danger ms-1'
          },
          buttonsStyling: false
      }).then(function (result) {
          if (result.value) {
              Api.jsonPatch(`/kpis/recheck/requests/to/hr/${id}/`, {})
              .then((deleteResult) => {
                  if (deleteResult.status === 200) {
                      MySwal.fire({
                          icon: 'success',
                          title: 'Re-Evaluation Kpi!',
                          text: 'Kpi status changed to Re-Evaluate successfully.',
                          customClass: {
                          confirmButton: 'btn btn-success'
                          }
                      }).then(function (result) {
                          if (result.isConfirmed) {
                              CallBack()
                          }
                      }) 
                  } else {
                      MySwal.fire({
                          icon: 'error',
                          title: 'Kpi can not be re-evaluated!',
                          text: deleteResult.message ? deleteResult.message : 'Kpi is not in re-evaluation process.',
                          customClass: {
                          confirmButton: 'btn btn-danger'
                          }
                      })
                  }
                          
                  })
          } 
      })
  }
  const recheckApproval = (id) => {
    MySwal.fire({
        title: 'Are you sure?',
        text: "Do you want to approve Kpi!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, proceed!',
        customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger ms-1'
        },
        buttonsStyling: false
    }).then(function (result) {
        if (result.value) {
            Api.jsonPost(`/kpis/hr/recheck/approval/list/`, {kpis_array: [id]})
            .then((deleteResult) => {
                if (deleteResult.status === 200) {
                    MySwal.fire({
                        icon: 'success',
                        title: 'Recheck Approval Kpi!',
                        text: 'Rechecked Kpi status changed to approved successfully.',
                        customClass: {
                        confirmButton: 'btn btn-success'
                        }
                    }).then(function (result) {
                        if (result.isConfirmed) {
                            CallBack()
                        }
                    }) 
                } else {
                    MySwal.fire({
                        icon: 'error',
                        title: 'Kpi can not be approved!',
                        text: deleteResult.message ? deleteResult.message : 'Kpi is not in recheck approval process.',
                        customClass: {
                        confirmButton: 'btn btn-danger'
                        }
                    })
                }
                        
                })
        } 
    })
    }
    const getKpiData = async () => {
        setLoading(true)
        let url = ''
        if (type !== 'cancel' && type !== 'recheck') {
            url = `/kpis/requests/to/hr/data/${data.id}/`
        }
        if (type === 'recheck') {
            url = `/kpis/recheck/requests/to/hr/data/${data.id}/`
        }
        if (type === 'cancel') {
           url = `/kpis/cancle/requests/to/hr/data/${data.id}/`
        }
        await Api.get(`${url}`).then(result => {
                if (result) {
                    if (result.status === 200) {
                       setKpiData(result.data)
                    } else {
                        Api.Toast('error', result.message)
                    }
                } else (
                 Api.Toast('error', 'Server not responding!')   
                )
            })
        setTimeout(() => {
            setLoading(false)
        }, 500)
        return false
    }
    useEffect(() => {
        getKpiData() 
    }, [setKpiData])
  return (
    <Fragment key={index}>
        <h3 className='text-center'><b>{data.name ? data.name : 'N/A'}</b></h3>
        {(checkedItems.length > 0 && type !== 'cancel' && type !== 'recheck' && type !== 'search') && (
            <Button className='btn btn-warning mb-1' onClick={multipleKpiApprove}>
                Approve Selected Kpi's
            </Button>
        )}
        {(checkedItems.length > 0 && type === 'cancel') && (
          <Button className='btn btn-warning mb-1' onClick={multipleCancelKpiApprove}>
              Approve Selected Kpi's
          </Button>
        )}
            <br></br>
        {(type !== 'search') && (
                                
            <input
                className='form-check-primary'
                type="checkbox"
                onChange={(event) => handlecheckall(event, kpiData)}
                disabled={
                    kpiData.every(
                    (item) => (item.kpis_status_level === 3 && item.kpis_status_level === 11)
                    )
                }
            />      
            )}
                {!loading ? (  
                kpiData && Object.values(kpiData).length > 0 ? (
                    Object.values(kpiData).reverse().map((kpi, key) => (
                        <div className="row" key={key}>
                                    <Col md={1} className="d-flex align-items-center">
                                            {type !== 'search' && (
                                                 (kpi.kpis_status_level === 3 || kpi.kpis_status_level === 11) ? (
                                                  <input
                                                  className='form-check-primary'
                                                  type="checkbox"
                                                  id={kpi.id}
                                                  onChange={handleCheck}
                                                  checked={checkedItems.includes(kpi.id.toString())}
                                                  // checked={checkedItems.includes(item.id)}
                                                  />
                                                ) : <input className='form-check-primary' type="checkbox" disabled/>
                                              )}
                                    </Col>
                                    <Col md={11} className='p-0'>
                                        <Card bg="light" style={{ backgroundColor: '#F2F3F4' }} className='text-nowrap'>    
                                            <CardBody>
                                                <Row>
                                                    <Col md={9}><CardTitle>{kpi.title ? (kpi.title).substring(0, 20) : 'N/A'}</CardTitle></Col>
                                                    <Col md={3} className='d-flex justify-content-end'>
                                                        <Eye onClick={() => CommentToggle(kpi)}/>
                                                    </Col>
                                                    <Col md={5}>
                                                        {kpi.kpis_status_title ? (
                                                        <>
                                                            <Badge color="light-success">{kpi.kpis_status_title}</Badge>
                                                        </>
                                                        ) : <Badge color="light-danger">N/A</Badge>}
                                                    </Col>
                                                    <Col md={3}>
                                                        <Badge color='light-warning'>{kpi.ep_type_title ? kpi.ep_type_title : 'N/A'}</Badge>
                                                    </Col>
                                                    <Col md={2}>
                                                        <Badge color='light-success'>{kpi.mode_of_kpis_title ? kpi.mode_of_kpis_title : 'N/A'}</Badge>
                                                        {kpi.kpis_status_level && kpi.kpis_status_level === 6 && (
                                                            <>
                                                            <br></br><Button className='btn btn-primary btn-sm mb-1'
                                                            onClick={() => recheckAction(kpi.id)}
                                                            >Re-Evaluate</Button>
                                                            </>
                                                        )}
                                                    </Col>
                                                    <Col md={2} className='d-flex justify-content-end'>
                                                        {/* {kpi.kpis_status_level && kpi.kpis_status_level === 6 && (
                                                            <Button className='btn btn-primary btn-sm'
                                                            onClick={() => recheckAction(kpi.id)}
                                                            >Re-Evaluate</Button>
                                                        )} */}
                                                    </Col>
                                                    <Col md={5}>
                                                        {kpi.evaluator_name ? kpi.evaluator_name : 'N/A'}
                                                    </Col>
                                                    <Col md={3}>
                                                        <Badge color='light-danger'>
                                                            {kpi.ep_complexity_title ? kpi.ep_complexity_title : 'N/A'}
                                                        </Badge><br></br>
                                                    </Col>
                                                    <Col md={4}>
                                                    {(kpi.kpis_status_level && kpi.kpis_status_level > 5 && kpi.kpis_status_level < 11) && (
                                                        <>                                                        
                                                            <Button className='btn btn-sm btn-primary' onClick={() => getEvaluationDetails(kpi.employee, kpi.id)}>Ratings</Button>
                                                            <br></br>
                                                        </>
                                                    )}
                                                    {kpi.kpis_status_level && kpi.kpis_status_level === 9 && (
                                                            <Button className='btn btn-primary btn-sm mt-1'
                                                            onClick={() => recheckApproval(kpi.id)}
                                                            >Re-Evaluation Approval</Button>
                                                        )}
                                                       
                                                    </Col>
                                                </Row>
                                        
                                            </CardBody>
                                        </Card>
                                    </Col>
                        </div>
                        ))
                    
                ) : (
                    <div className="text-center">No Kpi Data Found!</div>
                )
                ) : (
                    <div className='text-center'><Spinner/></div>
                    )}
    {/* <div className='vertically-centered-modal'>
        <Modal isOpen={UpdateModal} toggle={() => setUpdateModal(!UpdateModal)} className='modal-dialog-Update modal-lg'>
          <ModalHeader toggle={() => setUpdateModal(!UpdateModal)}>Update Kpi</ModalHeader>
          <ModalBody>
            {UpdateData && Object.values(UpdateData).length > 0 && (
                <UpdateKpi data={UpdateData} dropdownData={dropdownData} CallBack={CallBack} />
            )}
            
          </ModalBody>
        </Modal>
      </div> */}
      <Offcanvas direction={canvasPlacement} isOpen={canvasOpen} toggle={toggleCanvasEnd} >
          <OffcanvasHeader toggle={toggleCanvasEnd}></OffcanvasHeader>
          <OffcanvasBody className=''>
            {UpdateData && Object.values(UpdateData).length > 0 && (
                <Comments data={UpdateData} by='hr' callBack={CallBack}/>
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
                            No data found!
                        </CardBody>
                    </Card>
                )}
            
          </OffcanvasBody>
        </Offcanvas>
    </Fragment>
  )
}

export default KpiList