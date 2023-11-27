import React, { Fragment } from 'react'
import { Row, Col, Badge } from 'reactstrap'
const ViewPlan = ({ data }) => {
  return (
    <Fragment>
        <Row>
            <Col md={12}>
                <h2>{data.title ? data.title : 'No title found'}</h2>
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
                <b>Participants</b>: <Badge>{data.number_of_employee ? data.number_of_employee : 'N/A'}</Badge> 
            </Col>
            <Col md={4} className='my-2'>
                <b>Status</b>: <Badge>{data.status_title ? data.status_title : 'N/A'}</Badge> 
            </Col>
            <Col md={4} className='my-2'>
                <b>Cost</b>: <Badge>{data.cost ? data.cost : 'N/A'}</Badge>
            </Col>
        </Row>
        

    </Fragment>
  )
}

export default ViewPlan