import { Fragment } from 'react'
import { Eye } from 'react-feather'
import { Card, CardBody, Label, Row, Col, Button, Badge, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import apiHelper from '../../../../Helpers/ApiHelper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const HR_Reimbursement = ({ data, CallBack }) => {
    const Api = apiHelper()
    const MySwal = withReactContent(Swal)
   
    const approveReimbursement = async () => {
            
            await Api.jsonPatch(`/certification/hr/approval/reimbursement/${data.id}/`).then(result => {
                if (result) {
                    if (result.status === 200) {
                        Api.Toast('success', result.message)
                        CallBack()
                    } else {
                        Api.Toast('error', result.message)
                    }
                } else {
                    Api.Toast('error', 'Server Error!')
                }
            })
        
    }
    
  return (
    <Fragment>
            <Row>
                <Col md={6}>
                    <h2>Reimbursement Details</h2>
                </Col>
                {(data && data.reimbursement_status === 1) && (
                    <Col md={6}>
                        <Button className='btn btn-success float-right' onClick={() => approveReimbursement()}>Approve Reimbursement</Button>
                    </Col>
                )}
                    
                <Col md={12} className='my-2'>
                        <>
                        
                        {(data && Object.values(data).length > 0 && data.reimbursement_status) ? (
                                <Card className='dark-shadow'>
                                    <CardBody>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h4>{data.employee_name ? data.employee_name : 'No title found'}</h4>
                                            Course: <b>{data.title ? data.title : 'No title found'}</b><br></br>
                                            Cost: <Badge>{data.cost ? data.cost : 'N/A'}</Badge>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="float-right">
                                                <button
                                                    className="border-0 no-background"
                                                    title="Certificate"
                                                    >
                                                    <a href={`${data.certificate}`} target="_blank" >Certificate <Eye color="green"/></a>
                                                </button>
                                                <button
                                                    className="border-0 no-background"
                                                    title="Reciept"
                                                    >
                                                    <a href={`${data.certification_receipt}`} target="_blank">Reciept <Eye color="orange"/></a>
                                                </button><br></br><br></br>
                                                <Badge>{data.reimbursement_status_title}</Badge>
                                                
                                            </div>
                                        </div>
                                    </div>
                                    
                                    </CardBody>
                                </Card>
                        ) : (
                            <div className='my-2'>
                                No Reimbursement Request Found!
                            </div>
                        )}
                    </>
                </Col>
            </Row>
    </Fragment>
  )
}

export default HR_Reimbursement