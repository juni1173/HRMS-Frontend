import { Fragment, useEffect, useState } from "react"
import { Search,  Download, File } from "react-feather"
import { Spinner, Table, Row, Col, Container, Input, InputGroup, InputGroupText, Button} from "reactstrap"
import Select from 'react-select'
import ReactPaginate from 'react-paginate'
import Masonry from 'react-masonry-component'
import { CSVLink } from "react-csv"
import apiHelper from '../Helpers/ApiHelper'
import SearchHelper from "../Helpers/SearchHelper/SearchByObject"
const AttendanceTable = () => {
    const yearoptions = []
    const currentDate = new Date()
    // Get the current month and year
    const currentMonth = currentDate.getMonth() + 1 // Month is zero-based, so add 1
    const currentYear = currentDate.getFullYear() 
    const Api = apiHelper() 
    const searchHelper = SearchHelper()
    const [searchQuery] = useState([])
    const [loading, setLoading] = useState(false)
    const [preData, setPreData] = useState([])
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
        const currentDate = new Date(startDate)
        const currentYear = currentDate.getFullYear()
        const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0')
        while (currentDate <= endDate) {
          const currentDay = String(currentDate.getDate()).padStart(2, '0')
          dateRange.push(`${currentYear}-${currentMonth}-${currentDay}`)
          currentDate.setDate(currentDate.getDate() + 1)
        }
        setuniqueDates(dateRange)
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
                ["Emp Code", "Name", "WFH", "Presents", "Absents", ...uniqueDates],
                ...preData.map((item) => [
                  item.emp_code,
                  item.name,
                  item.attendance_status_data?.total_wfh || '0',
                  item.attendance_status_data?.total_presents || '0',
                  item.attendance_status_data?.total_absences || '0',
                  ...uniqueDates.map((date) => {
                    const statusItem = item.attendance_status_data?.data.find((status) => status.date === date)
                    return statusItem ? statusItem.attendance_status : 'No Data Found'
                  })
                 
                ])
              ]
              
              
   return (
    <Fragment>
           <Container>
            <div className='row  my-1'>
                <Col md={3}>
                    <h3>Attendance List</h3>
                    <span>Showing {Object.values(currentItems).length > 0 ? itemsPerPage : 0} results per page</span>
                </Col>
                <Col md={4}>
                    <InputGroup className='input-group-merge mb-2'>
                        <InputGroupText>
                            <Search size={14} />
                        </InputGroupText>
                        <Input placeholder='search employee name...'  onChange={e => { getSearch({list: preData, key: 'name', value: e.target.value }) } }/>
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
                
                    <Col md={3}>
                    <CSVLink className="btn btn-primary float-right mt-2" filename={`HRMS_Attendance_Sheet_${monthvalue}_${yearvalue}`} data={csvData}>Download <Download/> </CSVLink>
                    </Col>
         
            </div>
        </Container>
         <Row>
          <Col md={6}>
        <Select
  id="month"
  options={monthOptions}
  onChange={(selectedOption) => {
        setmonthvalue(selectedOption.value)
  }}
/>
</Col>
<Col md={6}>
        <Select
  id="year"
  options={yearoptions}
  onChange={(selectedOption) => {
        setyearvalue(selectedOption.value)
  }}
/>
</Col>
</Row>
<Container>
<Masonry className="row js-animation">
     {!loading ? (
                       <Table bordered striped responsive className='my-1'>
                        <thead  className='table-dark text-center'>
                            <tr>
                            <th>Emp code</th>
                            <th>Name</th>
                            <th>WFH</th>
        <th>Present</th>
        <th>Absent</th>
                            {uniqueDates.map((date, index) => (
            <th key={index} className="text-nowrap">{date}</th>
        ))}
       
                            </tr>
                              </thead> 
                                     
   {currentItems && Object.values(currentItems).length > 0 ? (
    currentItems.map((item, key) => (
        <tbody >
            <tr key={key}>
            <td>{item.emp_code}</td>
            <td>{item.name}</td>
            <td><strong>{item.attendance_status_data?.total_wfh || '0'}</strong></td>
<td><strong>{item.attendance_status_data?.total_presents || '0'}</strong></td>
<td><strong>{item.attendance_status_data?.total_absesnts || '0'}</strong></td>
          {item.attendance_status_data && item.attendance_status_data.data ? (
                        uniqueDates.map((date, index) => {
                            const statusItem = item.attendance_status_data.data.find(
                                (status) => status.date === date
                            )
                            return (
                                <td
                                key={index}
                                className={
                                  statusItem ? statusItem.attendance_status === "P" ? "text-success" : statusItem.attendance_status === "A" ? "text-danger" : statusItem.attendance_status === "WFH" ? "text-warning" : statusItem.attendance_status === "L" ? "text-primary" : "" : ""
                                }
                              >
                                {statusItem ? statusItem.attendance_status : ""}
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
        </Container>
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
    
        </Container>
        </div>    
    </Fragment>
   )
}
export default AttendanceTable