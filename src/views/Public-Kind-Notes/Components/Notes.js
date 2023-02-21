import React, { Fragment, useState, useEffect } from 'react'
import { Container, Row, Col, Button, Spinner, Offcanvas, OffcanvasHeader, OffcanvasBody } from 'reactstrap'
import NotesList from './NotesList'
import apiHelper from '../../Helpers/ApiHelper'
import NotesAdd from './NotesAdd'
import Masonary from 'react-masonry-component'
const Notes = () => {
  const Api = apiHelper()
  const [loading, setLoading] = useState(false)
  const [notesList, setNotesList] = useState([])
  const [canvasPlacement, setCanvasPlacement] = useState('end')
  const [canvasOpen, setCanvasOpen] = useState(false)
  const getNotes = async () => {
    setLoading(true)
    await Api.get(`/organization/${Api.org ? Api.org.id : 4}/kind/notes/`).then(result => {
      if (result) {
        if (result.status === 200) {
          setNotesList(result.data)
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
    getNotes()
  }
  const toggleCanvasEnd = () => {
    setCanvasPlacement('end')
    setCanvasOpen(!canvasOpen)
  }
  useEffect(() => {
    getNotes()
  }, [])
  return (
    <Fragment>
      <Container className='mt-1'>
        <Row>
          <Col md={6}>
            <h2>Kind Notes</h2>
          </Col>
          <Col md={6}>
              <Button className='btn btn-success float-right' onClick={toggleCanvasEnd}>
                Add a Note
              </Button>
          </Col>
        </Row>
        <Row className='mt-2'>
          <Col md={12}>
            {!loading ? (
              <NotesList data={notesList} CallBack={CallBack}/>
            ) : (
              <div className='text-center'><Spinner /></div> 
            )}
            
          </Col>
        </Row>
      </Container>
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