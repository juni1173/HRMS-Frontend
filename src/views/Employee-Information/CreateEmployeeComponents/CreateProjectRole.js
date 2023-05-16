import { useState, useEffect} from "react" 
import {Label, Row, Col, Input, Form, Spinner } from "reactstrap" 
import Select from 'react-select'
import apiHelper from "../../Helpers/ApiHelper"
const CreateProjectRole = ({emp_id, CallBack}) => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [projectList] = useState([])
    const [roleList] = useState([])
    const [pRoleDetail, setpRoleDetail] = useState({
        employee : emp_id,
        project : '',
        role : ''
         
   })
    const getPreData =  () => {
        setLoading(true)
        if (roleList.length > 0) {
            roleList.splice(0, roleList.length)
        }
        if (projectList.length > 0) {
            projectList.splice(0, projectList.length)
        }
        Api.get(`/employees/pre/projects/roles/data/view/`).then(roleResult => {
        if (roleResult) {
            
            if (roleResult.status === 200) {
                const projectData = roleResult.data.project
                for (let i = 0; i < projectData.length; i++) {
                    projectList.push({value: projectData[i].id, label: projectData[i].name})
                }
                const roleData = roleResult.data.role 
                for (let i = 0; i < roleData.length; i++) {
                    roleList.push({value: roleData[i].id, label: roleData[i].title})
                }
            }
        }
       })

       setTimeout(() => {
        setLoading(false)
       }, 1000)
       
    } 
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
                        CallBack()
                        Api.Toast('success', result.message)
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
    }, [projectList, roleList])
  return (
    !loading ? (
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
                        onChange={ (e) => { onChangepRoleDetailHandler('role', 'select', e) }}
                        />
                </Col>
                <Col md="4" className="mt-2">
                <button className="btn-next btn btn-success"  onClick={(e) => onSubmitHandler(e)}><span className="align-middle d-sm-inline-block d-none">Add</span></button>
                </Col>
            </Row>
        </Form>
    ) : (
        <div className="text-center"><Spinner/></div>
    )
  )
}

export default CreateProjectRole