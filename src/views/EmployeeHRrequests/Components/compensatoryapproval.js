import { Fragment, useState, useEffect } from 'react'
import { Row, Col, Card, CardBody, CardTitle, CardSubtitle, Spinner, Input, Label, Badge, Button, InputGroup, InputGroupText } from "reactstrap" 
import { Edit, FileText, XCircle, Search } from 'react-feather'
import Select from 'react-select'
import apiHelper from '../../Helpers/ApiHelper'
import SearchHelper from '../../Helpers/SearchHelper/SearchByObject'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import ReactPaginate from 'react-paginate'
const Approval = () => {
    const status_choices = [
            {value: 'pending by team lead', label: 'pending by team lead'},
            {value: 'approved by team lead', label: 'approved by team lead'},
            {value: 'rejected by team lead', label: 'rejected by team lead'}
]
    const Api = apiHelper() 
    const MySwal = withReactContent(Swal)
    const [loading, setLoading] = useState(false)
    const [searchResults, setSearchResults] = useState([])
    const [searchQuery] = useState([])
    const [currentItems, setCurrentItems] = useState([])
    const [data, setData] = useState([])
    const [pageCount, setPageCount] = useState(0)
    const [itemOffset, setItemOffset] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(50)
    const searchHelper = SearchHelper()
    // const [selectedItems, setSelectedItems] = useState([])
    const preDataApi = async () => {
        // const formData = new FormData()
        // formData['year'] = yearvalue
        // formData['month'] = monthvalue
        const response = await Api.jsonPost('/reimbursements/tl/compensatory/list/')
        if (response.status === 200) {
            setData(response.data)
        } else {
            return Api.Toast('error', 'Data not found')
        }
    }
    const CallBack = () => {
        preDataApi()
    }
   
      const itemsCount = [
        {value: 50, label: '50'},
        {value: 100, label: '100'},
        {value: 150, label: '150'},
        {value: 200, label: '200'}
    ]
    const getSearch = options => {

        if (options.value === '' || options.value === null || options.value === undefined || options.value === 0) {

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
            console.log(searchHelper.searchObj(options))
        }
    }
    const onStatusUpdate = async (id, status_value) => {
            MySwal.fire({
                title: 'Are you sure?',
                text: "Do you want to update the Status!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, update it!',
                customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-danger ms-1'
                },
                buttonsStyling: false
            }).then(function (result) {
                if (result.value) {
                    const formData = new FormData()
                    formData['team_lead_approval'] = status_value
                    // if (comment !== '') formData['decision_reason'] = comment
                     Api.jsonPatch(`/reimbursements/tl/update/compensatory/${id}/`, formData)
                        .then((result) => {
                            if (result.status === 200) {
                                MySwal.fire({
                                    icon: 'success',
                                    title: 'Status Updated!',
                                    text: 'Status is updated.',
                                    customClass: {
                                    confirmButton: 'btn btn-success'
                                    }
                                }).then(async function (result) {
                                    if (result.isConfirmed) {
                                        setLoading(true)
                                        await CallBack()
                                        setTimeout(() => {
                                            setLoading(false)
                                        }, 1000)
                                    }
                                })
                                } else {
                                    MySwal.fire({
                                        title: 'Error',
                                        text: result.message ? result.message : 'Something went wrong',
                                        icon: 'error',
                                        customClass: {
                                          confirmButton: 'btn btn-success'
                                        }
                                      })
                                }
                        })
                } 
            })
        }
    const StatusComponent = ({ item, index }) => {
        const [toggleThisElement, setToggleThisElement] = useState(false)
        // const [comment, setComment] = useState('')
        const [statusValue, setStatusValue] = useState('')
        return (
            <div className="single-history" key={index}>
            
            {toggleThisElement ? (
                <div className="row min-width-300">
                <div className="col-lg-8">
                <Select
                    isClearable={false}
                    options={status_choices}
                    className='react-select mb-1'
                    classNamePrefix='select'
                    defaultValue={status_choices.find(({value}) => value === item.team_lead_approval) ? status_choices.find(({value}) => value === item.team_lead_approval) : status_choices[0] }
                    onChange={(statusData) => setStatusValue(statusData.value)}
                    />
                    {/* {((statusValue === 'not-approved') || (statusValue === 'approved')) && (
                        <>
                        <Label>
                        Comment
                    </Label>
                    <Input 
                        type='textarea'
                        className='mb-1'
                        name='commentText'
                        placeholder="Add Remarks"
                        onChange={ (e) => { setComment(e.target.value) }}
                    />
                    </>
                    ) 
                    } */}
                    
                    <Button className="btn btn-primary" onClick={ async () => {
                        await onStatusUpdate(item.id, statusValue).then(() => {
                            setToggleThisElement((prev) => !prev)
                        })
                    }}>
                        Submit
                    </Button>
                </div>
                <div className="col-lg-4 float-right">
                <XCircle color="red" onClick={() => setToggleThisElement((prev) => !prev)}/>
                </div>
            </div>
            ) : (
                <div className="row min-width-225">
                    <div className="col-lg-8">
                    <h3><Badge color='light-secondary'>{status_choices.find(({value}) => value === item.team_lead_approval) ? status_choices.find(({value}) => value === item.team_lead_approval).label : status_choices[0].label }</Badge></h3>
                    </div>
                    
                    <div className="col-lg-4 float-right">
                        <Edit color="orange" onClick={() => setToggleThisElement((prev) => !prev)}/>
                     </div>
                </div>
            )
                
            }
            </div>
        )
        }
       
        useEffect(() => {
            setLoading(true)
            setSearchResults(data)
            getSearch({ list: data, value: null, type: 'equal' })
            setTimeout(() => {
                setLoading(false)
            }, 1000)
        }, [data])
