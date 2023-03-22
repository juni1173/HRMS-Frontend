import {useState, useEffect, Fragment} from 'react'
import { Form, Row, Col, Button, Spinner, Table } from 'reactstrap'
import Select from 'react-select'
import apiHelper from '../../../../../Helpers/ApiHelper'
import { Trash2 } from 'react-feather'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const RoleUsers = ({ role_id }) => {
    const Api = apiHelper()
    const [employeeList] = useState([])
    const [employee, setEmployee] = useState('')
    const [roleEmployees, setRoleEmployees] = useState([])
    const [loading, setLoading] = useState(false)
    const MySwal = withReactContent(Swal)
    
    const getEmployeeData = async () => {
        setLoading(true)
        await Api.get(`/employees/pre/data/system/roles/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    const data = result.data
                    employeeList.splice(0, employeeList.length)
                    for (let i = 0; i < data.length; i++) {
                        employeeList.push({value: data[i].id, label: data[i].name})
                    }
                    return employeeList
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
    }
    const getRoleEmployees = async () => {
        setLoading(true)
        await Api.get(`/employees/system/roles/${role_id}/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    const data = result.data
                    setRoleEmployees(data)
                } else {
                    Api.Toast('error', result.message)
                }
            } else (
             Api.Toast('error', 'Server not responding!')   
            )
        })  
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }
    const removeRoleEmployee = (uuid) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "Do you want to remove the user from this role!",
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
                Api.deleteData(`/employees/${uuid}/system/roles/`, {method: 'Delete'})
                .then((deleteResult) => {
                    if (deleteResult.status === 200) {
                        MySwal.fire({
                            icon: 'success',
                            title: 'User Removed!',
                            text: 'User is removed successfully.',
                            customClass: {
                            confirmButton: 'btn btn-success'
                            }
                        }).then(function (result) {
                            if (result.isConfirmed) {
                                getRoleEmployees()
                            }
                        })
                    } else {
                        MySwal.fire({
                            icon: 'error',
                            title: deleteResult.message ? deleteResult.message : 'User can not be removed!',
                            text: 'User is not removed.',
                            customClass: {
                            confirmButton: 'btn btn-danger'
                            }
                        })
                    }
                        
                    })
            } 
        })
    }
    const onSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData()
        if (employee !== '') {
            formData['employee'] = employee
            formData['role'] = role_id
        await Api.jsonPost(`/employees/system/roles/`, formData).then(result => {
            if (result) {
                if (result.status === 200) {
                    getRoleEmployees()
                    Api.Toast('success', result.message)
                } else {
                    Api.Toast('error', result.message)
                }
            } else (
             Api.Toast('error', 'Server not responding!')   
            )
        })  
        } else {
            Api.Toast('error', 'No employee found!')
        }
        
        setTimeout(() => {
            setLoading(false)
        }, 500)
    }
    useEffect(() => {
        getEmployeeData()
        getRoleEmployees()
    }, [])
  return (
    <Fragment>
        {!loading ? (
            <>
                <Form onSubmit={onSubmit}>
                <Row>
                    <Col md={8}>
                        <Select 
                            type='text'
                            className='select'
                            options={employeeList}
                            onChange={(e) => setEmployee(e.value)}
                        />
                    </Col>
                    <Col md={4}>
                    <Button className='btn btn-success'>
                        Assign
                    </Button>
                    </Col>
                </Row>
                </Form>
                <Row className='mt-1'>
                    <Col md={12}>
                       <Table responsive striped bordered>
                        <thead className='table-dark text-center'>
                            <tr >
                                <td>Employee</td>
                                <td>Role</td>
                                <td>Remove</td>
                            </tr>
                        </thead>
                        <tbody>
                            {roleEmployees.length > 0 ? (
                                roleEmployees.map((item, key) => (
                                    <tr key={key}>
                                        <td>
                                            {item.employee_name && item.employee_name}
                                        </td>
                                        <td>
                                            {item.role_title && item.role_title}
                                        </td>
                                        <td className='text-center'>
                                            <Trash2 color='red' onClick={() => removeRoleEmployee(item.employee_uuid)}/>
                                        </td>
                                    </tr>
                                ))
                                
                            ) : (
                                <tr>
                                    <td colSpan={3}>No Employee Found</td>
                                </tr>
                            )}
                        </tbody>
                        </Table> 
                    </Col>
                </Row>
            </>
            
        ) : (
            <div className='text-center'><Spinner/></div>
        )}
        
    </Fragment>
  )
}

export default RoleUsers