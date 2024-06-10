// ** React Imports
import { Fragment, useState, useEffect, useCallback } from 'react'

// ** Todo App Components
import Tasks from './Components/Tasks'

import apiHelper from '../Helpers/ApiHelper'
import Select from 'react-select'
// ** Styles
import '@styles/react/apps/app-todo.scss'
import { Card, CardBody, Spinner, Nav, NavLink, NavItem, TabContent, TabPane, Badge, Row, Col, Button } from 'reactstrap'
import { Crosshair, Filter, RefreshCcw, Save } from 'react-feather'

const index = () => {
    const Api = apiHelper()
  // ** States
  const [loading, setLoading] = useState(false)
  const [taskloading, setTaskLoading] = useState(false)
  const [filterLoading, setFilterLoading] = useState(false)
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [activeTab, setActiveTab] = useState(0)
  const [selectedTask, setSelectedTask] = useState(null)
  const [sortState, setSortState] = useState('all-task')
  const [filterStatus, setFilterStatus] = useState(false)
  const [typeDropdown, setTypeDropdown] = useState([])
  const [statusDropdown, setStatusDropdown] = useState([])
  const [employeeDropdown, setEmployeeDropdown] = useState([])
  const priority_choices = [
    {value: 'Low', label: 'Low'},
    {value: 'Medium', label:'Medium'},
    {value: 'High', label:'High'}
   ]
  const [query, setQuery] = useState({
    assign_to: null,
    task_type: null,
    priority: null,
    status: null
})
  
    const getTaskTypes = async (id = null) => {
        const formData = new FormData()
        if (id) {
            formData['project'] = id
        }
        await Api.jsonPost(`/taskify/task/types/pre/data/`, formData).then(result => {
            if (result) {
                if (result.status === 200) {
                    const typesData = result.data
                    if (Object.values(typesData).length > 0) {
                        const defaultTypesArr = []
                        const projectTypesArr = []
                        for (const default_types of typesData.default_task_type) {
                            defaultTypesArr.push({value: default_types.id, label: default_types.title, type: 'default_task_type'})
                        }
                        if (Object.values(typesData.project_task_type).length > 0) {
                            for (const project_types of typesData.project_task_type) {
                                projectTypesArr.push({value: project_types.id, label: project_types.title, type: 'project_task_type'})
                            }
                        }
                        setTypeDropdown([...defaultTypesArr, ...projectTypesArr])
                    }
                } else {
                    Api.Toast('error', result.message)
                }
            } else {
                Api.Toast('error', 'Server error!')
            }
        })
      } 
      const getStatuses = async (id = null) => {
        const formData = new FormData()
        if (id) {
            formData['project'] = id
        }
        await Api.jsonPost(`/taskify/task/status/pre/data/`, formData).then(result => {
            if (result) {
                if (result.status === 200) {
                    const statusData = result.data
                    if (Object.values(statusData).length > 0) {
                        const defaultStatusArr = []
                        const projectStatusArr = []
                        for (const status of statusData.default_status) {
                            defaultStatusArr.push({value: status.id, label: status.title})
                        }
                        if (Object.values(statusData.project_status).length > 0) {
                            for (const status of statusData.project_status) {
                                projectStatusArr.push({value: status.id, label: status.title})
                            }
                        }
                        
                        setStatusDropdown([...defaultStatusArr, ...projectStatusArr])
                    }
                } else {
                    Api.Toast('error', result.message)
                }
            } else {
                Api.Toast('error', 'Server error!')
            }
        })
      }  
      const getEmployees = async (id) => {
        await Api.get(`/taskify/get/project/employee/${id}/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    const employeeData = result.data
                    if (employeeData.length > 0) {
                        const arr = []
                        for (const emp of employeeData) {
                            arr.push({value: emp.id, label: emp.name})
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
            await Api.jsonPost(url, formData).then(tasksResult => {
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
    await Api.get(`/taskify/get/project/`).then(result => {
        if (result) {
            if (result.status === 200) {
                const projectsData = result.data
                if (projectsData.length > 0) {
                    setProjects(projectsData)
                    getTasks(projectsData[0].id)
                    setActiveTab(projectsData[0].id)
                }
            } else {
                Api.Toast('error', result.message)
            }
        } else {
            Api.Toast('error', 'Server error!')
        }
    })
  }

  const toggleTab = (id, type = null) => {
    setQuery(prev => ({
        ...prev,
        [type]: type
    }))
    setActiveTab(id)
    getTasks(id, query.type, query.status)
  }
  const filterClick = () => {
    setFilterStatus(!filterStatus)
    setFilterLoading(true)
        getTaskTypes(activeTab)
        getStatuses(activeTab)
        getEmployees(activeTab)
    setTimeout(() => {
        setFilterLoading(false)
    }, 500)
}
  // ** Get Tasks on mount & based on dependency change
  useEffect(() => {
    setLoading(true)
        getData()
    setTimeout(() => {
        setLoading(false)
    }, 500)
    
  }, [setProjects])
    const CallBack = useCallback((id, selectedTaskid, sort) => {
        setActiveTab(id)
        getTasks(id, sort)
        if (selectedTaskid) setSelectedTask(selectedTaskid)
    }, [tasks, sortState])
    const applyFilters = () => {
        getTasks(activeTab, sortState)
    }
  return (
    <Fragment>
            <Card>
                <CardBody className=''>
                    <Row>
                        <Col md="3">
                            <h3>Task Management Panel</h3>
                        </Col>
                        <Col md="9">
                            <Nav tabs className='mb-2'>
                            {!loading ? (
                                    projects.map((item) => (
                                        <NavItem key={item.id}>
                                        <NavLink
                                            className={activeTab === item.id ? 'active' : ''}
                                            style={{height:'55px'}}
                                            onClick={() => toggleTab(item.id)}
                                        >
                                            {item.name}
                                        </NavLink>
                                        </NavItem>
                                    ))
                            
                            ) : <div className='text-center'><Spinner size={'18'} type="grow"/> Loading projects...</div>
                            }
                        </Nav>
                        </Col>
                    </Row>
                    
              
            <div className='d-flex justify-content-between mb-1'>
                <div>
                    <b>Sort by  </b> <Badge>{sortState}</Badge>
                </div>
                <div>
                <span onClick={filterClick} className='cursor-pointer'><Filter color={filterStatus ? 'darkblue' : 'gray'} size={'18'} title="Filters"/> Filters </span>
                </div>
            </div> 
                {filterStatus && (
                    !filterLoading ? (
                    <div className='d-flex justify-content-center mb-1'>    
                        <div className='mx-1' style={{minWidth:'200px'}}>
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
                        <div className='mx-1' style={{minWidth:'200px'}}>
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
                        <div className='mx-1' style={{minWidth:'200px'}}>
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
                        <div className='mx-1' style={{minWidth:'200px'}}>
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
                        <div>
                        <Button color="primary" className="btn-next mt-2" onClick={applyFilters}>
                            <span className="align-middle d-sm-inline-block">
                            Apply
                            </span>
                            <Save
                            size={14}
                            className="align-middle ms-sm-25 ms-0"
                            ></Save>
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
                                                    <Tasks data={tasks} projectsData={projects} CallBack={CallBack} selectedTaskid={selectedTask ? selectedTask : null} project_id={activeTab}/>
                                                </TabPane>
                                </TabContent>
                                ) : (
                                    <div className='text-center'>
                                        <Spinner size='18' /> Loading tasks...
                                    </div>
                            )}
                </div>
                 </CardBody>
            </Card> 
            {/* <TaskSidebar
              store={store}
              params={params}
              addTask={addTask}
              dispatch={dispatch}
              open={openTaskSidebar}
              updateTask={updateTask}
              selectTask={selectTask}
              deleteTask={deleteTask}
              handleTaskSidebar={handleTaskSidebar}
            /> */}
    </Fragment>
  )
}

export default index
