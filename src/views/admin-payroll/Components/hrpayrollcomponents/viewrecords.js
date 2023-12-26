import { Fragment, useState, useEffect } from 'react'
import { Label, Row, Col, Input, Button, Spinner, Table, Badge,  Modal, ModalBody, ModalHeader, Card, CardBody } from "reactstrap" 
import Select from 'react-select'
import apiHelper from '../../../Helpers/ApiHelper'
import { Plus, PlusSquare, X } from 'react-feather'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const ViewRecord = ({content, apiCall, batch}) => {
    const Api = apiHelper() 
    const MySwal = withReactContent(Swal)
    const [data, setData] = useState([])
    const [AllData, setAllData] = useState()
    const [loading, setLoading] = useState(false)
    const [employeesNotInPF, setEmployeesNotInPF] = useState([])
    const getData = async () => {
      if (content && apiCall) {
    const apiendpoint = content.payroll_attribute_title.includes('Gym') ? '/payroll/batch/gym/data/' : content.payroll_attribute_title.includes('Medical') ? '/payroll/batch/medical/data/' : content.payroll_attribute_title.includes('Certifications') ? '/payroll/batch/certifications/data/' : content.payroll_attribute_title.includes('Training') ? '/payroll/batch/training/data/' : content.payroll_attribute_title.includes('PF') ? '/payroll/batch/pf/data/' : null
    setLoading(true)
    const formdata = new FormData()
    formdata['salary_batch'] = batch.salary.id
    formdata['payroll_batch'] = content.payroll_batch
    const response = await Api.jsonPost(apiendpoint, formdata)
        if (response.status === 200) {
          setLoading(false) 
            setAllData(response.data)
            setData(response.data.data)
            if (content.payroll_attribute_title.includes('PF')) {
              // const employeesNotInPF = response.data.data.filter((employee) => !employee.in_pf_records)
              setEmployeesNotInPF(response.data.employees_not_in_pf)
            }
        } else {
          setLoading(false)
        Api.Toast('error', response.message)
           
        }
        }
      }
      useEffect(() => {
getData()
      }, [setAllData, content])
      const addEmp = (item) => {
        MySwal.fire({
          title: 'Are you sure?',
          text: "Do you want to add the Employee!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, Add it!',
          customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-danger ms-1'
          },
          buttonsStyling: false
      }).then(function (result) {
          if (result.value) {
            const formData = new FormData()
            formData['salary_batch'] = batch.salary.id
            formData['employee_id'] = item.id
              Api.jsonPost(`/payroll/add/emp/pf/`, formData)
              .then((deleteResult) => {
                  if (deleteResult.status === 200) {
                      MySwal.fire({
                          icon: 'success',
                          title: 'Employee Added!',
                          text: 'Employee is added to pf.',
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
                          title: 'Employee can not be added!',
                          text: deleteResult.message ? deleteResult.message : 'Unable to add employee.',
                          customClass: {
                          confirmButton: 'btn btn-danger'
                          }
                      })
                  }
                          
                  })
          } 
      })
      }
      const removeEmp = (id) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "Do you want to remove the Employee!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Delete it!',
            customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-danger ms-1'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.value) {
                Api.deleteData(`/payroll/delete/emp/pf/${id}/`, {method: 'Delete'})
                .then((deleteResult) => {
                    if (deleteResult.status === 200) {
                        MySwal.fire({
                            icon: 'success',
                            title: 'Employee Removed!',
                            text: 'Employee is removed from pf.',
                            customClass: {
                            confirmButton: 'btn btn-success'
                            }
                        }).then(function (result) {
                            if (result.isConfirmed) {
                             getData()
                             MySwal.close()
                            }
                        }) 
                    } else {
                        MySwal.fire({
                            icon: 'error',
                            title: 'Employee can not be removed!',
                            text: deleteResult.message ? deleteResult.message : 'Unable to remove employee.',
                            customClass: {
                            confirmButton: 'btn btn-danger'
                            }
                            
                        })
                       
                    }                
                    })
            } else {
              MySwal.close()
            }
        })
    }
      return (
<Fragment>
        <Row>
            <Col md={12}>
            <Card>
                    <CardBody>
                        <Row className='mb-2'>
                            <Col md={6}>
                                <h3>Records</h3>
                            </Col>
                            <Col md={6}>
                            </Col>
                        </Row>
        {!loading ? <>
     
        {Object.values(data).length > 0 ? (
                    <Row>
                        <div className="row">
  <div className="col-md-4">
    <div className="d-flex justify-content-between align-items-center">
      <span>Total Amount:</span>
      <Badge color='light-warning'>
        {AllData.total_amount}
      </Badge>
    </div>
  </div>
  <div className="col-md-4">
    <div className="d-flex justify-content-between align-items-center">
      <span>Data Processed:</span>
      <Badge color='light-info'>
        {AllData.data_processed}
      </Badge>
    </div>
  </div>
</div>

                        <Col md={12}>
                            <Table bordered striped responsive className='my-1'>
                                    <thead className='table-dark text-center'>
                                    <tr>
                                        <th scope="col" className="text-nowrap">
                                        Employee Name
                                        </th>
                                        <th scope="col" className="text-nowrap">
                                         Amount
                                        </th>
                                        <th scope="col" className="text-nowrap">
                                        Status
                                        </th>
                                    </tr>
                                    </thead>
                                    
                                    <tbody className='text-center'>
                                        {Object.values(data).map((item, key) => (
                                                <tr key={key}>
                                                <td>{item.employee_name}</td>
                                                <td>{item.amount ? item.amount : item.cost ? item.cost : item.reimbursed_cost ? item.reimbursed_cost : null}</td>
                                                {content.payroll_attribute_title.includes('PF') ? <button
                                                className="border-0 no-background"
                                                title="Delete"
                                                onClick={() => removeEmp(item.id)}
                                              >
                                                <X color="red" />
                                              </button> : <td>{item.status ? item.status : item.reimbursement_status_title}</td> }
                                                </tr>
                                        )
                                        )}

                                    </tbody>
                                    
                            </Table>
                        </Col>
                    </Row>
                        ) : (
                            <div className="text-center">No Data Found!</div>
                        )}
                       {content.payroll_attribute_title.includes('PF') && employeesNotInPF.length > 0 ? (
  <Row>
    <Col md={12}>
      <h4>Employees Not in PF Records</h4>
      {employeesNotInPF.length > 0 ? (
        <Table bordered striped responsive className='my-1'>
          <thead className='table-dark text-center'>
            <tr>
              <th scope="col" className="text-nowrap">Emp Id</th>
              <th scope="col" className="text-nowrap">Employee Name</th>
              <th scope="col" className="text-nowrap">Action</th>
            </tr>
          </thead>
          <tbody className='text-center'>
            {employeesNotInPF.map((employee, key) => (
              <tr key={key}>
                <td>{employee.id}</td>
                <td>{employee.name}</td>
                <td><button
                                                className="border-0 no-background"
                                                title="Add"
                                                onClick={() => addEmp(employee)}
                                              >
                                                <PlusSquare color="green" />
                                              </button></td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="text-center">No Data Found!</div>
      )}
    </Col>
  </Row>
) : null}

                         </> : <div className='text-center'><Spinner type='grow' color='primary'/></div>}
        <hr></hr>
        </CardBody>
        </Card>
            </Col>

        </Row>
     
    </Fragment>
      )
}
export default ViewRecord