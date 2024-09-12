import React, { Fragment, useEffect, useState } from "react"
import {  UserMinus, Eye, Search, UserCheck, Settings, FileText, MoreVertical, Compass} from "react-feather"
import {Container, Row, Card, CardBody, CardTitle, Badge, InputGroup, Input, InputGroupText, Col, Spinner, Button, Offcanvas, OffcanvasHeader, OffcanvasBody,  Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Modal, ModalBody, ModalHeader} from "reactstrap"
import user_blank  from "../../../assets/images/avatars/user_blank.png"
import apiHelper from "../../Helpers/ApiHelper"
import SearchHelper from "../../Helpers/SearchHelper/SearchByObject"
import Masonry from 'react-masonry-component'
import ReactPaginate from 'react-paginate'
import Select from "react-select"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import ESS from '../ESS-Scripts/index'
import Preview from "../../emp_resume/Preview"
// import AssignModel from "../../WorkModels/WorkingModelAssign/Assign"
const Employees = ({ employeeList, CallBack, type }) => {
    
    const Api = apiHelper()
    const MySwal = withReactContent(Swal)
    const searchHelper = SearchHelper()
    const [loading, setLoading] = useState(false)
    const [searchResults, setSearchResults] = useState([])
    const [searchQuery] = useState([])
    const [currentItems, setCurrentItems] = useState([])
    const [pageCount, setPageCount] = useState(0)
    const [itemOffset, setItemOffset] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(50)
    const [canvasPlacement, setCanvasPlacement] = useState('end')
    const [canvasOpen, setCanvasOpen] = useState(false)
    const [canvas, setcanvas] = useState('')
    const [empID, setEmpID] = useState('')
    const [dropdownOpen, setDropdownOpen] = useState({})
    // const [modal, setModal] = useState(false)
    // const toggle = () => setModal(!modal)
    const toggleDropdown = (itemId) => {
      setDropdownOpen((prevState) => ({
        ...prevState,
        [itemId]: !prevState[itemId]
      }))
    }
    //Resume
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [summary, setSummary] = useState('')
  const [accomplishments, setAccomplishments] = useState([{ company: '', accomplishment: '' }])
  const [experiences, setExperiences] = useState([{ company: '', title: '', startDate: '', endDate: '', points: [''] }])
  const [educations, setEducations] = useState([{ university: '', degree: '', startDate: '', endDate: '' }])
    const itemsCount = [
        {value: 50, label: '50'},
        {value: 100, label: '100'},
        {value: 150, label: '150'},
        {value: 200, label: '200'}
    ]
    const getEmployeeData = async () => {
        setLoading(true)
            if (employeeList && Object.values(employeeList).length > 0) {
                    setSearchResults(employeeList)
            } 
        setTimeout(() => {
            setLoading(false)
        }, 500)
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
    const toggleCanvasEnd = () => {
        setCanvasPlacement('end')
        setCanvasOpen(!canvasOpen)
      }
    // const handleworkingmodel = (id) => {
    //     setEmpID(id)
    //     toggle()
    // }
    const ESSToggle = (id, canvasvalue) => {
        console.log(canvas)
        if (canvasvalue === 'ESS') {
        if (id !== null) {
            setEmpID(id)
        }
    } else if (canvasvalue === 'Resume') {
        const formdata = new FormData()
        formdata['employee_id'] = id
         Api.jsonPost(`/employees/view/resume/`, formdata).then((response) => {
            // debugger
                if (response.status === 200) {
                    const resumeData = JSON.parse(response.data[0].resume_data)
                    setName(resumeData.name)
                    setLocation(resumeData.location)
                    setMobile(resumeData.mobile)
                    setEmail(resumeData.email)
                    setSummary(resumeData.summary)
                    setAccomplishments(resumeData.accomplishments)
                    setExperiences(resumeData.experiences)
                    setEducations(resumeData.educations)
                } else {
                //   Api.Toast('error', response.message)
                }
              })
    }
        setCanvasPlacement('end')
        setCanvasOpen(!canvasOpen)

      }
    useEffect(() => {
        getEmployeeData()
        }, [setSearchResults])

    useEffect(() => {
        const endOffset = itemOffset === 0 ? itemsPerPage : itemOffset + itemsPerPage            
        setCurrentItems(searchResults.slice(itemOffset, endOffset))
        setPageCount(Math.ceil(searchResults.length / itemsPerPage))
        }, [itemOffset, itemsPerPage, searchResults])

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % searchResults.length
        setItemOffset(newOffset)
        }
    const removeAction = (uuid) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "Do you want to deactivate this employee!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Deactivate!',
            customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-danger ms-1'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.value) {
                Api.deleteData(`/employees/${uuid}/`, {method: 'Delete'})
                .then((deleteResult) => {
                    if (deleteResult.status === 200) {
                        MySwal.fire({
                            icon: 'success',
                            title: 'Employee Deactivated!',
                            text: 'Employee is deactivated.',
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
                            title: 'Employee cannot be deactivated!',
                            text: deleteResult.message ? deleteResult.message : 'Employee is not deactivated.',
                            customClass: {
                            confirmButton: 'btn btn-danger'
                            }
                        })
                    }
                            
                    })
            } 
        })
    }
    const activateAction = (uuid) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "Do you want to activate this employee!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Activate!',
            customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-danger ms-1'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.value) {
                Api.get(`/employees/activate/${uuid}/`)
                .then((deleteResult) => {
                    if (deleteResult.status === 200) {
                        MySwal.fire({
                            icon: 'success',
                            title: 'Employee Activated!',
                            text: 'Employee is activated.',
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
                            title: 'Employee cannot be activated!',
                            text: deleteResult.message ? deleteResult.message : 'Employee is not activated.',
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
        <Container>
            <div className='row  my-1'>
                <Col md={3}>
                    <h3>Employee List</h3>
                    <span>Showing {Object.values(currentItems).length > 0 ? itemsPerPage : 0} results per page</span>
                </Col>
                <Col md={4}>
                    <InputGroup className='input-group-merge mb-2'>
                        <InputGroupText>
                            <Search size={14} />
                        </InputGroupText>
                        <Input placeholder='search employee name...'  onChange={e => { getSearch({list: employeeList, key: 'name', value: e.target.value }) } }/>
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
                {type === 'active' && (
                    <Col md={3}>
                        <a href="/employeeInformation">
                            <Button className='btn btn-success'>
                                Add Employee
                            </Button>
                        </a>
                    </Col>
                )}
            </div>
        </Container>
        <Container>
        <Masonry className="row js-animation">
            {!loading ? (
            Object.values(currentItems).length > 0 ? (
            Object.values(currentItems).map((item) => (
                <Col md={3} key={item.uuid}>
                 <Card>
                    <CardBody>
                        <div className="row">
                        <div className="col-md-12 d-flex justify-content-end">
                            <Dropdown  isOpen={dropdownOpen[item.uuid]} toggle={() => toggleDropdown(item.uuid)} direction="end">
                                {/* <DropdownToggle className="no-background m-0 px-0"> */}
                                <div onClick={() => toggleDropdown(item.uuid)}><MoreVertical/></div>
        {/* </DropdownToggle> */}
        <DropdownMenu>
          <DropdownItem>{type === 'active' ? (
                                    <>
                                    <a href={`/employeeDetail/${item.uuid}`}>
                                    <button
                                            className="border-0 no-background"
                                            title="View Employee Detail"
                                            >
                                           <span className="mr-1"><Eye size={12}/></span>Profile
                                        </button>
                                    </a>
                                    </>
                                ) : (
                                    <button
                                    className="border-0 no-background"
                                    title="Activate Employee"
                                    onClick={() => activateAction(item.uuid)}
                                    >
                                    <span className="mr-1"><UserCheck size={12}/></span> Activate
                                </button>
                                )}</DropdownItem>
      {type === 'active' ? <DropdownItem>
              <button
                                        className="border-0 no-background"
                                        title="Deactivate Employee"
                                        onClick={() => removeAction(item.uuid)}
                                        >
                                        <span className="mr-1"><UserMinus size={12}/></span>Inactive
                                    </button> 
         </DropdownItem> : null}
         {/* {type === 'active' ? <DropdownItem>
              <button
                                        className="border-0 no-background"
                                        title="Set Working Model"
                                        onClick={() => handleworkingmodel(item.id)}
                                        >
                                        <span className="mr-1"><UserMinus size={12}/></span>Set Working Model
                                    </button> 
         </DropdownItem> : null} */}
         <DropdownItem>
         <button
                                        className="border-0 no-background text-nowrap"
                                        // style={{marginTop:'15px', padding:'10px'}}
                                        title="ESS Setup"
                                        onClick={() => {
                                            setcanvas('ESS')
                                            ESSToggle(item.id, 'ESS')
                                        }}
                                        >
                                        <span className="mr-1"><Settings size={12}/></span>ESS Setup
                                    </button>
         </DropdownItem>
         <DropdownItem>
         <button
                                        className="border-0 no-background"
                                        // style={{marginTop:'15px', padding:'10px'}}
                                        title="Resume"
                                        onClick={() => {
                                            setcanvas('Resume')
                                            ESSToggle(item.id, 'Resume')
                                        }}
                                        >
                                        <span className="mr-1"><FileText size={12}/> </span>Resume
                                    </button>
         </DropdownItem>
        </DropdownMenu>
      </Dropdown> 
                            </div>
                            <div className="col-md-12 d-flex justify-content-center" style={{marginTop: -30}}>
  {item.profile_image ?   <div className="rounded-circle overflow-hidden border border-secondary" style={{height: '70px', width: '70px'}}>
      <img src={`${Api.BaseUrl}${item.profile_image}`} className="w-100 h-100 object-fit-cover" alt="logo" />
    </div>  : <div className="rounded-circle overflow-hidden border border-secondary" style={{height: '70px', width: '70px'}}>
      <img src={user_blank} className="w-100 h-100 object-fit-cover" alt="logo" />
    </div>
  }   
                            </div>
                            
                            <div className="col-md-12 d-flex justify-content-center mt-1">
                                <strong className="text-nowrap">{item.name ? item.name : <Badge color="light-danger">N/A</Badge>}</strong>
                            </div>
                            <div className="col-md-12 d-flex justify-content-center">
                                @{item.position_title ? item.position_title : <Badge color="light-danger">N/A</Badge>}
                            </div>  
                        </div>
                    </CardBody>
                </Card> 
                </Col>
            ))) : (
                <Col md={12}>
                    <Card>
                        <CardBody>
                            No employee found!
                        </CardBody>
                    </Card>
                </Col>
            )) : (
                <div className="text-center"><Spinner /></div>
            )
            }
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
        <Offcanvas direction={canvasPlacement} isOpen={canvasOpen} toggle={toggleCanvasEnd} >
          <OffcanvasHeader toggle={toggleCanvasEnd}></OffcanvasHeader>
          <OffcanvasBody className=''>
            {canvas === 'ESS' ? <ESS id={empID}/> : null}
            {canvas === 'Resume' ? <Preview name={name} location={location} mobile={mobile} email={email} summary={summary} accomplishments={accomplishments} experiences={experiences} educations={educations}/>  : null}
          </OffcanvasBody>
        </Offcanvas>
        {/* <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Modal title</ModalHeader>
        <ModalBody>
            <AssignModel employee={empID} CallBack={toggle}/>
        </ModalBody>
        </Modal> */}
    </Fragment>
   )
}
export default Employees