import { Fragment, useEffect, useState } from 'react'
import { Download, Eye, Search, Trash2, Upload } from 'react-feather'
import { Card, CardBody, Label, Row, Col, Button, Badge, InputGroup, Input, InputGroupText, Modal, ModalHeader, ModalBody, ModalFooter, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import SearchHelper from '../../../../Helpers/SearchHelper/SearchByObject'
import apiHelper from '../../../../Helpers/ApiHelper'
const Assignments = ({ data, CallBack }) => {
    const Api = apiHelper()
    const searchHelper = SearchHelper()
    const [searchResults, setSearchResults] = useState(data.training_assignments)
    const [searchQuery] = useState([])
    const [basicModal, setBasicModal] = useState(false)
    const [file, setFile] = useState('')
    const [assignment_id, setAssignmentId] = useState('')
    const [uploadedAssignmentList, setUploadedAssignmentList] = useState([])
    const [active, setActive] = useState('1')

    const toggle = tab => {
      if (active !== tab) {
        setActive(tab)
      }
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
        if (assignment_id !== '' && file !== '') {
            const formData = new FormData()
            formData.append("training_assignment", assignment_id)
            formData.append("submitted_assignment", file)
            await Api.jsonPost(`/training/assignment/upload/by/employee/`, formData, false).then(result => {
                if (result) {
                    if (result.status === 200) {
                        Api.Toast('success', result.message)
                        setBasicModal(!basicModal)
                        CallBack()
                    } else {
                        Api.Toast('error', result.message)
                    }
                } else {
                    Api.Toast('error', 'Server Error!')
                }
            })
        } else {
            Api.Toast('error', 'Please fill all the required fields!')
        }
    }
   const uploadAssignment = id => {
    if (id) setAssignmentId(id)
    setBasicModal(!basicModal)
   }
   const uploadedAssignments = async () => {
    const response = await Api.get(`/training/assignment/upload/by/employee/${Api.user_id}/`)
      if (response.status === 200) {
        const responseData = response.data
        setUploadedAssignmentList(responseData)
         
      } else {
          return Api.Toast('error', 'Data not found')
      }
   }
   useEffect(() => {
    uploadedAssignments()
    }, [setUploadedAssignmentList])
  return (
    <Fragment>
            <Row>
                {/* <Col md={6}>
                    <h2>Assignments Details</h2>
                </Col> */}
                <Nav tabs>
                    <NavItem>
                    <NavLink
                        active={active === '1'}
                        onClick={() => {
                        toggle('1')
                        }}
                    >
                        Training Assignments
                    </NavLink>
                    </NavItem>
                    <NavItem>
                    <NavLink
                        active={active === '2'}
                        onClick={() => {
                        toggle('2')
                        }}
                    >
                        Uploaded Assignments
                    </NavLink>
                    </NavItem>
                </Nav>
                <TabContent className='py-50' activeTab={active}>
                    <TabPane tabId='1'>
                    <Col md={12} className='my-2'>
                        <>
                        <InputGroup className='input-group-merge mb-2'>
                            <InputGroupText>
                            <Search size={14} />
                            </InputGroupText>
                            <Input placeholder='search Assignment title...' onChange={e => { getSearch({list: data, key: 'title', value: e.target.value }) } }/>
                        </InputGroup>
                        {searchResults && searchResults.length > 0 ? (
                            searchResults.map((assignment, key) => (
                                <Card key={key} className="dark-shadow">
                                    <CardBody>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h4>{assignment.title ? assignment.title : 'No title found'}</h4>
                                            <Badge>{assignment.updated_at ? Api.formatDate(assignment.updated_at) : 'N/A'}</Badge>
                                            <Badge className='m-1'>{assignment.marks ? assignment.marks : 'N/A'}</Badge>
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
                                                    title="Upload"
                                                    >
                                                    <Button className='btn btn-primary' onClick={() => uploadAssignment(assignment.id)}>Upload</Button>
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
                    </TabPane>
                    <TabPane tabId='2'>
                    {uploadedAssignmentList && uploadedAssignmentList.length > 0 ? (
                            uploadedAssignmentList.map((assignment, key) => (
                                <Card key={key} className="dark-shadow">
                                    <CardBody>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h4>{assignment.title ? assignment.title : 'No title found'}</h4>
                                            <Badge>{assignment.updated_at ? Api.formatDate(assignment.updated_at) : 'N/A'}</Badge>
                                            <Badge className='m-1'>{assignment.marks ? assignment.marks : 'N/A'}</Badge>
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
                    </TabPane>
                
                </TabContent>
                
            </Row>
            <Modal isOpen={basicModal} toggle={() => setBasicModal(!basicModal)}>
                <ModalHeader toggle={() => setBasicModal(!basicModal)}>Add new Assignment</ModalHeader>
                <ModalBody>
                   <Row>
                  
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