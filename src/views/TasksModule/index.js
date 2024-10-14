// ** React Imports
import { Fragment, useState, useEffect, useCallback } from 'react'
// ** Todo App Components
import Tasks from './Components/Tasks'
import apiHelper from '../Helpers/ApiHelper'
import Select from 'react-select'
import * as XLSX from 'xlsx'
// ** Styles
import '@styles/react/apps/app-todo.scss'
import { Card, CardBody, Spinner, TabContent, TabPane, Badge, Row, Col, Button, Modal, ModalBody, ModalHeader, Table } from 'reactstrap'
import { Download, Filter, RefreshCcw, Save, Search } from 'react-feather'
import { TbReportAnalytics } from "react-icons/tb"
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import ReactPaginate from 'react-paginate'

const index = () => {
    const Api = apiHelper()
    // ** States
    const [loading, setLoading] = useState(false)
    const [taskloading, setTaskLoading] = useState(false)
    const [filterLoading, setFilterLoading] = useState(false)
    const [projects, setProjects] = useState([])
    const [activeProject, setActiveProjects] = useState('')
    const [projDropdown, setProjectDropdown] = useState([])
    const [tasks, setTasks] = useState([])
    const [pagination, setPagination] = useState(
        {currentPage: 1, totalPages: null}
    )
    const [activeTab, setActiveTab] = useState(0)
    const [selectedTask, setSelectedTask] = useState(null)
    const [sortState, setSortState] = useState('all-task')
    const [filterStatus, setFilterStatus] = useState(false)
    const [typeDropdown, setTypeDropdown] = useState([])
    const [statusDropdown, setStatusDropdown] = useState([])
    const [employeeDropdown, setEmployeeDropdown] = useState([])  
    const [centeredModal, setCenteredModal] = useState(false)
    const [reportStartDate, setReportStartDate] = useState('')
    const [reportEndDate, setReportEndDate] = useState('')
    const [csvExportData, setCsvExportData] = useState(null)
    const [workbook, setWorkbook] = useState(null)
    const [projectRole, setProjectRole] = useState('')
    const [selectedAssignee, setSelectedAssignee] = useState([{ value: '', label: 'select employee' }])
    const priority_choices = [
        {value: 'Low', label: 'Low'},
        {value: 'Medium', label:'Medium'},
        {value: 'High', label:'High'}
    ]
    const projectDropdown =  (projectsData) => {
    const arr = []
    if (projectsData) {
        for (const pro of projectsData) {
            arr.push({value: pro.id, label: pro.name})
        }
    }
    return arr
    }
    const [query, setQuery] = useState({
    assign_to: null,
    task_type: null,
    priority: null,
    status: null
    }) 
    // const getTaskTypes = async (id = null) => {
    //     const formData = new FormData()
    //     if (id) {
    //         formData['project'] = id
    //     }
    //     await Api.jsonPost(`/taskify/task/types/pre/data/`, formData).then(result => {
    //         if (result) {
    //             if (result.status === 200) {
    //                 const typesData = result.data
    //                 if (Object.values(typesData).length > 0) {
    //                     const defaultTypesArr = []
    //                     const projectTypesArr = []
    //                     for (const default_types of typesData.default_task_type) {
    //                         defaultTypesArr.push({value: default_types.id, label: default_types.title, type: 'default_task_type'})
    //                     }
    //                     if (Object.values(typesData.project_task_type).length > 0) {
    //                         for (const project_types of typesData.project_task_type) {
    //                             projectTypesArr.push({value: project_types.id, label: project_types.title, type: 'project_task_type'})
    //                         }
    //                     }
    //                     setTypeDropdown([...defaultTypesArr, ...projectTypesArr])
    //                 }
    //             } else {
    //                 Api.Toast('error', result.message)
    //                 setTypeDropdown(false)
    //             }
    //         } else {
    //             Api.Toast('error', 'Server error!')
    //         }
    //     })
    // } 
    // const getStatuses = async (id = null) => {
    //     const formData = new FormData()
    //     if (id) {
    //         formData['project'] = id
    //     }
    //     await Api.jsonPost(`/taskify/task/status/pre/data/`, formData).then(result => {
    //         if (result) {
    //             if (result.status === 200) {
    //                 const statusData = result.data
    //                 if (Object.values(statusData).length > 0) {
    //                     const defaultStatusArr = []
    //                     const projectStatusArr = []
    //                     for (const status of statusData.default_status) {
    //                         defaultStatusArr.push({value: status.id, label: status.title})
    //                     }
    //                     if (Object.values(statusData.project_status).length > 0) {
    //                         for (const status of statusData.project_status) {
    //                             projectStatusArr.push({value: status.id, label: status.title})
    //                         }
    //                     }
                        
    //                     setStatusDropdown([...defaultStatusArr, ...projectStatusArr])
    //                 }
    //             } else {
    //                 Api.Toast('error', result.message)
    //             }
    //         } else {
    //             Api.Toast('error', 'Server error!')
    //         }
    //     })
    // }  
    const getEmployees = async (id) => {
    await Api.get(`/taskify/get/project/employee/${id}/`).then(result => {
        if (result) {
            if (result.status === 200) {
                const employeeData = result.data
                if (employeeData.length > 0) {
                    const arr = []
                    for (const emp of employeeData) {
                        arr.push({value: emp.id, label: emp.name, img:emp.profile_image})
                    }
                    setEmployeeDropdown(arr)
                }
            } else {
                Api.Toast('error', result.message)
            }
        } else {
            Api.Toast('error', 'Server error!')
        }
    })
    }
    const onChangeTaskQueryHandler = (InputName, InputType, e) => {
        if (!e) {
            e = {
              target: InputName,
              value: null
            }
            setQuery(prevState => ({
                ...prevState,
                [InputName] : null
                
                }))
                return false
          }
        let InputValue
        if (InputType === 'input') {
        
        InputValue = e.target.value
        } else if (InputType === 'select') {
        
        InputValue = e
        } else if (InputType === 'date') {
            let dateFomat = e.split('/')
                dateFomat = `${dateFomat[2]}-${dateFomat[1]}-${dateFomat[0]}`    
            InputValue = dateFomat
        } else if (InputType === 'file') {
            InputValue = e.target.files[0].name
        }
    
        setQuery(prevState => ({
        ...prevState,
        [InputName] : InputValue
        
        }))
    }
    const getProjectPreData = async (id) => {
        if (id) {
            await Api.get(`/taskify/get/project/pre/data/${id}/`).then(result => {
                if (result) {
                    if (result.status === 200) {
                        const resultData = result.data
                        const employeeData = resultData.project_employees
                        if (Object.values(resultData).length > 0) {
                            const defaultTypesArr = []
                            const projectTypesArr = []
                            for (const default_types of resultData.default_task_type) {
                                defaultTypesArr.push({value: default_types.id, label: default_types.title, type: 'default_task_type'})
                            }
                            if (Object.values(resultData.project_task_type).length > 0) {
                                for (const project_types of resultData.project_task_type) {
                                    projectTypesArr.push({value: project_types.id, label: project_types.title, type: 'project_task_type'})
                                }
                            }
                            setTypeDropdown([...defaultTypesArr, ...projectTypesArr])
                        }
                        if (employeeData.length > 0) {
                            const arr = []
                            for (const emp of employeeData) {
                                arr.push({value: emp.id, label: emp.name, img:emp.profile_image})
                            }
                            setEmployeeDropdown(arr)
                        }
                        if (Object.values(resultData).length > 0) {
                            const defaultStatusArr = []
                            const projectStatusArr = []
                            for (const status of resultData.default_status) {
                                defaultStatusArr.push({value: status.id, label: status.title})
                            }
                            if (Object.values(resultData.project_status).length > 0) {
                                for (const status of resultData.project_status) {
                                    projectStatusArr.push({value: status.id, label: status.title})
                                }
                            }
                            
                            setStatusDropdown([...defaultStatusArr, ...projectStatusArr])
                        }
                        if (Object.values(resultData).length > 0) {
                            const projRole = resultData.employee_project_role
                            if (projRole.length > 0) {
                                setProjectRole(projRole[0])
                            }
                        }
                        
                    } else {
                        Api.Toast('error', result.message)
                        setTypeDropdown(false)
                    }
                } else {
                    Api.Toast('error', 'Server error!')
                }
            })
        }
    } 
    const getTasks = async (id = null, sortData = null, type = null) => {
        setTaskLoading(true)
        let url = ''
        if (id) {
            url = `/taskify/get/project/all/task/${id}/`
            const formData = new FormData()
            if (sortData) {
                setSortState(sortData)
                if (sortData === 'assign-to-me') formData['assign_to'] = Api.user.id
                if (sortData === 'created-by-me') formData['employee'] = Api.user.id
            }
            if (query.status) formData['status'] = query.status
            if (query.assign_to) formData['assign_to'] = query.assign_to
            if (query.priority) formData['priority'] = query.priority
            if (query.task_type) formData['task_type'] = query.task_type
            if (pagination.currentPage) formData['page'] = pagination.currentPage
            await Api.jsonPost(url, formData).then(tasksResult => {
                if (tasksResult) {
                    if (tasksResult.status === 200) {
                        setPagination(prevState => ({
                            ...prevState,
                            totalPages : tasksResult.data.total_pages
                            
                            }))
                        const tasksData = tasksResult.data.task_data
                        setTasks(tasksData)
                        getProjectPreData(id)
                    } else Api.Toast('error', tasksResult.message)
                } else {
                    Api.Toast('error', 'Server error!')
                }
            })
            setTimeout(() => {
                setTaskLoading(false)
            }, 500)
            return false
        }
        if (id && type === 'my_tasks') {
            url = `/taskify/get/project/assign/task/${id}/`
        }
       
        await Api.get(url).then(tasksResult => {
            if (tasksResult) {
                if (tasksResult.status === 200) {
                    const tasksData = tasksResult.data
                    setTasks(tasksData)
                } else Api.Toast('error', tasksResult.message)
            } else {
                Api.Toast('error', 'Server error!')
            }
        })
        setTimeout(() => {
            setTaskLoading(false)
        }, 500)
    }   
    const getData = async () => {
        setLoading(true)
        await Api.get(`/taskify/get/project/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    const projectsData = result.data
                    if (projectsData.length > 0) {
                        setProjects(projectsData)
                        setProjectDropdown(projectDropdown(projectsData))
                        getTasks(projectsData[0].id)
                        setActiveTab(projectsData[0].id)
                        setActiveProjects({value: projectsData[0].id, label: projectsData[0].name})
                        // getTaskTypes(projectsData[0].id)
                        // getStatuses(projectsData[0].id)
                        // getEmployees(projectsData[0].id)
                    }
                } else {
                    Api.Toast('error', result.message)
                }
            } else {
                Api.Toast('error', 'Server error!')
            }
        })
        setTimeout(() => {
            setLoading(false)
        }, 500)
    }
    const toggleTab = (proj, type = null) => {
        setQuery(prev => ({
            ...prev,
            [type]: type
        }))
        setActiveProjects(proj)
        setActiveTab(proj.value)
        setCsvExportData(null)
        getTasks(proj.value, query.type, query.status)
        getEmployees(proj.value)
    }
    const filterClick = () => {
        setFilterStatus(!filterStatus)
        setFilterLoading(true)
        setTimeout(() => {
            setFilterLoading(false)
        }, 500)
    }
    const handleAssigneeChange = (assignee) => {
        setSelectedAssignee(assignee)
    }
    const CustomOption = (props) => {
        const { data, innerRef, innerProps, isFocused, isSelected } = props
        
        return (
            <div
            ref={innerRef}
            {...innerProps}
            className={`d-flex align-items-center p-2 ${isSelected ? 'bg-primary text-white' : isFocused ? 'bg-primary text-white' : 'bg-light'}`}
            style={{ cursor: 'pointer' }}
            >
            <img 
                src={data.img} 
                alt={data.label} 
                className="rounded-circle me-2"
                style={{ width: '30px', height: '30px' }}
            />
            <span>{data.label}</span>
            </div>
        )
    }
  // ** Get Tasks on mount & based on dependency change
    useEffect(() => {
            getData()
    }, [setProjects])
    const CallBack = useCallback((id, selectedTaskid, sort) => {
        setActiveTab(id)
        getTasks(id, sort)
        if (selectedTaskid) setSelectedTask(selectedTaskid)
    }, [tasks, sortState])
    const applyFilters = () => {
        getTasks(activeTab, sortState)
    }
    const Previous = () => {
        return <span className='align-middle d-none d-md-inline-block'>Prev</span>
      }
      
      const Next = () => {
        return <span className='align-middle d-none d-md-inline-block'>Next </span>
      }
    const handlePageChange = (selected) => {
        const newPage = selected.selected + 1 // Convert to one-based index
        console.warn('Current Page:', newPage)
        // Update your pagination state
        setPagination(prev => ({ ...prev, currentPage: newPage }))
        // You can also fetch new data or perform other actions here
        getTasks(activeTab, sortState)
      }
    const theme = (theme) => ({
        ...theme,
        spacing: {
            ...theme.spacing,
            controlHeight: 30,
            baseUnit: 2
        }
    })
    const customStyles = {
    control: (base, state) => ({
        ...base,
        background: "#2229351a",
        fontWeight: "600",
        textAlign: "center",
        cursor: 'pointer',
        // match with the menu
        borderRadius: state.isFocused ? "3px 3px 0 0" : 3,
        // Overwrittes the different states of border
        borderColor: state.isFocused ? "yellow" : "green",
        // Removes weird border around container
        boxShadow: state.isFocused ? null : null,
        "&:hover": {
            // Overwrittes the different states of border
            borderColor: state.isFocused ? "red" : "gray"
        }
        })
    } 
    const getAllDatesBetween = (startDate, endDate) => {
        const dates = []
        const currentDate = new Date(startDate)
        const end = new Date(endDate)

        while (currentDate <= end) {
            dates.push(currentDate.toISOString().split('T')[0]) // Format as YYYY-MM-DD
            currentDate.setDate(currentDate.getDate() + 1)
        }

        return dates
    }
    const splitFunction = value => {
        const [integerPart, decimalPart] = value.split('.')
        if (decimalPart === '00') return integerPart
        return value
    } 
      const ExportReport = async () => {
        if (reportStartDate !== '' && reportEndDate !== '' && activeProject) {
            const formData = new FormData()
            formData['start_date'] = reportStartDate
            formData['end_date'] = reportEndDate
            if (selectedAssignee.value !== '') formData['employee'] = selectedAssignee.value
            try {
                const result = await Api.jsonPost(`/taskify/get/task/report/${activeProject.value}/`, formData)
                if (result.status === 200) {
                    const csvRows = []
                    const headerRow = [
                        "Title", "Parent", "Assigned_to", "Status", "Type", "Priority", 
                        "Planned_hours", "Actual_hours"
                    ]

                    const allDates = getAllDatesBetween(reportStartDate, reportEndDate)
                    headerRow.push(...allDates)
                    csvRows.push(headerRow)
                    
                    // Populate the data rows
                    result.data.forEach(item => {
                        const row = [
                            item.title,
                            item.parent_title || 'N/A',
                            item.assign_to_name,
                            item.status_title || 'N/A',
                            item.task_type_title || 'N/A',
                            item.priority || 'N/A',
                            splitFunction(item.planned_hours) || 'N/A',
                            splitFunction(item.actual_hours) || 'N/A'
                        ]

                         // Create a map for hours spent on each date
                         const dateToHoursMap = {}
                         if (item.task_time_logs) {
                            item.task_time_logs.forEach(log => {
                                const logDate = new Date(log.date).toISOString().split('T')[0] // Format as YYYY-MM-DD
                                dateToHoursMap[logDate] = splitFunction(log.hours_spent) || '0' // Default to '0.00' if no hours
                            })
                         }
 
                         // Fill the row with hours for each date in the range
                         allDates.forEach(date => {
                             row.push(dateToHoursMap[date] || '0') // Use '0.00' if no log exists for that date
                         })
 
                         csvRows.push(row)
                    })
                    setCsvExportData(csvRows)
                         // Create a new workbook
                    const ws = XLSX.utils.aoa_to_sheet(csvRows)
                    const wb = XLSX.utils.book_new()
                    XLSX.utils.book_append_sheet(wb, ws, "Report")

                    // Set column widths
                    ws['!cols'] = [
                        { wpx: 150 }, // Title
                        { wpx: 150 }, // Parent
                        { wpx: 150 }, // Assigned_to
                        { wpx: 100 }, // Status
                        { wpx: 100 }, // Type
                        { wpx: 100 }, // Priority
                        { wpx: 100 }, // Planned_hours
                        { wpx: 100 }, // Actual_hours
                        ...allDates.map(() => ({ wpx: 100 })) // Dates columns
                    ]
                    // Set header style (height and bold)
                    const headerCellStyle = { 
                        font: { bold: true }, 
                        alignment: { horizontal: "center" }
                    }
                    // Apply style to the header row
                    const headerRowIndex = 0 // First row (header)
                    for (let col = 0; col < headerRow.length; col++) {
                        const cell = ws[XLSX.utils.encode_cell({ r: headerRowIndex, c: col })]
                        if (cell) {
                            cell.s = headerCellStyle // Apply style
                        }
                    }
                    // Set row height for the header
                    ws['!rows'] = [{ hpx: 30 }] // Height in pixels for the header row

                    // Store the workbook in state
                    setWorkbook(wb)
                } else {
                    Api.Toast('error', result.message)
                }
            } catch (error) {
                console.error(error)
                Api.Toast('error', 'An error occurred while fetching the report.')
            }
        } 
      }
      const DownloadReport = () => {
        if (csvExportData) {
            if (workbook) {
                // Generate Excel file
                XLSX.writeFile(workbook, `report_${activeProject.label}_${new Date().toISOString().split('T')[0]}.xlsx`)
            } else {
                alert('Please generate the report first.')
            }
        }
      }
  return (
    <Fragment>
            <Card>
                <CardBody className='pt-1'>
                    <Row>
                        <Col md="6">
                            <h3>Task Management</h3>
                        </Col>
                        <Col md="5">
                            {!loading && (
                                <Select
                                isClearable={false}
                                className='react-select w-75 float-right mb-1'
                                styles={customStyles}
                                classNamePrefix='select'
                                theme={theme}
                                name="project"
                                options={projDropdown}
                                placeholder="Select Project"
                                components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
                                defaultValue={projDropdown.length > 0 && projDropdown[0]}
                                isLoading={taskloading}
                                menuPlacement="auto"
                                menuPosition="fixed"
                                onChange={ (e) => { toggleTab(e) }}
                            />
                            )}
                        </Col>
                        {(projectRole !== '' && Object.values(projectRole).length > 0 && projectRole.role_level < 3
                        && projectRole.role_level > 0) && (
                            <Col md="1">
                                <TbReportAnalytics className='cursor-pointer' title='Report' size={'30'} color="blue" onClick={() => setCenteredModal(!centeredModal)}/>
                            </Col>
                        )}
                    </Row>
            <div className='d-flex justify-content-between'>
                <div>
                <b>Sort by  </b> <Badge>{sortState}</Badge>
                 
                </div>
                <div>
                <span onClick={filterClick} className='cursor-pointer'><Filter color={filterStatus ? 'darkblue' : 'gray'} size={'18'} title="Filters"/> Filters </span>
                </div>
            </div> 
                {filterStatus && (
                    !filterLoading ? (
                        <div className='row d-flex justify-content-between mb-1'>
                        <div className='col-md-2' style={{minWidth:'200px'}}>
                            <label className='form-label'>
                                Type  <RefreshCcw color='darkblue' size={'14'} onClick={() => onChangeTaskQueryHandler('task_type', 'select', null)}/>
                            </label>
                            <Select
                                isClearable={false}
                                className='react-select'
                                classNamePrefix='select'
                                name="type"
                                options={typeDropdown ? typeDropdown : ''}
                                value={typeDropdown.find(option => option.value === query.task_type) || null}
                                onChange={ (e) => { onChangeTaskQueryHandler('task_type', 'select', e.value) }}
                            />
                        </div>
                        <div className='col-md-2' style={{minWidth:'200px'}}>
                            <label className='form-label'>
                                Status  <RefreshCcw color='darkblue' size={'14'} onClick={() => onChangeTaskQueryHandler('status', 'select', null)}/>
                            </label>
                            <Select
                                isClearable={false}
                                className='react-select'
                                classNamePrefix='select'
                                name="status"
                                options={statusDropdown ? statusDropdown : ''}
                                value={statusDropdown.find(option => option.value === query.status) || null}
                                onChange={ (e) => { onChangeTaskQueryHandler('status', 'select', e.value) }}
                            />
                        </div>
                        <div className='col-md-2' style={{minWidth:'200px'}}>
                            <label className='form-label'>
                                Priority  <RefreshCcw color='darkblue' size={'14'} onClick={() => onChangeTaskQueryHandler('priority', 'select', null)}/>
                            </label>
                            <Select
                                isClearable={false}
                                className='react-select'
                                classNamePrefix='select'
                                name="priority"
                                options={priority_choices ? priority_choices : ''}
                                value={priority_choices.find(option => option.value === query.priority) || null}
                                onChange={ (e) => { onChangeTaskQueryHandler('priority', 'select', e.value) }}
                            />
                        </div>
                        <div className='col-md-2' style={{minWidth:'200px'}}>
                            <label className='form-label'>
                                Assignee  <RefreshCcw color='darkblue' size={'14'} onClick={() => onChangeTaskQueryHandler('assign_to', 'select', null)}/>
                            </label>
                            <Select
                                isClearable={false}
                                className='react-select'
                                classNamePrefix='select'
                                name="assign"
                                options={employeeDropdown ? employeeDropdown : ''}
                                value={employeeDropdown.find(option => option.value === query.assign_to) || null}
                                onChange={ (e) => { onChangeTaskQueryHandler('assign_to', 'select', e.value) }}
                            />
                        </div>
                        <div className='col-md-2' style={{minWidth:'200px'}}>
                            <Button color="primary" className="btn-next mt-2" onClick={applyFilters}>
                                <span className="align-middle d-sm-inline-block">
                                    Apply
                                </span>
                                <Save size={14} className="align-middle ms-sm-25 ms-0"></Save>
                            </Button>
                        </div>
                    </div>                    
                    ) : <div className='text-center'><Spinner size={'16'} type='grow' color='blue'/></div>
                )}
                <hr></hr>
                <div className='todo-application'>
                {!taskloading ? (
                    <TabContent activeTab={activeTab}>
                        <TabPane tabId={activeTab}>
                            <Tasks
                                data={tasks}
                                projectsData={projects}
                                CallBack={CallBack}
                                selectedTaskid={selectedTask ? selectedTask : null}
                                project_id={activeTab}
                                employees={employeeDropdown}
                                priorities={priority_choices}
                                role={projectRole}
                                types={typeDropdown} // Ensure it's passed when available
                            />
                        </TabPane>
                    </TabContent>
                ) : (
                    <div className="text-center">
                        <Spinner size="18" /> Loading tasks...
                    </div>
                )}
                                <ReactPaginate
                                pageCount={ Math.ceil(pagination.totalPages) || 0 }
                                breakLabel='...'
                                nextLabel={<Next />}
                                pageRangeDisplayed={5}
                                marginPagesDisplayed={2}
                                onPageChange={handlePageChange} // This will handle page changes
                                forcePage={pagination.currentPage - 1} // Set the current page (ReactPaginate uses zero-based index)
                                previousLabel={<Previous />}
                                containerClassName='pagination mt-2'
                                pageLinkClassName='page-num'
                                previousLinkClassName='page-num'
                                nextLinkClassName='page-num'
                                activeLinkClassName='active'
                              />
                </div>
                 </CardBody>
            </Card> 
            <Modal isOpen={centeredModal} toggle={() => setCenteredModal(!centeredModal)} className={csvExportData ? 'modal-dialog-centered modal-xl' : 'modal-dialog-centered modal-lg'}>
                <ModalHeader toggle={() => setCenteredModal(!centeredModal)}>Export Report</ModalHeader>
                <ModalBody>
                <Row>
                    <Col md='3' className='mb-1'>
                        <label className='form-label'>
                            Time Log Start Date
                        </label>
                        <Flatpickr className='form-control' placeholder='YYYY-MM-DD'  onChange={date => setReportStartDate(Api.formatDate(date))} id='default-picker' />
                    </Col>
                    <Col md='3' className='mb-1'>
                        <label className='form-label'>
                        Time Log End Date
                        </label>
                        <Flatpickr className='form-control' placeholder='YYYY-MM-DD'  onChange={date => setReportEndDate(Api.formatDate(date))} id='default-picker' />
                    </Col>
                    <Col md={csvExportData ? '2' : '3'}>
                        <label className='form-label'>
                            Select Project Member
                        </label>
                            <Select
                                 value={selectedAssignee}
                                 options={employeeDropdown}
                                 onChange={handleAssigneeChange}
                                 components={{ Option: CustomOption }}
                                 getOptionLabel={(option) => option.label}
                                 getOptionValue={(option) => option.value}
                                 autoFocus
                                 styles={{
                                   option: (provided) => ({
                                     ...provided,
                                    //  Hide the default options to prevent conflicts with CustomOption
                                     display: 'none'
                                   }),
                                   singleValue: (provided) => ({
                                     ...provided,
                                     display: 'flex',
                                     alignItems: 'center'
                                   }),
                                   menu: (provided) => ({
                                     ...provided,
                                     zIndex: 9999
                                   })
                                 }}
                            />
                    </Col>
                    <Col md={csvExportData ? '2' : '3'}>
                                <Button.Ripple color='primary' className="mt-2" onClick={ExportReport}>
                                    <Search size={14} />
                                    <span className='align-middle ms-25'>Generate</span>
                                </Button.Ripple>
                    </Col>
                        {csvExportData && (
                            <Col md="2">
                                <Button.Ripple color='primary' className="mt-2" onClick={DownloadReport}>
                                    <Download size={14} />
                                    <span className='align-middle ms-25'>Download</span>
                                </Button.Ripple>
                            </Col>  
                        )}
                           
                        {csvExportData && (
                            
                            <Table size='sm' responsive bordered>
                                <thead>
                                    <tr>
                                        {csvExportData[0].map((header, index) => (
                                            <th key={index}>{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {csvExportData.slice(1).map((row, rowIndex) => (
                                        <tr key={rowIndex}>
                                            {row.map((cell, cellIndex) => (
                                                <td key={cellIndex}>{cell}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}       
                </Row>
                
                </ModalBody>
            </Modal>
    </Fragment>
    )
}
export default index
