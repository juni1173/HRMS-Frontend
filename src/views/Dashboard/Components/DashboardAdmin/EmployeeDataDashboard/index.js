import { Fragment, useState, useEffect, useContext, useRef } from 'react'
import Select from 'react-select'
import {writeFile, utils} from 'xlsx'
// ** Reactstrap Imports
import {
    Row, Col, 
    Card,
    CardBody,
    Spinner, Label, Badge, Button, Progress
  } from 'reactstrap'
import apiHelper from '../../../../Helpers/ApiHelper'
import ChartByDepartment from './ChartByDepartment'

import { FaUsers } from "react-icons/fa"
import { RiNumbersFill } from "react-icons/ri"
import { GrLineChart } from "react-icons/gr"
// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'

// ** Context
import { ThemeColors } from '@src/utility/context/ThemeColors'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'

const index = ({ type }) => {
    const [data, setData] = useState([])
    const isMounted = useRef(true)
    const [tableData, settableData] = useState([])
    const [empChartData, setEmpChartData] = useState([])
    const [loading, setLoading] = useState(false)
    const [departmentDropdown, setdepDropdown] = useState([])
    const [countData, setCountData] = useState({
        head_count: 0,
        avg_employee_age: 0,
        avg_tenure: 0,
        totalPermanentEmployees: 0,
        totalProbationEmployees: 0
    })
    const [highestTotalEmployeeCount, sethighestTotalEmployeeCount] = useState(0)
    const Api = apiHelper()
  // ** Context, Hooks & Vars
  const { colors } = useContext(ThemeColors),
    { skin } = useSkin(),
    labelColor = skin === 'dark' ? '#b4b7bd' : '#6e6b7b',
    successColorShade = '#315180',
    gridLineColor = 'rgba(200, 200, 200, 0.2)'
  const countPermanentEmployeesByDepartment = (arr) => {
        const counts = arr.reduce((acc, item) => {
          const department = item.title
          const permanentCount = item.employees_data.filter(employee => employee.status === 'Permanent').length
          
          if (acc[department]) {
            acc[department] += permanentCount
          } else {
            acc[department] = permanentCount
          }
          
          return acc
        }, {})
      
        // Convert counts to a flat array of objects
        const flatCounts = Object.keys(counts).map(department => ({ department, count: counts[department] }))
        
        return flatCounts
  }
  const countProbationEmployeesByDepartment = (arr) => {
        const counts = arr.reduce((acc, item) => {
          const department = item.title
          const permanentCount = item.employees_data.filter(employee => employee.status === 'Probation').length
          
          if (acc[department]) {
            acc[department] += permanentCount
          } else {
            acc[department] = permanentCount
          }
          
          return acc
        }, {})
      
        // Convert counts to a flat array of objects
        const flatCounts = Object.keys(counts).map(department => ({ department, count: counts[department] }))
        
        return flatCounts
  }
  const countEmployeesByMale = (arr) => {
        const counts = arr.reduce((acc, item) => {
          const department = item.title
          const maleCount = item.employees_data.filter(employee => employee.gender === 'Male').length
          
          if (acc[department]) {
            acc[department] += maleCount
          } else {
            acc[department] = maleCount
          }
          
          return acc
        }, {})
    
      // Convert counts to a flat array of objects
      const flatCounts = Object.keys(counts).map(department => ({ department, count: counts[department] }))
      
      return flatCounts
  }
  const countEmployeesByStatusGender = (arr, type, gender) => {
    const counts = arr.reduce((acc, item) => {
      const department = item.title
      const CountArr = item.employees_data.filter(employee => {
        return employee.gender === gender && employee.status === type
      })
      const Count = CountArr.length
      if (acc[department]) {
        acc[department] += Count
      } else {
        acc[department] = Count
      }
      return acc
    }, {})

  // Convert counts to a flat array of objects
  const flatCounts = Object.keys(counts).map(department => ({ department, count: counts[department] }))
  
  return flatCounts
  }
  const countEmployeesByFemale = (arr) => {
      const counts = arr.reduce((acc, item) => {
        const department = item.title
        const femaleCount = item.employees_data.filter(employee => employee.gender === 'Female').length
        
        if (acc[department]) {
          acc[department] += femaleCount
        } else {
          acc[department] = femaleCount
        }
        
        return acc
      }, {})
  
    // Convert counts to a flat array of objects
    const flatCounts = Object.keys(counts).map(department => ({ department, count: counts[department] }))
    
    return flatCounts
  }
    const calculateCount = (arr) => {
       if (isMounted.current) settableData(arr.flatMap(item => item.employees_data))
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
    
       if (isMounted.current) setCountData(prevState => ({
            ...prevState,
            head_count: totalEmployee,
            avg_employee_age: ageSum / ageCount, // corrected calculation
            avg_tenure: tenureSum / tenureCount // corrected calculation
        }))

        // Graph data
        const labels = arr.map(item => item.title)
        const values = arr.map(item => item.total_employee_count)
        const permanentEmployeesArr = countPermanentEmployeesByDepartment(arr)
          const probationEmployeesArr = countProbationEmployeesByDepartment(arr)
          const maleEmployeesArr = countEmployeesByMale(arr)
          const femaleEmployeesArr = countEmployeesByFemale(arr)
          let permanentMaleCount = countEmployeesByStatusGender(arr, 'Permanent', 'Male')
          let probationMaleCount = countEmployeesByStatusGender(arr, 'Probation', 'Male')
          let permanentFemaleCount = countEmployeesByStatusGender(arr, 'Permanent', 'Female')
          let probationFemaleCount = countEmployeesByStatusGender(arr, 'Probation', 'Female')
          const permanentEmployeesCountArr = permanentEmployeesArr.map(item => item.count)
          const probationEmployeesCountArr = probationEmployeesArr.map(item => item.count)
          const maleCountArr = maleEmployeesArr.map(item => item.count)
          const femaleCountArr = femaleEmployeesArr.map(item => item.count)
           permanentMaleCount = permanentMaleCount.map(item => item.count)
           probationMaleCount = probationMaleCount.map(item => item.count)
           permanentFemaleCount = permanentFemaleCount.map(item => item.count)
           probationFemaleCount = probationFemaleCount.map(item => item.count)
          const totalPermanentEmployees = permanentEmployeesCountArr.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
          const totalProbationEmployees = probationEmployeesCountArr.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
          if (isMounted.current) setCountData(prevState => ({
            ...prevState,
            totalPermanentEmployees,
            totalProbationEmployees
        }))
          const EmpResultChart = {
            labels,
            datasets: [
              {
                label: 'Total',
                maxBarThickness: 10,
                backgroundColor: successColorShade,
                borderColor: colors.primary.main,
                // borderRadius: { topRight: 15, topLeft: 15, bottomRight: 15 },
                data: values,
                stack: 'Stack 0'
              },
              {
                label: 'Permanent',
                maxBarThickness: 10,
                backgroundColor: '#1A5319',
                borderColor: '#1A5319',
                // borderRadius: { topRight: 15, topLeft: 15, bottomRight: 15 },
                data: permanentEmployeesCountArr,
                stack: 'Stack 1'
              },
              {
                label: 'On Probation',
                maxBarThickness: 10,
                backgroundColor: '#B04759',
                borderColor: '#B04759',
                // borderRadius: { topRight: 15, topLeft: 15, bottomRight: 15 },
                data: probationEmployeesCountArr,
                stack: 'Stack 2'
              },
              {
                label: 'Male',
                maxBarThickness: 10,
                backgroundColor: '#478CCF',
                borderColor: '#478CCF',
                // borderRadius: { topRight: 15, topLeft: 15, bottomRight: 15 },
                data: maleCountArr,
                stack: 'Stack 0'
              },
              {
                label: 'Female',
                maxBarThickness: 10,
                backgroundColor: '#36C2CE',
                borderColor: '#36C2CE',
                // borderRadius: { topRight: 15, topLeft: 15, bottomRight: 15 },
                data: femaleCountArr,
                stack: 'Stack 0'
              },
              {
                label: 'Permanent Male',
                maxBarThickness: 10,
                backgroundColor: '#508D4E',
                borderColor: '#508D4E',
                // borderRadius: { topRight: 15, topLeft: 15, bottomRight: 15 },
                data: permanentMaleCount,
                stack: 'Stack 1'
              },
              {
                label: 'Permanent Female',
                maxBarThickness: 10,
                backgroundColor: '#80AF81',
                borderColor: '#80AF81',
                // borderRadius: { topRight: 15, topLeft: 15, bottomRight: 15 },
                data: permanentFemaleCount,
                stack: 'Stack 1'
              },
              {
                label: 'Probation Male',
                maxBarThickness: 10,
                backgroundColor: '#E76161',
                borderColor: '#E76161',
                // borderRadius: { topRight: 15, topLeft: 15, bottomRight: 15 },
                data: probationMaleCount,
                stack: 'Stack 2'
              },
              {
                label: 'Probation Female',
                maxBarThickness: 10,
                backgroundColor: '#F99B7D',
                borderColor: '#F99B7D',
                // borderRadius: { topRight: 15, topLeft: 15, bottomRight: 15 },
                data: probationFemaleCount,
                stack: 'Stack 2'
              }

            ]
          }
         if (isMounted.current) sethighestTotalEmployeeCount(arr.reduce((max, item) => {
                    return item.total_employee_count > max ? item.total_employee_count : max
                }, 0))
        
          if (isMounted.current) setEmpChartData(EmpResultChart)
    }
    
    const getData = async () => {
        
        await Api.get(`/employees/generate/report/`).then(result => {
            
            if (result) {
              if (isMounted.current) setLoading(true)
                if (result.status === 200) {
                    const resultData = result.data
                    if (isMounted.current) setData(resultData)
                    const departments = resultData.map(item => ({
                        label: item.title, 
                        value: item.title
                    }))
                    if (isMounted.current) setdepDropdown(departments)
                    calculateCount(resultData)
                } else {
                    // Api.Toast('error', result.message)
                }
                setTimeout(() => {
                    setLoading(false)
                }, 1000)
                return () => {
                  isMounted.current = false
                }
            } else (
             Api.Toast('error', 'Server not responding!')   
            )
        })  
      }
    
      useEffect(() => {
        getData()
        return () => {
          isMounted.current = false
        }
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
           {type !== 'dashboard' && Object.values(departmentDropdown).length > 0 && (
              <>
                <Col md='12'>
                <Card>
                    <CardBody>
                      <Row>
                      
                      <Col md="9">
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
        ) : <div className='text-center'><Spinner color=''/></div>}
        <Col md='4'>
            <Row>
                <Col md='12'>
            <Card className='mb-2' style={{ background: 'linear-gradient(to right, #0f0c29, #302b63, #24243e)'}}>
            {!loading && (
                (data && Object.values(data).length > 0) ? (
                    <CardBody className='pb-0'>
                        <h3 className='text-white'><FaUsers color="#fff" size={'24px'}/> {countData.head_count ? countData.head_count : 'N/A'}</h3>
                        <p className='text-white'><b>Head Count</b></p>
                    </CardBody>
                ) : (
                    <CardBody className='pb-0'>
                        {/* <h3>N/A</h3> */}
                        <b>Head Count</b>
                    </CardBody>
                )
                
            )}
            </Card>
                </Col>
                <Col md='12'>
                    <Card className='mb-2' style={{ background: 'linear-gradient(to right, #ff512f, #f09819)'}}>
                    {!loading && (
                        (data && Object.values(data).length > 0) ? (
                            <CardBody className='pb-0'>
                                <h3 className='text-white'><RiNumbersFill color="#fff" size={'24px'}/> {countData.avg_employee_age ? countData.avg_employee_age.toFixed(2) : 'N/A'}</h3>
                            <p className='text-white'><b>Average Employee Age</b></p>
                            </CardBody>
                        ) :  (
                            <CardBody className='pb-0'>
                                {/* <h3>N/A</h3> */}
                                <b>Average Employee Age</b>
                            </CardBody>
                        )
                        
                    )}
                    </Card>
                </Col>
                <Col md='12'>
                    <Card className='mb-2'  style={{ background: 'linear-gradient(to right, #403a3e, #be5869)'}}>
                    {!loading && (
                        (data && Object.values(data).length > 0) && (
                            <CardBody className='pb-0'>
                                <h3 className='text-white'><GrLineChart color="#fff" size={'24px'}/> {countData.avg_tenure ? `${Number(countData.avg_tenure.toFixed(2))}` : 'N/A'}</h3>
                                <p className='text-white'><b>Average Employee Tenure</b></p>
                            </CardBody>
                        ) 
                        
                    )}
                    </Card>
                </Col>
                <Col md='12'>
                    <Card className='mb-2'  style={{ background: 'linear-gradient(to right, #2e1437, #948e99)'}}>
                    {!loading && (
                        (data && Object.values(data).length > 0) && (
                            <CardBody className=''>
                                <h3 className='text-white'>{countData.totalPermanentEmployees} Permanents</h3>
                                <Progress className='progress-bar-white' value={Math.round((countData.totalPermanentEmployees / countData.head_count) * 100)} ></Progress> <small className='text-white'>{Math.round((countData.totalPermanentEmployees / countData.head_count) * 100)}% Permanents</small>
                                <h3 className='text-white'>{countData.totalProbationEmployees} Probations</h3>
                                <Progress className='progress-bar-white' value={Math.round((countData.totalProbationEmployees / countData.head_count) * 100)} ></Progress><small className='text-white'>{Math.round((countData.totalProbationEmployees / countData.head_count) * 100)}% Probations</small>
                                {/* <p className='text-white'><b></b></p> */}
                            </CardBody>
                        )
                        
                    )}
                    </Card>
                </Col>
            </Row>
        </Col>
        
        {empChartData && Object.values(empChartData).length > 0 && (
            <Col md='8'>
            <ChartByDepartment  labelColor={labelColor} gridLineColor={gridLineColor} data={empChartData} highestTotalEmployeeCount={highestTotalEmployeeCount}/>
            </Col>
        )}
        
      </Row>
    </Fragment>
  )
}

export default index