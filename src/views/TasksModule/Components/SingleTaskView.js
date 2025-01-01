import React, { Fragment, useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import apiHelper from '../../Helpers/ApiHelper'
import TaskDetail from './TaskDetail'
import { Card, CardBody, CardHeader, Spinner } from 'reactstrap'
import { ArrowRight, Copy } from 'react-feather'
const SingleTaskView = () => {
  const params = useParams()
  const history = useHistory()
  const Api = apiHelper()
  const task_id = params.id
  const [loading, setLoading] = useState(false)
  const [task, setTask] = useState([])
  const [employeeDropdown, setEmployeeDropdown] = useState([]) 
  const [typeDropdown, setTypeDropdown] = useState([])
  const [projectRole, setProjectRole] = useState('')
  
  const priority_choices = [
    {value: 'Low', label: 'Low'},
    {value: 'Medium', label:'Medium'},
    {value: 'High', label:'High'}
]
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
  const getTask = async () => {
    if (task_id) {
        await Api.get(`/taskify/get/single/task/data/${task_id}/`).then(result => {
            if (result) {
                setLoading(true)
                if (result.status === 200) {
                    setTask(result.data[0])
                    getProjectPreData(result.data[0].project)
                } else {
                    Api.Toast('error', result.message)
                }
                setTimeout(() => {
                    setLoading(false)
                }, 500)
            }
        })
    }
    
  }
  useEffect(() => {
    getTask()
  }, [task_id])
  return (
    <Fragment>
        {(task && Object.values(task).length > 0) && !loading ? (
            <Card>
                <CardHeader className='pb-0 d-flex justify-content-between'>
                        <div>
                            {task && (
                                <p className='text-secondary mb-0'>{task.project_name} / Task ID - {task.id} <Copy onClick={() => Api.copyToClipboard(`${Api.ApiBaseLink}/task/${task.id}`)} size={14} color="gray" alt="copy Link"/><br></br><span className='text-muted small'>Created on {Api.formatDateWithMonthName(task.created_at)}</span></p>
                            )}
                        </div>
                        <div>
                            <h5 onClick={() => history.push('/tasks')} className=" cursor-pointer hover-underline">Task Manager <ArrowRight size={20} /></h5>
                        </div>
                    
                </CardHeader>
                <CardBody>
                <TaskDetail 
                    projectsData={[{id: task.project, name: task.project_name}]}
                    data={task}
                    employees={employeeDropdown}
                    priorities={priority_choices}
                    types={typeDropdown}
                    role={projectRole}
                    />
                </CardBody>
            </Card>
            
          ) : (
            <div className='text-center'><Spinner size="sm" /></div>
          )}
    </Fragment>
  )
}

export default SingleTaskView
