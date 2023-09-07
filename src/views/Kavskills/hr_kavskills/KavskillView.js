import React, { Fragment } from 'react'
import { Row, Col, Badge } from 'reactstrap'
import { File } from 'react-feather'
const KavskillView = ({data}) => {
  console.warn(data)
  
  return (
    <Fragment>
        <Row>
                    <Col md="12" className='mb-1'>
                        <Row>
                            <Col md="6" className="mb-1">
                            <Badge color='light-primary'  style={{fontSize: '15px'}}>
                            Name 
                            </Badge>
                            <h4 style={{padding:"0.3rem 0.5rem"}}>{data.full_name ? data.full_name : 'N/A'} </h4><a className='btn btn-outline-warning' target="_blank" href={`${data.kav_skills_resume}`}>
                                                <button
                                                    className="border-0 no-background"
                                                    title="Resume"
                                                    >
                                                    Resume <File color="orange"/>
                                                </button>
                                                </a>
                            </Col>
                            <Col md="6" className="mb-1">
                              <Badge color='light-warning'  style={{fontSize: '15px'}}>
                                Skill Title
                              </Badge>
                               <p style={{padding:"0.3rem 0.5rem"}}>{data.skill_type_title ? data.skill_type_title : 'N/A'}</p>
                            </Col>
                            <Col md="6" className='mb-1'>
                              <Badge color='light-success'  style={{fontSize: '15px'}}>
                                Email
                              </Badge>
                                <p style={{padding:"0.3rem 0.5rem"}}>{data.email ? data.email : 'N/A'}</p>
                            </Col>
                            <Col md="6" className='mb-1'>
                              <Badge color='light-info'  style={{fontSize: '15px'}}>
                                Contact
                              </Badge>
                                <p style={{padding:"0.3rem 0.5rem"}}>{data.contact_number ? data.contact_number : 'N/A'}</p>
                            </Col>
                            <Col md="6" className="mb-1">
                              <Badge color='light-danger'  style={{fontSize: '15px'}}>
                                University
                              </Badge>
                                <p style={{padding:"0.3rem 0.5rem"}}>{data.university_name ? data.university_name : 'N/A'}</p>
                            </Col>
                            <Col md="6" className="mb-1">
                              <Badge color='light-primary'  style={{fontSize: '15px'}}>
                                Major
                              </Badge>
                                <p style={{padding:"0.3rem 0.5rem"}}>{data.major ? data.major : 'N/A'}</p>
                            </Col>
                            <Col md="6" className='mb-1'>
                              <Badge color='light-warning'  style={{fontSize: '15px'}}>
                                Educational Qualification
                              </Badge>
                                <p style={{padding:"0.3rem 0.5rem"}}>{data.educational_qualifications ? data.educational_qualifications : 'N/A'}</p>
                            </Col>
                            {data.financial_aid ? (
                               <Col md="6" className='mb-1'>
                               <Badge color='light-success'  style={{fontSize: '15px'}}>
                               Financial Aid
                               </Badge>
                                 <p style={{padding:"0.3rem 0.5rem"}}>{data.financial_aid_reason ? data.financial_aid_reason : 'N/A'}</p>
                             </Col>
                            ) : (
                              <Col md="6" className='mb-1'>
                              <Badge color='light-info'  style={{fontSize: '15px'}}>
                                Financial Aid
                              </Badge>
                                <p style={{padding:"0.3rem 0.5rem"}}>Not Applied</p>
                            </Col>
                            )}
                            <Col md="6" className='mb-1'>
                               <Badge color='light-danger'  style={{fontSize: '15px'}}>
                               Objective
                               </Badge>
                                 <p style={{padding:"0.3rem 0.5rem"}}>{data.objectives ? data.objectives : 'N/A'}</p>
                             </Col>
                             <Col md="6" className='mb-1'>
                               <Badge color='light-primary'  style={{fontSize: '15px'}}>
                               Cover Letter
                               </Badge>
                                 <p style={{padding:"0.3rem 0.5rem"}}>{data.cover_letter ? data.cover_letter : 'N/A'}</p>
                             </Col>
                            <Col md="12" className='mb-1'>
                               <Badge color='light-warning'  style={{fontSize: '15px'}}>
                               Joining Reason
                               </Badge>
                                 <p style={{padding:"0.3rem 0.5rem"}}>{data.joining_reason ? data.joining_reason : 'N/A'}</p>
                             </Col>
                             <Col md="12" className='mb-1'>
                               <Badge color='light-success'  style={{fontSize: '15px'}}>
                               Additional Information
                               </Badge>
                                 <p style={{padding:"0.3rem 0.5rem"}}>{data.additional_information ? data.additional_information : 'N/A'}</p>
                             </Col>
                        </Row>
                    </Col>
                  
                   
                </Row> 
    </Fragment>
    
  )
}

export default KavskillView