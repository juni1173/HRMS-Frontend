import React, { Fragment, useState } from 'react'
import { Row, Col, Table, Modal, ModalHeader, ModalBody, Spinner, Button, Badge, CardBody, Card, Offcanvas, OffcanvasHeader, OffcanvasBody } from 'reactstrap'
import { Edit2, Eye, Trash2 } from 'react-feather'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import apiHelper from '../../Helpers/ApiHelper'
import UpdateKpi from '../UpdateKpi/update'
import EvaluationForm from './EvaluationForm'
import Comments from '../Comments'
import ViewKpiEvaluation from '../EmployeeKpi/ViewKpiEvaluation'
const KpiRequests = ({ data, CallBack, dropdownData, index, type }) => {
    const Api = apiHelper()
    const MySwal = withReactContent(Swal)
    const [loading, setLoading] = useState(false)
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
                              CallBack()
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
  return (
    <Fragment key={index}>
        {checkedItems.length > 0 && (
            <Button className='btn btn-warning mb-1' onClick={multipleKpiSend}>
                Approve & Send Kpi's to HR
            </Button>
        )}
    {!loading ? (  
    (data && Object.values(data).length > 0) ? (
    <>
    {Object.values(data).map((dataItem, dataKey) => (
       dataItem.employee_kpis_data && Object.values(dataItem.employee_kpis_data).length > 0 && ( 
        <Card key={dataKey}>
            <CardBody>
                  <>
                  
                    <h5>Kpi's of <b>{dataItem.name}</b></h5>  
                    <Row>
                    <Col md={12}>
                        <Table bordered striped responsive className='my-1'>
                                <thead className='table-dark text-center'>
                                <tr>
                                    <th scope="col" className="text-nowrap">
                                    <input
                                        type="checkbox"
                                        onChange={(event) => handlecheckall(event, dataItem.employee_kpis_data)}
                                        
                                        disabled={
                                         
                                          // dataItem.employee_kpis_data.every(
                                          //   (item) => console.log(item.employee_kpis_data)
                                          //   //  item.employee_kpis_data.kpis_status_level !== 2
                                          //   // 
                                          // )
                                          type !== 'cancel' ? dataItem.employee_kpis_data.every(
                                          
                                            (item) => item.employee_kpis_data && item.employee_kpis_data.every(
                                              (nestedItem) => nestedItem.kpis_status_level !== 2
                                            )
                                          ) : dataItem.employee_kpis_data.every(
                                          
                                            (item) => item.employee_kpis_data && item.employee_kpis_data.every(
                                              (nestedItem) => nestedItem.kpis_status_level !== 11
                                            )
                                          )
                                          
                                        }
                                      />
                                        {/* Select */}
                                    </th>
                                    <th scope="col" className="text-nowrap">
                                    Type
                                    </th>
                                    <th scope="col" className="text-nowrap">
                                    Detail
                                    </th>
                                    <th scope="col" className="text-nowrap">
                                    Complexity
                                    </th>
                                    <th scope="col" className="text-nowrap">
                                    Status
                                    </th>
                                    <th scope='col' className='text-nowrap'>
                                    Employment Type
                                    </th>
                                    <th scope="col" className="text-nowrap">
                                    Actions
                                    </th>
                                    {type !== 'cancel' && (
                                      <th scope="col" className="text-nowrap">
                                      Cancel
                                      </th>
                                    )}
                                    
                                    
                                </tr>
                                </thead>
                                
                                <tbody className='text-center'>
                                    {Object.values(dataItem.employee_kpis_data).reverse().map((item, key) => (
                                              item.employee_kpis_data && Object.values(item.employee_kpis_data).length > 0 ? (
                                                <Fragment key={key}>
                                                {item.employee_kpis_data.map((kpi, kpiIndex) => (
                                                  <Fragment key={kpiIndex}>
                                                            <tr key={key}>
                                                              { type === 'cancel' ? <td>{kpi.kpis_status_level === 11 ? <input
                                                          className='form-check-primary'
                                                          type="checkbox"
                                                          id={kpi.id}
                                                          onChange={handleCheck}
                                                          checked={checkedItems.includes(kpi.id.toString())}
                                                        />  : <input className='form-check-primary' type="checkbox" disabled/>}</td> : <td>{kpi.kpis_status_level === 2 ? <input
                                                          className='form-check-primary'
                                                          type="checkbox"
                                                          id={kpi.id}
                                                          onChange={handleCheck}
                                                          checked={checkedItems.includes(kpi.id.toString())}
                                                        />  : <input className='form-check-primary' type="checkbox" disabled/>}</td>}
                                                    
                                                    <td>{item.title ? item.title : 'N/A'}</td>
                                                    <td>{kpi.title ? kpi.title : 'N/A'}</td>
                                                    <td>{kpi.ep_complexity_title ? kpi.ep_complexity_title : 'N/A'}</td>
                                                    <td>{kpi.kpis_status_title ? (
                                                      <>
                                                        <Badge color="light-success">{kpi.kpis_status_title}</Badge>
                                                        { type !== 'cancel' ? <>
                                                        {kpi.kpis_status_level && kpi.kpis_status_level > 5 && <Button className='btn btn-sm btn-primary' onClick={() => getEvaluationDetails(kpi.employee, kpi.id)}>View Ratings</Button>}
                                                        </> : null}
                                                      </>
                                                    ) : <Badge color="light-danger">N/A</Badge>}</td>
                                                    <td>{kpi.mode_of_kpis_title ? kpi.mode_of_kpis_title : 'N/A'}</td>
                                                    <td>
                                                        <div className="row">
                                                          <div className='col-lg-4 '>
                                                          <Eye onClick={() => CommentToggle(kpi)}/>
                                                          </div>
                                                        {kpi.kpis_status_level === 2 && (
                                                            <>
                                                            <div className="col-lg-4 border-right">
                                                            <button
                                                            className="border-0"
                                                            onClick={() => UpdateKpiFunc(kpi)}
                                                            
                                                            >
                                                            <Edit2 color="orange" />
                                                            </button>
                                                            </div>
                                                            </>
                                                        ) }
                                                        {(kpi.kpis_status_level === 4 || kpi.kpis_status_level === 5 || kpi.kpis_status_level === 7 || kpi.kpis_status_level === 8) && (
                                                                <div className="col-lg-10">
                                                                    <button
                                                                    className="btn btn-primary btn-sm border-0"
                                                                    onClick={() => evaluationAction(dataItem.name, kpi.title, kpi)}
                                                                    >
                                                                    {`${kpi.scale_group_title} Evaluation`}
                                                                    </button>
                                                                </div>
                                                            )}
                                                        
                                                        </div>
                                                    </td>
                                                    {type !== 'cancel' && (
                                                    <td>
                                                    <button
                                                              className="btn btn-danger btn-sm border-0"
                                                              onClick={() => cancelAction(kpi.id)}
                                                              >
                                                              <Trash2/>
                                                              </button>
                                                    </td>
                                                    )}
                                                    </tr>
                                                  </Fragment>
                                                ))}
                                                </ Fragment>
                                              ) : (
                                                <>
                                                  <tr>
                                                  
                                                  <td><input className='form-check-primary' type="checkbox" disabled/></td>
                                                  <td>{item.title ? item.title : 'N/A'}</td>
                                                  <td colSpan={5}>No data found</td>
                                                  </tr>
                                                </>
                                              )
                                    )
                                    )}
                                
                                </tbody>
                                
                        </Table>
                        
                    </Col>
                    </Row>
                  </>                    
               
            </CardBody>
        </Card>
        )
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
    <div className='text-center'><Spinner color='white'/></div>
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
                <Comments data={UpdateData} />
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