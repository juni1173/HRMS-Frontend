import React, { Fragment, useState } from 'react'
import { Card, CardBody, Row, Col, Button, Spinner, Offcanvas, OffcanvasHeader, OffcanvasBody, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import NotesList from './NotesList'
import NotesAdd from './NotesAdd'
import { Send } from 'react-feather'
const Notes = ({notesList, CallBack}) => {
  const [loading, setLoading] = useState(false)
  const [active, setActive] = useState('1')

  const [canvasPlacement, setCanvasPlacement] = useState('end')
  const [canvasOpen, setCanvasOpen] = useState(false)
 
  const CallBackFunc = () => {
    setLoading(true)
    setCanvasOpen(false)
    CallBack()
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }
  const toggleCanvasEnd = () => {
    setCanvasPlacement('end')
    setCanvasOpen(!canvasOpen)
  }
  const toggle = tab => {
    setActive(tab)
  }
  
  return (
    <Fragment>
      <div className="Module-single-card">
                <div className="row">
                    <div className="col-md-12">
                      <Row>
                        <Col className='col-6'>
                          <h2>Kind Notes</h2>
                        </Col>
                        <Col className='col-6'>
                            <Button className='btn btn-sm btn-success float-right' onClick={toggleCanvasEnd}>
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
                                              <NotesList data={notesList.recieved} CallBack={CallBackFunc} ListType={`recieved`}/>
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
                                              <NotesList data={notesList.sent} CallBack={CallBackFunc} ListType={`sent`}/>
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
            <NotesAdd CallBack={CallBackFunc}/>
          </OffcanvasBody>
        </Offcanvas>
    </Fragment>
    
  )
}

export default Notes