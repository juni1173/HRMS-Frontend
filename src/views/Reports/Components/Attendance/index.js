import { Fragment, useState, useEffect } from 'react'
import Select from 'react-select'
// import {writeFile, utils} from 'xlsx'
// ** Reactstrap Imports
import {
    Row, Col, 
    Card,
    CardBody,
    Spinner, Label, Badge, Button, CardTitle
  } from 'reactstrap'
import apiHelper from '../../../Helpers/ApiHelper'
import Flatpickr from 'react-flatpickr'
// import EmployeeBarChart from '../EmployeeReport/EmployeeBarChart'
// import EmployeeDataTable from '../EmployeeReport/EmployeeDataTable'

// ** Custom Hooks
// import { useSkin } from '@hooks/useSkin'

// ** Context
// import { ThemeColors } from '@src/utility/context/ThemeColors'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import PercentageChart from './Components/PercentageChart'
import BarChart from './Components/BarChart'

const index = () => {
  const Api = apiHelper()
    const [data, setData] = useState([])
    const [total_working_days, setTotalWorkingDays] = useState(1)
    const [currDep, setCurrDep] = useState('')
    const [departmentLength, setDepartmentLength] = useState(0)
    const [ChartData, setChartData] = useState({
      categories: '',
      percentage: ''
    })
    const [loading, setLoading] = useState(false)
    const currentDate = new Date()
    const [reportParameters, setReportParameters] = useState({
        start_date: Api.formatDate(currentDate),
        end_date : Api.formatDate(currentDate)
    })
    
    const [departmentDropdown, setdepDropdown] = useState([])
    const [countData, setCountData] = useState({
        Annual: 0,
        Casual: 0,
        Presents: 0,
        WFH: 0,
        Employees:0,
        totalPresentDays: 0
    })
    
    // const [highestTotalEmployeeCount, sethighestTotalEmployeeCount] = useState(0)
    
  // ** Context, Hooks & Vars
//   const { colors } = useContext(ThemeColors),
//     { skin } = useSkin(),
//     labelColor = skin === 'dark' ? '#b4b7bd' : '#6e6b7b',
//     successColorShade = '#28dac6',
//     gridLineColor = 'rgba(200, 200, 200, 0.2)'

    const calculateCount = (arr) => {
        // settableData(arr.flatMap(item => item.employees_data))
        let totalAnnualLeaves = 0
        let totalCasualLeaves = 0
        let totalPresents = 0
        let totalWFH = 0 
        let totalEmployees = 0

        arr.forEach(item => { 
            totalAnnualLeaves += item.total_annual_leaves
            totalCasualLeaves += item.total_casual_leaves
            totalPresents += item.total_presents
            totalWFH += item.total_wfh
            totalEmployees += item.employees_data.length
        })
        setCountData(prevState => ({
            ...prevState,
            Annual: totalAnnualLeaves,
            Casual: totalCasualLeaves, // corrected calculation
            Presents: totalPresents, // corrected calculation
            WFH: totalWFH,
            Employees: totalEmployees,
            totalPresentDays: (totalPresents + totalWFH)
        }))
        // Graph data
        const categories = arr.map(item => item.title)
        
        const percentage = arr.map(item => ((((item.total_presents + item.total_wfh) / total_working_days) / item.total_employee_count) * 100).toFixed(2))
        setChartData(prevState => ({
          ...prevState,
          categories,
          percentage
      }))
    }
    
    const getData = async () => {
        const formData = new FormData()
        if (reportParameters.start_date !== '') formData['start_date'] = reportParameters.start_date
        if (reportParameters.end_date !== '') formData['end_date'] = reportParameters.end_date
        if (reportParameters.start_date !== '' && reportParameters.end_date !== '') {
            await Api.jsonPost(`/organization/${Api.org.id}/attendance/report/`, formData).then(result => {
              
              if (result) {
                  setLoading(true)
                  if (result.status === 200) {
                      const resultData = result.data.query_data
                      setTimeout(() => {
                        setTotalWorkingDays(result.data.total_working_days)
                        setData(resultData)
                      }, 1000)
                      const departments = resultData.map(item => ({
                          label: item.title, 
                          value: item.title
                      }))
                      setdepDropdown(departments)
                      if (currDep !== '') {
                        const filteredData = resultData.filter(item => item.title === currDep)
                        calculateCount(filteredData)
                      } else {
                        calculateCount(resultData)
                        setDepartmentLength(resultData.length)
                      }
                      
                  } else {
                      // Api.Toast('error', result.message)
                  }
                  console.warn(departmentLength)
                  setTimeout(() => {
                      setLoading(false)
                  }, 500)
              } else (
              Api.Toast('error', 'Server not responding!')   
              )
          })  
        }
       
      }
      const onChangeParametersDetailHandler = (InputName, InputType, e) => {
        
        let InputValue
        if (InputType === 'input') {
        
        InputValue = e.target.value
        } else if (InputType === 'select') {
        
        InputValue = e
        } else if (InputType === 'date') {  
            InputValue = Api.formatDate(e)
        } else if (InputType === 'file') {
            InputValue = e.target.files[0].name
        }
    
        setReportParameters(prevState => ({
        ...prevState,
        [InputName] : InputValue
        
        }))
        
      }
      const onChangeDepartmentHandler = (e) => {
        if (e) {
            const filteredData = data.filter(item => item.title === e)
            console.warn(e)
            if (typeof e !== 'undefined') { 
              setDepartmentLength(1)
              setCurrDep(e) 
              calculateCount(filteredData)
            } else { 
              setDepartmentLength(departmentDropdown.length)
              setCurrDep('') 
              calculateCount(data)
            }
            
        } else getData()
    }
      useEffect(() => {
        getData()
        }, [setData])

        useEffect(() => {
          // This will run whenever `data` or `totalWorkingDays` change
          if (data.length > 0 && total_working_days > 0) {
              if (currDep !== '') {
                  const filteredData = data.filter(item => item.title === currDep)
                  calculateCount(filteredData)
              } else {
                  calculateCount(data)
              }
          }
      }, [data, total_working_days, currDep])
        // const CallBack = useCallback(() => {
        //     getData()
        //   }, [requestData])
    //     const handleExport = () => {
    //       const csvjson = tableData.map(employee => ({
    //         id: employee.emp_id,
    //         name: employee.employee_name,
    //         status: employee.status,
    //         Gender: employee.gender,
    //         Education: employee.degree_title,
    //         Age: employee.age,
    //         Date_Of_Birth: employee.dob,
    //         Date_Of_Joining: employee.joining_date,
    //         tenure: employee.tenure,
    //         department: employee.department,
    //         salary: employee.salary,
    //         projects: employee.projects ? employee.projects.join(', ') : '',
    //         email: employee.email
    //         // Add other properties as needed
    //       }))
    //           const headings = [
    //             [
    //             'Emp ID',
    //             'Employee Name',
    //             'Status',
    //             'Gender',
    //             'Education',
    //             'Age',
    //             'Date Of Birth',
    //             'Date Of Joining',
    //             'Tenure At Kavtech',
    //             'Department',
    //             'Salary',
    //             'Project',
    //             'Email'
    //               ]
    //           ]
    //           const wb = utils.book_new()
    //           const ws = utils.json_to_sheet([])
    //           utils.sheet_add_aoa(ws, headings)
    //           utils.sheet_add_json(ws, csvjson, { origin: 'A2', skipHeader: true })
    //           utils.book_append_sheet(wb, ws, 'Report')
    //           writeFile(wb, 'Employee Report.xlsx')
    //       }
    // const onChangeDepartmentHandler = (e) => {
    //     if (e) {
    //         const filteredData = data.filter(item => item.title === e)
    //         calculateCount(filteredData)
    //     } else getData()
    // }
  
  return (
    <Fragment>
        <Card>
      <CardBody>
      <Row className='mb-2'>
        <Col md={3}>
          <Label className='form-label' for='default-picker'>
            From
          </Label>
          <Flatpickr className='form-control'  
            onChange={ (e) => { onChangeParametersDetailHandler('start_date', 'date', e) }} 
            id='default-picker' 
            placeholder='Start Date'
            defaultValue={reportParameters.start_date && reportParameters.start_date}
          />
        </Col>
        <Col md={3}>
          <Label className='form-label' for='default-picker'>
            To
          </Label>
          <Flatpickr className='form-control'  
            onChange={ (e) => { onChangeParametersDetailHandler('end_date', 'date', e) }} 
            id='default-picker' 
            placeholder='End Date'
            defaultValue={reportParameters.end_date && reportParameters.end_date}
          />
        </Col>
        <Col md="4">
                <Label className="form-label">
                  Select Department <Badge color='light-danger'>*</Badge>
                </Label>
                <Select
                    isClearable={false}
                    className='react-select'
                    classNamePrefix='select'
                    name="scale_group"
                    options={departmentDropdown ? departmentDropdown : ''}
                    onChange={ (e) => { onChangeDepartmentHandler(e ? e.value : onChangeDepartmentHandler()) }}
                    menuPlacement="auto" 
                    menuPosition='fixed'
                />
        </Col>
        <Col md="2">
          <Button className='btn btn-md btn-primary mt-2' onClick={() => getData()}>Go</Button>
        </Col>
    </Row>
      </CardBody>
    </Card>
      <Row className='match-height'>
        <Col md='6'>
            <Card className='mb-2'>
            {!loading && (
                (data && Object.values(data).length > 0) ? (
                  <>
                    <CardBody className='pb-0'>
                        <h3 className='text-center'><b>Annual vs. Casual</b></h3>
                        <h2 className='text-center'>{countData.Annual ? countData.Annual : '0'} | {countData.Casual ? countData.Casual : '0'}</h2>
                        
                    </CardBody>
                  </>
                ) : (
                    <CardBody className='pb-0'>
                        <h3 className='text-center'>Annual / Casual</h3>
                        <h3 className='text-center'>N/A</h3>
                    </CardBody>
                )
                
            )}
            </Card>
        </Col>
        <Col md='6'>
            <Card className='mb-2'>
            {!loading && (
                (data && Object.values(data).length > 0) ? (
                    <CardBody className='pb-0'>
                        <h3 className='text-center'><b>Total Employees</b></h3>
                        <h2 className='text-center'>{countData.Employees ? countData.Employees : 'N/A'}</h2>
                        
                    </CardBody>
                ) : (
                    <CardBody className='pb-0'>
                        <h3 className='text-center'>Total Employees</h3>
                        <h2 className='text-center'>0</h2>
                    </CardBody>
                )
                
            )}
            </Card>
        </Col>
        
          {countData.Presents > 0 && (
            <Col md='6'>
              <PercentageChart data={countData.Presents} total={(countData.Presents / (countData.Employees * total_working_days)) * 100} employeeTotal={(countData.Employees * total_working_days)} label='WFO Rate'/>
            </Col>
          )}
          {countData.WFH > 0 && (
            <Col md='6'>
              <PercentageChart data={countData.WFH} total={(countData.WFH / (countData.Employees * total_working_days)) * 100} employeeTotal={(countData.Employees * total_working_days)} label='WFH Rate'/>
            </Col>
          )}
          {(ChartData.categories !== '' && ChartData.percentage !== '') && (
              <BarChart categories={ChartData.categories} percentage={ChartData.percentage} />
          )}
        {/* <Col md='4'>
            <Card className='mb-2'>
            {!loading && (
                (data && Object.values(data).length > 0) ? (
                    <CardBody className='pb-0'>
                        <h3>{countData.head_count ? countData.head_count : 'N/A'}</h3>
                        <p><b>Head Count</b></p>
                    </CardBody>
                ) : (
                    <CardBody className='pb-0'>
                        <h3>N/A</h3>
                        <b>Head Count</b>
                    </CardBody>
                )
                
            )}
            </Card>
        </Col>
        <Col md='4'>
            <Card className='mb-2'>
            {!loading && (
                (data && Object.values(data).length > 0) ? (
                    <CardBody className='pb-0'>
                        <h3>{countData.avg_employee_age ? countData.avg_employee_age : 'N/A'}</h3>
                       <p><b>Average Employee Age</b></p>
                    </CardBody>
                ) :  (
                    <CardBody className='pb-0'>
                        <h3>N/A</h3>
                        <b>Average Employee Age</b>
                    </CardBody>
                )
                
            )}
            </Card>
        </Col>
        <Col md='4'>
            <Card className='mb-2'>
            {!loading && (
                (data && Object.values(data).length > 0) ? (
                    <CardBody className='pb-0'>
                        <h3>{countData.avg_tenure ? Number(countData.avg_tenure.toFixed(2)) : 'N/A'}</h3>
                        <p><b>Average Employee Tenure</b></p>
                    </CardBody>
                ) : (
                    <CardBody className='pb-0'>
                        <h3>N/A</h3>
                        <b>Average Employee Tenure</b>
                    </CardBody>
                )
                
            )}
            </Card>
        </Col>
        {empChartData && Object.values(empChartData).length > 0 && (
            <Col md='12'>
            <EmployeeBarChart  labelColor={labelColor} gridLineColor={gridLineColor} data={empChartData} highestTotalEmployeeCount={highestTotalEmployeeCount}/>
            </Col>
        )}
        {tableData && Object.values(tableData).length > 0 && (
            <Col md='12'>
            <EmployeeDataTable  data={tableData}/>
            </Col>
        )} */}
        
      </Row>
    </Fragment>
  )
}

export default index