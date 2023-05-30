import { Fragment, useState } from 'react'
import { Row, Col, Button, Spinner, Table, Badge } from "reactstrap" 
import { Edit2, Save, XCircle } from 'react-feather'
import apiHelper from '../../Helpers/ApiHelper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const PF = ({ data, CallBack }) => {
    const Api = apiHelper() 
    const MySwal = withReactContent(Swal)
    const [loading, setLoading] = useState(false)
   
    const applyPF = () => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "Do you want to apply for Provident Fund!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Apply!',
            customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-danger ms-1'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.value) {
                const formData = new FormData()
                formData['has_approval'] = true
                Api.jsonPost(`/reimbursements/employees/provident-fund/`, formData)
                .then((deleteResult) => {
                    if (deleteResult.status === 200) {
                        MySwal.fire({
                            icon: 'success',
                            title: 'Provident Fund Applied!',
                            text: 'successfully.',
                            customClass: {
                            confirmButton: 'btn btn-success'
                            }
                        }).then(function (result) {
                            if (result.isConfirmed) {
                                setLoading(true)
                                CallBack()
                                setTimeout(() => {
                                    setLoading(false)
                                }, 1000)
                            }
                        }) 
                    } else {
                        MySwal.fire({
                            icon: 'error',
                            title: 'PF cannot be applied!',
                            text: deleteResult.message ? deleteResult.message : 'PF is not applied.',
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
    <Fragment>
        <Row>
            <Col md={12}>
            <div className='content-header' >
                    <h5 className='mb-2'>Provident Fund</h5>
                </div>
        
        {!loading ? (
                <>
            {(data && Object.values(data).length > 0) ? (
                <Row>
                    <Badge color='light-success'>You have already applied for provident fund! </Badge>
                <Col md={12}>
                    <Table bordered striped responsive className='my-1'>
                            <thead className='table-dark text-center'>
                            <tr>
                                <th scope="col" className="text-nowrap">
                                Date
                                </th>
                                <th scope="col" className="text-nowrap">
                                Name
                                </th>
                                <th scope="col" className="text-nowrap">
                                Employee Approval
                                </th>
                                <th scope="col" className="text-nowrap">
                                Percentage
                                </th>
                                <th scope="col" className="text-nowrap">
                                Status
                                </th>
                            </tr>
                            </thead>
                            
                            <tbody className='text-center'>
                                {Object.values(data).map((item, key) => (
                                        <tr key={key}>
                                        <td className='nowrap'>{item.date ? item.date : <Badge color='light-danger'>N/A</Badge>}</td>
                                        <td>{item.employee_name ? item.employee_name : <Badge color='light-danger'>N/A</Badge>}</td>
                                        <td>{item.has_approval ? <Badge color='light-success'>Approved</Badge> : <Badge color='light-danger'>N/A</Badge>}</td>
                                        <td>{item.percentage ? `${item.percentage}%` : <Badge color='light-danger'>N/A</Badge>}</td>
                                        <td><Badge>{item.status ? item.status : <Badge color='light-danger'>N/A</Badge>}</Badge></td>
                                        
                                        </tr>
                                )
                                )}
                            
                            </tbody>
                            
                    </Table>
                </Col>
                </Row>
            ) : (
                <Row>  
                 <Badge color='light-success'>You have not applied for provident fund yet! </Badge>
                <Col md={3} className='mb-1'>
                <Button color="success" className="btn-next mt-2" onClick={applyPF}>
                <span className="align-middle d-sm-inline-block">
                  Click to Apply 
                </span>
                <Save
                  size={14}
                  className="align-middle ms-sm-25 ms-0"
                ></Save>
              </Button>
                </Col>
                </Row>
            )
            
            }
                </>
            ) : (
                <div className="text-center"><Spinner /></div>
            )
            
       }
        <hr></hr>
            </Col>
        </Row>
    </Fragment>
  )
}

export default PF