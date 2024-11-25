import React, {useState} from 'react'
import { Card, Col, Row, CardBody, CardHeader, CardText, Button, Badge } from 'reactstrap'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js'
import { FaChartPie } from "react-icons/fa"
import { BiSearchAlt  } from "react-icons/bi"
import { TbReportAnalytics } from "react-icons/tb"
import EmployeeListCard from './EmployeeListCard'
import { selectThemeColors } from '@utils'
import Select, { components } from 'react-select'
import Avatar from '@components/avatar'
import defaultAvatar from '@src/assets/images/avatars/user_blank.png'
import DepartmentBasedLineGraph from './Components/DepartmentBasedLineGraph'
import ExportExcel from './Components/ExportExcel'
// Register the necessary components from Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, Title)

const TotalKpiAndStatusCard = ({ employees, dropdownData, searchComponent, searchTool, evaluationReport }) => {
  // Calculate the total KPIs
  const totalKpis = employees.reduce((total, employee) => total + employee.total_kpis, 0)
  const countEmployeesWithZeroKpis = employees.reduce((count, employee) => {
    return employee.total_kpis === 0 ? count + 1 : count
  }, 0)
    const [statusLevel, setStatusLevel] = useState(null)
    const [filteredData, setFilteredData] = useState(employees)
    const [zeroKpiEmployees, setZeroKpiEmployees] = useState(false)
  // Group status counts by status title and status level
  const statusCounts = employees.reduce((acc, employee) => {
    employee.employee_kpis_data.status_count_details.forEach(status => {
      const statusKey = `${status.status_title}_${status.status_level}` // Combine title and level as the key
      if (!acc[statusKey]) {
        acc[statusKey] = 0
      }
      acc[statusKey] += status.status_count
    })
    return acc
  }, {})

  // Prepare data for pie chart
  const statusLabels = Object.keys(statusCounts)
  const statusData = statusLabels.map(label => statusCounts[label])
  const materialColors = [
    '#2196F3', // Blue
    '#4CAF50', // Green
    '#FF5722', // Red
    '#FFC107', // Amber
    '#9C27B0', // Purple
    '#009688', // Teal
    '#3F51B5', // Indigo
    '#E91E63', // Pink
    '#00BCD4', // Cyan
    '#8BC34A' // Light Green
  ]
  const pieData = {
    labels: statusLabels.map(item => item.split('_')[0]),
    datasets: [
      {
        data: statusData,
        backgroundColor: materialColors,
        hoverBackgroundColor: materialColors.map(color => `${color}AA`) // Slightly lighter color for hover effect
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'KPI and Status Distribution',
        // font: {
        //   size: 14,
        //   weight: 'bold'
        // },
        padding: {
          bottom: 10 // Reduced bottom padding to bring title closer
        }
      },
      tooltip: {
        enabled: true // Enable tooltips
      },
      legend: {
        display: true, // Show legend
        position: 'left', // Place legend on the right side of the chart
        labels: {
          font: {
            size: 8 // Adjust the font size of the legend
          },
          padding: 15 // Optional: space between the legend items
        }
      }
    },
    layout: {
      padding: {
        top: 10, // Reduce padding between title and chart
        bottom: 5,
        left: 5,
        right: 10 // Make sure there’s space for the legend on the right
      }
    },
    aspectRatio: 1.5 // You can adjust this to help the chart fit nicely
  }
  
const statusFilterFunction = status => {
    if (status) {
        if (status !== statusLevel) {
            setStatusLevel(status)
            const filteredArray = employees.filter(employee => {
                // Check if any of the status_count_details has the matching status_level
                return employee.employee_kpis_data.status_count_details.some(val => val.status_level === Number(status))
              })
              setFilteredData(filteredArray)
              setZeroKpiEmployees(false)
        } else {
            setStatusLevel(null)
            setZeroKpiEmployees(false)
            setFilteredData(employees)
        }
    } else {
        setStatusLevel(null)
        setZeroKpiEmployees(false)
        setFilteredData(employees)
    }
}
const noKpiFilterFunction = () => {
    if (!zeroKpiEmployees) {
        const filteredArray = employees.filter(employee => {
            // Check if any of the status_count_details has the matching status_level
            return employee.total_kpis === 0
          })
          setFilteredData(filteredArray)
          setZeroKpiEmployees(true)
          setStatusLevel(null)
    } else {
        setFilteredData(employees)
        setStatusLevel(null)
        setZeroKpiEmployees(false)
    }
      
}
const EmployeeDropdownComponent = ({ data, ...props }) => {
    return (
      <components.Option {...props}>
        <div className='d-flex flex-wrap align-items-center'>
          <Avatar className='my-0 me-1' size='sm' img={data.avatar ? data.avatar : defaultAvatar} />
          <div>{data.label}</div>
        </div>
      </components.Option>
    )
  }
const employeeFilterFunction = (arr) => {
        if (arr) {
                const filteredArray = filteredData.filter(employee => {
                    // Check if any of the status_count_details has the matching status_level
                    return employee.employee_id === arr.value
                  })
                  setFilteredData(filteredArray)
            
        } else {
            setStatusLevel(null)
            setZeroKpiEmployees(false)
            setFilteredData(employees)
        }
}
  return (
    <div className="container mt-1">
        <Card>
            <CardHeader className='pb-0'>
                {/* <CardTitle tag='h4'>KPI Panel</CardTitle> */}
                {/* <UncontrolledDropdown className='chart-dropdown'>
                <DropdownToggle color='' className='bg-transparent btn-sm border-0 p-50'>
                    Last 7 days
                </DropdownToggle>
                <DropdownMenu end>
                    {data.last_days.map(item => (
                    <DropdownItem className='w-100' key={item}>
                        {item}
                    </DropdownItem>
                    ))}
                </DropdownMenu>
                </UncontrolledDropdown> */}
            </CardHeader>
            <CardBody>
                <Row>
                    <Col md="4">{searchComponent && searchComponent()}</Col>
                    <Col md="4">
                        <Card 
                            className={(!statusLevel) ? 'mb-0 filters-card border-2' : 'mb-1 filter-card border-2'}
                            onClick={() => statusFilterFunction()} // Adjust width with maxWidth
                        >
                            <CardBody className='pb-1'>
                                <div className='d-flex justify-content-between'>
                                        <div><FaChartPie size={'50px'} color='#302b63' className='pr-5'/> <span className='font-large-1'>KPIs</span></div>
                                        <div><h1 className='font-large-2 fw-bolder' style={{color: '#302b63'}}>{totalKpis}</h1></div>
                                </div>
                                
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md="4" className='px-0 py-1'>
                        <div className='d-flex align-items-center justify-content-end'>
                        <Button.Ripple outline className='round mr-1' size='sm' color='primary' onClick={searchTool}>
                            <BiSearchAlt size={14}/>
                            <span className='align-middle ms-10'>Search Tool</span>
                        </Button.Ripple>
                        <Button.Ripple outline className='round mr-1' size='sm' color='primary' onClick={evaluationReport}>
                            <TbReportAnalytics size={14}/>
                            <span className='align-middle ms-10'>Evaluations</span>
                        </Button.Ripple>
                        <ExportExcel data={employees} />
                            {/* <button className='btn btn-outline-primary rounded-pill small'><span style={{paddingTop:'15px'}}>Export Report</span></button> */}
                        </div>
                    </Col>
                    <Col sm='6' md='6'  className='border-bottom border-right'>
                        <div style={{width:'500px', height:'340px'}}>
                                <Pie data={pieData} options={options}/>
                        </div>
                </Col>
                <Col sm='6' md='6'  className='border-bottom '>
                    <DepartmentBasedLineGraph EmployeeData={employees} />
                </Col>
                <Col md={12}>
                    <div className="tags-input-container">
                        <div className={zeroKpiEmployees ? 'tag-item filters-active' : 'tag-item cursor-pointer'} onClick={() => noKpiFilterFunction()}>
                            <span className="text"><Badge pill color='primary' >{countEmployeesWithZeroKpis}</Badge> No Kpi Employees</span>
                        </div>
                    {statusLabels.map((label, idx) => {
                            const [labelText, level] = label.split('_')
                            return (
                                <div className={(statusLevel && statusLevel === Number(level)) ? 'tag-item filters-active' : 'tag-item cursor-pointer'} key={idx} onClick={() => statusFilterFunction(Number(level))}>
                                <span className="text"><Badge pill color='primary' >{statusCounts[label]}</Badge> {labelText}</span>
                            </div>
                            )
                        })}
                        {(zeroKpiEmployees || statusLevel) && (
                            <div className='w-25'>
                            <Select
                                id='employees'
                                className='react-select'
                                classNamePrefix='select'
                                isClearable={true}
                                options={dropdownData.employeesDropdown}
                                theme={selectThemeColors}
                                placeholder="Employee Search"
                                // value={dropdownData.employeeDropdown.length ? [...dropdownData.employeeDropdown] : null}
                                onChange={e => employeeFilterFunction(e)}
                                components={{
                                Option: EmployeeDropdownComponent
                                }}
                                styles={{
                                    control: (provided) => ({
                                      ...provided,
                                      borderRadius: '30px',  // Adjust the value as needed (30px is just an example)
                                      borderColor: '#ccc',  // Optional: change the border color
                                      padding: '2px'       // Optional: Add padding if necessary
                                    }),
                                    dropdownIndicator: (provided) => ({
                                      ...provided,
                                      color: '#ccc'  // Optional: change the dropdown indicator color
                                    }),
                                    clearIndicator: (provided) => ({
                                      ...provided,
                                      color: '#ccc'  // Optional: change the clear indicator color
                                    })
                                  }}
                            />
                            </div>
                        )}
                    </div>
                    <EmployeeListCard data={filteredData} dropdownData={dropdownData} statusLevel={statusLevel}/>
                </Col>
                </Row>
            </CardBody>
            </Card>
      <Row>
     
        
      </Row>
    </div>
  )
}

export default TotalKpiAndStatusCard
