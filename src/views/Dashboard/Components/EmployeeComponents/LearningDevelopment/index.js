import React, { Fragment } from 'react'
import { Row, Col, Table, Badge, Button } from 'reactstrap'
import { Check } from 'react-feather'
const index = ({ sessions }) => {
  return (
    <Fragment>
       {(sessions && Object.values(sessions).length > 0) ? (
                <Row>
                <Col md={12}>
                    <Table bordered striped responsive className='my-1'>
                            <thead className='table-dark text-center'>
                            <tr>
                                <th scope="col" className="text-nowrap">
                                Course Title
                                </th>
                                <th scope="col" className="text-nowrap">
                                Type
                                </th>
                                <th scope="col" className="text-nowrap">
                                Duration
                                </th>
                                <th scope="col" className="text-nowrap">
                                Start / End Date
                                </th>
                                <th scope="col" className="text-nowrap">
                                Lectures
                                </th>
                                {/* <th>
                                    Details
                                </th> */}
                            </tr>
                            </thead>
                            
                            <tbody className='text-center'>
                                {Object.values(sessions).map((item, key) => (
                                        <tr key={key}>
                                        <td className='nowrap'>{item.course_title ? item.course_title : <Badge color='light-danger'>N/A</Badge>}</td>
                                        <td>{item.course_session_type_title ? item.course_session_type_title : <Badge color='light-danger'>N/A</Badge>}</td>
                                        <td>{item.duration ? item.duration : <Badge color='light-danger'>N/A</Badge>}</td>
                                        <td>{item.start_date ? `${item.start_date}` : <Badge color='light-danger'>N/A</Badge>} / {item.end_date ? `${item.end_date}` : <Badge color='light-danger'>N/A</Badge>}</td>
                                        <td>{item.total_lectures ? `${item.total_lectures}` : <Badge color='light-danger'>N/A</Badge>}</td>
                                        {/* <td><Button className='btn btn-primary' onClick={ () => toggleCanvasEnd(item)}>
                                            Details</Button></td> */}
                                        </tr>
                                )
                                )}
                            
                            </tbody>
                            
                    </Table>
                </Col>
                </Row>
            ) : (
                <p>Sessions Data not found!</p>
            )
            
            }
    </Fragment>
  )
}

export default index