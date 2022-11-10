import { useState } from "react" 
// import { toast, Slide } from 'react-toastify'
import apiHelper from "./ApiHelper"
const CustomHelper = () => {
    const Api = apiHelper()
    const [depResult] = useState({
        dep: {},
        depActive: {},
        depNotActive: {}
    } 
    )
  const fetchDepartments = async () => {
    
    const response = await Api.get('/organization/department/')
    // console.warn(response)
    if (response.status === 200) {
    
     
    }
    // console.warn(depResult)
    
    return depResult
   
}
    const addPositionGHeadData = async () => {
        const response = await Api.get('/organization/grouphead/')
        // console.warn(response)
        if (response.status === 200) {

            const result = response.data
            return result
        }
        // console.warn(depResult)
        
        return Api.Toast('error', 'Try Again')

    }
    const getDepartmentbyGHeadid = async (id) => {
        if (id) {
            const response = await Api.get('/organization/department/')
        // console.warn(response)
        if (response.status === 200) {
            const result = response.data
            const list = []
            for (let i = 0; i < result.length; i++) {
                if (result[i].grouphead === id) {
                    list.push(result[i])
                } 
            }
            return list
        }
        } else {
            return Api.Toast('error', 'Group Head not found')
        }
        
        // console.warn(depResult)
        
        return Api.Toast('error', 'Try Again')

    }
     const getstaffByDep = async () => {
        
            const response = await Api.get('/organization/staff_classification/')
        // console.warn(response)
        if (response.status === 200) {
            const result = response.data
            const list = []
            for (let i = 0; i < result.length; i++) {
                    list.push(result[i])
            }
            return list
        } else {
            return Api.Toast('error', 'staff Classifications not found')
        }
        
        
        // console.warn(depResult)
        
        return Api.Toast('error', 'Try Again')

    }
    const generateActiveNotActiveDropdown = (obj) => {
        const activeDropdown = []
        const notactiveDropdown = []
        const finalObj = []
        
            for (let i = 0; i < obj.length; i++) {
                if (obj[i].is_active) {
                    // console.warn(i)
                    activeDropdown.push({value: obj[i].id, label: obj[i].department_title})
                } else {
                    // console.warn(i)
                    notactiveDropdown.push({value: obj[i].id, label: obj[i].department_title})
                }
              }  
        //   console.warn(activeDropdown)
          finalObj['active'] = activeDropdown
          finalObj['notActive'] = notactiveDropdown
        //   console.warn(finalObj)
          return finalObj

    }
    
        return {
            fetchDepartments,
            addPositionGHeadData,
            generateActiveNotActiveDropdown,
            getDepartmentbyGHeadid,
            getstaffByDep
        }
    }

export default CustomHelper