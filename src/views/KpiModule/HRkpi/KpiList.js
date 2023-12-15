import React, { Fragment, useState } from 'react'
import { Row, Col, Table, Spinner, Button, Badge, CardBody, Card, Offcanvas, OffcanvasHeader, OffcanvasBody } from 'reactstrap'
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
        const isChecked = event.target.checked
      // console.warn(tableData)
        if (isChecked) {
          // Select all checkboxes in the current table
          const allIds = tableData
          .filter((item) => item.employee_kpis_data && (
          item.employee_kpis_data.filter(kpi => kpi.kpis_status_level === 11))
          .map((final) => final.id.toString()))
          console.warn(allIds)
          setCheckedItems(allIds)
          setCheckedItems([...checkedItems, ...allIds])
        } else {
          // Deselect all checkboxes in the current table
          const tableIds = tableData.map((item) => item.id.toString())// Convert to strings
          setCheckedItems(checkedItems.filter((item) => !tableIds.includes(item)))
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
                          title: 'Recheck Kpi!',
                          text: 'Kpi status changed to Re-check successfully.',
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
                          title: 'Kpi can not be rechecked!',
                          text: deleteResult.message ? deleteResult.message : 'Kpi is not in recheck process.',
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
  return (
    <Fragment key={index}>
        {/* <h3 className='text-white'>Evaluator: <b>{data.evaluator_name ? data.evaluator_name : 'N/A'}</b></h3> */}
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
    {!loading ? (  
    data.employee_kpis_data && Object.values(data.employee_kpis_data[0]).length > 0 ? (
    <>
    {Object.values(data.employee_kpis_data).map((dataItem, dataKey) => (
       <>
        <Card key={dataKey}>
            <CardBody>
                <h5>Kpi's of <b>{dataItem[0].name}</b></h5>
                <Badge>Evaluator -  <b>{data.evaluator_name ? data.evaluator_name : 'N/A'}</b></Badge>
                {dataItem[0].employee_kpis_data && Object.values(dataItem[0].employee_kpis_data).length > 0 ? (    
                    <Row>
                    <Col md={12}>
                       
                        <Table bordered striped responsive className='my-1'>
                                <thead className='table-dark text-center'>
                                <tr>
                                  {type !== 'search' && (
                                    <th scope="col" className="text-nowrap">
                                        <input
                                          type="checkbox"
                                          onChange={(event) => handlecheckall(event, dataItem[0].employee_kpis_data)}
                                          disabled={
                                            dataItem[0].employee_kpis_data.every(
                                              (item) => (item.kpis_status_level === 3 && item.kpis_status_level === 11)
                                            )
                                          }
                                        />
                  
                                    {/* <label className="form-check-label">Select</label> */}
                                    </th>
                                  )}
                                    <th scope="col" className="text-nowrap">
                                    Type
                                    </th>
                                    <th scope="col" className="text-nowrap">
                                    Details
                                    </th>
                                    <th scope="col" className="text-nowrap">
                                    Complexity
                                    </th>
                                    <th scope="col" className="text-nowrap">
                                    Status
                                    </th>
                                    <th scope="col" className="text-nowrap">
                                    Actions
                                    </th>
                                    
                                </tr>
                                </thead>
                                
                                <tbody className='text-center'>
                                    {Object.values(dataItem[0].employee_kpis_data).map((item, key) => (
                                       item.employee_kpis_data && Object.values(item.employee_kpis_data).length > 0 ? (
                                        <>
                                        {item.employee_kpis_data.map((kpi, kpiIndex) => (

                                          <Fragment key={kpiIndex}>
                                            <tr key={key}>
                                              {type !== 'search' && (
                                                 <td>{(kpi.kpis_status_level === 3 || kpi.kpis_status_level === 11) ? (
                                                  <input
                                                  className='form-check-primary'
                                                  type="checkbox"
                                                  id={kpi.id}
                                                  onChange={handleCheck}
                                                  checked={checkedItems.includes(kpi.id.toString())}
                                                  // checked={checkedItems.includes(item.id)}
                                                  />
                                                ) : <input className='form-check-primary' type="checkbox" disabled/>}</td>
                                              )}
                                              <td>{kpi.ep_type_title ? kpi.ep_type_title : 'N/A'}</td>
                                              <td>{kpi.title ? (kpi.title).substring(0, 20) : 'N/A'}</td>
                                              <td>{kpi.ep_complexity_title ? kpi.ep_complexity_title : 'N/A'}</td>
                                              <td>{kpi.kpis_status_title ? (
                                                      <>
                                                        <Badge color="light-success">{kpi.kpis_status_title}</Badge>
                                                        {(kpi.kpis_status_level && kpi.kpis_status_level > 5 && kpi.kpis_status_level < 11) && <Button className='btn btn-sm btn-primary' onClick={() => getEvaluationDetails(kpi.employee, kpi.id)}>View Ratings</Button>}
                                                      </>
                                                    ) : <Badge color="light-danger">N/A</Badge>}</td>
                                              <td>
                                                <Row>
                                                  <Col>
                                                  <Eye onClick={() => CommentToggle(kpi)}/>
                                                  </Col>
                                                 {kpi.kpis_status_level && kpi.kpis_status_level === 6 && (
                                                  <Col>
                                                  <Button className='btn btn-primary btn-sm'
                                                  onClick={() => recheckAction(kpi.id)}
                                                  >Recheck</Button>
                                                  </Col>
                                                 )}
                                                 {kpi.kpis_status_level && kpi.kpis_status_level === 9 && (
                                                  <Col>
                                                  <Button className='btn btn-primary btn-sm'
                                                  onClick={() => recheckApproval(kpi.id)}
                                                  >Recheck Approval</Button>
                                                  </Col>
                                                 )}
                                                </Row>
                                                
                                                </td>
                                            </tr>
                                          </Fragment>
                                        ))}
                                        </>
                                       ) : (
                                              <>
                                                  <tr>
                                                    {type !== 'search' && (
                                                      <td><input className='form-check-primary' type="checkbox" disabled/></td>
                                                    )}
                                                  <td>{item.title ? item.title : 'N/A'}</td>
                                                  <td colSpan={type !== 'search' ? 3 : 4}>No data found</td>
                                                  </tr>
                                                </>
                                       )
                                            
                                    )
                                    )}
                                
                                </tbody>
                                
                        </Table>
                        
                    </Col>
                    </Row>          
                ) : (
                    <div className="text-center">No Kpi Data Found!</div>
                )}
            </CardBody>
        </Card>
        </>
    ))}
    </>
    ) : (
        <div className="text-center">No Evaluation Reuests Found!</div>
    )
  ) : (
    <div className='text-center'><Spinner color='white'/></div>
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