import { useEffect, useState, Fragment } from "react"
import { Label, Button, Table, Spinner } from "reactstrap"
import Select from 'react-select'
import apiHelper from "../../../../../Helpers/ApiHelper"
const Projects = ({ data, CallBack, training_id }) => {
    
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [assignedProjects] = useState(data.training_projects ? data.training_projects : [])
    const [projectsArr] = useState([])
    const [project_id, setProjectsID] = useState([])
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

        // const CallBack = useCallback(() => {
        //     getTrainings()
        //     setCanvasOpen(false)
        //   }, [data])
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
                </tr>
            </thead>
            <tbody>
            {assignedProjects.length > 0 ? (
                assignedProjects.map(item => (
                    <tr key={item.id}>
                        <td className="text-center"><b>{item.project_title ? item.project_title : 'N/A'}</b></td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td>No Project Assigned</td>
                </tr>
            )
        }
            </tbody>
        </Table>
        
        
    </Fragment>
  )
}

export default Projects