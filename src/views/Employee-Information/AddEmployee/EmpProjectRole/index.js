import {useEffect, useState, Fragment} from 'react'
import {Label, Row, Col, Card, CardBody, Form, Table, Spinner, Badge } from "reactstrap" 
import Select from 'react-select'
import apiHelper from '../../../Helpers/ApiHelper'
import EmployeeHelper from '../../../Helpers/EmployeeHelper'
const EmpProjectRole = ({emp_state}) => {
    const Api = apiHelper()
    const EmpHelper = EmployeeHelper()
    const [loading, setLoading] = useState(false)
    const [employee_project_roles, setemployee_project_roles] = useState([])
    const [projectList] = useState([])
    const [roleList] = useState([])
    const [pRoleDetail, setpRoleDetail] = useState({
        employee : emp_state['emp_data'].id,
        project : '',
        role : ''
         
   })
   const onChangepRoleDetailHandler = (InputName, InputType, e) => {
        
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

        setpRoleDetail(prevState => ({
        ...prevState,
        [InputName] : InputValue
        
        
        }))

    }
   const getPreData = async () => {
    setLoading(true)
        await Api.get(`/projects/`).then(projectResult => {

            if (projectList.length > 0) {
                projectList.splice(0, projectList.length)
            }
            if (projectResult) {
                if (projectResult.status === 200) {
                    const projectData = projectResult.data
                    for (let i = 0; i < projectData.length; i++) {
                        projectList.push({value: projectData[i].id, label: projectData[i].name})
                    }
                }
            }
            
        })
        await Api.get(`/roles/`).then(roleResult => {
            if (roleList.length > 0) {
                roleList.splice(0, roleList.length)
            }
            if (roleResult) {
                if (roleResult.status === 200) {
                    const roleData = roleResult.data
                    for (let i = 0; i < roleData.length; i++) {
                        roleList.push({value: roleData[i].id, label: roleData[i].title})
                    }
                }
            }
        })
        await Api.get(`/employees/${emp_state['emp_data'].uuid}/projects/roles/data/`).then(empProjResult => {
            if (empProjResult) {
                if (empProjResult.status === 200) {
                    const empProjData = empProjResult.data
                   setemployee_project_roles(empProjData)
                } else {
                    Api.Toast('error', empProjResult.message)
                }
            } else {
                Api.Toast('error', 'Server not found!')
            }
        })
        setTimeout(() => {
            setLoading(false)
        }, 1000)
        return false
    } 
    const onSubmitHandler = async (e) => {
        setLoading(true)
        e.preventDefault()
        if (pRoleDetail.employee !== '' && pRoleDetail.project !== ''
         && pRoleDetail.role !== '') {
            const formData = new FormData()
            formData['employee'] = pRoleDetail.employee
            formData['project'] = pRoleDetail.project.value
            formData['role'] = pRoleDetail.role.value
            await Api.jsonPost(`/employees/projects/roles/data/`, formData).then(result => {
                if (result) {
                    if (result.status === 200) {
                        getPreData()
                        Api.Toast('success', result.message)
                        setpRoleDetail({
                            employee : emp_state['emp_data'].id,
                            project : '',
                            role : ''
                       })
                    } else {
                        Api.Toast('error', result.message)
                    }
                } else {
                    Api.Toast('error', 'Server Not Responding')
                }
            })
            
        } else {
            Api.Toast('error', 'All Fileds are required')
        }
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }
    useEffect(() => {
        getPreData()
    }, [projectList, roleList, setemployee_project_roles])
  return (
    <Fragment>
        <Row>
            <Col md={12}>
                <Card>
                <CardBody>
                <Row>
                    <Col md={12}>
                    <Form >
                    <Row>
                        <Col md="4" className="mb-1">
                            <Label className="form-label">
                            Project
                            </Label>
                            <Select
                                type="text"
                                placeholder="Select Project"
                                name="project"
                                options={projectList}
                                value = {pRoleDetail.project}
                                onChange={ (e) => { onChangepRoleDetailHandler('project', 'select', e) }}
                                />
                        </Col>
                        <Col md="4" className="mb-1">
                            <Label className="form-label">
                            Role
                            </Label>
                            <Select
                                type="text"
                                placeholder="Select Role"
                                name="role"
                                options={roleList}
                                value = {pRoleDetail.role}
                                onChange={ (e) => { onChangepRoleDetailHandler('role', 'select', e) }}
                                />
                        </Col>
                        <Col md="4" className="mt-2">
                        <button className="btn-next btn btn-success"  onClick={(e) => onSubmitHandler(e)}><span className="align-middle d-sm-inline-block d-none">Add</span></button>
                        </Col>
                    </Row>
                    </Form>
                    </Col>
                </Row>
                {!loading ? (
                    Object.values(employee_project_roles).length > 0 ? (
                    <>
                        <Table bordered striped responsive>
                            <thead>
                                <tr>
                                    <th>Project</th>
                                    <th>Role</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>status/Deactivate</th>
                                </tr>
                            </thead>

                            <tbody>
                            {Object.values(employee_project_roles).map((pRole, key) => (
                                <tr key={key} className={!pRole.is_active ? 'table-danger' : ''}>
                                    <td>{pRole.project_title ? pRole.project_title : 'N/a'}</td>
                                    <td>{pRole.role_title ? pRole.role_title : 'N/A'}</td>
                                    <td>{pRole.start_date ? pRole.start_date : 'N/A'}</td>
                                    <td>{pRole.end_date ? pRole.end_date : <Badge color='light-success'>Not Ended</Badge>}</td>
                                    <td>
                                        {pRole.is_active ? (
                                            <div className="d-flex row">
                                            <div className="col">
                                            <button
                                                className="border-0 btn btn-danger"
                                                onClick={() => EmpHelper.DeleteProjectRole(pRole.id).then(() => { getPreData() })}
                                            >
                                                End Role 
                                            </button>
                                            </div>
                                        </div>
                                        ) : (
                                            <Badge color='light-danger'>Role Ended</Badge>
                                        )}
                                        
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </>
                    ) : (
                            <p>No Data Found</p>
                    )
                    
                    ) : (
                        <div className="text-center"><Spinner /></div>
                    )}
                </CardBody>
                </Card>
            </Col>
        </Row>
    </Fragment>
  )
}

export default EmpProjectRole