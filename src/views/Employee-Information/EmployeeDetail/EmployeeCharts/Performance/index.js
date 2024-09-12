import React, { Fragment } from 'react'
import { Row, Col } from 'reactstrap'
import BatchBasedKpiData from './BatchBasedKpiData'
import ProjectBasedKpiData from './ProjectBasedKpiData'

const index = ({ id }) => {
  return (
    <Fragment>
        <Row className='w-100'>
            <h4>Performance</h4>
            <Col md='12' className='border-bottom'>
                <BatchBasedKpiData id={id}/>
            </Col>
            <Col md='12' className='mt-2'>
                <ProjectBasedKpiData id={id}/>
            </Col>
        </Row>
        
    </Fragment>
  )
}

export default index