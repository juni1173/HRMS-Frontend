import { Fragment, useEffect, useState, useCallback } from "react"
import { Spinner, TabContent, TabPane, Nav, NavItem, NavLink, Badge} from "reactstrap"
import apiHelper from "../../Helpers/ApiHelper"
import KpiByBatch from "./KpiByBatch"
import KpiList from "./KpiList"
import EmployeeListHR from "./EmployeeListHR"
 
const index = () => {
    
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [requestData, setRequestData] = useState([])
    const [recheckData, setRecheckData] = useState([])
    const [cancelData, setCancelData] = useState([])
    const [typesDropdownArr] = useState([])
    const [complexityDropdownArr] = useState([])
    const [employeesDropdownArr] = useState([]) 
    const [yearlySegmentation] = useState([])
    const [segmentationData, setSegmentationData] = useState([])
    const [ep_batch] = useState([])
    const [active, setActive] = useState('1')
    const [count, setCount] = useState([
        {evaluation: 0},
        {recheck: 0},
        {cancel: 0}
    ])
    const toggle = tab => {
        setActive(tab)
      }
    const getCount = (name, value) => {
        if (name && value) {
            value > 0 ? setCount(previous => ({...previous, [name] : value})) : setCount(previous => ({...previous, [name] : 0}))
        }
    }
    const getPreData = async () => {
        setLoading(true)
        await Api.get(`/kpis/requests/to/hr/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    setRequestData(result.data)
                    if (result.data) {
                        getCount('evaluation', result.data.length)
                    }
                } else {
                    // Api.Toast('error', result.message)
                    return false
                }
            } else {
             Api.Toast('error', 'Server not responding!') 
            }
        }) 
        await Api.get(`/kpis/recheck/requests/to/hr/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    setRecheckData(result.data)
                    if (result.data) {
                        getCount('recheck', result.data.length)
                    }
                } else {
                    // Api.Toast('error', result.message)
                    return false
                }
            } else {
             Api.Toast('error', 'Server not responding!') 
            }
        }) 
        await Api.get(`/kpis/cancle/requests/to/hr/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    setCancelData(result.data)
                    if (result.data) {
                        getCount('cancel', result.data.length)
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
                        employeesDropdownArr.push({value: data.employees[i].id, label: data.employees[i].name})
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
          }, [requestData])
   return (
    <Fragment>
        <h2>HR KPI's PANEL</h2>
        <div className='nav-vertical configuration_panel'>
            <Nav tabs className='nav-left'>
                                
                                    <NavItem >
                                    <NavLink
                                        active={active === '1'}
                                        onClick={() => {
                                        toggle('1')
                                        }}
                                    >
                                    Kpi's Approvals <Badge className="bg-danger ml-5">{(count && count.evaluation > 0) && count.evaluation}</Badge>
                                    </NavLink>
                                    </NavItem>
                                
                                    <NavItem >
                                    <NavLink
                                        active={active === '2'}
                                        onClick={() => {
                                        toggle('2')
                                        }}
                                    >
                                        ReCheck Requests <Badge className="bg-danger ml-5">{(count && count.recheck > 0) && count.recheck}</Badge>
                                    </NavLink>
                                    <NavLink
                                        active={active === '3'}
                                        onClick={() => {
                                        toggle('3')
                                        }}
                                    >
                                        Cancelled Kpi's <Badge className="bg-danger ml-5">{(count && count.cancel > 0) && count.cancel}</Badge>
                                    </NavLink>
                                    <NavLink
                                        active={active === '4'}
                                        onClick={() => {
                                        toggle('4')
                                        }}
                                    >
                                        Search Kpi
                                    </NavLink>
                                    </NavItem>
                                
                                {/* </div> */}
            </Nav>
            <TabContent className='py-50' activeTab={active}>
                        <TabPane tabId={'1'} className='tab-pane-blue'>
                        {!loading ? (
                            <EmployeeListHR data={requestData} dropdownData={{typeDropdown: typesDropdownArr, complexityDropdown: complexityDropdownArr, employeesDropdown: employeesDropdownArr}} CallBack={CallBack} type='approvals'/>
                        ) : (
                            <div className='text-center'><Spinner color="white"/></div>
                        )
                        }
                        </TabPane>
                        <TabPane tabId={'2'} className='tab-pane-blue'>
                        {!loading ? (
                            <EmployeeListHR data={recheckData} dropdownData={{typeDropdown: typesDropdownArr, complexityDropdown: complexityDropdownArr, employeesDropdown: employeesDropdownArr}} CallBack={CallBack} type='recheck'/>
                            
                        ) : (
                            <div className='text-center'><Spinner color="white"/></div>
                        )
                        }
                        </TabPane>
                        <TabPane tabId={'3'} className='tab-pane-blue'>
                        {!loading ? (
                           <EmployeeListHR data={cancelData} dropdownData={{typeDropdown: typesDropdownArr, complexityDropdown: complexityDropdownArr, employeesDropdown: employeesDropdownArr}} CallBack={CallBack} type='cancel'/>
                            
                        ) : (
                            <div className='text-center'><Spinner color="white"/></div>
                        )
                        }
                        </TabPane>
                        <TabPane tabId={'4'} className='tab-pane-blue'>
                        {!loading ? (
                           <KpiByBatch segmentation={segmentationData} dropdownData={{typeDropdown: typesDropdownArr, complexityDropdown: complexityDropdownArr, employeesDropdown: employeesDropdownArr, yearlySegmentation}} CallBack={CallBack} type='search'/> 
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
export default index