import { Fragment, useState } from 'react'
import { Download, Eye, Search, Trash2 } from 'react-feather'
import { Card, CardBody, Label, Row, Col, Button, Badge, InputGroup, Input, InputGroupText, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import SearchHelper from '../../../../../Helpers/SearchHelper/SearchByObject'
import apiHelper from '../../../../../Helpers/ApiHelper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const Assignments = ({ data, training_id, CallBack }) => {
    const Api = apiHelper()
    const searchHelper = SearchHelper()
    const MySwal = withReactContent(Swal)
    const [searchResults, setSearchResults] = useState(data)
    const [searchQuery] = useState([])
    const [basicModal, setBasicModal] = useState(false)
    const [title, setTitle] = useState('')
    const [file, setFile] = useState('')
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
            setSearchResults(searchHelper.searchObj(options))
            
        } else {
            
            searchQuery[options.key] = options.value
            options.value = {query: searchQuery}
            setSearchResults(searchHelper.searchObj(options))
        }
        
    }
    const imageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
          setFile(e.target.files[0]) 
        }
    }
    const addAssignment = async () => {
        if (title !== '' && file !== '') {
            const formData = new FormData()
            formData.append("title", title)
            formData.append("assignment", file)
            await Api.jsonPost(`/training/assignment/${training_id}/`, formData, false).then(result => {
                if (result) {
                    if (result.status === 200) {
                        Api.Toast('success', result.message)
                        setBasicModal(!basicModal)
                        CallBack()
                    }
                } else {
                    Api.Toast('error', 'Server Error!')
                }
            })
        } else {
            Api.Toast('error', 'Please fill all the required fields!')
        }
    }
    const deleteAssignment = (id) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "Do you want to delete the Assignment!",
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
                Api.deleteData(`/training/assignment/id/${id}/`, {method:'delete'})
                .then((deleteResult) => {
                    if (deleteResult.status === 200) {
                        MySwal.fire({
                            icon: 'success',
                            title: 'Assignment Deleted!',
                            text: 'Assignment is Deleted.',
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
                            title: deleteResult.message ? deleteResult.message : 'Assignment can not be Deleted!',
                            text: 'Assignment is not Deleted.',
                            customClass: {
                            confirmButton: 'btn btn-danger'
                            }
                        })
                    }
                        
                    })
            } 
        })
    }
  return (
    <Fragment>
            <Row>
                <Col md={6}>
                    <h2>Assignments Details</h2>
                </Col>
                {training_id && (
                    <Col md={6}>
                    <Button className='btn btn-success float-right' onClick={() => setBasicModal(!basicModal)}>Add Assignment</Button>
                </Col>
                )}
                <Col md={12} className='my-2'>
                        <>
                        <InputGroup className='input-group-merge mb-2'>
                            <InputGroupText>
                            <Search size={14} />
                            </InputGroupText>
                            <Input placeholder='search title...' onChange={e => { getSearch({list: data, key: 'title', value: e.target.value }) } }/>
                        </InputGroup>
                        {searchResults && searchResults.length > 0 ? (
                            searchResults.map((assignment, key) => (
                                <Card key={key}>
                                    <CardBody>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h4>{assignment.title ? assignment.title : 'No title found'}</h4>
                                            <Badge>{assignment.updated_at ? Api.formatDate(assignment.updated_at) : 'N/A'}</Badge>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="float-right">
                                                <button
                                                    className="border-0 no-background"
                                                    title="View"
                                                    >
                                                    <a href={`${process.env.REACT_APP_PUBLIC_URL}${assignment.assignment}`} target="_blank" ><Eye color="green"/></a>
                                                </button>
                                                <button
                                                    className="border-0 no-background"
                                                    title="Download"
                                                    >
                                                    <a href={`${process.env.REACT_APP_PUBLIC_URL}${assignment.assignment}`} target="_blank" rel="noopener noreferrer" download><Download color="orange"/></a>
                                                </button>
                                                <button
                                                    className="border-0 no-background"
                                                    title="Delete"
                                                    onClick={() => deleteAssignment(assignment.id)}
                                                    >
                                                    <Trash2 color="red"/>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    </CardBody>
                                </Card>
                            ))
                        ) : (
                            <div className='my-2'>
                                No Assignment Found!
                            </div>
                        )}
                    </>
                </Col>
            </Row>
            <Modal isOpen={basicModal} toggle={() => setBasicModal(!basicModal)}>
                <ModalHeader toggle={() => setBasicModal(!basicModal)}>Add new Assignment</ModalHeader>
                <ModalBody>
                   <Row>
                   <Col md="6" className="mb-1">
                        <Label className="form-label">
                        Title<Badge color='light-danger'>*</Badge>
                        </Label>
                        <Input
                            type="text"
                            name="title"
                            onChange={ (e) => setTitle(e.target.value)}
                            placeholder="Title"
                            />
                    </Col>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                        File<Badge color='light-danger'>*</Badge>
                        </Label>
                        <Input
                            type="file"
                            id="assignment"
                            name="assignment"
                            accept="image/*"
                            onChange={imageChange}
                            />
                    </Col>
                   </Row>
                </ModalBody>
                <ModalFooter>
                    <Button color='primary' onClick={() => addAssignment()}>
                    Submit
                    </Button>
                </ModalFooter>
            </Modal>
    </Fragment>
  )
}

export default Assignments