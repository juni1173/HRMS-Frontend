import { Card, CardBody, Label, Input, Spinner, CardTitle, Row, Col, Table, InputGroup, InputGroupText } from "reactstrap"
import apiHelper from "../../Helpers/ApiHelper"
import Select from 'react-select'
import { useState, useEffect } from "react"
import { Search } from "react-feather"
import SearchHelper from "../../Helpers/SearchHelper/SearchByObject"
import ReactPaginate from 'react-paginate'
const EmployeeSalary = () => {
    const Api = apiHelper()
    const searchHelper = SearchHelper()
    const [searchQuery] = useState([])
    const [loading, setLoading] = useState(false)
    const [employeeData, setEmployeeData] = useState([])
    const [payroll_options, setPayroll_options] = useState([])
    const [currentItems, setCurrentItems] = useState([])
    const [searchResults, setSearchResults] = useState([])
    const [pageCount, setPageCount] = useState(0)
    const [itemOffset, setItemOffset] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(50)
    const itemsCount = [
      {value: 25, label: '25'},
        {value: 50, label: '50'},
        {value: 100, label: '100'},
        {value: 150, label: '150'},
        {value: 200, label: '200'}
    ]
    const allowedoptions = [
        {value: true, label: 'Yes'},
        {value: false, label: 'No'}
    ]
    const salary_cycle_options = [
        {value: 'Monthly', label: 'Monthly'},
        {value: 'Semi-Monthly', label: 'Semi-Monthly'}
    ]

    
    const getData =  async() => {
        setLoading(true)
         await Api.get(`/payroll/employee/configuration/`).then(response => {
            setEmployeeData(response.data)
            // setCurrentItems(response.data)
            setSearchResults(response.data)
          }) 
          await Api.get(`/payroll/list/batches/`).then(response => {
            const options = response.data.map(item => ({
              value: item.id,
              label: item.title || `Batch ${item.batch_no}`
            }))
            setPayroll_options(options)
          }) 
         setTimeout(() => {
          setLoading(false)
         }, 1000)
      }
      useEffect(() => {
          getData()
      }, [])
      const CallBack = () => {
        getData()
      }
      const updateConfiguration = (employeeId, title, value) => {
        // Define your API call here, passing the necessary data
        const requestData = {
          employee: employeeId,
          [title]: value
        }
    
        Api.jsonPost(`/payroll/employee/configuration/`, requestData)
        .then((response) => {
            if (response.status === 200) {
               Api.Toast('success', 'Batch Updated Successfully')
              CallBack()
            } else {
              return Api.Toast('error', response.message)
            }                
            })
      }
      const getSearch = options => {
        console.log(typeof options.value)
        if (options.value === '' || options.value === null || options.value === undefined) {

            if (options.key in searchQuery) {
                delete searchQuery[options.key]
            } 
            if (Object.values(searchQuery).length > 0) {
                options.value = {query: searchQuery}
            } else {
                options.value = {}
            }
            // setItemOffset(0)
            // setEmployeeData(searchHelper.searchObj(options))
            setCurrentItems(searchHelper.searchObj(options))
            setSearchResults(searchHelper.searchObj(options))
            
        } else {
            searchQuery[options.key] = options.value
            options.value = {query: searchQuery}
            // setItemOffset(0)
            // setEmployeeData(searchHelper.searchObj(options))
            console.log(searchHelper.searchObj(options))
            setCurrentItems(searchHelper.searchObj(options))
            setSearchResults(searchHelper.searchObj(options))
            console.log(currentItems)
        }
        
    }
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
    !loading ? (
    <div className="mx-1">
      <Row>
      <Col md={4}>
<Label>Serach Employee</Label>
                    <InputGroup className='input-group-merge mb-2'>
                        <InputGroupText>
                            <Search size={14} />
                        </InputGroupText>
                        <Input placeholder='search employee name...'  onChange={e => { getSearch({list: employeeData, key: 'employee_name', value: e.target.value }) } }/>
                    </InputGroup>
                </Col>
                <Col md={4}>
<Label>Serach by batch</Label>
                    <InputGroup className='input-group-merge mb-2'>
                        <InputGroupText>
                            <Search size={14} />
                        </InputGroupText>
                        <Input placeholder='search batch name...'  onChange={e => { getSearch({list: employeeData, key: 'payroll_batch_title', value: e.target.value }) } }/>
                    </InputGroup>
                </Col>
                <Col md={4}>
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

</Col>
</Row>
                {currentItems.length > 0 ? <>
                  <Table bordered striped responsive>
                        <thead className='table-dark text-center'>
                            <tr>
                                <th>Name</th>
                                <th>Payroll Batch</th>
                                <th>Salary Cycle</th>
                                <th>Allow Slip</th> 
                                <th>Allow Salary</th>
                            </tr>
                        </thead>
                        <tbody>
                        {currentItems.map((employee) => (
            <tr key={employee.id}>
              <td>
                <div className="d-flex align-items-center">
                  <img
                    src={employee.employee_profile_image}
                    // alt={employee.empl}
                    className="mr-2"
                    style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                  />
                  <div>
                    <div><strong>{employee.employee_name}</strong></div>
                    <div>{employee.staff_classification}</div>
                  </div>
                </div>
              </td>
              <td>
                <Select
      className="mb-2"
      placeholder="TBD"
      options={payroll_options}
      onChange={(selectedOption) => {
        // Update the salary cycle value and call the API
        const newValue = selectedOption ? selectedOption.value : null
        updateConfiguration(employee.employee_id, "payroll_batch", newValue)
      }}
      menuPlacement="auto" 
      menuPosition='fixed'
      value={
        employee.payroll_batch ? payroll_options.find(
              (option) => option.value === employee.payroll_batch
            ) : null
      }
    /></td>
              <td>
                <Select
      className="mb-2"
      placeholder="TBD"
      options={salary_cycle_options}
      onChange={(selectedOption) => {
        // Update the salary cycle value and call the API
        const newValue = selectedOption ? selectedOption.value : null
        updateConfiguration(employee.employee_id, "takeAway", newValue)
      }}
      menuPlacement="auto" 
      menuPosition='fixed'
      // defaultValue={
      //   employee.takeAway ? salary_cycle_options.find(
      //         (option) => option.value === employee.takeAway
      //       ) : null
      // }
      defaultValue={salary_cycle_options[0]}
      isDisabled={true}
    /></td>
              <td>
              <Select
      className="mb-2"
      placeholder="TBD"
      options={allowedoptions}
      onChange={(selectedOption) => {
        // Update the allow slip value and call the API
        const newValue = selectedOption ? selectedOption.value : null
        updateConfiguration(
          employee.employee_id,
          "is_payslip_allowed",
          newValue
        )
      }}
      menuPlacement="auto" 
      menuPosition='fixed'
      // defaultValue={
      //    allowedoptions.find(
      //         (option) => option.value === employee.is_payslip_allowed
      //       )
      // }
      defaultValue={allowedoptions[0]}
      isDisabled={true}
    />
    </td>
              <td><Select
      className="mb-2"
      placeholder="TBD"
      options={allowedoptions}
      onChange={(selectedOption) => {
        // Update the allow salary value and call the API
        const newValue = selectedOption ? selectedOption.value : null
        updateConfiguration(
          employee.employee_id,
          "is_salary_allowed",
          newValue
        )
      }}
      menuPlacement="auto" 
      menuPosition='fixed'
      // defaultValue={
      //    allowedoptions.find(
      //         (option) => option.value === employee.is_salary_allowed
      //       )
      // }
      defaultValue={allowedoptions[0]}
      isDisabled={true}
    /></td>
            </tr>
                        ))}

                        </tbody> 
                        </Table>
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
                </> : <div className="text-center">No data found</div> }
    </div>
  ) : (
    <div className="container h-100 d-flex justify-content-center">
      <div className="jumbotron my-auto">
        <div className="display-3"><Spinner type='grow' color='primary'/></div>
      </div>
  </div>
  )
  )
}

export default EmployeeSalary