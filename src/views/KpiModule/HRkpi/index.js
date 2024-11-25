import { Fragment, useEffect, useState, useCallback } from "react"
import { Spinner, Modal, ModalHeader, ModalBody} from "reactstrap"
import apiHelper from "../../Helpers/ApiHelper"
import KpiByBatch from "./KpiByBatch"
import KpiReports from "./KpiReports/index"
import KpiStatusCounts from "./KpiStatusCounts"
 
const index = () => {
    
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    
    const [typesDropdownArr] = useState([])
    const [complexityDropdownArr] = useState([])
    const [employeesDropdownArr] = useState([]) 
    const [yearlySegmentation] = useState([])
    const [segmentationData, setSegmentationData] = useState([])
    const [ep_batch] = useState([])
    // const [active, setActive] = useState('1')
    const [searchToolModal, setsearchToolModal] = useState(false)
    const [evaluationReportModal, setevaluationReportModal] = useState(false)
    
    const getPreData = async () => {
        setLoading(true)
       
        await Api.get(`/kpis/pre/data/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    const data = result.data
                    const typeLength = data.type.length
                    const complexityLength = data.complexity.length
                    const employeeLength = data.employees.length
                    const yearly_segmentation = data.yearly_segmentation.length
                    setSegmentationData(data.yearly_segmentation)
                    const ep_batch_in_progress = data.ep_batch_in_progress.length
                    for (let i = 0; i < typeLength; i++) {
                        typesDropdownArr.push({value: data.type[i].id, label: data.type[i].title})
                    }
                    for (let i = 0; i < complexityLength; i++) {
                        complexityDropdownArr.push({value: data.complexity[i].id, label: data.complexity[i].title})
                    }
                    for (let i = 0; i < employeeLength; i++) {
                        employeesDropdownArr.push({value: data.employees[i].id, label: data.employees[i].name, avatar: data.employees[i].profile_image})
                    }
                    for (let i = 0; i < yearly_segmentation; i++) {
                        yearlySegmentation.push({value: data.yearly_segmentation[i].id, label: data.yearly_segmentation[i].year})
                    }
                    for (let i = 0; i < ep_batch_in_progress; i++) {
                        ep_batch.push({value: data.ep_batch_in_progress[i].id, label: data.ep_batch_in_progress[i].batch_no})
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
          }, [])
   return (
    <Fragment>
        <h2 className="text-center">HR KPI's PANEL</h2>
        {/* <div className='nav-horizontal configuration_panel'> */}
        {!loading ? (
                            <>
                            <KpiStatusCounts 
                                segmentation={segmentationData}
                                dropdownData={{typeDropdown: typesDropdownArr, complexityDropdown: complexityDropdownArr, employeesDropdown: employeesDropdownArr, yearlySegmentation}}
                                searchTool={() => setsearchToolModal(!searchToolModal)}
                                evaluationReport={() => setevaluationReportModal(!evaluationReportModal)}
                             />
                            {/* <EmployeeListHR data={requestData} dropdownData={{typeDropdown: typesDropdownArr, complexityDropdown: complexityDropdownArr, employeesDropdown: employeesDropdownArr}} CallBack={CallBack} type='approvals'/> */}
                            </>
                        ) : (
                            <div className='text-center'><Spinner color=""/></div>
                        )
                        }
        {/* </div> */}
        <Modal isOpen={searchToolModal} toggle={() => setsearchToolModal(!searchToolModal)} className="modal-xl">
          <ModalHeader toggle={() => setsearchToolModal(!searchToolModal)}>Search Kpi Tool</ModalHeader>
          <ModalBody>
                {!loading ? (
                           <KpiByBatch segmentation={segmentationData} dropdownData={{typeDropdown: typesDropdownArr, complexityDropdown: complexityDropdownArr, employeesDropdown: employeesDropdownArr, yearlySegmentation}} CallBack={CallBack} type='search'/> 
                        ) : (
                            <div className='text-center'><Spinner color=""/></div>
                        )
                }
          </ModalBody>
        </Modal>

        <Modal isOpen={evaluationReportModal} toggle={() => setevaluationReportModal(!evaluationReportModal)} className="modal-xl">
          <ModalHeader toggle={() => setevaluationReportModal(!evaluationReportModal)}>Evaluations Insights</ModalHeader>
          <ModalBody>
                {!loading ? (
                                
                        <KpiReports segmentation={segmentationData} dropdownData={{typeDropdown: typesDropdownArr, complexityDropdown: complexityDropdownArr, employeesDropdown: employeesDropdownArr, yearlySegmentation}}/>
                    
                    ) : (
                        <div className='text-center'><Spinner color=""/></div>
                    )
                
                }
          </ModalBody>
        </Modal>
        
    </Fragment>
   )
}
export default index