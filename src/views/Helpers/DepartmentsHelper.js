import { useState } from "react" 
// import { toast, Slide } from 'react-toastify'
import apiHelper from "./ApiHelper"
const DepartmentsHelper = () => {
    const Api = apiHelper()
    const [depActive] = useState([])
    const [depNotActive] = useState([])
    const [depResult] = useState({
        dep: {},
        depActive: {},
        depNotActive: {}
    } 
    )
  const fetchDepartments = async () => {
    
    const response = await Api.get('/organization/department/', { headers: {Authorization: Api.token} })
    if (response.status === 200) {
    
        // emptying the array
    
    depActive.splice(0, depActive.length)
    depNotActive.splice(0, depNotActive.length)

        const dep = response.data 
        
        // console.warn(result)
        if (Object.values(dep).length > 0) {
            for (let i = 0; i < dep.length; i++) {
                if (dep[i].is_active) {
                    
                  depActive.push({value: dep[i].id, label: dep[i].title})
                } else {
                  
                   depNotActive.push({value: dep[i].id, label: dep[i].title})
                    
                }
              }  
        }
    depResult.dep = dep
    depResult.depActive = depActive
    depResult.depNotActive = depNotActive
    return depResult
    }
    // console.warn(depResult)
    
    return depResult
   
    }
    return {
        fetchDepartments
    }
}
export default DepartmentsHelper