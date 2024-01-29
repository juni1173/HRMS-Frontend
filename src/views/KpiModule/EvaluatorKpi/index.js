import { Fragment, useEffect, useState, useCallback } from "react"
import { Spinner, Button, Modal, ModalHeader, ModalBody} from "reactstrap"
import apiHelper from "../../Helpers/ApiHelper"
import KpiRequests from "./KpiRequests"
import AddEmployeeKpi from "../EmployeeKpi/AddEmployeeKpi"
 
const index = ({ type, countData }) => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [preData, setPreData] = useState([])
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
                    setPreData(result.data.employee_kpis_data)
                    let evaluationTotal = 0
                    if (result.data.employee_kpis_data) {
                        result.data.employee_kpis_data.forEach(element => {
                            element[0].employee_kpis_data.forEach(kpiData => {
                                if (kpiData.employee_kpis_data) {
                                    evaluationTotal += kpiData.employee_kpis_data.length
                                }
                            })
                        })
                        countData('evaluation', evaluationTotal)
                    }
                } else {
                    // Api.Toast('error', result.message)
                    return false
                }
            } else (
             Api.Toast('error', 'Server not responding!') 
            )
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
                    setCancelData(result.data.employee_kpis_data)
                    let cancelTotal = 0
                    if (result.data.employee_kpis_data) {
                        result.data.employee_kpis_data[0].forEach(element => {
                            element.employee_kpis_data.forEach(kpiData => {
                                if (kpiData.employee_kpis_data) {
                                    cancelTotal += kpiData.employee_kpis_data.length
                                }
                            })
                        })
                        countData('cancel', cancelTotal)
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
                    setRecheckData(result.data.employee_kpis_data)
                    let recheckTotal = 0
                    if (result.data.employee_kpis_data) {
                    result.data.employee_kpis_data[0].forEach(element => {
                        element.employee_kpis_data.forEach(kpiData => {
                            if (kpiData.employee_kpis_data) {
                                recheckTotal += kpiData.employee_kpis_data.length
                            }
                        })
                    })
                    countData('recheck', recheckTotal)
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
          }, [preData])
   return (
    <Fragment>
        {(type !== 'cancel' && type !== 'recheck') && (
        <Button color='light' className="float-right mb-2" outline onClick={() => setBasicModal(!basicModal)}>
          Add Employee Kpi
        </Button>
        )}
        {!loading ? (
            <>
            {type === 'recheck' && (
                (recheckData && Object.values(recheckData).length > 0) ? (
                    Object.values(recheckData).map((item, key) => (
                    <div key={key}>
                        <KpiRequests index={key} key={item.id} data={item} dropdownData={{typeDropdown: typesDropdownArr, complexityDropdown: complexityDropdownArr, employeesDropdown: employeesDropdownArr, batchDropdown: batchDropdownArr}} CallBack={CallBack} type={type}/>
                     </div>    
                    ))
                
                    ) : (
                        <div className="text-center text-white"><p>No data found!</p></div>
                    )
            )}
            {type === 'cancel' && (
                (cancelData && Object.values(cancelData).length > 0) ? (
                    Object.values(cancelData).map((item, key) => (
                    <div key={key}>
                        <KpiRequests index={key} key={item.id} data={item} dropdownData={{typeDropdown: typesDropdownArr, complexityDropdown: complexityDropdownArr, employeesDropdown: employeesDropdownArr, scaleGroupData: scaleGroup, batchData: batchDropdownArr}} CallBack={CallBack} type={type}/>
                     </div>    
                    ))
                
                    ) : (
                        <div className="text-center text-white"><p>No data found!</p></div>
                    )
            ) }
            {(type !== 'cancel' && type !== 'recheck') && (
               (preData && Object.values(preData).length > 0) ? (
                Object.values(preData).map((item, key) => (
                    
                <div key={key}>
                    <KpiRequests index={key} key={item.id} data={item} dropdownData={{typeDropdown: typesDropdownArr, complexityDropdown: complexityDropdownArr, employeesDropdown: employeesDropdownArr, scaleGroupData: scaleGroup, batchData: batchDropdownArr}} type={type} CallBack={CallBack} />
                 </div>    
                ))
            
                ) : (
                    <div className="text-center text-white"><p>No data found!</p></div>
                )
                
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