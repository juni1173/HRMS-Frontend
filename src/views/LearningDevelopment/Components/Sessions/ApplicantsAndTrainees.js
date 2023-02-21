import {React, useState, useEffect, Fragment} from 'react'
import Select from 'react-select'
import { Button, Label, Row, Spinner, Col, Offcanvas, OffcanvasHeader, OffcanvasBody } from 'reactstrap'
import { Plus } from 'react-feather'
import apiHelper from '../../../Helpers/ApiHelper'
import ApplicantList from './Applicants/Components/ApplicantList'
import TraineeList from './Trainees/Components/TraineeList'
import AddApplicant from './Applicants/Components/AddApplicant'
const ApplicantsAndTrainees = () => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [sessionList] = useState([])
    const [currentSession, setCurrentSession] = useState('')
    const [applicantsList, setApplicantsList] = useState([])
    const [traineesList, setTraineesList] = useState([])
    const [ActiveList, setActiveList] = useState(0)
    const [canvasPlacement, setCanvasPlacement] = useState('end')
    const [canvasOpen, setCanvasOpen] = useState(false)
   
    const getCourseSessions = async() => {
        setLoading(true)
            await Api.get('/instructors/session/').then(result => {
                if (result) {
                    sessionList.splice(0, sessionList.length)
                    if (result.status === 200) {
                        const session = result.data
                        for (let i = 0; i < session.length; i++) {
                            sessionList.push({value: session[i].id, label: `${session[i].course_title} / ${session[i].start_date} - ${session[i].end_date}`})
                        }
                    } else {
                        Api.Toast('error', result.message)
                    }
                } else {
                    sessionList.splice(0, sessionList.length)
                    Api.Toast('error', result.message)
                }
            })
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }
    const getApplicants = async () => {
        if (currentSession !== '') {
            setActiveList(1)
            setLoading(true)
            await Api.get(`/applicants/${currentSession}`).then(result => {
                if (result) {
                    if (result.status === 200) {
                        const final = result.data
                        setApplicantsList(final) 
                    } else {
                        setApplicantsList([])
                        Api.Toast('error', result.message)
                    }
                } else {
                    setApplicantsList([])
                    Api.Toast('error', result.message)
                }
            })
            setTimeout(() => {
                setLoading(false)
            }, 1000)
        } else {
            Api.Toast('error', 'Please select course session first!')
        }
        
    }
    const getTrainees = async () => {
        if (currentSession !== '') {
            setActiveList(2)
            setLoading(true)
            await Api.get(`/applicants/trainee/${currentSession}`).then(result => {
                if (result) {
                    if (result.status === 200) {
                        const final = result.data
                        setTraineesList(final) 
                    } else {
                        setTraineesList([])
                        Api.Toast('error', result.message)
                    }
                } else {
                    setTraineesList([])
                    Api.Toast('error', result.message)
                }
            })
            setTimeout(() => {
                setLoading(false)
            }, 1000)
        } else {
            Api.Toast('error', 'Please select course session first!')
        }
    }
    const toggleCanvasEnd = () => {
        setCanvasPlacement('end')
        setCanvasOpen(!canvasOpen)
        }
    const CallBack = () => {
        toggleCanvasEnd()  
        getApplicants()
    }
    useEffect(() => {
        getCourseSessions()
    }, [])
  return (
    <Fragment>
       
            <Row>
                <Col md="6">
                    <Label>
                        Select Course Session
                    </Label>
                    <Select
                        type="text"
                        name="session"
                        options={sessionList}
                        defaultValue={sessionList.find(pre => pre.value === currentSession) ? sessionList.find(pre => pre.value === currentSession) : ''}
                        onChange={e => setCurrentSession(e.value)}
                    />
                </Col>
                <Col md="6">
                    <Row className='pt-2'>
                        <Col md='6' className='border-right text-center'>
                        <Button className='btn btn-primary' onClick={getApplicants}>
                            Applicants
                        </Button>
                        </Col>
                        <Col md='6' className='text-center'>
                        <Button className='btn btn-primary' onClick={getTrainees}>
                            Trainees
                        </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            
        {!loading ? (
            <>
            {ActiveList === 1 && (
                <>
                    <div className="row mt-3">
                        <div className="col-lg-6">
                            <h2>Applicants</h2>
                        </div>
                        <div className="col-lg-6">
                            <button
                                className="btn btn-sm btn-success float-right"
                                title="Add Applicant"
                                onClick={toggleCanvasEnd}
                                >    
                                <Plus />Add Applicant
                            </button>
                        </div>
                    </div>
                    <Row className='pt-2'>
                        <Col md='12'>
                            <ApplicantList data={applicantsList} getApplicants={getApplicants}/>
                        </Col>
                    </Row>
                </>
            )}
            {ActiveList === 2 && (
                 <Row className='pt-2'>
                    <Col md='12'>
                        <TraineeList data={traineesList} CallBack={getTrainees} />
                    </Col>
                </Row>
            )}
           
            </>
        ) : (
            <div className="text-center pt-3"><Spinner color='primary'/></div>
        )}
            <Offcanvas direction={canvasPlacement} isOpen={canvasOpen} toggle={toggleCanvasEnd}>
                <OffcanvasHeader toggle={toggleCanvasEnd}></OffcanvasHeader>
                <OffcanvasBody className=''>
                    <AddApplicant CallBack={CallBack} session={currentSession}/>
                </OffcanvasBody>
            </Offcanvas>
    </Fragment>
  )
}

export default ApplicantsAndTrainees