import { Fragment, useState, useEffect, useContext } from 'react'
import Select from 'react-select'
import {writeFile, utils} from 'xlsx'
// ** Reactstrap Imports
import {
    Row, Col, 
    Card,
    CardBody,
    Spinner, Label, Badge, Button, CardTitle
  } from 'reactstrap'
import apiHelper from '../../../Helpers/ApiHelper'
import EmployeeBarChart from './EmployeeBarChart'
import EmployeeDataTable from './EmployeeDataTable'

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'

// ** Context
import { ThemeColors } from '@src/utility/context/ThemeColors'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'

const index = () => {
    const [data, setData] = useState([])
    const [tableData, settableData] = useState([])
    const [empChartData, setEmpChartData] = useState([])
    const [loading, setLoading] = useState(false)
    const [departmentDropdown, setdepDropdown] = useState([])
    const [countData, setCountData] = useState({
        head_count: 0,
        avg_employee_age: 0,
        avg_tenure: 0
    })
    const [highestTotalEmployeeCount, sethighestTotalEmployeeCount] = useState(0)
    const Api = apiHelper()
  // ** Context, Hooks & Vars
  const { colors } = useContext(ThemeColors),
    { skin } = useSkin(),
    labelColor = skin === 'dark' ? '#b4b7bd' : '#6e6b7b',
    successColorShade = '#28dac6',
    gridLineColor = 'rgba(200, 200, 200, 0.2)'

    const calculateCount = (arr) => {
        settableData(arr.flatMap(item => item.employees_data))
        let totalEmployee = 0
        let ageSum = 0
        let ageCount = 0
        let tenureSum = 0 
        let tenureCount = 0
    
        arr.forEach(item => { 
            totalEmployee += item.total_employee_count
            if (item.average_employee_age && item.average_employee_age > 0) { 
                ageSum += item.average_employee_age
                ageCount += 1
            }
            if (item.tenure && item.tenure > 0) { 
                tenureSum += item.tenure
                tenureCount += 1
            }
        })
    
        setCountData(prevState => ({
            ...prevState,
            head_count: totalEmployee,
            avg_employee_age: ageSum / ageCount, // corrected calculation
            avg_tenure: tenureSum / tenureCount // corrected calculation
        }))

        // Graph data
        const labels = arr.map(item => item.title)
        const values = arr.map(item => item.total_employee_count)
       
        const EmpResultChart = {
            labels,
            datasets: [
              {
                maxBarThickness: 15,
                backgroundColor: successColorShade,
                borderColor: colors.primary.main,
                borderRadius: { topRight: 15, topLeft: 15 },
                data: values
              }
            ]
          }
          sethighestTotalEmployeeCount(arr.reduce((max, item) => {
                    return item.total_employee_count > max ? item.total_employee_count : max
                }, 0))
        
          setEmpChartData(EmpResultChart)
    }
    
    const getData = async () => {
        
        await Api.get(`/employees/generate/report/`).then(result => {
            
            if (result) {
                setLoading(true)
                if (result.status === 200) {
                    const resultData = result.data
                    setData(resultData)
                    const departments = resultData.map(item => ({
                        label: item.title, 
                        value: item.title
                    }))
                    setdepDropdown(departments)
                    calculateCount(resultData)
                } else {
                    // Api.Toast('error', result.message)
                }
                setTimeout(() => {
                    setLoading(false)
                }, 1000)
            } else (
             Api.Toast('error', 'Server not responding!')   
            )
        })  
      }
    
      useEffect(() => {
        getData()
        }, [setData])
    
        // const CallBack = useCallback(() => {
        //     getData()
        //   }, [requestData])
        const handleExport = () => {
          const csvjson = tableData.map(employee => ({
            id: employee.emp_id,
            name: employee.employee_name,
            status: employee.status,
            Gender: employee.gender,
            Education: employee.degree_title,
            Age: employee.age,
            Date_Of_Birth: employee.dob,
            Date_Of_Joining: employee.joining_date,
            tenure: employee.tenure,
            department: employee.department,
            salary: employee.salary,
            projects: employee.projects ? employee.projects.join(', ') : '',
            email: employee.email
            // Add other properties as needed
          }))
              const headings = [
                [
                'Emp ID',
                'Employee Name',
                'Status',
                'Gender',
                'Education',
                'Age',
                'Date Of Birth',
                'Date Of Joining',
                'Tenure At Kavtech',
                'Department',
                'Salary',
                'Project',
                'Email'
                  ]
              ]
              const wb = utils.book_new()
              const ws = utils.json_to_sheet([])
              utils.sheet_add_aoa(ws, headings)
              utils.sheet_add_json(ws, csvjson, { origin: 'A2', skipHeader: true })
              utils.book_append_sheet(wb, ws, 'Report')
              writeFile(wb, 'Employee Report.xlsx')
          }
    const onChangeDepartmentHandler = (e) => {
        if (e) {
            const filteredData = data.filter(item => item.title === e)
            calculateCount(filteredData)
        } else getData()
    }
  return (
    <Fragment>
     
      <Row className='match-height'>
      {!loading ? (
            <>
           { Object.values(departmentDropdown).length > 0 && (
              <>
                <Col md='12'>
                <Card>
                    <CardBody>
                      <Row>
                      <Col md='9'>
                          <Label className="form-label">
                            Select Department <Badge color='light-danger'>*</Badge>
                            </Label>
                            <Select
                                isClearable={true}
                                className='react-select'
                                classNamePrefix='select'
                                name="scale_group"
                                options={departmentDropdown ? departmentDropdown : ''}
                                onChange={ (e) => { onChangeDepartmentHandler(e ? e.value : onChangeDepartmentHandler()) }}
                                menuPlacement="auto" 
                                menuPosition='fixed'
                            />
                      </Col>
                      <Col md='3'>
                      <Button className='btn btn-success float-right mt-2' onClick={handleExport}>Export Report</Button>
                      </Col>
                      </Row>
                    </CardBody>
                </Card>
                </Col>
              </>
            )}
           
            </>
        ) : <div className='text-center'><Spinner color='white'/></div>}
        <Col md='4'>
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
                        <h3>{countData.avg_employee_age ? (countData.avg_employee_age.toFixed(2)) : 'N/A'}</h3>
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
        )}
        
      </Row>
    </Fragment>
  )
}

export default index