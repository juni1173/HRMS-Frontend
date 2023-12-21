import { Fragment, useEffect, useState, useCallback } from "react"
import { Spinner, TabContent, TabPane, Nav, NavItem, NavLink, Badge} from "reactstrap"
import EmployeeKpi from "./EmployeeKpi/index"
import EvaluationRequests from "./EvaluatorKpi/index"
import EmployeeKpiSearch from "./EmployeeKpi/EmployeeKpiSearch"
 import apiHelper from "../Helpers/ApiHelper"
const KpiModule = () => {
    
    const [active, setActive] = useState('1')
    const [count, setCount] = useState([
        {evaluation: 0},
        {recheck: 0},
        {cancel: 0}
    ])
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [preData, setPreData] = useState([])
    const [typesDropdownArr] = useState([])
    const [complexityDropdownArr] = useState([])
    const [employeesDropdownArr] = useState([]) 
    const [yearlySegmentation] = useState([])
    const [segmentationData, setSegmentationData] = useState([])
    const [ep_batch] = useState([])
    const getCount = (name, value) => {
        if (name && value) {
            value > 0 ? setCount(previous => ({...previous, [name] : value})) : setCount(previous => ({...previous, [name] : 0}))
        }
    }
    const toggle = tab => {
        setActive(tab)
      }
      const getPreData = async () => {
        setLoading(true)
        await Api.get(`/kpis/pre/data/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    const data = result.data
                    setPreData(data)
                    typesDropdownArr.splice(0, typesDropdownArr.length)
                    complexityDropdownArr.splice(0, complexityDropdownArr.length)
                    employeesDropdownArr.splice(0, employeesDropdownArr.length)
                    ep_batch.splice(0, ep_batch.length)
                    const type = data.type
                    const complexityLength = data.complexity.length
                    const employeeLength = data.employees.length
                    const yearly_segmentation = data.yearly_segmentation.length
                    // const ep_batch_completed = data.ep_batch_completed.length
                    const ep_batch_in_progress = data.ep_batch_in_progress.length
                    
                    type.forEach(element => {
                        typesDropdownArr.push({value: element.id, label: element.title})
                    })
                    for (let i = 0; i < complexityLength; i++) {
                        complexityDropdownArr.push({value: data.complexity[i].id, label: data.complexity[i].title})
                    }
                    for (let i = 0; i < employeeLength; i++) {
                        employeesDropdownArr.push({value: data.employees[i].id, label: data.employees[i].name})
                    }
                    // for (let i = 0; i < ep_batch_completed; i++) {
                    //     ep_batch.push({value: data.ep_batch_completed[i].id, label: data.ep_batch_completed[i].batch_no})
                    // }
                    for (let i = 0; i < yearly_segmentation; i++) {
                        yearlySegmentation.push({value: data.yearly_segmentation[i].id, label: data.yearly_segmentation[i].year})
                    }
                    setSegmentationData(data.yearly_segmentation)
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
          }, [preData])
   return (
    <Fragment>
        <h2>EMPLOYEE KPI's PANEL</h2>
        <div className='nav-vertical configuration_panel'>
            <Nav tabs className='nav-left'>
                                
                                    <NavItem >
                                    <NavLink
                                        active={active === '1'}
                                        onClick={() => {
                                        toggle('1')
                                        }}
                                    >
                                    Your KPI's
                                    </NavLink>
                                    </NavItem>
                                
                                    <NavItem >
                                    <NavLink
                                        active={active === '2'}
                                        onClick={() => {
                                        toggle('2')
                                        }}
                                    >
                                        Kpi's For Evaluation <Badge className="bg-danger ml-5">{(count && count.evaluation > 0) && count.evaluation}</Badge>
                                    </NavLink>
                                    <NavLink
                                        active={active === '3'}
                                        onClick={() => {
                                        toggle('3')
                                        }}
                                    >
                                        Re-Evaluations <Badge className="bg-danger ml-5">{(count && count.recheck > 0) && count.recheck}</Badge>
                                    </NavLink>
                                    <NavLink
                                        active={active === '4'}
                                        onClick={() => {
                                        toggle('4')
                                        }}
                                    >
                                        Cancelled Kpi's <Badge className="bg-danger ml-5">{(count && count.cancel > 0) && count.cancel}</Badge>
                                    </NavLink>
                                    <NavLink
                                        active={active === '5'}
                                        onClick={() => {
                                        toggle('5')
                                        }}
                                    >
                                        History
                                    </NavLink>
                                    </NavItem>
                                    
                                
                                {/* </div> */}
            </Nav>
            <TabContent className='py-50' activeTab={active}>
                        <TabPane tabId={'1'} className='tab-pane-blue'>
                             {active === '1' ? <EmployeeKpi /> : null }   
                        </TabPane>
                        <TabPane tabId={'2'} className='tab-pane-blue'>
                        {active === '2' ? <EvaluationRequests type='evaluation' countData={getCount}/> : null }
                        </TabPane>
                        <TabPane tabId={'3'} className='tab-pane-blue'>
                        {active === '3' ? <EvaluationRequests type='recheck' countData={getCount}/> : null }
                        </TabPane>
                        <TabPane tabId={'4'} className='tab-pane-blue'>
                        {active === '4' ? <EvaluationRequests type='cancel' countData={getCount}/> : null }
                        </TabPane>
                        <TabPane tabId={'5'} className='tab-pane-blue'>
                        {active === '5' ? (
                            !loading ? (
                                <EmployeeKpiSearch segmentation={segmentationData} dropdownData={{typeDropdown: typesDropdownArr, complexityDropdown: complexityDropdownArr, employeesDropdown: employeesDropdownArr, yearlySegmentation}} CallBack={CallBack} type='search'/> 
                             ) : (
                                 <div className='text-center'><Spinner color="white"/></div>
                             )
                        ) : null}
                        </TabPane>

            </TabContent>
        </div>
    </Fragment>
   )
}
export default KpiModule