useEffect(() => {
preDataApi()
}, [setData])
        useEffect(() => {
            if (searchResults && Object.values(searchResults).length > 0) {
                const endOffset = itemOffset === 0 ? itemsPerPage : itemOffset + itemsPerPage            
                setCurrentItems(searchResults.slice(itemOffset, endOffset))
                setPageCount(Math.ceil(searchResults.length / itemsPerPage))
            }
            }, [itemOffset, itemsPerPage, searchResults])
            
        const handlePageClick = (event) => {
            const newOffset = (event.selected * itemsPerPage) % searchResults.length
            setItemOffset(newOffset)
            }
            // const handleCheckboxChange = (itemId) => {
            //     if (selectedItems.length < 5) {
            //     // Step 3
            //     const updatedSelection = [...selectedItems]
            
            //     if (updatedSelection.includes(itemId)) {
            //       updatedSelection.splice(updatedSelection.indexOf(itemId), 1)
            //     } else {
            //       updatedSelection.push(itemId)
            //     }
            //     setSelectedItems(updatedSelection)
            // } else {
            //     Api.Toast('error', 'You can select only 5 records ')
            // }
            //   }
  return (
    <Fragment>
        <Row>
        <Col md={12}>
        <div className='content-header' >
          <h5 className='mb-2'>Compensatory Leave Requests</h5>
          </div>
        </Col>
        
        <Col md={3}>
            <Label>
                Search Status
            </Label>
            <Select
                isClearable={true}
                options={status_choices}
                className='react-select mb-1'
                classNamePrefix='select'
                onChange={e => {
                            if (e) {
                            getSearch({list: data, key: 'team_lead_approval', value: e.value, type: 'equal' }) 
                            } else {
                                getSearch({list: data, key: 'team_lead_approval', value: '' }) 
                            }
                        } 
                    }
            />
                
        </Col>
        <Col md={3}>
            <span>Showing {currentItems && Object.values(currentItems).length > 0 ? itemsPerPage : 0} results</span>
            <Select 
                placeholder="Entries"
                options={itemsCount}
                onChange={e => {
                    setItemsPerPage(e.value)
                    setItemOffset(0)
                }}
            />
        </Col>
        <Col md={6}>
<Label>Serach Employee</Label>
                    <InputGroup className='input-group-merge mb-2'>
                        <InputGroupText>
                            <Search size={14} />
                        </InputGroupText>
                        <Input placeholder='search employee name...'  onChange={e => { getSearch({list: data, key: 'employee_name', value: e.target.value }) } }/>
                    </InputGroup>
                </Col>
                <Col md={6}>
                {/* {selectedItems.length > 0 ?  <div>
                <Label>Select Status</Label>
                <Select
                 isClearable={true}
                 options={status_choices}
                 className='react-select mb-1'
                 classNamePrefix='select'
                 placeholder="Select Status"
                 onChange={(selectedOption) => {
                     if (selectedOption !== null) {
                        const formData = new FormData()
                        formData['gym_array'] = selectedItems
                        formData['status'] = selectedOption.value
                        Api.jsonPatch(`/reimbursements/update/multi/gym/allowance/status/`, formData)
                        .then((result) => {
                            if (result.status === 200) {
                                MySwal.fire({
                                    icon: 'success',
                                    title: 'Status Updated!',
                                    text: 'Status is updated.',
                                    customClass: {
                                    confirmButton: 'btn btn-success'
                                    }
                                }).then(async function (result) {
                                    if (result.isConfirmed) {
                                        setLoading(true)
                                        await CallBack()
                                        setTimeout(() => {
                                            setLoading(false)
                                        }, 1000)
                                    }
                                })
                                } else {
                                    MySwal.fire({
                                        title: 'Error',
                                        text: result.message ? result.message : 'Something went wrong',
                                        icon: 'error',
                                        customClass: {
                                          confirmButton: 'btn btn-success'
                                        }
                                      })
                                }
                        })   
                     } 
             
               }}
             /></div>  : null} */}
             </Col>
            <Col md={12}>
        
        {!loading ? (
                <>
            {(currentItems && Object.values(currentItems).length > 0) ? (
                <Row>
                 <Col md={12}>
                 {Object.values(currentItems).map((item, index) => (
                            <Card key={index}>
                            <CardBody>
                                <div className="row">
                             
                       
                                    <div className="col-md-3">
                                      
                                {/* <Input
                               
                          type="checkbox"
                          onChange={() => handleCheckboxChange(item.id)}
                          checked={selectedItems.includes(item.id)}
                        />  */}
                        
                                    <CardTitle tag='h1'>{item.employee_name ? item.employee_name : <Badge color='light-danger'>N/A</Badge>}</CardTitle>
                                    <CardSubtitle>
                                        <h4><Badge color='light-warning'>{item.date ? item.date : <Badge color='light-danger'>N/A</Badge>}</Badge></h4></CardSubtitle>
                                    </div>
                                    <div className="col-md-8">
                                    <div className="mb-1">
                                        <StatusComponent item={item} key={index}/>
                                        </div>     
                                    </div>
                                    <div className='col-md-12'>
                                        Jira Ticket : <Badge color='light-warning'>{item.jira_ticket ? item.jira_ticket : <Badge color='light-danger'>N/A</Badge>}</Badge>
                                    </div>
                                    <div className='col-md-12'>
                                        Reason : <Badge color='light-warning'>{item.reason ? item.reason : <Badge color='light-danger'>N/A</Badge>}</Badge>
                                    </div>
                                   
                                </div>
                                    
                            </CardBody>
                            </Card> 
                        ))}
                    </Col>   
            </Row>
            ) : (
                <div className="text-center">No Compensatory Leave Request Data Found!</div>
            )
            
            }
                </>
            ) : (
                <div className="text-center"><Spinner /></div>
            )
            
       }
        <hr></hr>
            </Col>
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
        </Row>
        
    </Fragment>
  )
}

export default Approval