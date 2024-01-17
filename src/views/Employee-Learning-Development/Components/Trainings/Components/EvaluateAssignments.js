import React, { Fragment, useState } from 'react'
import { Card, CardBody, Row, Col, Modal, ModalHeader, ModalBody, Input, Badge, Button, Spinner, CardHeader } from 'reactstrap'
import apiHelper from '../../../../Helpers/ApiHelper'
const EvaluateAssignments = ({ data }) => {
    console.warn(data)
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [assignmentData, setAssignmentData] = useState([])
    const [basicModal, setBasicModal] = useState(false)
    // const [selectedEmp, setSelectedEmp] = useState([])
    const [obtained_marks, setObtainedMarks] = useState('')
    // const AssignmentsModal = (item) => {
    //     if (item) {
    //         setSelectedEmp(item)
    //     }
    //     setBasicModal(!basicModal)
    // }
    const getAssignment = async (training, employee, callBack = false) => {
        if (!employee || !training) {
            return Api.Toast('error', 'Training or employee not Selected!')
        }
       if (!callBack) setBasicModal(!basicModal)
        setLoading(true)
        const formData = new FormData()
        formData['employee'] = employee
        const response = await Api.jsonPost(`/training/evaluator/employee/uploaded/assignment/${training}/`, formData)
        if (response.status === 200) {
          const responseData = response.data
          setAssignmentData(responseData)
        } else {
            return Api.Toast('error', 'Data not found')
        }
        setTimeout(() => {
            setLoading(false)
        }, 500)
    }
    const SubmitMarks = async (id, training, employee) => {
        if (id) {
            if (obtained_marks !== '') {
                const formData = new FormData
                formData['obtained_marks'] = obtained_marks
                await Api.jsonPatch(`/training/add/marks/assignment/uploaded/by/employee/${id}/`, formData)
                .then(result => {
                    if (result) {
                        if (result.status === 200) {
                            if (training && employee) getAssignment(training, employee, true)
                            Api.Toast('success', result.message)
                        } else {
                            Api.Toast('error', result.message)
                        }
                    } else {
                        Api.Toast('error', 'Server Not Responding!')
                    }
                })
            } else {
                Api.Toast('error', 'Marks field is empty!')
            }
        } else {
            Api.Toast('error', 'No Assignment Selected!')
        }
    }
  return (
    <Fragment>
        <h3 className='text-center'>Evaluate Trainees Assignments</h3><hr></hr>
        {data && Object.values(data).length > 0 ? (
            Object.values(data).map((item, key) => (
                <Card key={key}>
                    <CardBody>
                        <Row>
                            <Col md={6}><h4>{item.employee_name ? item.employee_name : 'N/A'}</h4></Col>
                            <Col md={6} >
                                <Button className='float-right' color='primary' outline onClick={() => getAssignment(item.training, item.employee)}>
                                    Assignments
                                </Button>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            ))
            
        ) : <p>No Data Found</p>}
        <Modal isOpen={basicModal} toggle={() => setBasicModal(!basicModal)} className="modal-lg">
          <ModalHeader toggle={() => setBasicModal(!basicModal)}></ModalHeader>
          <ModalBody>
            
            {!loading ? (
            assignmentData && Object.values(assignmentData).length > 0 ? (
                Object.values(assignmentData).map((assignment, key) => (
                    <Card key={key}>
                        <CardBody>
                            <Row>
                                <Col md={4}>
                                    <b>{assignment.employee_name ? assignment.employee_name : 'N/A'}</b>
                                    <hr></hr>
                                    <h3> {assignment.training_assignment_title ? assignment.training_assignment_title : 'N/A'}</h3>
                                    Total Marks: <Badge>{assignment.total_marks ? assignment.total_marks : 'N/A'}</Badge><br></br>
                                    Status: <Badge>{assignment.assignment_status_title ? assignment.assignment_status_title : 'N/A'}</Badge>
                                </Col>
                                <Col md={3}>
                                    <b>{assignment.training_title ? assignment.training_title : 'N/A'}</b>
                                    <hr></hr>
                                    <a className='btn btn-primary btn-sm mb-2' href={assignment.assignment_file ? assignment.assignment_file : '#'} target='_blank'>Assignment</a>
                                    {assignment.submitted_assignment ? <a className='btn btn-success btn-sm' href={assignment.submitted_assignment ? assignment.submitted_assignment : '#'} target='_blank'>Submitted File</a> : <Badge color="light-danger">No Assignment Submitted</Badge>}
                                </Col>
                                <Col md={5} className='float-right'>
                                    <b>Score</b>
                                    <hr></hr>
                                        {assignment.obtained_marks ? (
                                            <h3>Marks Obtained: {assignment.obtained_marks}</h3>
                                        ) : (
                                            <Row>
                                                <Col md={7}>
                                                    <Input
                                                    type='number'
                                                    min={0}
                                                    max={assignment.total_marks ? assignment.total_marks : 0}
                                                    placeholder="Enter Marks"
                                                    onChange={(e) => setObtainedMarks(e.target.value)}
                                                    />
                                                </Col>
                                                <Col md={5}>
                                                    <Button className='btn btn-primary' onClick={() => SubmitMarks(assignment.id, assignment.training, assignment.employee)}>Submit</Button>
                                                </Col>
                                            </Row>
                                        )}
                                </Col>
                            </Row>
                            
                        </CardBody>
                    </Card>
                ))
            ) : <p>No Data Found</p>
            ) : <div className='text-center'><Spinner></Spinner></div>}
          </ModalBody>
        </Modal>
    </Fragment>
  )
}

export default EvaluateAssignments