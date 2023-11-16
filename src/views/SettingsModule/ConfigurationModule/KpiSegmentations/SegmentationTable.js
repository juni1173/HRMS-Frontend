import React, { Fragment, useState } from 'react'
import { Row, Col, Table, Badge, Modal, ModalHeader, ModalBody, Spinner, Card, CardBody } from 'reactstrap'
import { Lock, Edit2, UserCheck, UserMinus, UserX } from 'react-feather'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import apiHelper from '../../../Helpers/ApiHelper'
import UpdateSegmentation from './UpdateSegmentation'
const SegmentationTable = ({ kpidata, CallBack }) => {
    const [loading, setLoading] = useState(false)
    const Api = apiHelper()
    const MySwal = withReactContent(Swal)
    const [UpdateModal, setUpdateModal] = useState(false)
    const lockAction = () => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "Do you want to lock yearly KPI segmentations!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, lock it!',
            customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-danger ms-1'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.value) {
                Api.get(`/kpis/set/yearly/segmentation/lock/data/`)
                .then((deleteResult) => {
                    if (deleteResult.status === 200) {
                        MySwal.fire({
                            icon: 'success',
                            title: 'Kpi Segmentation Locked!',
                            text: 'Kpi Segmentation is Locked.',
                            customClass: {
                            confirmButton: 'btn btn-success'
                            }
                        }).then(function (result) {
                            if (result.isConfirmed) {
                                setLoading(true)
                                 CallBack()
                                setTimeout(() => {
                                    setLoading(false)
                                }, 500)
                            }
                        }) 
                    } else {
                        MySwal.fire({
                            icon: 'error',
                            title: 'Kpi Segmentation can not be locked!',
                            text: deleteResult.message ? deleteResult.message : 'Kpi Segmentation is not locked.',
                            customClass: {
                            confirmButton: 'btn btn-danger'
                            }
                        })
                    }
                            
                    })
            } 
        })
    }
    const completeAction = (id) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "Do you want to complete this batch of KPI!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, mark as complete!',
            customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-danger ms-1'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.value) {
                Api.jsonPatch(`/kpis/set/yearly/segmentation/complete/batch/${id}/`, {})
                .then((deleteResult) => {
                    if (deleteResult.status === 200) {
                        MySwal.fire({
                            icon: 'success',
                            title: 'Kpi Batch is marked as completed!',
                            text: 'Kpi Batch is completed.',
                            customClass: {
                            confirmButton: 'btn btn-success'
                            }
                        }).then(function (result) {
                            if (result.isConfirmed) {
                                setLoading(true)
                                 CallBack()
                                setTimeout(() => {
                                    setLoading(false)
                                }, 500)
                            }
                        }) 
                    } else {
                        MySwal.fire({
                            icon: 'error',
                            title: 'Kpi batch can not be completed!',
                            text: deleteResult.message ? deleteResult.message : 'Kpi batch is not completed.',
                            customClass: {
                            confirmButton: 'btn btn-danger'
                            }
                        })
                    }
                            
                    })
            } 
        })
    }
    const startAction = (id) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "Do you want to start this batch of KPI!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, start the batch!',
            customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-danger ms-1'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.value) {
                Api.jsonPatch(`/kpis/set/yearly/segmentation/start/batch/${id}/`, {})
                .then((deleteResult) => {
                    if (deleteResult.status === 200) {
                        MySwal.fire({
                            icon: 'success',
                            title: 'Kpi Batch started!',
                            text: 'Kpi Batch is started.',
                            customClass: {
                            confirmButton: 'btn btn-success'
                            }
                        }).then(function (result) {
                            if (result.isConfirmed) {
                                setLoading(true)
                                 CallBack()
                                setTimeout(() => {
                                    setLoading(false)
                                }, 500)
                            }
                        }) 
                    } else {
                        MySwal.fire({
                            icon: 'error',
                            title: 'Kpi batch can not be started!',
                            text: deleteResult.message ? deleteResult.message : 'Kpi batch is not started.',
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
    {!loading ? (
    (kpidata && Object.values(kpidata).length > 0) ? (
        <Row>
        <Col md={12}>
        {Object.values(kpidata).map((item, key) => (
            <>
            <Card key={key}>
                <CardBody>
                    <Row>
                        <Col md={10}>
                            <Row>
                            <Col md={6}><b>Duration</b>: {item.duration ? item.duration : 'N/A'}</Col>
                        <Col md={6}><b>Brainstorming Period</b>: {item.brainstorming_period ? item.brainstorming_period : 'N/A'}</Col>
                        <Col md={6} className='mt-2'><b>Brainstorming Period For Evaluator</b>: {item.brainstorming_period_for_evaluator ? item.brainstorming_period_for_evaluator : 'N/A'}</Col>
                        <Col md={6} className='mt-2'><b>Evaluator Period</b>: {item.evaluation_period ? item.evaluation_period : 'N/A'}</Col>
                            </Row>
                        </Col>
                        <Col md={2}>
                        {item.is_lock ? (
                                        <>
                                            <Badge color='light-success'>Locked</Badge>
                                            at
                                            {item.locked_date && <p className='nowrap'>{item.locked_date}</p>}
                                            
                                        </>
                                    ) : (
                                        <>
                                            <div className="col-lg-6">
                                                <button
                                                className="border-0"
                                                onClick={() => setUpdateModal(!UpdateModal)}
                                                >
                                                <Edit2 color="orange" />
                                                </button>
                                            </div>
                                            <div className="col-lg-6">
                                                <button
                                                className="border-0"
                                                onClick={() => lockAction()}
                                                >
                                                <Lock color="red" />
                                                </button>
                                            </div>
                                        </>
                                    )}
                        </Col>

                    </Row>
                    
                </CardBody>
            </Card>
            <h2>Batches Info</h2>
                {item.ep_batches.length > 0 && (
                    <Row>
                   {item.ep_batches.reverse().map((batch, batchKey) => (
                        
                            <Col md={12}>
                            <Card key={batchKey}>
                                <CardBody>
                                    <Row>
                                        <Col md={6}>
                                            <b>Batch#</b>: {batch.batch_no ? batch.batch_no : 'N/A'}
                                        </Col>
                                        <Col md={4}>
                                            <b>Status</b>: {batch.batch_status ? batch.batch_status : 'N/A'}
                                            
                                        </Col>
                                            {(batch.batch_status && batch.batch_status === 'not-used') && (
                                                <Col md={2}>
                                                    <UserX color='red' size={40} className='float-right'/>
                                                 </Col>
                                            )}
                                             {(batch.batch_status && batch.batch_status === 'completed') && (
                                                <Col md={2}>
                                                    <UserCheck color='green' size={40} className='float-right'/>
                                                 </Col>
                                            )}
                                            {(batch.batch_status && batch.batch_status === 'in-progress') && (
                                                <Col md={2}>
                                                <button
                                                 className="btn btn-success btn-sm"
                                                 onClick={() => completeAction(batch.id)}
                                                 >
                                                 Mark As Completed
                                                 </button>
                                                 </Col>
                                            )}
                                            {(batch.batch_status && batch.batch_status === 'upcoming') && (
                                                <Col md={2}>
                                                <button
                                                 className="btn btn-primary btn-sm"
                                                 onClick={() => startAction(batch.id)}
                                                 >
                                                 Start Batch
                                                 </button>
                                                 </Col>
                                            )}
                                            
                                        
                                        <Col md={6}>
                                            <b>Start Date</b>: {batch.start_date ? batch.start_date : 'N/A'}
                                        </Col>
                                        <Col md={6}>
                                            <b>End Date</b>: {batch.end_date ? batch.end_date : 'N/A'}
                                        </Col>
                                    </Row>
                                    
                                </CardBody>
                            </Card>
                            </Col>
                        
                    ))}
                    </Row>
                )}
                </>
        ))}
            
        </Col>
    </Row>
        ) : (
            <div className="text-center">No Segmentation Data Found!</div>
        )
    ) : (
        <div className='text-center'><Spinner /></div>
    ) 
    }
    <div className='vertically-centered-modal'>
        <Modal isOpen={UpdateModal} toggle={() => setUpdateModal(!UpdateModal)} className='modal-dialog-Update'>
          <ModalHeader toggle={() => setUpdateModal(!UpdateModal)}>Update Segmentation</ModalHeader>
          <ModalBody>
            <UpdateSegmentation data={kpidata[0]} CallBack={CallBack} />
          </ModalBody>
        </Modal>
      </div>
    </Fragment>
  )
}

export default SegmentationTable