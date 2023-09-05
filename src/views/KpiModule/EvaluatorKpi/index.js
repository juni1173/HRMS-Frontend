import { Fragment, useEffect, useState, useCallback } from "react"
import { Spinner} from "reactstrap"
import apiHelper from "../../Helpers/ApiHelper"
import KpiRequests from "./KpiRequests"
 
const index = () => {
    
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [preData, setPreData] = useState([])
    const [typesDropdownArr] = useState([])
    const [complexityDropdownArr] = useState([])
    const [employeesDropdownArr] = useState([]) 
    const getPreData = async () => {
        setLoading(true)
        await Api.get(`/kpis/requests/to/team/lead/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    setPreData(result.data.employee_kpis_data)
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
                    typesDropdownArr.splice(0, typesDropdownArr.length)
                    complexityDropdownArr.splice(0, complexityDropdownArr.length)
                    employeesDropdownArr.splice(0, employeesDropdownArr.length)
                    for (let i = 0; i < typeLength; i++) {
                        typesDropdownArr.push({value: data.type[i].id, label: data.type[i].title})
                    }
                    for (let i = 0; i < complexityLength; i++) {
                        complexityDropdownArr.push({value: data.complexity[i].id, label: data.complexity[i].title})
                    }
                    for (let i = 0; i < employeeLength; i++) {
                        employeesDropdownArr.push({value: data.employees[i].id, label: data.employees[i].name})
                    }
                    
                } else {
                    Api.Toast('error', result.message)
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
        {!loading ? (
            (preData && Object.values(preData).length > 0) ? (
                Object.values(preData).map((item, key) => (
                <div key={key}>
                    <KpiRequests index={key} data={item} dropdownData={{typeDropdown: typesDropdownArr, complexityDropdown: complexityDropdownArr, employeesDropdown: employeesDropdownArr}} CallBack={CallBack} />
                </div>    
                ))
                ) : (
                    <div className="text-center"><p>No data found!</p></div>
                )
            
        ) : (
            <div className='text-center'><Spinner/></div>
        )
        }
    </Fragment>
   )
}
export default index