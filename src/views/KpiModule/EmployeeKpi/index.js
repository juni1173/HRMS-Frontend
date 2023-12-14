import { Fragment, useEffect, useState, useCallback } from "react"
import { Spinner, Button, Modal, ModalHeader, ModalBody} from "reactstrap"
import apiHelper from "../../Helpers/ApiHelper"
import DefaultEvaluationForm from "../Evaluation/DefaultEvaluationForm"
import AddEmployeeKpi from "./AddEmployeeKpi"
 
const index = () => {
    
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [preData, setPreData] = useState([])
    const [typesDropdownArr] = useState([])
    const [complexityDropdownArr] = useState([])
    const [employeesDropdownArr] = useState([])
    const [batchDropdownArr] = useState([])
    const [scaleGroup] = useState([])
    const [projects] = useState([]) 
    const [basicModal, setBasicModal] = useState(false)
    
    const getPreData = async () => {
        setLoading(true)
        await Api.get(`/kpis/pre/data/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    setPreData(result.data)
                    typesDropdownArr.splice(0, typesDropdownArr.length)
                    complexityDropdownArr.splice(0, complexityDropdownArr.length)
                    employeesDropdownArr.splice(0, employeesDropdownArr.length)
                    batchDropdownArr.splice(0, batchDropdownArr.length)
                    scaleGroup.splice(0, scaleGroup.length)
                    projects.splice(0, projects.length)
                    const data = result.data
                    const typeLength = data.type.length
                    const complexityLength = data.complexity.length
                    const employeeLength = data.employees.length
                    const scaleGroupLength = data.scale_group.length
                    const projectsLength = data.employees_projects.length
                    const batchLength = data.ep_batch_in_progress.length
                    for (let i = 0; i < typeLength; i++) {
                        typesDropdownArr.push({value: data.type[i].id, label: data.type[i].title})
                    }
                    for (let i = 0; i < complexityLength; i++) {
                        complexityDropdownArr.push({value: data.complexity[i].id, label: data.complexity[i].title})
                    }
                    for (let i = 0; i < employeeLength; i++) {
                        employeesDropdownArr.push({value: data.employees[i].id, label: data.employees[i].name})
                    }
                    for (let i = 0; i < scaleGroupLength; i++) {
                        scaleGroup.push({value: data.scale_group[i].id, label: data.scale_group[i].title})
                    }
                    for (let i = 0; i < projectsLength; i++) {
                        projects.push({value: data.employees_projects[i].id, label: data.employees_projects[i].project_title})
                    }
                    for (let i = 0; i < batchLength; i++) {
                        batchDropdownArr.push({value: data.ep_batch_in_progress[i].id, label: data.ep_batch_in_progress[i].title})
                    }
                    
                } else {
                    // Api.Toast('error', result.message)
                }
            } else (
             Api.Toast('error', 'Server not responding!')   
            )
        })  
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }
    useEffect(() => {
         getPreData()
        }, [])

        const CallBack = useCallback(() => {
            getPreData()
          }, [preData])
   return (
    <Fragment>
         <Button color='light' className="float-right mb-2" outline onClick={() => setBasicModal(!basicModal)}>
          Evaluation Chart
        </Button>
        {!loading ? (
            <AddEmployeeKpi preData={preData} dropdownData={{typeDropdown: typesDropdownArr, complexityDropdown: complexityDropdownArr, employeesDropdown: employeesDropdownArr, scaleGroupData: scaleGroup, projectsData: projects, batchData: batchDropdownArr}} CallBack={CallBack}/>
        ) : (
            <div className='text-center'><Spinner color="white"/></div>
        )
        }
         <Modal isOpen={basicModal} toggle={() => setBasicModal(!basicModal)} className='modal-xl'>
          <ModalHeader toggle={() => setBasicModal(!basicModal)}>Evaulation Chart</ModalHeader>
          <ModalBody>
           <DefaultEvaluationForm />
          </ModalBody>
        </Modal>
    </Fragment>
   )
}
export default index