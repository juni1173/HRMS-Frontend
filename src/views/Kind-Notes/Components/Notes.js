import React, { Fragment, useState, useEffect } from 'react'
import { Card, CardBody, Row, Col, Button, Spinner, Offcanvas, OffcanvasHeader, OffcanvasBody, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import NotesList from './NotesList'
import apiHelper from '../../Helpers/ApiHelper'
import NotesAdd from './NotesAdd'
import { Send } from 'react-feather'
const Notes = () => {
  const Api = apiHelper()
  const [loading, setLoading] = useState(false)
  const [active, setActive] = useState('1')
  const [notesList, setNotesList] = useState({
    recieved: '',
    sent: ''
  })
  const [canvasPlacement, setCanvasPlacement] = useState('end')
  const [canvasOpen, setCanvasOpen] = useState(false)
  const getNotes = async () => {
    setLoading(true)
    setNotesList({
      recieved: '',
      sent: ''
      })
    await Api.get(`/kind-notes/sent/`).then(result => {
      if (result) {
        if (result.status === 200) {
          setNotesList(prevState => ({
            ...prevState,
            sent: result.data
            }))
        } else {
          // Api.Toast('error', result.message)
        }
      } else {
        Api.Toast('error', 'Server not responding!')
      }
    })
      await Api.get(`/kind-notes/received/`).then(result => {
        if (result) {
          if (result.status === 200) {
            setNotesList(prevState => ({
              ...prevState,
              recieved: result.data
              }))
          } else {
            // Api.Toast('error', result.message)
          }
        } else {
          Api.Toast('error', 'Server not responding!')
        }
    })
    console.warn(notesList)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }
  const CallBack = () => {
    setCanvasOpen(false)
    getNotes()
  }
  const toggleCanvasEnd = () => {
    setCanvasPlacement('end')
    setCanvasOpen(!canvasOpen)
  }
  const toggle = tab => {
    setActive(tab)
  }
  useEffect(() => {
    getNotes()
  }, [])
  return (
    <Fragment>
      <div className="Module-single-card">
                <div className="row">
                    <div className="col-md-12">
                      <Row>
                        <Col md={6}>
                          <h2>Kind Notes</h2>
                        </Col>
                        <Col md={6}>
                            <Button className='btn btn-success float-right' onClick={toggleCanvasEnd}>
                              Send a Note <Send/>
                            </Button>
                        </Col>
                      </Row>
                        <Nav tabs className='course-tabs'>
                                {/* <div className='col-md-6'> */}
                                    <NavItem >
                                    <NavLink
                                        active={active === '1'}
                                        onClick={() => {
                                        toggle('1')
                                        }}
                                    >
                                    Recieved
                                    </NavLink>
                                    </NavItem>
                                {/* </div>
                                <div className='col-md-6'> */}
                                    <NavItem >
                                    <NavLink
                                        active={active === '2'}
                                        onClick={() => {
                                        toggle('2')
                                        }}
                                    >
                                        Sent
                                    </NavLink>
                                    </NavItem>
                                
                                {/* </div> */}
                        </Nav>
                    </div>
                </div>
                    
                    <TabContent className='py-50' activeTab={active}>
                        <TabPane tabId={'1'}>
                            <div className="row">
                                <div className="col-lg-12">
                                      <Row className='mt-1'>
                                        <Col md={12}>
                                          {!loading ? (
                                            notesList.recieved !== '' ? (
                                              <NotesList data={notesList.recieved} CallBack={CallBack} ListType={`recieved`}/>
                                            ) : (
                                              <Card className='card-blue'> 
                                                <CardBody>
                                                  <p className='text-white'>No Notes Found!</p>
                                                </CardBody>
                                              </Card>
                                            )
                                            
                                          ) : (
                                            <div className='text-center'><Spinner /></div> 
                                          )}
                                          
                                        </Col>
                                      </Row>
                                </div>
                            </div> 
                        </TabPane>
                        <TabPane tabId={'2'}>
                            <div className="row">
                                <div className="col-lg-12">
                                      <Row className='mt-1'>
                                        <Col md={12}>
                                          {!loading ? (
                                            notesList.sent !== '' ? (
                                              <NotesList data={notesList.sent} CallBack={CallBack} ListType={`sent`}/>
                                            ) : (
                                              <Card className='card-blue'> 
                                                <CardBody>
                                                  <p className='text-white'>No Notes Found!</p>
                                                </CardBody>
                                              </Card>
                                            )
                                          ) : (
                                            <div className='text-center'><Spinner /></div> 
                                          )}
                                          
                                        </Col>
                                      </Row>
                                </div>
                            </div>
                        </TabPane>
                    </TabContent>
                       
            </div>
      
      <Offcanvas direction={canvasPlacement} isOpen={canvasOpen} toggle={toggleCanvasEnd} >
          <OffcanvasHeader toggle={toggleCanvasEnd}></OffcanvasHeader>
          <OffcanvasBody className=''>
            {/* {Canvas(active)} */}
            <NotesAdd CallBack={CallBack}/>
          </OffcanvasBody>
        </Offcanvas>
    </Fragment>
    
  )
}

export default Notes