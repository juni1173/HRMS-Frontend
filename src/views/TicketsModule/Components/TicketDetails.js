import React, { Fragment, useEffect, useState } from 'react'
import { CheckCircle } from 'react-feather'
import { Badge, Row, Col, Spinner, Card, CardBody } from 'reactstrap'
import apiHelper from '../../Helpers/ApiHelper'

const TicketDetails = ({data}) => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [log, setLog] = useState([])
    const getLog = async () => {
        await Api.get(`/ticket/descision/resaon/data/${data.id}/`)
        .then(result => {
            if (result) {
                setLoading(true)
                if (result.status === 200) {
                    setLog(result.data)
                } else {
                    Api.Toast('error', result.message)
                }
                setTimeout(() => {
                    setLoading(false)
                }, 500)
            } else {
                Api.Toast('error', 'Server not responding!')
            }
        })
    }
    useEffect(() => {
        getLog()
    }, [setLog])
  return (
    <Fragment>
        <h3>{data.category_title ? data.category_title : 'Category not found!'} Ticket by {data.employee_name ? data.employee_name.toUpperCase() : 'employee name not found!'}</h3>
        <hr></hr>
        <Row>
            <Col md={data.category === 1 ? '6' : '12'} className='mb-2'>
                {(data.ticket_status === 4 || data.ticket_status === 7 || data.ticket_status === 10 || data.ticket_status === 13) ? (
                    <>
                    <span>Status- </span> <Badge color='light-success'><CheckCircle color='green'/> {data.ticket_status_title ? data.ticket_status_title : 'N/A'}</Badge>
                   </>
                ) : (
                    <>
                    <span>Status- </span> <Badge color='light-warning'>{data.ticket_status_title ? data.ticket_status_title : 'N/A'}</Badge>
                   </>
                )}
                
            </Col>
            {data.category === 1 && (
                <Col md={6} className='mb-2'>
                    Team Lead- <Badge color='light-success'>{data.team_lead_name ? data.team_lead_name.toUpperCase() : 'N/A'}</Badge>
                </Col>
            )}
            {data.category !== 3 && (
                <Col md={12} className='mb-2'>
                    Assign to- <Badge>{data.assign_to_name ? data.assign_to_name.toUpperCase() : 'N/A'}</Badge>
                </Col>
            )}
            {data.transfer_to && (
                <Col md={12} className='mb-2'>
                Transfer- <b>{`Transferred to ${(data.transfer_to_name ? data.transfer_to_name.toUpperCase() : 'N/A')}`}</b>
                </Col>
            )}
            <Col md={12} className='mb-2'>
                Subject- <b>{data.subject ? data.subject : 'N/A'}</b>
            </Col>
            <hr></hr>
            <Col md={12}>
                <p>Description-: </p>
                <Card className='mt-1'>
                    <CardBody>
                    <b>{data.description ? data.description : 'N/A'}</b>
                    </CardBody>
                </Card>
            </Col>
        </Row>
        <hr></hr>
        <h3>Ticket Log</h3>
        {!loading ? (
            (log && Object.values(log).length > 0) ? (
                Object.values(log).map((item, key) => (
                    <Row key={key}>
                        <Col md="12">
                            <Card>
                                <CardBody>
                                    <Row>
                                        <Col md='8'>
                                        {(item.ticket_status === 4 || item.ticket_status === 7 || item.ticket_status === 10 || item.ticket_status === 13) ? (
                                                <p><CheckCircle color='green'/> <b>{item.ticket_status_title}</b></p>
                                            ) : <p><b>{item.ticket_status_title}</b></p>}
                                        
                                        <p>{item.decision_reason}</p>
                                        <b>by </b><span>{item.decision_by_name}</span>
                                        </Col>
                                        <Col md="4" className='d-flex justify-content-end'>
                                            <span style={{color: '#808080b5'}}>{Api.formatDateDifference(item.updated_at)}</span>
                                        </Col>
                                    </Row>
                                    
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                ))
            ) : <div className="text-center">No Activity Found!</div>
        ) : <div className="text-center"><Spinner type="grow"/></div>}
    </Fragment>
  )
}

export default TicketDetails