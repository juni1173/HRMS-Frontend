import React, { Fragment, useState } from 'react'
import { Delete } from 'react-feather'
import { Row, Col, Table, Button, Offcanvas, OffcanvasHeader, OffcanvasBody, Badge, Modal, ModalHeader, ModalBody, Input } from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import apiHelper from '../../../../../Helpers/ApiHelper'
import EmployeeAssignments from './EmployeeAssignments'
import ReimbursementDetails from './ReimbursementDetails'
const EmployeeAssigned = ({ data, CallBack }) => {
    console.warn(data)
    const Api = apiHelper()
    const MySwal = withReactContent(Swal)
    const [canvasPlacement, setCanvasPlacement] = useState('end')
    const [canvasOpen, setCanvasOpen] = useState(false)
    const [basicModal, setBasicModal] = useState(false)
    const [reimburseData, setReimburseData] = useState([])
    const [assignments, setAssignments] = useState([])
    const [reimbursementAmount, setReimbursementAmount] = useState('')
    const toggleCanvasEnd = (assign) => {
        if (assign) {
            setAssignments(assign)
        }
        setCanvasPlacement('end')
        setCanvasOpen(!canvasOpen)
      }
     const reimbursementModal = (data) => {
        if (data) setReimburseData(data)
        setBasicModal(!basicModal)
     } 
      const deleteAssignedEmployee = (id) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "Do you want to remove this employee from this training!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Remove it!',
            customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-danger ms-1'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.value) {
                Api.deleteData(`/training/employee/id/${id}/`, {method:'delete'})
                .then((deleteResult) => {
                    if (deleteResult.status === 200) {
                        MySwal.fire({
                            icon: 'success',
                            title: 'Employee Removed!',
                            text: 'Employee is Removed.',
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
                            title: deleteResult.message ? deleteResult.message : 'Employee can not be Removed!',
                            text: 'Employee is not Removed.',
                            customClass: {
                            confirmButton: 'btn btn-danger'
                            }
                        })
                    }
                        
                    })
            } 
        })
    }
    const approveSubmit = (id) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "Do you want to approve this reimbursement amount of this training!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Approve it!',
            customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-danger ms-1'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.value) {
                const formData = new FormData()
                if (reimbursementAmount !== '') {
                    formData['reimbursed_cost'] = reimbursementAmount
                    Api.jsonPatch(`/training/hr/reimbursement/approval/employee/id/${id}/`, formData)
                .then((deleteResult) => {
                    if (deleteResult.status === 200) {
                        MySwal.fire({
                            icon: 'success',
                            title: 'Reimbursement Approved!',
                            text: 'Reimbursement is Approved.',
                            customClass: {
                            confirmButton: 'btn btn-success'
                            }
                        }).then(function (result) {
                            if (result.isConfirmed) {
                                setBasicModal(!basicModal)
                                CallBack()
                            }
                        })
                    } else {
                        MySwal.fire({
                            icon: 'error',
                            title: deleteResult.message ? deleteResult.message : 'Reimbursement can not be Approved!',
                            text: 'Reimbursement is not Approved.',
                            customClass: {
                            confirmButton: 'btn btn-danger'
                            }
                        })
                    }
                        
                    })
                } else {
                    Api.Toast('error', 'Reimburement amount is required!')
                }
            } 
        })
    }
  return (
    <Fragment>
        <Table bordered striped responsive>
            <thead className='table-dark text-center'>
            <tr>
                <th>Employee</th>
                <th>Evaluator</th>
                {/* <th>End Date</th> */}
                <th>Status</th>
                <th>Assignments</th>
                <th>Reimbursements</th>
            </tr>
            </thead>
            <tbody>
            {data && data.length > 0 ? (
                data.map((employee, key) => (
                    <tr key={key}>
                        <td>{employee.employee_name ? employee.employee_name : 'N/A'} {employee.training_status < 2 && <Delete className='float-right' color='red' size={20} onClick={() => deleteAssignedEmployee(employee.id)}/>}</td>
                        <td>{employee.training_evaluator_name ? employee.training_evaluator_name : 'N/A'}</td>
                        {/* <td>{employee.end_date ? employee.end_date : 'N/A'}</td> */}
                        <td>{employee.training_status_title ? employee.training_status_title : 'N/A'}</td>
                        <td>{employee.employee_training_assignment ? <Button className='btn btn-success' onClick={() => toggleCanvasEnd(employee.employee_training_assignment)}>Details</Button> : 'Not submitted'}</td>
                        <td>{(employee.reimbursement_status && (employee.reimbursement_status === 1 || employee.reimbursement_status === 2)) ? <Badge color='light-danger' style={{ cursor: 'pointer'}} onClick={() => reimbursementModal(employee)}>{employee.reimbursement_status_title}</Badge> : 'N/A'}</td>
                    </tr>
                ))
                
            ) : (
                <tr>
                    <td colSpan='5'>No data found</td>
                </tr>
            )}
            </tbody>
        </Table>
        <Offcanvas direction={canvasPlacement} isOpen={canvasOpen} toggle={toggleCanvasEnd} >
          <OffcanvasHeader toggle={toggleCanvasEnd}></OffcanvasHeader>
          <OffcanvasBody className=''>
            <EmployeeAssignments data={assignments}/>
          </OffcanvasBody>
        </Offcanvas>
        <Modal isOpen={basicModal} toggle={() => setBasicModal(!basicModal)} className="modal-lg">
          <ModalHeader toggle={() => setBasicModal(!basicModal)}></ModalHeader>
          <ModalBody>
            <ReimbursementDetails data={reimburseData} />
            {reimburseData.reimbursement_status === 1 && (
                <Row>
                <Col md={6}>
                    <Input
                        type='number'
                        title='cost'
                        placeholder='Approved Amount'
                        onChange={e => setReimbursementAmount(e.target.value)}
                    />
                </Col>
                <Col md={6}>
                    <Button color='success float-right' onClick={() => approveSubmit(reimburseData.id)}>
                        Submit Approval
                    </Button>
                </Col>
            </Row>
            )}
            
          </ModalBody>
        </Modal>
</Fragment>
  )
}

export default EmployeeAssigned