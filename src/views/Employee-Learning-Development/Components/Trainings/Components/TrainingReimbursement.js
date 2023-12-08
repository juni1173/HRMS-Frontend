import { Fragment, useState } from 'react'
import { Eye } from 'react-feather'
import { Card, CardBody, Label, Row, Col, Button, Badge, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import apiHelper from '../../../../Helpers/ApiHelper'
const TrainingReimbursement = ({ data, CallBack }) => {
    const Api = apiHelper()
    
    const [basicModal, setBasicModal] = useState(false)
    const [training_cost, setTraining_cost] = useState('')
    const [training_receipt, settraining_receipt] = useState('')
    
    const training_receiptChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            settraining_receipt(e.target.files[0])
        }
    }
   
    const addReimbursement = async () => {
            const formData = new FormData()
            if (training_receipt !== '') formData.append("training_receipt", training_receipt)
            if (training_cost !== '') formData.append("training_cost", training_cost)
            await Api.jsonPatch(`/training/upload/invoice/employee/id/${data.id}/`, formData, false).then(result => {
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
                                            <h4>{data.training_title ? data.training_title : 'No title found'}</h4>
                                            <b>{data.description ? data.description : 'No description found'}</b><br></br>
                                            Duration: <Badge>{data.duration ? data.duration : 'N/A'}</Badge><br></br>
                                            Mode: <Badge>{data.mode_of_training_title ? data.mode_of_training_title : 'N/A'}</Badge>
                                            
                                            {data.training_cost && (
                                                <p>Cost: <Badge>{data.training_cost ? data.training_cost : 'N/A'}</Badge></p>
                                            )}
                                            
                                        </div>
                                        <div className="col-md-6">
                                            <div className="float-right">
                                            {data.training_receipt && (
                                                <button
                                                className="border-0 no-background"
                                                title="Receipt"
                                                >
                                                <a href={`${data.training_receipt}`} target="_blank" >Training Receipt <Eye color="green"/></a>
                                            </button>
                                            )}
                                                <br></br><br></br>
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
                        Training Receipt
                        </Label>
                        <Input
                            type="file"
                            id="training_receipt"
                            name="training_receipt"
                            accept="image/*"
                            onChange={training_receiptChange}
                            />
                    </Col>
                    <Col md="4" className="mb-1">
                        <Label className="form-label">
                        Training Cost
                        </Label>
                        <Input
                            type="input"
                            id="cost"
                            name="cost"
                            onChange={(e) => setTraining_cost(e.target.value)}
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

export default TrainingReimbursement