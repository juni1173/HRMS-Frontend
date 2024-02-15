import { Fragment, useEffect, useState, useCallback } from "react"
import { Spinner, Button, Modal, ModalHeader, ModalBody, Row, Col} from "reactstrap"
import apiHelper from "../../Helpers/ApiHelper"
import KpiRequests from "./kpiRequests2"
import AddEmployeeKpi from "../EmployeeKpi/AddEmployeeKpi"
import EmployeeList from "./EmployeeList"
 
const index = ({ type, countData }) => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [preData] = useState([])
    const [TLData, setTLData] = useState([])
    const [recheckData, setRecheckData] = useState([])
    const [cancelData, setCancelData] = useState([])
    const [typesDropdownArr] = useState([])
    const [complexityDropdownArr] = useState([])
    const [employeesDropdownArr] = useState([]) 
    const [batchDropdownArr] = useState([])
    const [scaleGroup] = useState([])
    const [projects] = useState([]) 
    const [basicModal, setBasicModal] = useState(false)
    const getPreData = async () => {
        setLoading(true)
        await Api.get(`/kpis/requests/to/team/lead/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    setTLData(result.data)
                    if (result.data) {
                        countData('evaluation', result.data.length)
                    }
                } else {
                    // Api.Toast('error', result.message)
                    return false
                }
            } else {
             Api.Toast('error', 'Server not responding!') 
            }
        })  
        await Api.get(`/kpis/pre/data/`).then(result => {
            if (result) {
                if (result.status === 200) {
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
                    Api.Toast('error', result.message)
                }
            } else (
             Api.Toast('error', 'Server not responding!')   
            )
        })   
        await Api.get(`/kpis/cancel/requests/to/team/lead/`).then(result => {
            
            if (result) {
                if (result.status === 200) {
                    setCancelData(result.data)
                    // let cancelTotal = 0
                    if (result.data) {
                        // result.data.forEach(kpiData => {
                        //     if (kpiData.total_kpis) {
                        //         cancelTotal += kpiData.total_kpis
                        //     }
                        // })
                        countData('cancel', result.data.length)
                    }
                    
                } else {
                    // Api.Toast('error', result.message)
                    return false
                }
            } else (
             Api.Toast('error', 'Server not responding!') 
            )
        })  
        await Api.get(`/kpis/recheck/requests/to/team/lead/`).then(result => {
            
            if (result) {
                if (result.status === 200) {
                    setRecheckData(result.data)
                    // let recheckTotal = 0
                    if (result.data) {
                        // result.data.forEach(kpiData => {
                        //     if (kpiData.total_kpis) {
                        //         recheckTotal += kpiData.total_kpis
                        //     }
                        // })
                    countData('recheck', result.data.length)
                }
                } else {
                    // Api.Toast('error', result.message)
                    return false
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
          }, [TLData, recheckData, cancelData])
   return (
    <Fragment>
        {(type !== 'cancel' && type !== 'recheck') && (
            <Row>
                <Col md={12}>
                    <Button color='light' className="float-right mb-2" outline onClick={() => setBasicModal(!basicModal)}>
                        Add Employee Kpi
                    </Button>
                </Col>
            </Row>
        )}
        {!loading ? (
            <>
            {type === 'recheck' && (
                <EmployeeList data={recheckData} dropdownData={{typeDropdown: typesDropdownArr, complexityDropdown: complexityDropdownArr, employeesDropdown: employeesDropdownArr, scaleGroupData: scaleGroup, batchData: batchDropdownArr}} type={type} CallBack={CallBack} />
            )}
            {type === 'cancel' && (
                <EmployeeList data={cancelData} dropdownData={{typeDropdown: typesDropdownArr, complexityDropdown: complexityDropdownArr, employeesDropdown: employeesDropdownArr, scaleGroupData: scaleGroup, batchData: batchDropdownArr}} type={type} CallBack={CallBack} />
            ) }
            {(type !== 'cancel' && type !== 'recheck') && (
                <EmployeeList data={TLData} dropdownData={{typeDropdown: typesDropdownArr, complexityDropdown: complexityDropdownArr, employeesDropdown: employeesDropdownArr, scaleGroupData: scaleGroup, batchData: batchDropdownArr}} type={type} CallBack={CallBack} />
                
            )}
            </>
        ) : (
            <div className='text-center'><Spinner color="white"/></div>
        )
        }
         <Modal isOpen={basicModal} toggle={() => setBasicModal(!basicModal)} className='modal-xl'>
          <ModalHeader toggle={() => setBasicModal(!basicModal)}>Add Kpi</ModalHeader>
          <ModalBody>
          {!loading ? (
                <AddEmployeeKpi preData={preData} dropdownData={{typeDropdown: typesDropdownArr, complexityDropdown: complexityDropdownArr, employeesDropdown: employeesDropdownArr, scaleGroupData: scaleGroup, projectsData: projects, batchData: batchDropdownArr}} type='evaluator' CallBack={CallBack}/>
            ) : (
                <div className='text-center'><Spinner color="white"/></div>
            )}
          </ModalBody>
        </Modal>
    </Fragment>
   )
}
export default index