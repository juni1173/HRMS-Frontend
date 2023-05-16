import React, { Fragment, useState, useEffect } from 'react'
import { Card, CardBody, CardTitle, CardSubtitle, Row, Col, Offcanvas, OffcanvasHeader, OffcanvasBody, Spinner } from 'reactstrap'
import { Edit, Trash2 } from 'react-feather'
import apiHelper from '../../Helpers/ApiHelper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import UpdateProject from './UpdateProject'
import Masonry from 'react-masonry-component'
import ReactPaginate from 'react-paginate'

const ProjectList = ({ data, CallBack }) => {
  const Api = apiHelper()
  const MySwal = withReactContent(Swal)
  
  const [updateCanvasPlacement, setupdateCanvasPlacement] = useState('end')
  const [updateCanvasOpen, setupdateCanvasOpen] = useState(false)
  const [updateProject, setUpdateProject] = useState([])
  
  const [currentItems, setCurrentItems] = useState([])
  const [pageCount, setPageCount] = useState(0)
  const [itemOffset, setItemOffset] = useState(0)
  const itemsPerPage = 6

  const deleteProject = (id) => {
      MySwal.fire({
          title: 'Are you sure?',
          text: "Do you want to delete the Project!",
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
              Api.deleteData(`/projects/${id}/`, {method: 'Delete'})
              .then((deleteResult) => {
                  if (deleteResult.status === 200) {
                      MySwal.fire({
                          icon: 'success',
                          title: 'Project Deleted!',
                          text: 'Project is deleted.',
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
                          title: 'Project can not be deleted!',
                          text: deleteResult.message ? deleteResult.message : 'Project is not deleted.',
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
    setUpdateProject(item)
    setupdateCanvasPlacement('end')
    setupdateCanvasOpen(!updateCanvasOpen)
  }
  
  
  useEffect(() => {
    const endOffset = itemOffset === 0 ? itemsPerPage : itemOffset + itemsPerPage
    setCurrentItems(data.slice(itemOffset, endOffset))
    setPageCount(Math.ceil(data.length / itemsPerPage))
  }, [itemOffset, itemsPerPage, data])

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % data.length
    setItemOffset(newOffset)
  }
  return (
    <Fragment>
      
      {Object.values(currentItems).length > 0 ? (
        <>
            <Masonry className="row js-animation">
              {currentItems.map((item, key) => (
                  <Col md={6} key={key}>
                    <Card>
                    <CardBody>
                    <CardTitle tag='h4'>{item.name ? item.name : 'N/A'}
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
                            onClick={() => deleteProject(item.uuid)}
                            >
                            <Trash2 color="red"/>
                        </button>
                      </div>
                    </CardTitle>
                        <CardSubtitle className='text-muted mb-1'> {item.code ? item.code : 'N/A'}</CardSubtitle>
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
        </>
      ) : (
        <Card>
          <CardBody>
            <p>No Project Found!</p>
          </CardBody>
        </Card>
      )}
      
      
      <Offcanvas direction={updateCanvasPlacement} isOpen={updateCanvasOpen} toggle={toggleCanvasEnd}>
        <OffcanvasHeader toggle={toggleCanvasEnd}></OffcanvasHeader>
        <OffcanvasBody className=''>
            <UpdateProject data={updateProject} CallBack={() => CallBack()}/>
        </OffcanvasBody>
      </Offcanvas>
    </Fragment>
  )
}

export default ProjectList