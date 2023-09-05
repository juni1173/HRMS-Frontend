import React, { Fragment, useState } from 'react'
import { Row, Col, Table, Badge, Modal, ModalHeader, ModalBody, Spinner } from 'reactstrap'
import { Lock, Edit2 } from 'react-feather'
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
    // const unlockAction = () => {
    //     MySwal.fire({
    //         title: 'Are you sure?',
    //         text: "Do you want to unlock yearly KPI segmentations!",
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonText: 'Yes, unlock it!',
    //         customClass: {
    //         confirmButton: 'btn btn-primary',
    //         cancelButton: 'btn btn-danger ms-1'
    //         },
    //         buttonsStyling: false
    //     }).then(function (result) {
    //         if (result.value) {
    //             Api.get(`/kpis/set/yearly/segmentation/unlock/kpidata/`)
    //             .then((deleteResult) => {
    //                 if (deleteResult.status === 200) {
    //                     MySwal.fire({
    //                         icon: 'success',
    //                         title: 'Kpi Segmentation Unlocked!',
    //                         text: 'Kpi Segmentation is Unlocked.',
    //                         customClass: {
    //                         confirmButton: 'btn btn-success'
    //                         }
    //                     }).then(function (result) {
    //                         if (result.isConfirmed) {
    //                             CallBack()
    //                         }
    //                     }) 
    //                 } else {
    //                     MySwal.fire({
    //                         icon: 'error',
    //                         title: 'Kpi Segmentation can not be Unlocked!',
    //                         text: deleteResult.message ? deleteResult.message : 'Kpi Segmentation is not Unlocked.',
    //                         customClass: {
    //                         confirmButton: 'btn btn-danger'
    //                         }
    //                     })
    //                 }
                            
    //                 })
    //         } 
    //     })
    // }
  return (
    <Fragment>
    {!loading ? (
    (kpidata && Object.values(kpidata).length > 0) ? (
        <Row>
        <Col md={12}>
            <Table bordered striped responsive className='my-1'>
                    <thead className='table-dark text-center'>
                    <tr>
                        <th scope="col" className="text-nowrap">
                        Duration
                        </th>
                        <th scope="col" className="text-nowrap">
                        Brainstorming Period
                        </th>
                        <th scope="col" className="text-nowrap">
                        Brainstorming Period For Evaluator
                        </th>
                        <th scope="col" className="text-nowrap">
                        Evaluator Period
                        </th>
                        <th scope="col" className="text-nowrap">
                        Actions
                        </th>
                    </tr>
                    </thead>
                    
                    <tbody className='text-center'>
                        {Object.values(kpidata).map((item, key) => (
                                <tr key={key}>
                                <td>{item.duration ? item.duration : 'N/A'}</td>
                                <td>{item.brainstorming_period ? item.brainstorming_period : 'N/A'}</td>
                                <td>{item.brainstorming_period_for_evaluator ? item.brainstorming_period_for_evaluator : 'N/A'}</td>
                                <td>{item.evaluation_period ? item.evaluation_period : 'N/A'}</td>
                                <td>
                                    <div className="row">
                                    
                                    {item.is_lock ? (
                                        <Badge color='light-success'>Locked</Badge>
                                        
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
                                    
                                    {/* <div className="col">
                                        <button
                                        className="border-0"
                                        onClick={() => unlockAction()}
                                        >
                                        <Unlock color="red" />
                                        </button>
                                    </div> */}
                                    </div>
                                </td>
                                </tr>
                        )
                        )}
                    
                    </tbody>
                    
            </Table>
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