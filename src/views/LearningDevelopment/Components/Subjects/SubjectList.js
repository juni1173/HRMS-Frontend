import React, { Fragment, useState, useEffect } from 'react'
import { Table, Badge, Row, Col, Offcanvas, OffcanvasHeader, OffcanvasBody, InputGroup, Input, InputGroupText } from 'reactstrap'
import { Edit, XCircle, Search } from "react-feather"
import apiHelper from "../../../Helpers/ApiHelper"
import UpdateSubject from "./UpdateSubject"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import SearchHelper from '../../../Helpers/SearchHelper/SearchByObject'
import ReactPaginate from 'react-paginate'
import Select from "react-select"

const SubjectList = ({data, CallBack}) => {
    const Api = apiHelper()
    const searchHelper = SearchHelper()
    const [updateCanvasPlacement, setupdateCanvasPlacement] = useState('end')
    const [updateCanvasOpen, setupdateCanvasOpen] = useState(false)
    const [currentSubjectData, setCurrentSubjectData] = useState([])
    const MySwal = withReactContent(Swal)
    const [searchQuery] = useState([])
    const [currentItems, setCurrentItems] = useState([])
    const [pageCount, setPageCount] = useState(0)
    const [itemOffset, setItemOffset] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(50)
    const itemsCount = [
        {value: 50, label: '50'},
        {value: 100, label: '100'},
        {value: 150, label: '150'},
        {value: 200, label: '200'}
    ]
    const removeSubject = (uuid, slug) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "Do you want to delete the Subject!",
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
                Api.deleteData(`/courses/subjects/${slug}/${uuid}/`, {method: 'Delete'})
                .then((deleteResult) => {
                    if (deleteResult.status === 200) {
                        MySwal.fire({
                            icon: 'success',
                            title: 'Subject Deleted!',
                            text: 'Subject is deleted.',
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
                            title: deleteResult.message ? deleteResult.message : 'Subject can not be deleted!',
                            text: 'Subject is not deleted.',
                            customClass: {
                            confirmButton: 'btn btn-danger'
                            }
                        })
                    }
                        
                    })
            } 
        })
    }
    const toggleCanvasEnd = subjectData => {
        setCurrentSubjectData(subjectData)
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
            setCurrentItems(data.slice(0, itemsPerPage))
            
        } else {
            
            searchQuery[options.key] = options.value
            options.value = {query: searchQuery}
            setItemOffset(0)
            setCurrentItems(searchHelper.searchObj(options))
        }
        
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
        <div className='row  my-1'>
                <Col md={6}>
                <h2>Subjects</h2>
                <span>Showing {itemsPerPage} results per page</span>
                </Col>
                <Col md={4}>
                    <InputGroup className='input-group-merge mb-2'>
                        <InputGroupText>
                            <Search size={14} />
                        </InputGroupText>
                        <Input placeholder='search subject title...'  onChange={e => { getSearch({list: data, key: 'title', value: e.target.value }) } }/>
                    </InputGroup>
                </Col>
                <Col md={2}>
                    <Select 
                    placeholder="Entries"
                    options={itemsCount}
                    onChange={e => {
                        setItemsPerPage(e.value)
                        setItemOffset(0)
                    }}
                    />
                </Col>
            </div>
        <Table striped responsive bordered>
            <thead className='table-dark text-center'>
                <tr>
                    <th>Title </th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
            {currentItems.map((subject, key) => (
                <tr key={key}>
                    <td>{subject.title ? subject.title : <Badge color='light-danger'>N/A</Badge>}</td>
                    <td>{subject.type_title ? subject.type_title : <Badge color='light-danger'>N/A</Badge>}</td>
                    <td>{subject.description ? subject.description : <Badge color='light-danger'>N/A</Badge>}</td>
                    <td>
                        <Row>
                            <Col md={6} className='text-center'>
                            <button
                                className="border-0 no-background"
                                title="Edit Subject"
                                onClick={() => toggleCanvasEnd(subject)}
                                >
                                <Edit color="orange"/>
                            </button>
                            
                            </Col>
                            <Col md={6} className='text-center'>
                            <button
                                className="border-0 no-background"
                                title="Delete Subject"
                                onClick={() => removeSubject(subject.uuid, subject.slug_title)}
                                >
                                <XCircle color="red"/>
                            </button>
                            </Col>
                        </Row>
                    </td>
                </tr>
            ))}
            </tbody>
        </Table>
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
        <Offcanvas direction={updateCanvasPlacement} isOpen={updateCanvasOpen} toggle={toggleCanvasEnd}>
        <OffcanvasHeader toggle={toggleCanvasEnd}></OffcanvasHeader>
        <OffcanvasBody className=''>
            <UpdateSubject subjectData={currentSubjectData} CallBack={CallBack}/>
        </OffcanvasBody>
        </Offcanvas>
    </Fragment>
  )
}

export default SubjectList