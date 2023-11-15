import { Fragment, useEffect, useState, useCallback } from "react"
import { Spinner, TabContent, TabPane, Nav, NavItem, NavLink, Badge} from "reactstrap"
import apiHelper from "../../Helpers/ApiHelper"
import KpiByBatch from "./KpiByBatch"
import KpiList from "./KpiList"
 
const index = () => {
    
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [preData, setPreData] = useState([])
    const [reCheckData, setRecheckData] = useState([])
    const [cancelData, setCancelData] = useState([])
    const [typesDropdownArr] = useState([])
    const [complexityDropdownArr] = useState([])
    const [employeesDropdownArr] = useState([]) 
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
                    setPreData(result.data)
                    let evaluationTotal = 0
                    result.data.forEach(element => {
                        element.employee_kpis_data.forEach(kpiData => {
                            kpiData.forEach(kpi => {
                                kpi.employee_kpis_data.forEach(data => {
                                    if (data.employee_kpis_data) {
                                        evaluationTotal += data.employee_kpis_data.length
                                    }
                                })
                                
                            })
                        })
                    })
                    getCount('evaluation', evaluationTotal)
                } else {
                    // Api.Toast('error', result.message)
                }
            } else (
             Api.Toast('error', 'Server not responding!')   
            )
        })  
        await Api.get(`/kpis/recheck/requests/to/hr/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    setRecheckData(result.data)
                    let recheckTotal = 0
                    result.data.forEach(element => {
                        element.employee_kpis_data.forEach(kpiData => {
                            kpiData.forEach(kpi => {
                                kpi.employee_kpis_data.forEach(data => {
                                    if (data.employee_kpis_data) {
                                        recheckTotal += data.employee_kpis_data.length
                                    }
                                })
                                
                            })
                        })
                    })
                    getCount('recheck', recheckTotal)
                } else {
                    // Api.Toast('error', result.message)
                }
            } else (
             Api.Toast('error', 'Server not responding!')   
            )
        })  
        await Api.get(`/kpis/cancle/requests/to/hr/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    setCancelData(result.data)
                    let cancelTotal = 0
                        result.data.forEach(element => {
                            element.employee_kpis_data.forEach(kpiData => {
                                kpiData.forEach(kpi => {
                                    kpi.employee_kpis_data.forEach(data => {
                                        if (data.employee_kpis_data) {
                                            cancelTotal += data.employee_kpis_data.length
                                        }
                                    })
                                    
                                })
                            })
                        })
                    getCount('cancel', cancelTotal)
                } else {
                    // Api.Toast('error', result.message)
                }
            } else (
             Api.Toast('error', 'Server not responding!')   
            )
        })  
        await Api.get(`/kpis/pre/data/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    const data = result.data
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
                            preData && Object.values(preData).length > 0 ? (
                                preData.map((item, index) => (
                                    <div key={index}>
                                        <KpiList key={index} data={item} dropdownData={{typeDropdown: typesDropdownArr, complexityDropdown: complexityDropdownArr, employeesDropdown: employeesDropdownArr}} CallBack={CallBack} type='approvals'/>
                                    </div>
                                ))
                                
                            ) : (
                                <div className='text-center text-white'>No Data Found!</div>
                            )
                            
                        ) : (
                            <div className='text-center'><Spinner color="white"/></div>
                        )
                        }
                        </TabPane>
                        <TabPane tabId={'2'} className='tab-pane-blue'>
                        {!loading ? (
                            reCheckData && Object.values(reCheckData).length > 0 ? (
                                reCheckData.map((item, index) => (
                                    <div key={index}>
                                        <KpiList key={index} data={item} dropdownData={{typeDropdown: typesDropdownArr, complexityDropdown: complexityDropdownArr, employeesDropdown: employeesDropdownArr}} CallBack={CallBack} type='recheck'/>
                                    </div>
                                ))
                                
                            ) : (
                                <div className='text-center text-white'>No Data Found!</div>
                            )
                            
                        ) : (
                            <div className='text-center'><Spinner color="white"/></div>
                        )
                        }
                        </TabPane>
                        <TabPane tabId={'3'} className='tab-pane-blue'>
                        {!loading ? (
                            cancelData && Object.values(cancelData).length > 0 ? (
                                cancelData.map((item, index) => (
                                    <div key={index}>
                                        <KpiList key={index} data={item} dropdownData={{typeDropdown: typesDropdownArr, complexityDropdown: complexityDropdownArr, employeesDropdown: employeesDropdownArr}} CallBack={CallBack} type='cancel'/>
                                    </div>
                                ))
                                
                            ) : (
                                <div className='text-center text-white'>No Data Found!</div>
                            )
                            
                        ) : (
                            <div className='text-center'><Spinner color="white"/></div>
                        )
                        }
                        </TabPane>
                        <TabPane tabId={'4'} className='tab-pane-blue'>
                        {!loading ? (
                           <KpiByBatch dropdownData={{typeDropdown: typesDropdownArr, complexityDropdown: complexityDropdownArr, employeesDropdown: employeesDropdownArr, ep_batch}} CallBack={CallBack} type='search'/> 
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