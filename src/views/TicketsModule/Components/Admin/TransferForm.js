import {Fragment, useEffect, useState} from 'react'
import { Row, Col, Badge, Button } from 'reactstrap'
import Select from 'react-select'
import EmployeeHelper from '../../../Helpers/EmployeeHelper'
import apiHelper from '../../../Helpers/ApiHelper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const TransferForm = ({id, CallBack}) => {
    const EmpHelper = EmployeeHelper()
    const Api = apiHelper()
    const MySwal = withReactContent(Swal)
    const [employees, setEmployees] = useState([])
    const [emp, setEmp] = useState('')
    const getEmployees = () => {
        if (Object.values(employees).length === 0) {
            EmpHelper.fetchEmployeeDropdown().then(result => {
                setEmployees(result)
            })
        }
    }
    const transferAction = () => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "Do you want to transfer ticket?",
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
                const formData = new FormData()
                if (emp !== '') {
                    formData['transfer_to'] = emp
                    Api.jsonPatch(`/ticket/transfer/to/other/employee/${id}/`, formData)
                    .then((deleteResult) => {
                        if (deleteResult.status === 200) {
                            MySwal.fire({
                                icon: 'success',
                                title: 'Ticket Transfered!',
                                text: 'Ticket transfered successfully.',
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
                                title: 'Ticket can not be transfered!',
                                text: deleteResult.message ? deleteResult.message : 'Ticket is not in transfered.',
                                customClass: {
                                confirmButton: 'btn btn-danger'
                                }
                            })
                        }
                                
                        })
                } else {
                    Api.Toast('error', 'Employee is required to transfer a ticket!')
                }
               
            } 
        })
    }
    useEffect(() => {
        getEmployees()
    }, setEmployees)
  return (
    <Fragment>
        <Row>
            <Col md='8' className='mb-1'>
                <label className='form-label'>
                    Select Employee<Badge color='light-danger'>*</Badge>
                </label>
                <Select
                    isClearable={false}
                    className='react-select'
                    classNamePrefix='select'
                    name="employee"
                    options={employees ? employees : ''}
                    onChange={ (e) => { setEmp(e.value) }}
                />
            </Col>
            <Col md='4'>
                <Button className="btn btn-primary mt-2" onClick={() => transferAction()}>Transfer</Button>
            </Col>
        </Row>
    </Fragment>
  )
}

export default TransferForm