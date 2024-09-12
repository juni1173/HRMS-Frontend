import {Fragment, useEffect, useState} from 'react'
import apiHelper from '../../Helpers/ApiHelper'
import { Col, Spinner, Row, Progress, Button, Badge, Card, CardBody } from 'reactstrap'
import { CheckCircle, RefreshCw, XOctagon } from 'react-feather'
const Index = ({id}) => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [logLoading, setlogLoading] = useState(false)
    const [preData, setPreData] = useState([])
    const [logData, setLogData] = useState([])
    const [scripts, setScripts] = useState({
        nscLeaves: false,
        scLeaves: false,
        medical: false
        })
    const getPreData = async () => {
        
        await Api.get(`/employees/required/fields/${id}/`)
        .then(result => {
            if (result) {
                if (result.status === 200) {
                    setLoading(true)
                    setPreData(result.data)
                    setTimeout(() => {
                        setLoading(false)
                    }, 500)
                } else {
                    Api.Toast('error', result.message)
                }
            } else {
                Api.Toast('error', 'Server not responding!')
            }
        })
    }
    const scriptsLog = async () => {
        
        await Api.get(`/reimbursements/allowance/script/logs/${id}/`)
        .then(result => {
            if (result) {
                if (result.status === 200) {
                    setlogLoading(true)
                    setLogData(result.data)
                    setTimeout(() => {
                        setlogLoading(false)
                    }, 500)
                } else {
                    Api.Toast('error', result.message)
                }
            } else {
                Api.Toast('error', 'Server not responding!')
            }
        })
    }
    const scriptRun = async (type) => {
        let url = ''
        if (type) {
            if (type === 'nscLeaves') url = `/reimbursements/employee/nsc/leave/script/${id}/`
            if (type === 'medical') url = `/reimbursements/employee/medical/script/${id}/`
            if (type === 'scLeaves') url = `/reimbursements/employee/leave/script/${id}/`
            await Api.jsonPost(url, {}).then(result => {
                if (result) {
                    if (result.status === 200) {
                        setScripts(prevState => ({
                            ...prevState,
                            [type] : true
                            }))
                    }
                }
            })
        }
    }
    useEffect(() => {
        getPreData()
        scriptsLog()
    }, [setPreData, setLogData])
  return (
        <Fragment>
            <h3 className='text-center'>ESS Setup checklist for {preData.name ? preData.name.toUpperCase() : 'N/A'}</h3>
            {!loading ? (
                preData && Object.values(preData).length > 0 ? (
                <Row className='mt-2'>
                    <Col md="6">
                        <b>Staff Classification</b>
                    </Col>
                    <Col md="6" className='float-right'>
                        {preData.staff_classification ? <><CheckCircle color='green'/> {preData.staff_classification_title}</> : <XOctagon color='red'/>}
                    </Col>
                    <hr></hr>
                    <Col md="6">
                        <b>Employee Type</b>
                    </Col>
                    <Col md="6" className='float-right'>
                        {(preData.employee_type && preData.employee_type === 1) ? <><CheckCircle color='green'/> - {preData.employee_type_title} </> : <XOctagon color='red'/>}
                    </Col>
                    <hr></hr>
                    <Col md="6">
                       <b>Gender</b>
                    </Col>
                    <Col md="6" className='float-right'>
                        {preData.gender ? <><CheckCircle color='green'/> - {preData.gender_type}</> : <XOctagon color='red'/>}
                    </Col>
                    <hr></hr>
                </Row>
            ) : <div className="text-center">No Requirements data found against this employee!</div>
            ) : <div className="text-center"><Spinner/></div>}
            <Row>
                    <Col md='4' className='border-right text-center'>
                        {!scripts.nscLeaves ? (
                            <Button className='btn btn-primary' onClick={() => scriptRun('nscLeaves')}>
                                NSC Leaves Setup
                            </Button>
                        ) : <Badge color='light-success'>NSC Leaves Executed <CheckCircle color='green'/></Badge>}
                        
                    </Col>
                    <Col md='4' className='border-right text-center'>
                        {!scripts.medical ? (
                            <Button className='btn btn-primary' onClick={() => scriptRun('medical')}>
                                Medical Setup
                            </Button>
                        ) : <Badge color='light-success'>Medical Executed <CheckCircle color='green'/></Badge>}
                        
                    </Col>
                    <Col md='4' className='text-center'>
                        {!scripts.scLeaves ? (
                            <Button className='btn btn-primary' onClick={() => scriptRun('scLeaves')}>
                                SC Leaves Setup
                            </Button>
                        ) : <Badge color='light-success'>SC Leaves Executed <CheckCircle color='green'/></Badge>}
                    </Col>
            </Row>
           <hr></hr>
                <Row>
                    <Col md='6'>
                            <h3>Setup Execution History</h3>
                        </Col>
                        <Col md='6'>
                            <RefreshCw onClick={scriptsLog} className='float-right'/>
                        </Col>
                        <hr></hr>
                        {!logLoading ? (
                        logData && Object.values(logData).length > 0 ? (
                            Object.values(logData).map((item, key) => (
                                <Card key={key}>
                                    <CardBody>
                                        <Row>
                                            <Col md='8'>
                                                <b>{item.script_title ? item.script_title : 'N/A'}</b>
                                            </Col>
                                            <Col md='4' >
                                                <span className='float-right'>{item.updated_at && Api.formatDateDifference(item.updated_at)}</span>
                                            </Col>
                                            <Col md='12'>
                                                <Badge color='light-success'>{item.is_completed ? 'Completed' : 'N/A'}</Badge>
                                            </Col>
                                        </Row>
                                        
                                    </CardBody>
                                </Card>
                            ))
                        
                        ) : <div className="text-center">No History found against this employee!</div>
                        ) : <div className="text-center"><Spinner/></div>}
                </Row>
            
        </Fragment>
  )
}

export default Index