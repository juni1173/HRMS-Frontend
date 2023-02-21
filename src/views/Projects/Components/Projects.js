import React, { Fragment, useState, useEffect } from 'react'
import { Row, Col, Button, Spinner, Offcanvas, OffcanvasHeader, OffcanvasBody } from 'reactstrap'
import ProjectList from './ProjectList'
import apiHelper from '../../Helpers/ApiHelper'
import ProjectAdd from './ProjectAdd'
const Project = () => {
  const Api = apiHelper()
  const [loading, setLoading] = useState(false)
  const [projectList, setProjectList] = useState([])
  const [canvasPlacement, setCanvasPlacement] = useState('end')
  const [canvasOpen, setCanvasOpen] = useState(false)
  const getProject = async () => {
    setLoading(true)
    await Api.get(`/projects/`).then(result => {
      if (result) {
        if (result.status === 200) {
          setProjectList(result.data)
        } else {
          // Api.Toast('error', result.message)
        }
      } else {
        Api.Toast('error', 'Server not responding!')
      }
    })
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }
  const CallBack = () => {
    setCanvasOpen(false)
    getProject()
  }
  const toggleCanvasEnd = () => {
    setCanvasPlacement('end')
    setCanvasOpen(!canvasOpen)
  }
  useEffect(() => {
    getProject()
  }, [])
  return (
    <Fragment>
      <Row>
        <Col md={6}>
          <h2>Projects</h2>
        </Col>
        <Col md={6}>
            <Button className='btn btn-success float-right' onClick={toggleCanvasEnd}>
              Add a Project
            </Button>
        </Col>
      </Row>
      <Row className='mt-2'>
        <Col md={12}>
          {!loading ? (
            <ProjectList data={projectList} CallBack={CallBack}/>
          ) : (
            <div className='text-center'><Spinner /></div> 
          )}
          
        </Col>
      </Row>
      <Offcanvas direction={canvasPlacement} isOpen={canvasOpen} toggle={toggleCanvasEnd} >
          <OffcanvasHeader toggle={toggleCanvasEnd}></OffcanvasHeader>
          <OffcanvasBody className=''>
            {/* {Canvas(active)} */}
            <ProjectAdd CallBack={CallBack}/>
          </OffcanvasBody>
        </Offcanvas>
    </Fragment>
    
  )
}

export default Project