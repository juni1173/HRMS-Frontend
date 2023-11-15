import React, { Fragment } from 'react'
import { Card, CardBody, CardTitle, CardSubtitle, Badge, Row, Col } from 'reactstrap'

const CertificateList = ({ data }) => {

  return (
    <Fragment>
      {(data && Object.values(data).length > 0) ? (
            <Row>
                <Col md={12}>
                    {Object.values(data).map((item, index) => (
                        <Card key={index}>
                        <CardBody>
                            <div className="row">
                                
                                <div className="col-md-4">
                                <CardTitle tag='h1'>{item.employee_name ? item.employee_name : <Badge color='light-danger'>N/A</Badge>}</CardTitle>
                                <CardSubtitle>
                                <h4><Badge color='light-success'>{item.position_title ? item.position_title : <Badge color='light-danger'>N/A</Badge>}</Badge></h4>
                                    <h4><Badge color='light-warning'>{`${item.certification_status_title ? item.certification_status_title : <Badge color='light-danger'>N/A</Badge>}`}</Badge></h4></CardSubtitle>
                                </div>
                                <div className="col-md-4">
                                    <Badge color='light-success'>
                                            Duration
                                    </Badge><br></br>
                                    <span className="jd_position" style={{color: "black", fontWeight:"20px", padding:"0.3rem 0.5rem"}}>{item.duration && item.duration}</span>
                                    
                                    <br></br><Badge color='light-danger'>
                                        Mode
                                    </Badge><br></br>
                                    <span style={{color: "black", fontWeight:"10px", padding:"0.3rem 0.5rem"}}>{item.mode_of_course_title && item.mode_of_course_title}</span>
                                </div>
                                <div className="col-md-4">
                                <div className="mb-1">
                                    {/* <StatusComponent item={item} key={index}/> */}
                                    </div>
                                <Badge color='light-success'>
                                Relevance
                                    </Badge><br></br>
                                    <h4><Badge color='light-danger'>{item.relevance_title ? item.relevance_title : <Badge color='light-danger'>N/A</Badge>}</Badge></h4>
                                    
                                </div>
                                
                            </div>
                                
                        </CardBody>
                        </Card> 
                    ))}
                </Col>   
            </Row>
        ) : (
            <div className="text-center">No Certifications Data Found!</div>
        )}
    </Fragment>
  )
}

export default CertificateList