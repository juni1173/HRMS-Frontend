import { Fragment, useEffect, useState, useCallback } from "react"
import {TabContent, TabPane, Nav, NavItem, NavLink, Spinner} from "reactstrap"
import apiHelper from "../../Helpers/ApiHelper"
import Employees from "./Employees"
 
const viewEmployee = () => {
    
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [employeeActiveList, setEmployeeActiveList] = useState([])
    const [employeeInactiveList, setEmployeeInactiveList] = useState([])
    const [active, setActive] = useState('1')
    const getEmployeeData = async () => {
        setLoading(true)
        await Api.get(`/employees/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    setEmployeeActiveList(result.data.active_employees)
                    setEmployeeInactiveList(result.data.deactive_employees)
                } else {
                    Api.Toast('error', result.message)
                }
            } else (
             Api.Toast('error', 'Server not responding!')   
            )
        })  
        setTimeout(() => {
            setLoading(false)
        }, 500)
    }
    const toggle = tab => {
        setActive(tab)
      }
    useEffect(() => {
        getEmployeeData()
        }, [])

        const CallBack = useCallback(() => {
            getEmployeeData()
          }, [employeeActiveList, employeeInactiveList])
   return (
    <Fragment>
      <Nav tabs className='course-tabs'>
                                {/* <div className='col-md-6'> */}
                                    <NavItem >
                                    <NavLink
                                        active={active === '1'}
                                        onClick={() => {
                                        toggle('1')
                                        }}
                                    >
                                    Active Employees
                                    </NavLink>
                                    </NavItem>
                                {/* </div>
                                <div className='col-md-6'> */}
                                    <NavItem >
                                    <NavLink
                                        active={active === '2'}
                                        onClick={() => {
                                        toggle('2')
                                        }}
                                    >
                                        InActive Employees
                                    </NavLink>
                                    </NavItem>
                                
                                {/* </div> */}
                        </Nav>
                        <TabContent className='py-50' activeTab={active}>
                        <TabPane tabId={'1'}>
                            {!loading ? (
                                <Employees employeeList={employeeActiveList} CallBack={CallBack} type="active"/>
                            ) : (
                                <div className="text-center"><Spinner/></div> 
                            )}
                           
                        </TabPane>
                        <TabPane tabId={'2'}>
                        {!loading ? (
                                 <Employees employeeList={employeeInactiveList} CallBack={CallBack} type="inactive"/>
                            ) : (
                                <div className="text-center"><Spinner/></div> 
                            )}
                           
                        </TabPane>
                    </TabContent>
    </Fragment>
   )
}
export default viewEmployee