import { useEffect, useState, Fragment } from "react"
import { Label, Button, Table, Col, Input, Spinner } from "reactstrap"
import Select from 'react-select'
import apiHelper from "../../../../../Helpers/ApiHelper"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Trash2 } from "react-feather"
const Projects = ({ data, CallBack, training_id }) => {
    const Api = apiHelper()
    const MySwal = withReactContent(Swal)
    const [loading, setLoading] = useState(false)
    const [assignedProjects] = useState(data.training_projects ? data.training_projects : [])
    const [projectsArr] = useState([])
    const [project_id, setProjectsID] = useState([])
    const [notify, setNotify] = useState(false)
    const getPreData = async () => {
        setLoading(true)
        await Api.get(`/training/pre/data/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    const final = result.data
                    const projectsData = final.projects
                    projectsData.forEach(element => {
                        projectsArr.push({value: element.id, label: element.name})
                    })
                } 
            }
        })
        setTimeout(() => {
            setLoading(false)
        }, 500)
    }
    const handleProjectsSelect = (selectedOptions) => {
        setProjectsID(selectedOptions.map((option) => option.value))
      }
      const AddProjects = async () => {
        
        if (project_id.length > 0) {
            const formData = new FormData()
            formData['training'] = training_id
            formData['project_array'] = project_id
            formData['notify'] = notify
            setLoading(true)
              
                await Api.jsonPost(`/training/add/project/in/training/`, formData)
                .then(result => {
                    if (result) {
                        if (result.status === 200) {
                        Api.Toast('success', result.message)
                        CallBack()
                        } else {
                            Api.Toast('error', result.message)
                        }
                    } else {
                        Api.Toast('error', 'Server not responding!')
                    }
                })
            setTimeout(() => {
                setLoading(false)
            }, 1000)
        } else {
            Api.Toast('error', 'Please select an employee to add!')
        }
        
    }
    useEffect(() => {
        getPreData()
        }, [])

        // const CallBackAction = useCallback(() => {
        //     getPreData()
        //   }, [data])
          const removeProject = (id) => {
            MySwal.fire({
                title: 'Are you sure?',
                text: "Do you want to remove this project from this training!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, Remove it!',
                customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-danger ms-1'
                },
                buttonsStyling: false
            }).then(function (result) {
                if (result.value) {
                    Api.deleteData(`/training/project/remove/${id}/`, {method: 'DELETE'})
                    .then((deleteResult) => {
                        if (deleteResult.status === 200) {
                            MySwal.fire({
                                icon: 'success',
                                title: 'Project Removed!',
                                text: 'Project is Removed.',
                                customClass: {
                                confirmButton: 'btn btn-success'
                                }
                            }).then(function (result) {
                                if (result.isConfirmed) {
                                    CallBack()
                                }
                            })
                        } else {
                            MySwal.fire({
                                icon: 'error',
                                title: deleteResult.message ? deleteResult.message : 'Project can not be Removed!',
                                text: 'Project is not removed.',
                                customClass: {
                                confirmButton: 'btn btn-danger'
                                }
                            })
                        }
                            
                        })
                } 
            })
        }
        const handleCheck = (event) => {
            // const { id } = event.target
            const isChecked = event.target.checked
            setNotify(isChecked)
        }
  return (
    <Fragment>
        {!loading ? (
            <div className='row'>
                <div className="col-md-12"><h2>{data.title}</h2></div>
            <div className='col-md-8'>
                <Label>
                    Select Projects
                </Label>
                <Select 
                    type="text"
                    options={projectsArr}
                    onChange={handleProjectsSelect}
                    isMulti
                />
            </div>
            <Col md="2" className='mb-1'>
                               <Label>
                                   Notify Team
                               </Label><br></br>
                               <Input type='checkbox' 
                               onChange={handleCheck}
                               />
                           </Col>
            <div className='col-md-4 pt-2'>
                <Button className='btn btn-success' onClick={AddProjects}>
                        Assign Projects
                </Button>
            </div>
        </div>
        ) : (
            <div className="text-center"><Spinner/></div>
        )}
        <Table responsive striped bordered className="mt-5">
            <thead className="table-dark text-center">
                <tr>
                    <th>
                        Project Assigned
                    </th>
                    <th>
                        Remove
                    </th>
                </tr>
            </thead>
            <tbody>
            {assignedProjects.length > 0 ? (
                assignedProjects.map(item => (
                    <tr key={item.id}>
                        <td className="text-center"><b>{item.project_title ? item.project_title : 'N/A'}</b></td>
                        <td className="text-center"><Trash2 color="red" onClick={() => removeProject(item.id)}/></td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={2}>No Project Assigned</td>
                </tr>
            )
        }
            </tbody>
        </Table>
        
        
    </Fragment>
  )
}

export default Projects