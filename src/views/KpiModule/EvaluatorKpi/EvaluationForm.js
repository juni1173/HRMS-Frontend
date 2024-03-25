import React, { Fragment, useEffect, useState } from 'react'
import { Card, CardBody, Row, Col, CardHeader, Badge, Table, Button, Spinner, Label} from 'reactstrap'
import apiHelper from '../../Helpers/ApiHelper'
import Select from 'react-select'

const EvaluationForm = ({ data, CallBack }) => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [ratingsData, setRatingsData] = useState([])
    // const [updatedData, setUpdateData] = useState(data.evaluationData)
    const [kpiAspectsData, setKpiAspects] = useState([])
    const [evaluation_status, setEvaluation_status] = useState(data.evaluationData.evaluation_status ? data.evaluationData.evaluation_status : '')
    const Evaluation_Status = [
      {value: 1, label: 'completed'},
      {value: 2, label: 'in-complete'},
      {value: 3, label: 'carry forward to next quarter'}
    ]
    const getRatingsData = async () => {
        
        await Api.get(`/configuration/scalerating/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    setLoading(true)
                    const resultData = result.data
                    for (let i = 0; i < resultData.length; i++) {
                        ratingsData.push({value: resultData[i].id, label: resultData[i].title})
                    }
                    setTimeout(() => {
                        setLoading(false)
                    }, 500)
                }
            } else {
                Api.Toast('error', 'No ratings data found!')
            }
        })
    }
    const getKpiAspects = async () => {
        
        await Api.get(`/kpis/get/scale/group/data/${data.evaluationData.id}/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    setLoading(true)
                    const resultData = result.data
                    console.warn(resultData)
                    const updated = resultData.map((scale, scaleIndex) => {
                        if (scaleIndex !== 0) {
                            return scale // If index is not 0, return the original scale without modification
                        }
                        return {
                            ...scale,
                            kpi_aspects: scale.kpi_aspects.map((aspect) => {
                                return {
                                    ...aspect,
                                    parameters: aspect.parameters.map((parameter) => {
                                        if (
                                           parameter.scale_rating !== null
                                        ) {
                                            return {
                                                ...parameter,
                                                // scale_rating: newValue,
                                                has_checked: true
                                            }
                                        }
                                        return parameter
                                    })
                                }
                            })
                        }
                    })
                        setKpiAspects(updated)
                        console.warn(resultData)
                    setTimeout(() => {
                        setLoading(false)
                    }, 500)
                }
            } else {
                Api.Toast('error', 'No Aspect data found!')
            }
        })
    }
    const updateRating = (value, i) => {
        // debugger
        if (i) {
            let newValue = null 
            if (value !== null) {
            newValue = value.value
            }
            const updated = kpiAspectsData.map((scale, scaleIndex) => {
                if (scaleIndex !== 0) {
                    return scale // If index is not 0, return the original scale without modification
                }
                return {
                    ...scale,
                    kpi_aspects: scale.kpi_aspects.map((aspect, aspectIndex) => {
                        return {
                            ...aspect,
                            parameters: aspect.parameters.map((parameter, paraIndex) => {
                                if (
                                    aspectIndex === i.aspectIndex &&
                                    paraIndex === i.paraIndex
                                ) {
                                    if (value !== null) {
                                    return {
                                        ...parameter,
                                        scale_rating: newValue,
                                        has_checked: true
                                    }
                                } else {
                                    return {
                                        ...parameter,
                                        scale_rating: newValue,
                                        has_checked: false
                                    }
                                }
                                }
                                return parameter
                            })
                        }
                    })
                }
            })
            setKpiAspects(updated)
            console.warn(updated)
            return updated
        }
    }
    
   const saveEvaluation = async () => {
        if (evaluation_status !== '') {
            kpiAspectsData[0]['evaluation_status'] = evaluation_status
        }
        // const formData = new FormData(updatedData)
        await Api.jsonPost(`/evaluation/kpi/${data.evaluationData.id}/`, kpiAspectsData[0]).then(result => {
            if (result) {
                
                if (result.status === 200) {
                    CallBack()
                    Api.Toast('success', result.message)
                } else {
                    Api.Toast('error', result.message)
                }
            }
    })
    
   }
   const submitEvaluation = async () => {
    
        // const formData = new FormData(updatedData)
        const payloadData = kpiAspectsData[0]
        payloadData['action'] = "submit"
        if (evaluation_status !== '') {
            payloadData['evaluation_status'] = evaluation_status
        }
        await Api.jsonPost(`/evaluation/kpi/${data.evaluationData.id}/`, payloadData).then(result => {
            if (result) {
                
                if (result.status === 200) {
                    CallBack()
                    Api.Toast('success', result.message)
                } else {
                    Api.Toast('error', result.message)
                }
            }
    })

    }
    
    useEffect(() => {
        getRatingsData()
        getKpiAspects()
        return false
    }, [setRatingsData, setKpiAspects])
  return (
    <Fragment>
        <Card className='dark-shadow'>
            <CardHeader>
               <Badge color="light-primary">Employee </Badge> <h3>{data.employee}</h3>
            </CardHeader>
            <CardBody>
                    <Row>
                        <Col md={12}><h5>Kpi Details</h5>
                        <p>{data.kpi_details}</p>
                        </Col>
                    </Row>
            
        {!loading ? (
            Object.values(kpiAspectsData) && Object.values(kpiAspectsData).length > 0 ? (
                Object.values(kpiAspectsData).map((item, index) => (
                    <Fragment key={index}>
                        
                            <h3 className='text-center mb-2'>{`${item.scale_group_title} Evaluation`}</h3>
                            {item.kpi_aspects && item.kpi_aspects.length > 0 ? (
                                <>
                                {item.kpi_aspects.map((aspect, aspectIndex) => (
                                    <Fragment key={aspectIndex}>
                                    <Card>
                                        <CardBody>
                                            {item.have_aspects === false ?  null : <>
                                        <Badge color="light-danger">Aspect </Badge><b>{aspect.aspect_group_title}</b> </> }                                      
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
                                                   <td>
  {parameter.parameter_group_title}{' '}
  {parameter.required_parameter ? <Badge color='light-danger'>*</Badge> : null}</td>
                                                        <td>
                                                        <div className="row min-width-300">
                                                            <div className="col-lg-12">
                                                            <Select
                                                                isClearable={true}
                                                                options={ratingsData}
                                                                className='react-select mb-1'
                                                                classNamePrefix='select'
                                                                menuPortalTarget={document.body} 
                                                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                                defaultValue={ratingsData.find((pre) => pre.value === parameter.scale_rating) ? ratingsData.find((pre) => pre.value === parameter.scale_rating) : ''}
                                                                onChange={(statusData) => updateRating(statusData, {paraIndex, aspectIndex, index})}
                                                                />
                                                            </div>
                                                        </div>
                                                            {/* <StatusComponent data={item} item={parameter} index={{paraIndex, aspectIndex, index}}/> */}
                                                        </td>
                                                    </tr>
                                                ))}
                                                
                                                </>
                                            ) : (
                                                <p className='text-white'>No Parameter found</p>
                                            )}
                                            </tbody>
                                        </Table>
                                        
                                        </CardBody>
                                    </Card> 
                                    </Fragment>
                                ))}
                                <Row>
                                    <Col md='8'>
                                        <b>KPI Status</b>
                                     <Select
                                        isClearable={false}
                                        options={Evaluation_Status}
                                        className='react-select'
                                        classNamePrefix='Status'
                                        defaultValue={Evaluation_Status.find((pre) => pre.value === data.evaluationData.evaluation_status) ? Evaluation_Status.find((pre) => pre.value === data.evaluationData.evaluation_status) : ''}
                                        onChange={(e) => setEvaluation_status(e.value)}
                                        />
                                    </Col>
                                    <Col md='2'>
                                        <Button className='btn btn-warning float-right m-1' onClick={saveEvaluation}>
                                                Save
                                        </Button>
                                    </Col>
                                    <Col md='2'>
                                        <Button className='btn btn-success float-right m-1' onClick={submitEvaluation} disabled={evaluation_status === '' && true }>
                                            Submit
                                        </Button>
                                    </Col>
                                </Row>
                                
                                </>
                            ) : (
                                <p>No kpi aspects found</p>
                            )}
                    </Fragment>
                ))
            ) : (
                <Card>
                    <CardBody>
                    <p>No Evaluation Data Found</p>
                        </CardBody>
                    </Card>
            )
        ) : (
           <div className='text-center'><Spinner color='white' type='grow'/></div> 
        )
        
        }
        
        </CardBody>
        </Card>
    </Fragment>
  )
}

export default EvaluationForm