import {Fragment, React, useEffect, useState} from 'react'
import { BarChart2 } from 'react-feather'
import { Card, CardBody, Spinner, Row, Col, Badge, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import apiHelper from '../../../Helpers/ApiHelper'
import IssueDetail from './IssueDetail'
import StatusChart from './StatusChart'
import AssigneeChart from './AssigneeChart'
const JiraIssues = ({ data }) => {
    const Api = apiHelper()
    const [issues, setIssues] = useState([])
    const [loading, setLoading] = useState(false)
    // const [centeredModal, setCenteredModal] = useState(false)
    // const [assigneeModal, setAssigneeModal] = useState(false)
    // const [statusCount, setStatusCount] = useState([])
    // const [assigneeCount, setAssigneeCount] = useState([])
    const [currentIssue, setCurrentIssue] = useState([])
    const getIssues = async () => {
        setLoading(true)
          const formData = new FormData()
        formData['fields'] =  [
            "summary",
            "status",
            "assignee",
            "comment",
            "worklog",
            "priority"
          ]
          formData['fieldsByKeys'] = false
          formData['jql'] = `project = ${data.id} ORDER BY created DESC`
          formData['maxResults'] = 100
          formData['startAt'] = 0

        await Api.jiraPost(`/rest/api/2/search`, JSON.stringify(formData)).then(result => {
            if (result) {
                if (result.status === 200) {
                    setIssues(result.data.issues)
                } else {
                    setIssues([])
                }
            }
            
        })
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }
    const onClickIssue = item => {
        setCurrentIssue(item)
    }
    function convert(json) {
        const statusCategories = []
        
        for (const issue of json) {   // iterate over all issues
            const currStatusCategory = issue.fields.status
            if (statusCategories[currStatusCategory.name]) {   // category is already listed, increase counter
                statusCategories[currStatusCategory.name]++
            } else {   // category is new, add it to our collection
                statusCategories[currStatusCategory.name] = 1
            }
        }
    
        // build simple result for template
        const result = []
        for (const name in statusCategories) {
            result.push({
                name,
                'Number of Issues': statusCategories[name]
            })
        }
    
        result.sort(function(a, b) {
            return a.Category < b.Category ? 1 : -1
        })
    
        return result
    }
    const getAssignee = () => {
    const assigneeMap = new Map()
    issues.forEach((issue) => {
     if (issue.fields.assignee) {
         const assigneeName = issue.fields.assignee.displayName
      if (assigneeMap.has(assigneeName)) {
        assigneeMap.set(assigneeName, assigneeMap.get(assigneeName) + 1)
      } else {
        assigneeMap.set(assigneeName, 1)
      }
    }
    })

    // Convert the map to an array of assignees with issue counts
    const assigneesWithCount = Array.from(assigneeMap, ([name, count]) => ({
      name,
      issueCount: count
    }))
    return assigneesWithCount
}
    // const getStatusChart = () => {
    //     const data = convert(issues)
    //     setStatusCount(data)
    //     setCenteredModal(!centeredModal)
    // }
    // const getAssigneeChart = () => {
    //     const data = getAssignee(issues)
       
    //     setAssigneeCount(data)
    //     setAssigneeModal(!assigneeModal)
    // }
    useEffect(() => {
        getIssues()
    }, [])
  return (
    <Fragment>
        
        <Row>
            <Col md={3} id='left-scroll'>
            <h3 className='text-center text-white'>Jira Issues </h3>
            {
            !loading ? (
                Object.values(issues).length > 0 ? (
                    issues.map((item, key) => (
                        <Card key={key} onClick={() => onClickIssue(item.fields)} className='cursor-pointer'>
                            <CardBody>
                                <Row>
                                    <Col md={8}>
                                    {item.fields.summary}
                                    </Col>
                                    <Col md={4}>
                                       <Badge className='badge-glow'>{item.fields.status.name}</Badge> 
                                    </Col>
                                </Row>
                                
                            </CardBody>
                        </Card>
                    ))
                ) : (
                    <p className='text-white'>Issues not found!</p>
                )
            ) : (
                <div className='text-center'><Spinner type='grow' color='white'/></div>
            )
        }
            </Col>
            <Col md={6} className='mid-scroll'>
                <h3 className='text-center'>Issue Detail </h3>
{/*                 
                <Button className='btn btn-success text-center m-2' onClick={getStatusChart}>
                    Status Chart <BarChart2 />
                </Button>
                <Button className='btn btn-success text-center' onClick={getAssigneeChart}>
                    Assignee Chart <BarChart2 />
                </Button> */}
                {
                    Object.values(currentIssue).length > 0 ? (
                        <IssueDetail data={currentIssue} />
                    ) : (
                        <div className='text-center'>No selected issue...</div>
                    )
                }
            </Col>
            <Col md={3} className='right-scroll'>
                    <StatusChart data={convert(issues)} />
                    <br></br>
                    <AssigneeChart data={getAssignee(issues)} />
                </Col>
        </Row>
        {/* <Modal isOpen={centeredModal} toggle={() => setCenteredModal(!centeredModal)} className='modal-dialog-centered modal-lg'>
          <ModalHeader toggle={() => setCenteredModal(!centeredModal)}>Statuses Chart</ModalHeader>
          <ModalBody>
                <StatusChart data={statusCount} />
          </ModalBody>
          <ModalFooter>
           
          </ModalFooter>
        </Modal>
        <Modal isOpen={assigneeModal} toggle={() => setAssigneeModal(!assigneeModal)} className='modal-dialog-centered modal-lg'>
          <ModalHeader toggle={() => setAssigneeModal(!assigneeModal)}>Assignee Chart</ModalHeader>
          <ModalBody>
                <AssigneeChart data={assigneeCount} />
          </ModalBody>
          <ModalFooter>
           
          </ModalFooter>
        </Modal> */}
    </Fragment>
  )
}

export default JiraIssues