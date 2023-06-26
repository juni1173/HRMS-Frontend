import React from 'react'
import apiHelper from '../../../Helpers/ApiHelper'
import { Card, CardTitle, CardBody, Badge } from 'reactstrap'
const NodeComponent = ({ node }) => {
    const Api = apiHelper()
  return (
    <Card>
                    <CardBody>
                        <div className="row">
                            <div className="col-md-3">
                            <CardTitle tag='h1'> </CardTitle>
                                <Badge color='light-warning'>
                                {node.profile_image ?  <img src={`${Api.BackendBaseLink}${node.profile_image}`} style={{height: '50px', width: "50px"}} alt="logo" /> : <img src={user_blank} style={{height: '50px', width: "50px"}} alt="logo" />}   
                                </Badge> 
                            </div>
                            <div className="col-md-3">
                                <Badge color='light-info p-0'>
                                    Name
                                </Badge>
                                <br></br>
                                <strong>{node.name ? node.name : <Badge color="light-danger">N/A</Badge>}</strong>
                            </div>
                            <div className="col-md-3">
                                <Badge color='light-success p-0'>
                                    Staff Classification
                                </Badge><br></br>
                                <strong>{node.staff_classification_title ? node.staff_classification_title : <Badge color="light-danger">N/A</Badge>}</strong>
                                
                            </div>
                            <div className="col-lg-3 float-right">
                                
                                <div className="float-right">
                              
                                    
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card> 
  )
}

export default NodeComponent