import {React, useEffect, useState} from 'react'
import { Card, CardBody, Spinner, Row, Col, Badge } from 'reactstrap'
import apiHelper from '../../Helpers/ApiHelper'

const JiraProject = ({ data }) => {
    const Api = apiHelper()
    const [issues, setIssues] = useState([])
    const [loading, setLoading] = useState(false)
    const getIssues = async () => {
        setLoading(true)
          const formData = new FormData()
        //   formData['expand'] = [
        //     "names",
        //   "schema",
        //   "operations"
        // ]
        formData['fields'] =  [
            "summary",
            "status",
            "assignee"
          ]
          formData['fieldsByKeys'] = false
          formData['jql'] = `project = ${data.id}`
          formData['maxResults'] = 50
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
    useEffect(() => {
        getIssues()
    }, [])
  return (
    !loading ? (
        Object.values(issues).length > 0 ? (
            issues.map((item, key) => (
                <Card key={key}>
                    <CardBody>
                        <Row>
                            <Col md={10}>
                            {item.fields.summary}
                            </Col>
                            <Col md={2}>
                               <Badge>{item.fields.status.name}</Badge> 
                            </Col>
                        </Row>
                        
                    </CardBody>
                </Card>
            ))
        ) : (
            <p>Issues not Available</p>
        )
    ) : (
        <div className='text-center'><Spinner/></div>
    )
    
    
  )
}

export default JiraProject