import React, { Fragment, useEffect, useState } from 'react'
import { Card, CardBody, Row, Col, CardHeader, Badge, Table, Button, Spinner} from 'reactstrap'
import apiHelper from '../../Helpers/ApiHelper'
import Select from 'react-select'

const ViewKpiEvaluation = ({ data }) => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [details, setDetails] = useState([])
    
    const getData = async () => {
        const formData = new FormData()
        formData['kpi_id'] = data.kpi_id
        formData['employee_id'] = data.employee
        await Api.jsonPost(`/kpis/employees/kpi/data/`, formData).then(result => {
            if (result) {
                if (result.status === 200) {
                    setLoading(true)
                    const resultData = result.data[0]
                    setDetails(resultData)
                    setTimeout(() => {
                        setLoading(false)
                    }, 500)
                }
            } else {
                Api.Toast('error', 'No ratings data found!')
            }
        })
    }
    
    
    useEffect(() => {
        getData()
        return false
    }, [setDetails])
  return (
    <Fragment>
        
            
        {!loading ? (
            details && Object.values(details).length > 0 ? (
                <>
                    <Card className='dark-shadow'>
                        <CardHeader>
                        <Badge color="light-primary">Employee </Badge> <h3>{details.employee_name && details.employee_name}</h3>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col md={12}><h5>Kpi Details</h5>
                                <p>{details.title && details.title}</p>
                                </Col>
                            </Row>
                            {details.scale_groups_data && details.scale_groups_data.length > 0 ? (
                                details.scale_groups_data.map((item, index) => (
                                    <Fragment key={index}>
                                        
                                            <h3 className='text-center mb-2'>{`${item.scale_group_title} Evaluation`}</h3>
                                            {item.kpi_aspects && item.kpi_aspects.length > 0 ? (
                                                <>
                                                {item.kpi_aspects.map((aspect, aspectIndex) => (
                                                    <Fragment key={aspectIndex}>
                                                    <Card>
                                                        <CardBody>
                                                        <Badge color="light-danger">Aspect </Badge><b>{aspect.aspect_group_title}</b> <Badge>{aspect.result}%</Badge>                                       
                                                        <Table bordered striped responsive className='my-1'>
                                                            <thead className='table-dark text-center'>
                                                                <tr>
                                                                    <th>Parameter</th>
                                                                    <th>Rating</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className='text-center'>
                                                            {aspect.parameters && aspect.parameters.length > 0 ? (
                                                                <>
                                                                {aspect.parameters.map((parameter, paraIndex) => (
                                                                    <tr key={paraIndex}>
                                                                        <td>{parameter.parameter_group_title}</td>
                                                                        <td>
                                                                       {parameter.result ? <Badge>{parameter.result}%</Badge> : <Badge className='light-danger'>N/A</Badge>}
                                                                            {/* <StatusComponent data={item} item={parameter} index={{paraIndex, aspectIndex, index}}/> */}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                                
                                                                </>
                                                            ) : (
                                                                <p>No Parameter found</p>
                                                            )}
                                                            </tbody>
                                                        </Table>
                                                        
                                                        </CardBody>
                                                    </Card> 
                                                    </Fragment>
                                                ))}
                                                
                                                
                                                </>
                                            ) : (
                                                <p>No data found</p>
                                            )}
                                    </Fragment>
                                ))
                            ) : (
                                <Card>
                                    <CardBody>
                                        No data found
                                        </CardBody>
                                    </Card>
                            )}
                        </CardBody>
                    </Card>
                </>
            ) : (
                <Card>
                        <CardBody>
                            No data found
                            </CardBody>
                        </Card>
            )
                
                ) : (
                <div className='text-center'><Spinner type='grow'/></div> 
                )
        }
        
        
    </Fragment>
  )
}

export default ViewKpiEvaluation