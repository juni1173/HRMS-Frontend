import React, { Fragment } from 'react'
import { Row, Col, Badge, Button } from 'reactstrap'
import Assignments from '../../../../LearningDevelopment/Components/Trainings/Components/Plan/Assignments'
import apiHelper from '../../../../Helpers/ApiHelper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const TrainingDetails = ({ data, CallBack }) => {
    console.warn(data)
    const Api = apiHelper()
    const MySwal = withReactContent(Swal)
    const changeTraining = (id, training_status) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "Do you want to change the Training status!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Change it!',
            customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-danger ms-1'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.value) {
                Api.jsonPatch(`/training/employee/start/training/${id}/`, {training_status})
                .then((deleteResult) => {
                    if (deleteResult.status === 200) {
                        MySwal.fire({
                            icon: 'success',
                            title: 'Training Status Changed!',
                            text: 'Training is Updated.',
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
                            title: deleteResult.message ? deleteResult.message : 'Training can not be Changed!',
                            text: 'Training is not Changed.',
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
            <Col md={6}>
                <h2>{data.training_title ? data.training_title : 'No title found'}</h2>
            </Col>
            <Col md={6}>
                {data.training_status === 1 && (
                    <div className='float-right'>
                        <Button className='btn btn-success' onClick={() => changeTraining(data.training, 2)}>Start Training</Button>
                    </div>
                )}
                {data.training_status === 2 && (
                    <div className='float-right'>
                        <Button className='btn btn-success' onClick={() => changeTraining(data.training, 3)}>Complete Training</Button>
                    </div>
                )}
            </Col>
            <Col md={12}>
                <p>{data.description ? data.description : 'No description found'}</p>
            </Col>
            <hr></hr>
            <Col md={12}>
                <h3>Details</h3>
            </Col>
            <Col md={4} className='my-2'>
                <b>Duration</b>: <Badge>{data.duration ? data.duration : 'N/A'}</Badge> 
            </Col>
            <Col md={4} className='my-2'>
                <b>Training Mode</b>: <Badge>{data.mode_of_training_title ? data.mode_of_training_title : 'N/A'}</Badge> 
            </Col>
            <Col md={4} className='my-2'>
                <b>Status</b>: <Badge>{data.training_status_title ? data.training_status_title : 'N/A'}</Badge> 
            </Col>
            <Col md={4} className='my-2'>
                <b>Cost</b>: <Badge>{data.training_cost ? data.training_cost : (data.cost ? data.cost : 'N/A')}</Badge>
            </Col>
            <Col md={4} className='my-2'>
                <b>Evaluator</b>: <Badge>{data.training_evaluator_name ? data.training_evaluator_name : 'N/A'}</Badge>
            </Col>
            <Col md={6} className='my-2'>
                <b>From</b>: <Badge>{data.start_date ? data.start_date : 'N/A'}</Badge> - <b>To</b>: <Badge>{data.end_date ? data.end_date : 'N/A'}</Badge>
            </Col>
            
        </Row>
        <hr></hr>
        <Row>
            <Assignments data={data.training_assignments} type={'employee'}/>
        </Row>
        

    </Fragment>
  )
}

export default TrainingDetails