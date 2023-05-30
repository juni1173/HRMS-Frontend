import { Fragment, useState } from 'react'
import { Row, Col, Button, Spinner, Table, Badge } from "reactstrap" 
import { Check } from 'react-feather'
import apiHelper from '../../Helpers/ApiHelper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const SessionsList = ({ data, CallBack }) => {
    const Api = apiHelper() 
    const MySwal = withReactContent(Swal)
    const [loading, setLoading] = useState(false)
   
    const applySession = (id) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "Do you want to apply for this Session!",
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
                Api.jsonPost(`/applicants/register/course_session/${id}/`, formData)
                .then((deleteResult) => {
                    if (deleteResult.status === 200) {
                        MySwal.fire({
                            icon: 'success',
                            title: 'Session Applied!',
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
                            title: 'Session cannot be applied!',
                            text: deleteResult.message ? deleteResult.message : 'Session is not applied.',
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
                    <h5 className='mb-2'>Sessions</h5>
                </div>
        
        {!loading ? (
                <>
            {(data && Object.values(data).length > 0) ? (
                <Row>
                <Col md={12}>
                    <Table bordered striped responsive className='my-1'>
                            <thead className='table-dark text-center'>
                            <tr>
                                <th scope="col" className="text-nowrap">
                                Course Title
                                </th>
                                <th scope="col" className="text-nowrap">
                                Type
                                </th>
                                <th scope="col" className="text-nowrap">
                                Duration
                                </th>
                                <th scope="col" className="text-nowrap">
                                Start / End Date
                                </th>
                                <th scope="col" className="text-nowrap">
                                Total Lectures
                                </th>
                                <th scope="col" className="text-nowrap">
                                Apply
                                </th>
                            </tr>
                            </thead>
                            
                            <tbody className='text-center'>
                                {Object.values(data).map((item, key) => (
                                        <tr key={key}>
                                        <td className='nowrap'>{item.course_title ? item.course_title : <Badge color='light-danger'>N/A</Badge>}</td>
                                        <td>{item.course_session_type_title ? item.course_session_type_title : <Badge color='light-danger'>N/A</Badge>}</td>
                                        <td>{item.duration ? item.duration : <Badge color='light-danger'>N/A</Badge>}</td>
                                        <td>{item.start_date ? `${item.start_date}` : <Badge color='light-danger'>N/A</Badge>} / {item.end_date ? `${item.end_date}` : <Badge color='light-danger'>N/A</Badge>}</td>
                                        <td>{item.total_lectures ? `${item.total_lectures}` : <Badge color='light-danger'>N/A</Badge>}</td>
                                        <td>
                                        <Button color="success" className="btn-next mt-2" onClick={() => applySession(item.id)}>
                                            <span className="align-middle d-sm-inline-block">
                                            Apply 
                                            </span>
                                            <Check
                                            size={14}
                                            className="align-middle ms-sm-25 ms-0"
                                            ></Check>
                                        </Button>
                                        </td>
                                        
                                        </tr>
                                )
                                )}
                            
                            </tbody>
                            
                    </Table>
                </Col>
                </Row>
            ) : (
                <p>Sessions Data not found!</p>
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

export default SessionsList