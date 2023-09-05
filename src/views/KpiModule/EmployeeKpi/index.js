import { Fragment, useEffect, useState, useCallback } from "react"
import { Spinner} from "reactstrap"
import apiHelper from "../../Helpers/ApiHelper"
import AddEmployeeKpi from "./AddEmployeeKpi"
 
const index = () => {
    
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [preData, setPreData] = useState([])
    const [typesDropdownArr] = useState([])
    const [complexityDropdownArr] = useState([])
    const [employeesDropdownArr] = useState([]) 
    const getPreData = async () => {
        setLoading(true)
        await Api.get(`/kpis/pre/data/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    setPreData(result.data)
                    typesDropdownArr.splice(0, typesDropdownArr.length)
                    complexityDropdownArr.splice(0, complexityDropdownArr.length)
                    employeesDropdownArr.splice(0, employeesDropdownArr.length)
                    const data = result.data
                    const typeLength = data.type.length
                    const complexityLength = data.complexity.length
                    const employeeLength = data.employees.length
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
            <AddEmployeeKpi preData={preData} dropdownData={{typeDropdown: typesDropdownArr, complexityDropdown: complexityDropdownArr, employeesDropdown: employeesDropdownArr}} CallBack={CallBack}/>
        ) : (
            <div className='text-center'><Spinner/></div>
        )
        }
    </Fragment>
   )
}
export default index