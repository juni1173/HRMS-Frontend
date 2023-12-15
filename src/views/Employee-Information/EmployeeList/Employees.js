import { Fragment, useEffect, useState } from "react"
import {  UserMinus, Eye, Search, UserCheck} from "react-feather"
import {Container, Row, Card, CardBody, CardTitle, Badge, InputGroup, Input, InputGroupText, Col, Spinner, Button} from "reactstrap"
import user_blank  from "../../../assets/images/avatars/user_blank.png"
import apiHelper from "../../Helpers/ApiHelper"
import SearchHelper from "../../Helpers/SearchHelper/SearchByObject"
import Masonry from 'react-masonry-component'
import ReactPaginate from 'react-paginate'
import Select from "react-select"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
 
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
                <Col md={6} key={item.uuid}>
                <Card>
                    <CardBody>
                        <div className="row">
                            <div className="col-md-3">
                            <CardTitle tag='h1'> </CardTitle>
                                <Badge color='light-warning'>
                                {item.profile_image ?  <img src={`${Api.BaseUrl}${item.profile_image}`} style={{height: '50px', width: "50px"}} alt="logo" /> : <img src={user_blank} style={{height: '50px', width: "50px"}} alt="logo" />}   
                                </Badge> 
                            </div>
                            <div className="col-md-3">
                                <Badge color='light-info p-0'>
                                    Name
                                </Badge>
                                <br></br>
                                <strong>{item.name ? item.name : <Badge color="light-danger">N/A</Badge>}</strong>
                            </div>
                            <div className="col-md-3">
                                <Badge color='light-success p-0'>
                                    Employee Code
                                </Badge><br></br>
                                <strong>{item.emp_code ? item.emp_code : <Badge color="light-danger">N/A</Badge>}</strong>
                                
                            </div>
                            <div className="col-lg-3 float-right">
                                
                                <div className="float-right">
                                
                                {type === 'active' ? (
                                    <>
                                    <a href={`/employeeDetail/${item.uuid}`}>
                                    <button
                                            className="border-0 no-background"
                                            title="View Employee Detail"
                                            >
                                            <Eye color="green"/>
                                        </button>
                                    </a>
                                    <button
                                        className="border-0 no-background"
                                        title="Deactivate Employee"
                                        onClick={() => removeAction(item.uuid)}
                                        >
                                        <UserMinus color="red"/>
                                    </button>
                                    </>
                                ) : (
                                    <button
                                    className="border-0 no-background"
                                    title="Activate Employee"
                                    onClick={() => activateAction(item.uuid)}
                                    >
                                    <UserCheck color="green"/>
                                </button>
                                )}
                                
                                    
                                </div>
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
    </Fragment>
   )
}
export default Employees