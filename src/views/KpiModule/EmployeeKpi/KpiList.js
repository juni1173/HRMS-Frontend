import React, { Fragment, useEffect, useState } from 'react'
import { Row, Col, Table, Modal, ModalHeader, ModalBody, Spinner, Button, Badge, Offcanvas, OffcanvasHeader, OffcanvasBody, Card, CardBody } from 'reactstrap'
import { Edit2, Trash2, Eye } from 'react-feather'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import apiHelper from '../../Helpers/ApiHelper'
import UpdateKpi from '../UpdateKpi/update'
import Comments from '../Comments'
import ViewKpiEvaluation from './ViewKpiEvaluation'
const KpiList = ({ searchData, CallBack, dropdownData, type }) => {
    const Api = apiHelper()
    const MySwal = withReactContent(Swal)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [UpdateModal, setUpdateModal] = useState(false)
    const [checkedItems, setCheckedItems] = useState([])
    const [UpdateData, setUpdateData] = useState([])
    const [selectAll, setSelectAll] = useState(false)
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
      const handlecheckall = (event) => {
        const isChecked = event.target.checked
        setSelectAll(isChecked)
    
        if (isChecked) {
          // Select all items
          const allItemIds = data.map((item) => item.id.toString())
          setCheckedItems(allItemIds)
        } else {
          // Deselect all items
          setCheckedItems([])
        }
      }
      const multipleKpiSend = async () => {
        console.warn(checkedItems)
        // return false
        if (checkedItems.length > 0) {  
                await Api.jsonPost(`/kpis/employees/approval/list/`, {kpis_array: checkedItems})
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
        
        } else {
            Api.Toast('error', 'Please select a kpi to send!')
        }
    }
    const removeAction = (id) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "Do you want to delete Kpi!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-danger ms-1'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.value) {
                Api.deleteData(`/kpis/employees/${id}/`, {method: 'Delete'})
                .then((deleteResult) => {
                    if (deleteResult.status === 200) {
                        MySwal.fire({
                            icon: 'success',
                            title: 'Kpi Deleted!',
                            text: 'Kpi is deleted.',
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
                            title: 'Kpi can not be deleted!',
                            text: deleteResult.message ? deleteResult.message : 'Kpi is not deleted.',
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
        searchData && searchData.length > 0 ? (
            setData(searchData)
            ) : (
            await Api.get(`/kpis/employees/`).then(result => {
                if (result) {
                    if (result.status === 200) {
                       setData(result.data)
                    } else {
                        Api.Toast('error', result.message)
                    }
                } else (
                 Api.Toast('error', 'Server not responding!')   
                )
            })
            )
        setTimeout(() => {
            setLoading(false)
        }, 500)
        return false
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
      useEffect(() => {
            getKpiData() 
        }, [setData])
        
  return (
    <Fragment>
    {Object.values(data).length > 0 ? (
        !loading ? (
            <Card>
                <CardBody>
                <Row>
            
            <Col md={12}>
                {checkedItems.length > 0 && (
                    <Button className='btn btn-primary mb-1' onClick={multipleKpiSend}>
                        Send Kpi's to Evaluator
                    </Button>
                )}
                <Table bordered striped responsive className='my-1'>
                        <thead className='table-dark text-center'>
                        <tr>
                            {(type !== 'search') && (
                                <th scope="col" className="text-nowrap">
                                <input
                                type="checkbox"
                                onChange={handlecheckall} // Attach the handler to the "Select All" checkbox
                                checked={selectAll} // Bind the checked state to the "Select All" checkbox
                                disabled={
                                    data.every((item) => item.kpis_status_level !== 1)
                                  }
                              />
                                    {/* Select */}
                                </th>
                            )}
                            <th scope="col" className="text-nowrap">
                            Detail
                            </th>
                            <th scope="col" className="text-nowrap">
                            Evaluator
                            </th>
                            <th scope="col" className="text-nowrap">
                            Type
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
                            View
                            </th>
                            <th scope="col" className="text-nowrap">
                            Actions
                            </th>
                        </tr>
                        </thead>
                        
                        <tbody className='text-center'>
                            {Object.values(data).reverse().map((item, key) => (
                                    <tr key={key}>
                                {(type !== 'search') && (
                                    <td>{item.kpis_status_level === 1 ?  <input
                                        className='form-check-primary'
                                        type="checkbox"
                                        id={item.id}
                                        onChange={handleCheck}
                                        checked={checkedItems.includes(item.id.toString())} // Bind the checked state to individual checkboxes
                                    /> : <input className='form-check-primary' type="checkbox" disabled/>}</td>
                                )}
                                    <td>{item.title ? item.title : 'N/A'}</td>
                                    <td>{item.evaluator_name ? item.evaluator_name : 'N/A'}</td>
                                    <td>{item.ep_type_title ? item.ep_type_title : 'N/A'}</td>
                                    <td>{item.ep_complexity_title ? item.ep_complexity_title : 'N/A'}</td>
                                    <td>{item.kpis_status_title ? (
                                        <>
                                    <Badge color="light-success">{item.kpis_status_title}</Badge>
                                    {item.kpis_status_level && item.kpis_status_level > 5 && <Button className='btn btn-sm btn-primary' onClick={() => getEvaluationDetails(item.employee, item.id)}>View Ratings</Button>}
                                    </>
                                    ) : <Badge color="light-danger">N/A</Badge>}</td>
                                    <td>{item.mode_of_kpis_title ? item.mode_of_kpis_title : 'N/A'}</td>
                                    <td><Eye onClick={() => CommentToggle(item)}/></td>
                                    <td>
                                        <div className="row">
                                        {item.kpis_status_level === 1 ? (
                                            <>
                                            <div className="col-lg-6">
                                            <button
                                            className="border-0"
                                            onClick={() => UpdateKpiFunc(item)}
                                            
                                            >
                                            <Edit2 color="orange" />
                                            </button>
                                            </div>
                                            <div className="col-lg-6">
                                                <button
                                                className="border-0"
                                                onClick={() => removeAction(item.id)}
                                                >
                                                <Trash2 color="red" />
                                                </button>
                                            </div>
                                            </>
                                        ) : (
                                            <Badge color='light-danger'>No Action Available</Badge>
                                        ) }
                                        
                                        </div>
                                    </td>
                                    </tr>
                            )
                            )}
                        
                        </tbody>
                        
                </Table>
            </Col>
            </Row>
                </CardBody>
            </Card>
        
        ) : (
            <div className='text-center'><Spinner color='white'/></div>
        )
        ) : (
            <div className="text-center text-white">No Kpi Data Found!</div>
        )
    }
    <div className='vertically-centered-modal'>
        <Modal isOpen={UpdateModal} toggle={() => setUpdateModal(!UpdateModal)} className='modal-dialog-Update modal-lg'>
          <ModalHeader toggle={() => setUpdateModal(!UpdateModal)}>Update Kpi</ModalHeader>
          <ModalBody>
            {UpdateData && Object.values(UpdateData).length > 0 && (
                <UpdateKpi data={UpdateData} dropdownData={dropdownData} CallBack={CallBack} type='employee'/>
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