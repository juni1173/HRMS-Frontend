import { Fragment, useState, useEffect } from 'react'
import { Row, Col, Card, CardBody, CardTitle, CardSubtitle, Spinner, Input, Label, Badge, Button, InputGroup, InputGroupText } from "reactstrap" 
import { Edit, XCircle, Search } from 'react-feather'
import Select from 'react-select'
import apiHelper from '../../Helpers/ApiHelper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import SearchHelper from "../../Helpers/SearchHelper/SearchByObject"
const PF = ({ status_choices, yearoptions }) => {
    const currentDate = new Date()
    // Get the current month and year
    const currentMonth = currentDate.getMonth() + 1 // Month is zero-based, so add 1
    const currentYear = currentDate.getFullYear() 
    const Api = apiHelper()
    const MySwal = withReactContent(Swal)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [yearvalue, setyearvalue] = useState()
    const [monthvalue, setmonthvalue] = useState()
    const [searchResults, setSearchResults] = useState([])
    const [searchQuery] = useState([])
    const [currentItems, setCurrentItems] = useState([])
    const searchHelper = SearchHelper()
    const monthNames = [
        {value: currentMonth, label: 'Select Month'},
        {value: 1, label: "January"},
        {value: 2, label: "February"},
        {value: 3, label: "March"},
        {value: 4, label: "April"},
        {value: 5, label: "May"},
        {value: 6, label: "June"},
        {value: 7, label: "July"},
        {value: 8, label: "August"},
        {value: 9, label: "September"},
        {value: 10, label: "October"},
        {value: 11, label: "November"},
        {value: 12, label: "December"}
      ]
    const preDataApi = async () => {
        const formData = new FormData()
        formData['year'] = yearvalue
        formData['month'] = monthvalue
        const response = await Api.jsonPost('/reimbursements/employee/requests/pf/data/', formData)
        if (response.status === 200) {
            setData(response.data)
        } else {
            return Api.Toast('error', 'Pre server data not found')
        }
    }
useEffect(() => {
preDataApi()
}, [setData, monthvalue, yearvalue])
const CallBack = () => {
    preDataApi()
}
const getSearch = options => {
    // console.warn(options)
    if (options.value === '' || options.value === null || options.value === undefined || options.value === 0) {
        if (options.key in searchQuery) {
            delete searchQuery[options.key]
        } 
        if (Object.values(searchQuery).length > 0) {
            options.value = {query: searchQuery}
        } else {
            options.value = {}
        }
        
        // setItemOffset(0)
        setSearchResults(searchHelper.searchObj(options))
        setCurrentItems(searchHelper.searchObj(options))
        
    } else {
        
        searchQuery[options.key] = options.value
        options.value = {query: searchQuery}
        // setItemOffset(0)
        setSearchResults(searchHelper.searchObj(options))
        setCurrentItems(searchHelper.searchObj(options))
    }
    return false
}
useEffect(() => {
    if (searchResults && Object.values(searchResults).length > 0) {
        // const endOffset = itemOffset === 0 ? itemsPerPage : itemOffset + itemsPerPage            
        setCurrentItems(searchResults)
        // setPageCount(Math.ceil(searchResults.length / itemsPerPage))
    }
    }, [searchResults])
    const onStatusUpdate = async (id, status_value, comment) => {
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
                formData['status'] = status_value
                if (comment !== '') formData['decision_reason'] = comment
                 Api.jsonPatch(`/reimbursements/update/provident-fund/status/${id}/`, formData)
                    .then((result) => {
                        if (result.status === 200) {
                            MySwal.fire({
                                icon: 'success',
                                title: 'Status Updated!',
                                text: 'Status is updated.',
                                customClass: {
                                confirmButton: 'btn btn-success'
                                }
                            }).then(function (result) {
                                if (result.isConfirmed) {
                                    setLoading(true)
                                    CallBack()
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
    const [comment, setComment] = useState('')
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
                defaultValue={status_choices.find(({value}) => value === item.status) ? status_choices.find(({value}) => value === item.status) : status_choices[0] }
                onChange={(statusData) => setStatusValue(statusData.value)}
                />
                {((statusValue === 'not-approved') || (statusValue === 'approved')) && (
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
                }
                
                <Button className="btn btn-primary" onClick={ async () => {
                    await onStatusUpdate(item.id, statusValue, comment).then(() => {
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
                <h3><Badge color='light-secondary'>{status_choices.find(({value}) => value === item.status) ? status_choices.find(({value}) => value === item.status).label : status_choices[0].label }</Badge></h3>
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
  return (
    <Fragment>
    <Row>
        <Col md={12}>
     <div className='content-header' >
      <h5 className='mb-2'>PF Requests</h5>
    </div>
    </Col>
    <Col md={3}>
            <Label>Select Year</Label>
            <Select
                isClearable={true}
                options={yearoptions}
                className='react-select mb-1'
                classNamePrefix='select'
                placeholder="Select Year"
                onChange={(selectedOption) => {
                    if (selectedOption !== null) {
                        setyearvalue(selectedOption.value)
                    } else {  
                        setyearvalue(currentYear)
                    }
            
              }}
            />
</Col>
        <Col md={3}>
            <Label>Search Month</Label>
            <Select
                isClearable={true}
                options={monthNames}
                className='react-select mb-1'
                classNamePrefix='select'
                onChange={(selectedOption) => {
                    if (selectedOption !== null) {
                        setmonthvalue(selectedOption.value)
                    } else {  
                        setmonthvalue(currentMonth)
                    }
            
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
    {!loading ? (
            <>
        {(data && Object.values(data).length > 0) ? (
            <Row>
             <Col md={12}>
             {Object.values(currentItems).map((item, index) => (
                        <Card key={index}>
                        <CardBody>
                            <div className="row">
                               
                                <div className="col-md-4">
                                <CardTitle tag='h1'>{item.employee_name ? item.employee_name : <Badge color='light-danger'>N/A</Badge>}</CardTitle>
                                <CardSubtitle>
                                    <h4><Badge color='light-warning'>{item.date ? item.date : <Badge color='light-danger'>N/A</Badge>}</Badge></h4></CardSubtitle>
                                </div>
                                <div className="col-md-4">
                                    <Badge color='light-success'>
                                            Percentage
                                    </Badge><br></br>
                                    <span className="jd_position" style={{color: "black", fontWeight:"20px", padding:"0.3rem 0.5rem"}}>{item.percentage && item.percentage}</span>
                                    
                                    {/* <br></br><Badge color='light-danger'>
                                        Monthly Limit
                                    </Badge><br></br>
                                    <span style={{color: "black", fontWeight:"10px", padding:"0.3rem 0.5rem"}}>{item.gym_monthly_limit && item.gym_monthly_limit}</span> */}
                                </div>
                                <div className="col-md-4">
                                <div className="mb-1">
                                    <StatusComponent item={item} key={index}/>
                                    </div>
                                {/* <Badge color='light-success'>
                                        Receipt
                                    </Badge><br></br>
                                    <span style={{color: "black", fontWeight:"10px", padding:"0.3rem 0.5rem"}}>{item.gym_receipt ? <a target='_blank' href={`${process.env.REACT_APP_PUBLIC_URL}${item.gym_receipt}`}> <img src={`${process.env.REACT_APP_PUBLIC_URL}${item.gym_receipt}`} width={20} height={20}/></a> : <Badge color='light-danger'>N/A</Badge>}</span> */}
                                    
                                </div>
                               
                            </div>
                                
                        </CardBody>
                        </Card> 
                    ))}
                </Col>   
        </Row>
        ) : (
            <div className="text-center">No PF Data Found!</div>
        )
        
        }
            </>
        ) : (
            <div className="text-center"><Spinner /></div>
        )
        
   }
    <hr></hr>
        {/* </Col> */}
    </Row>
</Fragment>
  )
}

export default PF