import React, { Fragment } from 'react'
import { Badge, Row, Col, Card, CardBody } from 'reactstrap'

const IssueDetail = ({ data }) => {

  return (
    <Fragment>
         {
            Object.values(data).length > 0 ? (
                        <Card>
                            <CardBody>
                                <Row className='mb-2'>
                                    <Col md={8}>
                                   <h3>{data.summary}</h3>
                                   <br></br>
                                       <b>Assignee: </b><Badge>{data.assignee ? (data.assignee.displayName && data.assignee.displayName) : 'N/A'} </Badge>
                                       <br></br>
                                       <b>Description: </b>{data.description ? data.description : <Badge color='light-danger'>N/A</Badge>}
                                    </Col>
                                    <Col md={4} >
                                       <b>Status: </b><Badge color={data.status.statusCategory.colorName === 'green' ? 'light-success' : 'light-warning'}>{data.status.name}</Badge>
                                       <br></br><br></br>
                                       <b>Priority: </b>{data.priority ? (
                                        <Row>
                                         {data.priority.iconUrl && (
                                            <Col md={2} className="text-center">
                                                <img src={data.priority.iconUrl} width="32" height={32} />
                                            </Col>
                                         )} 
                                        {data.priority.name && (
                                             <Col md={10}>
                                               <Badge>{data.priority.name}</Badge>
                                            </Col>
                                         )} 
                                       
                                    </Row>
                                       ) : <Badge>N/A</Badge>} 
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12} className='mb-1'>
                                        <h5 className='mb-1'>Time Log</h5>
                                        {Object.values(data.worklog.worklogs).length > 0 ? (
                                                    (data.worklog.worklogs).map((worklog, key) => (
                                                    <Row key={key}>
                                                    <Col md={2} className="text-center">
                                                        <img src={worklog.author.avatarUrls["32x32"]} width="32" height={32} />
                                                    </Col>
                                                    <Col md={10}>
                                                        <h6>{worklog.author.displayName}</h6>
                                                        <p>{worklog.timeSpent}</p>
                                                    </Col>
                                                </Row>
                                                )
                                            )
                                            ) : (
                                                <p>No Worklog found!</p>
                                            )}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12}>
                                        <h5>Comments</h5>
                                        <div className='commentBox'>
                                            {Object.values(data.comment.comments).length > 0 ? (
                                                    (data.comment.comments).map((comment, key) => (
                                                    <Row key={key}>
                                                    <Col md={2} className="text-center">
                                                        <img src={comment.author.avatarUrls["32x32"]} width="32" height={32} />
                                                    </Col>
                                                    <Col md={10}>
                                                        <h6>{comment.author.displayName}</h6>
                                                        <p><div dangerouslySetInnerHTML={{ __html: comment.body }} /></p>
                                                    </Col>
                                                </Row>
                                                )
                                            )
                                            ) : (
                                                <p>No comments found!</p>
                                            )}
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    
                ) : (
                    <p>Issue detail not Found!</p>
                )
        }
    </Fragment>
  )
}

export default IssueDetail