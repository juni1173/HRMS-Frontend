import React, { Fragment, useState } from 'react'
import { Row, Col, Table, Modal, ModalHeader, ModalBody, Spinner, Button, Badge, CardBody, Card } from 'reactstrap'
import { Edit2, Trash2 } from 'react-feather'
// import Swal from 'sweetalert2'
// import withReactContent from 'sweetalert2-react-content'
import apiHelper from '../../Helpers/ApiHelper'
import UpdateKpi from '../UpdateKpi/update'
const KpiRequests = ({ data, CallBack, dropdownData, key }) => {
    const Api = apiHelper()
    // const MySwal = withReactContent(Swal)
    const [loading, setLoading] = useState(false)
    const [UpdateModal, setUpdateModal] = useState(false)
    const [checkedItems, setCheckedItems] = useState([])
    const [UpdateData, setUpdateData] = useState([])
    const handleCheck = (event) => {
        const { id } = event.target
        const isChecked = event.target.checked
    
        if (isChecked) {
          setCheckedItems([...checkedItems, id])
        } else {
          setCheckedItems(checkedItems.filter((item) => item !== id))
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
    const UpdateKpiFunc = (item) => {
        setUpdateData(item)
        setUpdateModal(!UpdateModal)
    }
  return (
    <Fragment key={key}>
        {checkedItems.length > 0 && (
                            <Button className='btn btn-primary mb-1' onClick={multipleKpiSend}>
                                Send Kpi's to HR
                            </Button>
                        )}
    {!loading ? (  
    data && Object.values(data).length > 0 ? (
    <>
    {Object.values(data).map((dataItem, dataKey) => (
       <>
        <Card key={dataKey}>
            <CardBody>
                <h5>Kpi's of <b>{dataItem.name}</b></h5>
                {dataItem.employee_kpis_data && Object.values(dataItem.employee_kpis_data).length > 0 ? (    
                    <Row>
                    <Col md={12}>
                        
                        <Table bordered striped responsive className='my-1'>
                                <thead className='table-dark text-center'>
                                <tr>
                                    <th scope="col" className="text-nowrap">
                                        Select
                                    </th>
                                    <th scope="col" className="text-nowrap">
                                    Detail
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
                                    <th scope="col" className="text-nowrap">
                                    Actions
                                    </th>
                                </tr>
                                </thead>
                                
                                <tbody className='text-center'>
                                    {Object.values(dataItem.employee_kpis_data).map((item, key) => (
                                            <tr key={key}>
                                            <td>{item.kpis_status_level === 2 ? <input className='form-check-primary' type="checkbox" id={item.id} onChange={handleCheck} /> : <input className='form-check-primary' type="checkbox" disabled/>}</td>
                                            <td>{item.title ? item.title : 'N/A'}</td>
                                            <td>{item.ep_type_title ? item.ep_type_title : 'N/A'}</td>
                                            <td>{item.ep_complexity_title ? item.ep_complexity_title : 'N/A'}</td>
                                            <td>{item.kpis_status_title ? <Badge color="light-success">{item.kpis_status_title}</Badge> : <Badge color="light-danger">N/A</Badge>}</td>
                                            <td>
                                                <div className="row">
                                                {item.kpis_status_level === 2 ? (
                                                    <>
                                                    <div className="col-lg-6">
                                                    <button
                                                    className="border-0"
                                                    onClick={() => UpdateKpiFunc(item)}
                                                    
                                                    >
                                                    <Edit2 color="orange" />
                                                    </button>
                                                    </div>
                                                    {/* <div className="col-lg-6">
                                                        <button
                                                        className="border-0"
                                                        onClick={() => removeAction(item.id)}
                                                        >
                                                        <Trash2 color="red" />
                                                        </button>
                                                    </div> */}
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
    <div className='text-center'><Spinner/></div>
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
    </Fragment>
  )
}

export default KpiRequests