import React, { Fragment } from 'react'
import { Row, Col, Badge } from 'reactstrap'
const ViewEmailTemplate = ({data}) => {
  console.warn(data)
  return (
    <Fragment>
        <Row>
                    <Col md="12" className='mb-1'>
                        <Row>
                            <Col md="6" className="mb-1">
                            <Badge color='light-primary'  style={{fontSize: '15px'}}>
                            Title
                            </Badge>
                            <h4 style={{padding:"0.3rem 0.5rem"}}>{data.title ? data.title : 'N/A'} </h4>
                            </Col>
                            <Col md="6" className="mb-1">
                              <Badge color='light-warning'  style={{fontSize: '15px'}}>
                                Subject
                              </Badge>
                               <p style={{padding:"0.3rem 0.5rem"}}>{data.subject_line ? data.subject_line : 'N/A'}</p>
                            </Col>
                            <Col md="12" className='mb-1'>
                              <Badge color='light-success'  style={{fontSize: '15px'}}>
                                Body
                              </Badge>
                                <p style={{padding:"0.3rem 0.5rem"}}>{data.body ? data.body : 'N/A'}</p>
                            </Col>
                            <Col md="12" className="mb-1">
                              <Badge color='light-info'  style={{fontSize: '15px'}}>
                                Footer
                              </Badge>
                                <p style={{padding:"0.3rem 0.5rem"}}>{data.footer ? data.footer : 'N/A'}</p>
                            </Col>
                        </Row>
                    </Col>
                  
                   
                </Row> 
    </Fragment>
    
  )
}

export default ViewEmailTemplate