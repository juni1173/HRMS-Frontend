import { Fragment, useEffect, useState } from "react"
import {  Eye, Search} from "react-feather"
import {Container, Card, CardBody, CardTitle, Badge, InputGroup, Input, InputGroupText, Col, Spinner} from "reactstrap"
import user_blank  from "../../../assets/images/avatars/user_blank.png"
import apiHelper from "../../Helpers/ApiHelper"
import SearchHelper from "../../Helpers/SearchHelper/SearchByObject"
import Masonry from 'react-masonry-component'
import ReactPaginate from 'react-paginate'
 
const viewEmployee = () => {
    
    const Api = apiHelper()
    const searchHelper = SearchHelper()
    const [loading, setLoading] = useState(false)
    const [employeeList, setEmployeeList] = useState([])
    const [searchResults, setSearchResults] = useState([])
    const [searchQuery] = useState([])
    const [currentItems, setCurrentItems] = useState([])
    const [pageCount, setPageCount] = useState(0)
    const [itemOffset, setItemOffset] = useState(0)
    const itemsPerPage = 6
    
    const getEmployeeData = async () => {
        setLoading(true)
        await Api.get(`/employees/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    setEmployeeList(result.data)
                    setSearchResults(result.data)
                } else {
                    Api.Toast('error', result.message)
                }
            } else (
             Api.Toast('error', 'Server not responding!')   
            )
        })  
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
        }, [setEmployeeList])

    useEffect(() => {
        const endOffset = itemOffset === 0 ? itemsPerPage : itemOffset + itemsPerPage            
        setCurrentItems(searchResults.slice(itemOffset, endOffset))
        setPageCount(Math.ceil(searchResults.length / itemsPerPage))
        }, [itemOffset, itemsPerPage, searchResults])

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % searchResults.length
        setItemOffset(newOffset)
        }
   return (
    <Fragment>
        <Container>
            <div className='row  my-1'>
                <Col md={6}>
                    <h3>Employee List</h3>
                </Col>
                <Col md={6}>
                    <InputGroup className='input-group-merge mb-2'>
                        <InputGroupText>
                            <Search size={14} />
                        </InputGroupText>
                        <Input placeholder='search employee name...'  onChange={e => { getSearch({list: employeeList, key: 'name', value: e.target.value }) } }/>
                    </InputGroup>
                </Col>
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
                                {item.profile_image ?  <img src={`${Api.BackendBaseLink}${item.profile_image}`} style={{height: '50px', width: "50px"}} alt="logo" /> : <img src={user_blank} style={{height: '50px', width: "50px"}} alt="logo" />}   
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
                                <a href={`/employeeDetail/${item.uuid}`}>
                                <button
                                        className="border-0 no-background"
                                        title="View Employee Detail"
                                        >
                                        <Eye color="green"/>
                                    </button>
                                </a>
                                    
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
export default viewEmployee