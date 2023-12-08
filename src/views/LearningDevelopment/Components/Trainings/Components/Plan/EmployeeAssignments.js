import { Fragment } from 'react'
import { Card, CardBody, Badge } from 'reactstrap'
import { Eye, Download, Trash2 } from 'react-feather'
import apiHelper from '../../../../../Helpers/ApiHelper'
const EmployeeAssignments = ({ data }) => {
    const Api = apiHelper()
  return (
    <Fragment>
        {data && data.length > 0 ? (
                            data.map((assignment, key) => (
                                <Card key={key} className="dark-shadow">
                                    <CardBody>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h4>{assignment.training_assignment_title ? assignment.training_assignment_title : 'No title found'}</h4>
                                            <Badge>{assignment.updated_at ? Api.formatDate(assignment.updated_at) : 'N/A'}</Badge>
                                            <Badge className='m-1'>{assignment.obtained_marks ? assignment.obtained_marks : 'N/A'}</Badge>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="float-right">
                                                <button
                                                    className="border-0 no-background"
                                                    title="View"
                                                    >
                                                    <a href={`${process.env.REACT_APP_PUBLIC_URL}${assignment.submitted_assignment}`} target="_blank" ><Eye color="green"/></a>
                                                </button>
                                                <button
                                                    className="border-0 no-background"
                                                    title="Download"
                                                    >
                                                    <a href={`${process.env.REACT_APP_PUBLIC_URL}${assignment.submitted_assignment}`} target="_blank" rel="noopener noreferrer" download><Download color="orange"/></a>
                                                </button>
                                                
                                            </div>
                                        </div>
                                    </div>
                                    
                                    </CardBody>
                                </Card>
                            ))
                        ) : (
                            <div className='my-2'>
                                No Assignment Found!
                            </div>
                        )}
    </Fragment>
  )
}

export default EmployeeAssignments