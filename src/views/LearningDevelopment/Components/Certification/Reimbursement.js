import { Fragment, useState } from 'react'
import { Eye } from 'react-feather'
import { Card, CardBody, Label, Row, Col, Button, Badge, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

import apiHelper from '../../../Helpers/ApiHelper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const Reimbursement = ({ data, CallBack }) => {
    console.warn(data)
    const Api = apiHelper()
    const MySwal = withReactContent(Swal)
    const [basicModal, setBasicModal] = useState(false)
    const [feedback_comment, setComment] = useState('')
    const [certificate, setCertificate] = useState('')
    const [reciept, setReciept] = useState('')
    
    const certificateChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setCertificate(e.target.files[0])
        }
    }
    const recieptChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setReciept(e.target.files[0])
        }
    }
    const addReimbursement = async () => {
            const formData = new FormData()
            if (certificate !== '') formData.append("certificate", certificate)
            if (reciept !== '') formData.append("certification_receipt", reciept)
            if (feedback_comment !== '') formData.append("feedback_comment", feedback_comment)
            await Api.jsonPatch(`/certification/certificate/submission/${data.id}/`, formData, false).then(result => {
                if (result) {
                    if (result.status === 200) {
                        Api.Toast('success', result.message)
                        setBasicModal(!basicModal)
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
                {(data && data.reimbursement_status === null) && (
                    <Col md={6}>
                        <Button className='btn btn-success float-right' onClick={() => setBasicModal(!basicModal)}>Add Reimbursement</Button>
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
            <Modal isOpen={basicModal} toggle={() => setBasicModal(!basicModal)}>
                <ModalHeader toggle={() => setBasicModal(!basicModal)}>Add Reimbursement</ModalHeader>
                <ModalBody>
                   <Row>
                    <Col md="4" className="mb-1">
                        <Label className="form-label">
                        Certificate
                        </Label>
                        <Input
                            type="file"
                            id="certificate"
                            name="certificate"
                            accept="image/*"
                            onChange={certificateChange}
                            />
                    </Col>
                    <Col md="4" className="mb-1">
                        <Label className="form-label">
                        Certificate Reciept
                        </Label>
                        <Input
                            type="file"
                            id="reciept"
                            name="reciept"
                            accept="image/*"
                            onChange={recieptChange}
                            />
                    </Col>
                    <Col md="4" className="mb-1">
                        <Label className="form-label">
                        Comment
                        </Label>
                        <Input
                            type="inputarea"
                            id="comment"
                            name="comment"
                            onChange={(e) => setComment(e.target.value)}
                            />
                    </Col>
                   </Row>
                </ModalBody>
                <ModalFooter>
                    <Button color='primary' onClick={() => addReimbursement()}>
                    Submit
                    </Button>
                </ModalFooter>
            </Modal>
    </Fragment>
  )
}

export default Reimbursement