import React, { Fragment, useState, useEffect } from 'react'
import { InputGroup, Container, Card, CardBody, CardTitle, CardSubtitle, CardText, InputGroupText, Col, Offcanvas, OffcanvasHeader, OffcanvasBody, Input } from 'reactstrap'
import { Edit, Trash2, Search } from 'react-feather'
import apiHelper from '../../Helpers/ApiHelper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import UpdateNote from './UpdateNote'
import Masonry from 'react-masonry-component'
import ReactPaginate from 'react-paginate'
import SearchHelper from '../../Helpers/SearchHelper/SearchByObject'

const NotesList = ({ data, CallBack, ListType }) => {
  console.warn(data)
  const Api = apiHelper()
  const searchHelper = SearchHelper()
  const MySwal = withReactContent(Swal)
  const [searchResults, setSearchResults] = useState(data)
  const [searchQuery] = useState([])
  const [updateCanvasPlacement, setupdateCanvasPlacement] = useState('end')
  const [updateCanvasOpen, setupdateCanvasOpen] = useState(false)
  const [updateNote, setUpdateNote] = useState([])

  const [currentItems, setCurrentItems] = useState([])
  const [pageCount, setPageCount] = useState(0)
  const [itemOffset, setItemOffset] = useState(0)
  const itemsPerPage = 6

  const deleteNotes = (id) => {
      MySwal.fire({
          title: 'Are you sure?',
          text: "Do you want to delete the Note!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, Delete it!',
          customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-danger ms-1'
          },
          buttonsStyling: false
      }).then(function (result) {
          if (result.value) {
              Api.deleteData(`/kind-notes/${id}/`, {method: 'Delete'})
              .then((deleteResult) => {
                  if (deleteResult.status === 200) {
                      MySwal.fire({
                          icon: 'success',
                          title: 'Note Deleted!',
                          text: 'Note is deleted.',
                          customClass: {
                          confirmButton: 'btn btn-success'
                          }
                      }).then(function (result) {
                          if (result.isConfirmed) {
                              CallBack()
                          }
                      }) 
                  } else {
                      MySwal.fire({
                          icon: 'error',
                          title: 'Note can not be deleted!',
                          text: deleteResult.message ? deleteResult.message : 'Note is not deleted.',
                          customClass: {
                          confirmButton: 'btn btn-danger'
                          }
                      })
                  }
                          
                  })
          } 
      })
  }

  const toggleCanvasEnd = item => {
    setUpdateNote(item)
    setupdateCanvasPlacement('end')
    setupdateCanvasOpen(!updateCanvasOpen)
  }
  const getSearch = options => {
    if (options.value === '' || options.value === null || options.value === undefined) {

        if (options.key in searchQuery) {
            delete searchQuery[options.key]
        } 
        if (Object.values(searchQuery).length > 0) {
            options.value = {query: searchQuery}
        } else {
            options.value = {}
        }
        setItemOffset(0)
        setSearchResults(searchHelper.searchObj(options))
        setCurrentItems(searchHelper.searchObj(options))
        
    } else {
        
        searchQuery[options.key] = options.value
        options.value = {query: searchQuery}
        setItemOffset(0)
        setSearchResults(searchHelper.searchObj(options))
        setCurrentItems(searchHelper.searchObj(options))
    }
    
}

  useEffect(() => {
    const endOffset = itemOffset === 0 ? itemsPerPage : itemOffset + itemsPerPage            
    setCurrentItems(searchResults.slice(itemOffset, endOffset))
    setPageCount(Math.ceil(searchResults.length / itemsPerPage))
  }, [itemOffset, itemsPerPage, data])

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % searchResults.length
    setItemOffset(newOffset)
  }
  return (
    <Fragment>
      <Container>
        <div className='row'>
          {ListType === 'sent' && (
            <Col md={6}>
              <InputGroup className='input-group-merge mb-2'>
                  <InputGroupText>
                      <Search size={14} />
                  </InputGroupText>
                  <Input placeholder='Search Reciever Name...'  onChange={e => { getSearch({list: data, key: 'receiver_name', value: e.target.value }) } }/>
              </InputGroup>
          </Col>
          )}
            {ListType === 'recieved' && (
              <Col md={6}>
                <InputGroup className='input-group-merge mb-2'>
                    <InputGroupText>
                        <Search size={14} />
                    </InputGroupText>
                    <Input placeholder='Search Sender Name...'  onChange={e => { getSearch({list: data, key: 'sender_name', value: e.target.value }) } }/>
                </InputGroup>
            </Col>
            )}
          </div>
      </Container>
      {Object.values(currentItems).length > 0 ? (
        <>
          <Container>
            <Masonry className="row js-animation">
              {currentItems.map((item, key) => (
                  <Col md={6} key={key}>
                    <Card className='card-blue'>
                    <CardBody>
                    <CardTitle tag='h4' className='text-white'>{item.receiver_name ? item.receiver_name : 'N/A'}
                      <div className='float-right'>
                          <button
                              className="border-0 no-background"
                              title="Edit"
                              onClick={() => toggleCanvasEnd(item)}
                              >
                              <Edit color="orange"/>
                          </button>
                        <button
                            className="border-0 no-background"
                            title="Delete"
                            onClick={() => deleteNotes(item.id)}
                            >
                            <Trash2 color="red"/>
                        </button>
                      </div>
                    </CardTitle>
                        <CardSubtitle className='text-muted mb-1'>By {item.sender_name ? item.sender_name : 'N/A'}</CardSubtitle>
                        <CardText className='text-white'>
                        {item.notes ? item.notes : 'N/A'}
                        </CardText>
                    </CardBody>
                    </Card>
                  </Col>
                )) }
            </Masonry>
            <ReactPaginate
              breakLabel="..."
              nextLabel=">"
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              pageCount={pageCount}
              previousLabel="<"
              renderOnZeroPageCount={null}
              containerClassName='pagination'
              pageLinkClassName='page-num'
              previousLinkClassName='page-num'
              nextLinkClassName='page-num'
              activeLinkClassName='active'
            />
          </Container>
        </>
      ) : (
        <Card>
          <CardBody>
            <p>No Notes Found!</p>
          </CardBody>
        </Card>
      )}
      <Offcanvas direction={updateCanvasPlacement} isOpen={updateCanvasOpen} toggle={toggleCanvasEnd}>
        <OffcanvasHeader toggle={toggleCanvasEnd}></OffcanvasHeader>
        <OffcanvasBody className=''>
            <UpdateNote data={updateNote} CallBack={() => CallBack()}/>
        </OffcanvasBody>
      </Offcanvas>
    </Fragment>
  )
}

export default NotesList