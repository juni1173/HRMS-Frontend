import { Fragment, useEffect, useState } from "react"
import { Search,  Download, Book, AlertTriangle, Monitor, Home, Wifi, Calendar } from "react-feather"
import { Spinner, Table, Row, Col, Container, Input, InputGroup, InputGroupText, Button, Label, Tooltip, CardBody, Card, Offcanvas, OffcanvasHeader, OffcanvasBody} from "reactstrap"
import Select from 'react-select'
import ReactPaginate from 'react-paginate'
import Masonry from 'react-masonry-component'
import { CSVLink } from "react-csv"
import apiHelper from '../Helpers/ApiHelper'
import SearchHelper from "../Helpers/SearchHelper/SearchByObject"
import Adminlist from "./List"
// import { Calendar } from "react-multi-date-picker"
import '../../App.css'
const AttendanceHours = () => {
    const yearoptions = []
    const currentDate = new Date()
    // Get the current month and year
    const currentMonth = currentDate.getMonth() + 1 // Month is zero-based, so add 1
    const currentYear = currentDate.getFullYear() 
    const Api = apiHelper() 
    const searchHelper = SearchHelper()
    const [searchQuery] = useState([])
    const [selectedItem, setSelectedItem] = useState()
    const [loading, setLoading] = useState(false)
    const [preData, setPreData] = useState([])
    const [canvasPlacement, setCanvasPlacement] = useState('end')
    const [canvasOpen, setCanvasOpen] = useState(false)
    const [monthvalue, setmonthvalue] = useState(currentMonth)
    const [yearvalue, setyearvalue] = useState(currentYear)
    const [uniqueDates, setuniqueDates] = useState([])
    const [currentItems, setCurrentItems] = useState([])
    const [searchResults, setSearchResults] = useState([])
    const [pageCount, setPageCount] = useState(0)
    const [itemOffset, setItemOffset] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(50)
    const itemsCount = [
        {value: 50, label: '50'},
        {value: 100, label: '100'},
        {value: 150, label: '150'},
        {value: 200, label: '200'}
    ]
    const monthOptions = [
        { value: 1, label: 'January' },
        { value: 2, label: 'February' },
        { value: 3, label: 'March' },
        { value: 4, label: 'April' },
        { value: 5, label: 'May' },
        { value: 6, label: 'June' },
        { value: 7, label: 'July' },
        { value: 8, label: 'August' },
        { value: 9, label: 'September' },
        { value: 10, label: 'October' },
        { value: 11, label: 'November' },
        { value: 12, label: 'December' }
      ]
      // Generate options for the last 5 years and add them to the array
    for (let i = 0; i < 5; i++) {
        const year = currentYear - i
        yearoptions.push({ value: year, label: year.toString() })
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
    const getPreData = async () => {
        setLoading(true)
        const formData = new FormData()
        formData['month'] = monthvalue
        formData['year'] = yearvalue
        await Api.jsonPost(`/all/employee/current/month/atteandance/`, formData)
        .then(result => {
            if (result) {
                if (result.status === 200) {
                   setPreData(result.data)
                   setSearchResults(result.data)
                } else {
                    Api.Toast('error', result.message)
                }
            } else {
                Api.Toast('error', result.message)
            }
        })
        setTimeout(() => {
            setLoading(false)
        }, 1000)
       
    }
    const handleRowClick = (item) => {
        setSelectedItem(item)
        setCanvasPlacement('end')
        setCanvasOpen(!canvasOpen)
    }
    const generateUniqueDates = (year, month) => {
        const startDate = new Date(year, month - 1, 1)
        const endDate = new Date(year, month, 0)
        const dateRange = []
        const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
        const currentDate = new Date(startDate)
        const currentYear = currentDate.getFullYear()
        const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0')
        while (currentDate <= endDate) {
          const dayLabel = weekdays[currentDate.getDay()]
          const currentDay = String(currentDate.getDate()).padStart(2, '0')
          dateRange.push({date:`${currentYear}-${currentMonth}-${currentDay}`, label:dayLabel})
          currentDate.setDate(currentDate.getDate() + 1)
        }
        setuniqueDates(dateRange)
      }
  //   const generateUniqueDates = (year, month) => {
  //     const startDate = new Date(year, month - 1, 1)
  //     const endDate = new Date(year, month, 0)
  //     const dateRange = []
  //     // const currentYear = startDate.getFullYear()
  //     // const currentMonth = String(startDate.getMonth() + 1).padStart(2, '0')
  //     const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  
  //     const currentDate = new Date(startDate)
  //     while (currentDate <= endDate) {
  //         const dayLabel = weekdays[currentDate.getDay()]
  //         const dayOfMonth = currentDate.getDate()
  //         dateRange.push({label:dayLabel, date:dayOfMonth})
  //         currentDate.setDate(currentDate.getDate() + 1)
  //     }
  //     console.log(dateRange)
  //     setuniqueDates(dateRange)
  // }
  
      
    useEffect(() => {
        getPreData()
     generateUniqueDates(yearvalue, monthvalue)
        }, [setSearchResults, monthvalue, yearvalue])
       
        useEffect(() => {
            const endOffset = itemOffset === 0 ? itemsPerPage : itemOffset + itemsPerPage            
            setCurrentItems(searchResults.slice(itemOffset, endOffset))
            setPageCount(Math.ceil(searchResults.length / itemsPerPage))
            }, [itemOffset, itemsPerPage, searchResults])
    
        const handlePageClick = (event) => {
            const newOffset = (event.selected * itemsPerPage) % searchResults.length
            setItemOffset(newOffset)
            }
            const csvData = [
                ["Emp Code", "Name", "Total Hours", ...uniqueDates.map((item) => { return item.date })],
                ...preData.map((item) => [
                  item.emp_code,
                  item.employee_name,
                  item.total_monthly_hours ? item.total_monthly_hours : '0',
                  ...uniqueDates.map((date) => {
                    const statusItem = item.daily_hours.find(
                        (status) => status.date === date.date
                    )
                    return statusItem ? statusItem.hours : '0'
                })
                 
                ])
              ]
              
              // const [tooltipOpen, setTooltipOpen] = useState(false)

              // const toggle = () => setTooltipOpen(!tooltipOpen)       
   return (
    <Fragment>
      <Card>
        <CardBody>
           <Container>
           <Row>
  <Col md={3} xs={12}>
    <h3 className="mt-2">Time Tracking</h3>
  </Col>
<Col md={3}></Col>
<Col md={6} className="d-flex justify-content-end align-items-center">
  <div className="mr-1">
  <span>Showing {Object.values(currentItems).length > 0 ? itemsPerPage : 0} results per page</span>
    <Select
      className="mb-2"
      placeholder="Entries"
      options={itemsCount}
      onChange={(e) => {
        setItemsPerPage(e.value)
        setItemOffset(0)
      }}
    />
  </div>
  <div>
    <CSVLink
      className="btn btn-primary mt-2 mb-2"
      filename={`HRMS_Attendance_Sheet_${monthvalue}_${yearvalue}`}
      data={csvData}
    >
      <Download />
    </CSVLink>
  </div>
</Col>

</Row>
        </Container>
         <Row>
<Col md={4}>
            <Label>Select Month</Label>
            <Select
            id='month'
                isClearable={true}
                options={monthOptions}
                className='react-select mb-1'
                classNamePrefix='select'
                placeholder="Select Month"
                value={monthOptions.find(option => option.value === monthvalue)}
                onChange={(selectedOption) => {
                    if (selectedOption !== null) {
                        setmonthvalue(selectedOption.value)
                    } else {
                        setmonthvalue(currentMonth)
                    }
            
              }}
            />
        </Col>
<Col md={4}>
            <Label>Select Year</Label>
            <Select
                isClearable={true}
                options={yearoptions}
                className='react-select mb-1'
                classNamePrefix='select'
                placeholder="Select Year"
                value={yearoptions.find(option => option.value === yearvalue)}
                onChange={(selectedOption) => {
                    if (selectedOption !== null) {
                        setyearvalue(selectedOption.value)
                    } else {
                       
                        setyearvalue(currentYear)
                    }
            
              }}
            />
</Col>
<Col md={4}>
<Label>Search Employee</Label>

                    <InputGroup className='input-group-merge mb-2'>
                        <InputGroupText>
                            <Search size={14} />
                        </InputGroupText>
                        <Input placeholder='search employee name...'  onChange={e => { getSearch({list: preData, key: 'employee_name', value: e.target.value }) } }/>
                    </InputGroup>
                </Col>
</Row>
{/* <Container> */}
<Masonry className="row js-animation">
     {!loading ? (
                       <Table borderless striped responsive className='table table-sm my-1 Small-font'>
                        <thead  className='table-dark text-center'>
                            <tr>
                            <th className="px-1">Emp code</th>
                            <th className="px-1">Name</th>
        <th className="px-1">Total Hours</th>
                            {uniqueDates.map((date, index) => (
           <th key={index} className="px-1">
           {String(date.date).slice(-2)} {/* Extract the last two characters */}
           <div className="text-small">{date.label}</div>
       </th>
        ))}
       
                            </tr>
                              </thead> 
                                     
   {currentItems && Object.values(currentItems).length > 0 ? (
    currentItems.map((item, key) => (
        <tbody >
             <tr key={key} onClick={() => handleRowClick(item)} style={{ cursor: 'pointer' }}>
            <td className="px-1">{item.emp_code}</td>
            <td className="px-1 text-small" >{item.employee_name}</td>
            <td className="px-1 text-nowrap"><strong>{item.total_monthly_hours ? item.total_monthly_hours : '0'}</strong></td>
          {item.daily_hours ? (
                        uniqueDates.map((date, index) => {
                            const statusItem = item.daily_hours.find(
                                (status) => status.date === date.date
                            )
                            return (
                                <td
                                key={index}
                                className="px-1 text-nowrap"
                              >
                          {statusItem && statusItem.hours !== null ?  statusItem.hours : '0'}
                              </td>
                              
                            )
                        })
                    ) : (
                        <td colSpan={uniqueDates.length}>No Attendance Data Found!</td>
                    )}
                                        
                                        
            </tr>
        </tbody>
        
    ))
) : (
    <div className='text-center'>No Data Found!</div>
)}
                       </Table>
                 
        ) : (
            <div className='text-center'><Spinner/></div>
        )
        }
        </Masonry>
        <div className="mt-2">    
        <Container> 
           
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
    <Offcanvas direction={canvasPlacement} isOpen={canvasOpen} toggle={handleRowClick} className="largeCanvas">
          <OffcanvasHeader toggle={handleRowClick}></OffcanvasHeader>
          <OffcanvasBody className=''>
           <Adminlist data={selectedItem} month={monthvalue} year={yearvalue}/>  
          </OffcanvasBody>
        </Offcanvas>
        </Container>
        </div>   
        </CardBody>
      </Card> 
    </Fragment>
   )
}
export default AttendanceHours
