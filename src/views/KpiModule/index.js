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
                    const typeLength = data.type.length
                    const complexityLength = data.complexity.length
                    const employeeLength = data.employees.length
                    const ep_batch_completed = data.ep_batch_completed.length
                    const ep_batch_in_progress = data.ep_batch_in_progress.length
                    for (let i = 0; i < typeLength; i++) {
                        typesDropdownArr.push({value: data.type[i].id, label: data.type[i].title})
                    }
                    for (let i = 0; i < complexityLength; i++) {
                        complexityDropdownArr.push({value: data.complexity[i].id, label: data.complexity[i].title})
                    }
                    for (let i = 0; i < employeeLength; i++) {
                        employeesDropdownArr.push({value: data.employees[i].id, label: data.employees[i].name})
                    }
                    for (let i = 0; i < ep_batch_completed; i++) {
                        ep_batch.push({value: data.ep_batch_completed[i].id, label: data.ep_batch_completed[i].batch_no})
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
                                        Recheck Kpi's <Badge className="bg-danger ml-5">{(count && count.recheck > 0) && count.recheck}</Badge>
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
                                <EmployeeKpi />
                        </TabPane>
                        <TabPane tabId={'2'} className='tab-pane-blue'>
                                <EvaluationRequests type='evaluation' countData={getCount}/>
                        </TabPane>
                        <TabPane tabId={'3'} className='tab-pane-blue'>
                                <EvaluationRequests type='recheck' countData={getCount}/>
                        </TabPane>
                        <TabPane tabId={'4'} className='tab-pane-blue'>
                                <EvaluationRequests type='cancel' countData={getCount}/>
                        </TabPane>
                        <TabPane tabId={'5'} className='tab-pane-blue'>
                        {!loading ? (
                           <EmployeeKpiSearch dropdownData={{typeDropdown: typesDropdownArr, complexityDropdown: complexityDropdownArr, employeesDropdown: employeesDropdownArr, ep_batch}} CallBack={CallBack} type='search'/> 
                        ) : (
                            <div className='text-center'><Spinner color="white"/></div>
                        )
                        }
                        </TabPane>

            </TabContent>
        </div>
    </Fragment>
   )
}
export default KpiModule