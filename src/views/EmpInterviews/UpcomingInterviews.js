import React, { Fragment, useEffect, useState, useRef } from 'react'
import { Card, CardBody, CardText, CardTitle, CardHeader, Button, Row, Badge, Col, Modal, ModalBody, ModalHeader } from 'reactstrap'
import apiHelper from '../Helpers/ApiHelper'
import EvaluationForm from '../Candidates/Components/EvaluationComponents/EvaluationForm'

const UpcomingInterviews = () => {
  const Api = apiHelper()
  const isMounted = useRef(true)
  const [data, setData] = useState([])
  const [evaluateModal, setEvaluateModal] = useState(false)
  const [activeEvaluationModal, setEvaluationModal] = useState(1)
  const [loading, setLoading] = useState(true)
  const [isStart, setisStart] = useState(false)
  const [cand_uuid, setcand_uuid] = useState(null)
  const [currentStage, setCurrentStage] = useState(null)
  const openEvaluateModal = (uuid, stage_id, active) => {
    setcand_uuid(uuid)
    if (stage_id) setCurrentStage(stage_id)
    setEvaluationModal(active)
    setEvaluateModal(true)
    } 
  const fetchData = async () => {
    try {
      const response = await Api.get('/interviews/upcoming/interviews/')
      if (response.status === 200) {
        if (isMounted.current) setData(response.data.upcoming_interviews)
        if (isMounted.current) setLoading(false)
      } else {
        Api.Toast('error', 'Server not found')
      }
    } catch (error) {
      Api.Toast('error', 'Error fetching data')
    }
    return () => {
      isMounted.current = false
    }
  }
  useEffect(() => {
    fetchData()
    return () => {
      isMounted.current = false
    }
  }, [])
  const CallBack = () => {
    fetchData()
  }
  const startInterview = async(uuid, id) => {
setisStart(true)
try {
  const response = await Api.get(`/interviews/candidate/job/start/${uuid}/${id}/`)
  if (response.status === 200) {
    // setData(response.data.upcoming_interviews)
    fetchData()
    setLoading(false)
  } else {
    Api.Toast('error', 'Server not found')
  }
} catch (error) {
  Api.Toast('error', 'Error fetching data')
}
  }
  const onCompleteInterview = async (uuid, id) => {
    await Api.get(`/interviews/candidate/job/mark/complete/${uuid}/${id}/`)
    .then(result => {
        if (result) {
            if (result.status === 200) {
                // getInterviewData()
                fetchData()
            } else {
                Api.Toast('error', result.message)
            }
        } else {
            Api.Toast('error', 'Server not responding!')
        }
    })
}
const evaluationModal = (active) => {
  switch (active) {
      case 1:
          return <EvaluationForm uuid={cand_uuid} stage_id={currentStage} CallBack={CallBack} />
      // case 2:
      //   return <EvaluationDetail uuid={cand_uuid} />
      default:
        return <p>No Data Found</p>
    }
} 

  return (
   <Fragment>
    <Row>
        <div>
          <CardTitle tag='h4'>Interviews Schedule</CardTitle>
          <CardText className='font-small-2'>{Api.formatDate(new Date())}</CardText>
        </div>
      {/* </CardHeader> */}
      {/* <CardBody> */}
        {loading ? (
          <div>Loading...</div>
        ) : data.length > 0 ? (
          data.map((interview, index) => (
            <Card key={index} className='mb-3'>
              <CardBody>
                <CardTitle>{interview.candidate_name}</CardTitle>
                <CardText>
                <Row>
  <Col md="4" className='mb-2'>
    Job Title:<Badge color='light-success'> {interview.position_title} </Badge>
  </Col>
  <Col md="4" className='mb-2'>
    Date: <Badge color="light-primary">{interview.interview_date}</Badge>
  </Col>
  <Col md="4" className='mb-2'>
    Time Slot: <Badge color="light-warning">{interview.time_slot_title}</Badge>
  </Col>
  <Col md="4" className='mb-2'>
    Interview Stage: <Badge color='light-danger'>{interview.stage_title}</Badge>
  </Col>
  <Col md="4" className='mb-2'>
    Mode: <Badge color="info">{interview.mode_title}</Badge>
  </Col>
{isStart ? <Col md="4" className='mb-2'>
    Meeting Link: <a href={interview.interview_url}>{interview.interview_url}</a>
  </Col> : <Col md="4"></Col> }
  {interview.status < 3 ? <Col md="4" className='mb-2'>
   <Button color='success' onClick={() => startInterview(interview.candidate_job_uuid, interview.id)}>Start Interview</Button> 
  </Col> : null}
  {interview.status === 3 ? <Col md="4" className='mb-2'>
    <Button color='success' onClick={() => onCompleteInterview(interview.candidate_job_uuid, interview.id)}>Complete Interview</Button> 
   </Col> : null}
   {interview.status === 4 && !interview.is_completed && !interview.is_evaluation ? <Col md="4" className='mb-2'>
    <Button color='success' onClick={() => openEvaluateModal(interview.candidate_job_uuid, interview.stage, 1)}>Evaluate Interview</Button> 
   </Col> : null}
   {interview.status === 4 && interview.is_completed && interview.is_evaluation ? <Col md="4" className='mb-2'>
    <Button color='success' onClick={() => openEvaluateModal(interview.candidate_job_uuid, interview.stage, 1)}>View Evaluation</Button> 
   </Col> : null}
  {/* <Col md="4">
    Meeting Medium: <Badge color="secondary">{interview.interview_medium}</Badge>
  </Col> */}
</Row>
                </CardText>
                {/* <Button color="primary">Join Meeting</Button> */}
              </CardBody>
            </Card>
          ))
        ) : (
          <div>You have no scheduled interviews</div>
        )}
      {/* </CardBody> */}
      <Modal isOpen={evaluateModal} toggle={() => setEvaluateModal(!evaluateModal)} className='modal-dialog-centered modal-xl'>
                <ModalHeader className='bg-transparent' toggle={() => setEvaluateModal(!evaluateModal)}></ModalHeader>
                <ModalBody className='px-sm-5 mx-50 pb-5'>
                    {evaluationModal(activeEvaluationModal)}
                </ModalBody>
            </Modal>
            </Row>
            </Fragment>
    // </Card>
  )
}

export default UpcomingInterviews
