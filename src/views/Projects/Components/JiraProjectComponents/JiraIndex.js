import { Fragment, useState, useEffect } from 'react'
import { Card, CardBody, CardTitle, Col, Offcanvas, OffcanvasHeader, OffcanvasBody, Spinner, Button } from 'reactstrap'
import Masonry from 'react-masonry-component'
import JiraIssues from './Issues'
import apiHelper from '../../../Helpers/ApiHelper'
import DashboardChart from './JiraDashoardCharts'
const JiraIndex = () => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [JiraProjects, setJiraProjects] = useState([])
    const [jiraCanvasPlacement, setjiraCanvasPlacement] = useState('end')
    const [jiraCanvasOpen, setjiraCanvasOpen] = useState(false)
    const [currentJiraProject, setCurrentJiraProject] = useState([])
    const toggleJiraCanvasEnd = item => {
        if (item) {
            setCurrentJiraProject(item)
        }
        setjiraCanvasPlacement('end')
        setjiraCanvasOpen(!jiraCanvasOpen)
      }
      const getJiraProjects = async () => {
        setLoading(true)
       await Api.jiraGet(`/rest/api/2/project`).then(result => {
          if (result) {
              setJiraProjects(result)
          }
        })
        setTimeout(() => {
          setLoading(false)
        }, 1000)
      }
     
      const CallBack = () => {
        setjiraCanvasOpen(false)
        getJiraProjects()
      }
      useEffect(() => {
        getJiraProjects()
      }, [setJiraProjects])
  return (
    <Fragment>
        <DashboardChart dashboardId='10024'/>
        <h2 className='mb-2'>Jira Projects</h2>
        {
      !loading ? (
        JiraProjects.length > 0 ? (
          <Masonry className='row js-animation'>
            {JiraProjects.map((item, key) => (
              <Col md={3} key={key} onClick={() => toggleJiraCanvasEnd(item)}>
              <Card className='cursor-pointer'>
              <CardBody>
              <CardTitle tag='h4'>
                {item.name ? item.name : 'N/A'}
              </CardTitle>
              </CardBody>
              </Card>
            </Col>
            ))}
          </Masonry>
        ) : (
          <Card>
            <CardBody>
              <p>No Jira Project Found!</p>
            </CardBody>
          </Card>
        )
      ) : (
        <div className='text-center'><Spinner/></div>
      )
      }
      <Offcanvas direction={jiraCanvasPlacement} isOpen={jiraCanvasOpen} toggle={toggleJiraCanvasEnd} className="xlargeCanvas">
        <OffcanvasHeader toggle={toggleJiraCanvasEnd}></OffcanvasHeader>
        <OffcanvasBody className=''>
            <JiraIssues data={currentJiraProject} CallBack={() => CallBack()}/>
        </OffcanvasBody>
      </Offcanvas>
    </Fragment>
  )
}

export default JiraIndex