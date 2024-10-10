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
const AttendanceTable = () => {
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
      await Api.jsonPost(`/attendance/status/`, formData)
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
    const handleRowClick = (item) => {
      setSelectedItem(item)
      setCanvasPlacement('end')
      setCanvasOpen(!canvasOpen)
  }
    
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
            ["Emp Code", "Name", "WFH", "Presents", "Absents", ...uniqueDates.map(date => date.date)],
            ...preData.map((item) => [
              item.emp_code,
              item.name,
              item.attendance_status_data?.total_wfh || '0',
              item.attendance_status_data?.total_presents || '0',
              item.attendance_status_data?.total_absences || '0',
              ...uniqueDates.map((date) => {
                const statusItem = item.attendance_status_data?.data.find(
                  (status) => status.date === date.date 
                )
                return statusItem ? statusItem.attendance_status : 'No Data Found'
              })
            ])
          ]          
                 
   return (
    <Fragment>
      <Card>
        <CardBody>
           <Container>
           <Row>
  <Col md={3} xs={12}>
    <h3 className="mt-2">Attendance Overview</h3>
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
                menuPlacement="auto" 
                menuPosition='fixed'
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
                        <Input placeholder='search employee name...'  onChange={e => { getSearch({list: preData, key: 'name', value: e.target.value }) } }/>
                    </InputGroup>
                </Col>
</Row>
{/* <Container> */}
<Masonry className="row js-animation">
      {!loading ? (
                       <Table borderless responsive className='table table-sm my-1 Small-font sticky-header'>
                        <thead  className='table-dark text-center sticky'>
                            <tr>
                            <th className="px-1">Emp code</th>
                            <th className="px-1">Name</th>
                            <th className="px-1">WFH</th>
                            <th className="px-1">P</th>
                            <th className="px-1">A</th>
                            <th className="px-1">L</th>
                            <th className="px-1">H</th>
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
                                    <tr key={key} onClick={() => handleRowClick(item)} style={{ cursor: 'pointer' }} className='onHovergrey'>
                                    <td className="px-1 sticky-col bg-blue" title="Employee Code">{item.emp_code}</td>
                                    <td className="px-1 text-small sticky-col" title="Employee Name">{item.name}</td>
                                    <td className="px-1" title="WFH"><strong>{item.attendance_status_data?.total_wfh || '0'}</strong></td>
                                    <td className="px-1" title="Total Presents"><strong>{item.attendance_status_data?.total_presents || '0'}</strong></td>
                                    <td className="px-1" title="Total Absents"><strong>{item.attendance_status_data?.total_absesnts || '0'}</strong></td>
                                    <td className="px-1" title="Total Leaves"><strong>{item.attendance_status_data?.total_leaves || '0'}</strong></td>
                                    <td className="px-1" title="Total Holidays"><strong>{item.attendance_status_data?.total_holidays || '0'}</strong></td>
                                    {item.attendance_status_data && item.attendance_status_data.data ? (
                                                uniqueDates.map((date, index) => {
                                                    const statusItem = item.attendance_status_data.data.find(
                                                        (status) => status.date === date.date
                                                    )
                                                    return (
                                                        <td
                                                        key={index}
                                                        className="px-1"
                                                        title={date.date}
                                                      >
                                                  {statusItem && statusItem.attendance_status !== null ?  statusItem.attendance_status === 'W' ? statusItem.attendance_status : statusItem.attendance_status === 'L' ?    statusItem.comments.split(' ').map(word => word.charAt(0)).join('') :  statusItem.attendance_status === 'P' ? <Monitor size={12} color="green"/> :  statusItem.attendance_status === 'WFH' ? <Wifi size={12} color="blue"/> : statusItem.attendance_status === 'H' ? <Calendar color='#A020F0' size={12}/> : <AlertTriangle color="red" size={12}/>  :    <AlertTriangle color="red" size={12}/>}

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
      {/* </Conainer> */}
      <div className="d-flex align-items-center mt-2 mb-2">
      <Col md={2} className="pr-1">
    <AlertTriangle size={20} color="red"/> -
    <span className="ms-1">Absent</span>
    </Col>
  <Col md={2} className="pr-1">
        <Wifi size={20} color="blue"/> - 
        <span className="ms-1">WFH</span>
        </Col>
    {/* </div> */}
    
    <Col md={2} className="pr-1">
        <Monitor size={20} color="green"/> - 
        <span className="ms-1">Office</span>
    </Col>
    <Col md={2} className="pr-1">
    W -
    <span className="ms-1">Weekend</span>
    </Col>
    <Col md={2} className="pr-1">
        <Calendar size={20} color="#A020F0"/> - 
        <span className="ms-q">Public Holiday</span>
        </Col>
        <Col md={4}>
    Leave Initials - 
    <span className="ms-1">Leave</span>
    </Col>
</div>
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
export default AttendanceTable
