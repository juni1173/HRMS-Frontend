import { Fragment, useEffect, useState, useCallback } from "react"
import { Spinner} from "reactstrap"
import apiHelper from "../../Helpers/ApiHelper"
import KpiList from "./KpiList"
 
const index = () => {
    
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [preData, setPreData] = useState([])
    const [typesDropdownArr] = useState([])
    const [complexityDropdownArr] = useState([])
    const [employeesDropdownArr] = useState([]) 
    const getPreData = async () => {
        setLoading(true)
        await Api.get(`/kpis/requests/to/hr/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    setPreData(result.data)
                } else {
                    Api.Toast('error', result.message)
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
            preData && Object.values(preData).length > 0 ? (
                preData.map((item, index) => (
                    <div key={index}>
                        <KpiList key={index} data={item} dropdownData={{typeDropdown: typesDropdownArr, complexityDropdown: complexityDropdownArr, employeesDropdown: employeesDropdownArr}} CallBack={CallBack} />
                    </div>
                ))
                
            ) : (
                <div className='text-center'>No Data Found!</div>
            )
            
        ) : (
            <div className='text-center'><Spinner/></div>
        )
        }
    </Fragment>
   )
}
export default index