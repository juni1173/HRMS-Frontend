import React, { Fragment } from 'react'
import { Row, Col } from 'reactstrap'
import Plans from './Components/Plan/index'
const index = () => {
  return (
    <Fragment>
        <Row>
            <Col md={12}>
                <Plans />
            </Col>
        </Row>
    </Fragment>
  )
}

export default index