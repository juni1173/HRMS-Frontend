import React, { Fragment, useEffect, useState } from 'react'
import { Card, CardBody, CardText, CardTitle, CardHeader, Button, Row, Badge, Col, Modal, ModalBody, ModalHeader } from 'reactstrap'
import apiHelper from '../Helpers/ApiHelper'
import EvaluationDetail from '../Candidates/Components/EvaluationComponents/EvaluationDetail'

const PreviousInterviews = () => {
  const Api = apiHelper()
  const [data, setData] = useState([])
  const [evaluateModal, setEvaluateModal] = useState(false)
  const [activeEvaluationModal, setEvaluationModal] = useState(1)
  const [loading, setLoading] = useState(true)
  const [cand_uuid, setcand_uuid] = useState(null)
  const openEvaluateModal = (uuid, active) => {
    setcand_uuid(uuid)
    // if (stage_id) setCurrentStage(stage_id)
    setEvaluationModal(active)
    setEvaluateModal(true)
    } 
  const fetchData = async () => {
    try {
      const response = await Api.get('/interviews/upcoming/interviews/')
      if (response.status === 200) {
        setData(response.data.previous_interviews)
        setLoading(false)
      } else {
        Api.Toast('error', 'Server not found')
      }
    } catch (error) {
      Api.Toast('error', 'Error fetching data')
    }
  }
  useEffect(() => {
    fetchData()
  }, [])
const evaluationModal = (active) => {
  switch (active) {
      case 1:
          return <EvaluationDetail uuid={cand_uuid}  />
      default:
        return <p>No Data Found</p>
    }
} 

  return (
   <Fragment>
    <Row>
        <div>
          <CardTitle tag='h4'>Interviews</CardTitle>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : data.length > 0 ? (
          data.map((interview, index) => (
            <Card key={index} className='mb-3'>
              <CardBody>
                <CardTitle>{interview.candidate_name}</CardTitle>
                <CardText>
                <Row>
  <Col md="4">
    Job Title:<Badge color='light-success'> {interview.position_title} </Badge>
  </Col>
  <Col md="4">
    Date: <Badge color="light-primary">{interview.interview_date}</Badge>
  </Col>
  <Col md="4">
    Time Slot: <Badge color="light-warning">{interview.time_slot_title}</Badge>
  </Col>
  <Col md="4">
    Interview Stage: <Badge color='light-danger'>{interview.stage_title}</Badge>
  </Col>
  <Col md="4">
    Mode: <Badge color="info">{interview.mode_title}</Badge>
  </Col>
   {interview.status === 4 ? <Col md="4">
    <Button color='success' onClick={() => openEvaluateModal(interview.candidate_job_uuid, 1)}>View Evaluation</Button> 
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
          <div>You have no interviews records</div>
        )}
      <Modal isOpen={evaluateModal} toggle={() => setEvaluateModal(!evaluateModal)} className='modal-dialog-centered modal-xl'>
                <ModalHeader className='bg-transparent' toggle={() => setEvaluateModal(!evaluateModal)}></ModalHeader>
                <ModalBody className='px-sm-5 mx-50 pb-5'>
                    {evaluationModal(activeEvaluationModal)}
                </ModalBody>
            </Modal>
            </Row>
            </Fragment>
  )
}

export default PreviousInterviews
