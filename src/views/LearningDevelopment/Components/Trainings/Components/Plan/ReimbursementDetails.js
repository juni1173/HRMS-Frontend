import React, { Fragment } from 'react'
import { Card, CardBody, Badge } from 'reactstrap'
import { Eye } from 'react-feather'
const ReimbursementDetails = ({ data }) => {
  return (
    <Fragment>
        <h3>Reimburement Details</h3>
         {(data && Object.values(data).length > 0 && data.reimbursement_status) ? (
                                <Card className='dark-shadow'>
                                    <CardBody>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h4>{data.employee_name ? data.employee_name : 'No name found'}</h4>
                                            <b><Badge>Evaluator</Badge> {data.training_evaluator_name ? data.training_evaluator_name : 'No description found'}</b><br></br><br></br>
                                            Training: <Badge>{data.training_status_title ? data.training_status_title : 'N/A'}</Badge><br></br><br></br>
                                            <Badge>From</Badge> {data.start_date ? data.start_date : 'N/A'} - <Badge>To</Badge> {data.end_date ? data.end_date : 'N/A'}
                                            
                                            {data.training_cost && (
                                                <p className='mt-1'>Cost: <Badge>{data.training_cost ? data.training_cost : 'N/A'}</Badge></p>
                                            )}
                                            
                                        </div>
                                        <div className="col-md-6">
                                            <div className="float-right">
                                            {data.training_receipt && (
                                                <button
                                                className="border-0 no-background"
                                                title="Receipt"
                                                >
                                                <a href={`${data.training_receipt}`} target="_blank" >Training Receipt <Eye color="green"/></a>
                                            </button>
                                            )}
                                                <br></br><br></br>
                                                <Badge>{data.reimbursement_status_title}</Badge>
                                                
                                            </div>
                                        </div>
                                    </div>
                                    
                                    </CardBody>
                                </Card>
                        ) : (
                            <div className='my-2'>
                                No Reimbursement Request Found!
                            </div>
                        )}
    </Fragment>
  )
}

export default ReimbursementDetails