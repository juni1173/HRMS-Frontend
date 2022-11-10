import { useState } from "react" 
// import { toast, Slide } from 'react-toastify'
import apiHelper from "./ApiHelper"
const staffClassificationsHelper = () => {
    const Api = apiHelper()
    const [staffActive] = useState([])
    const [staffNotActive] = useState([])
    const [staffResult] = useState({
        staff: {},
        staffActive: {},
        staffNotActive: {}
    } 
    )
  const fetchstaffClassifications = async () => {
    
    const response = await Api.get('/organization/staff_classification/')
    // console.warn(response)
    if (response.status === 200) {
    
        // emptying the array
    
    staffActive.splice(0, staffActive.length)
    staffNotActive.splice(0, staffNotActive.length)

        const staff = response.data 
        
        // console.warn(result)
        if (Object.values(staff).length > 0) {
            for (let i = 0; i < staff.length; i++) {
                if (staff[i].is_active) {
                    
                  staffActive.push({value: staff[i].id, label: staff[i].staffClassification_title})
                } else {
                  
                   staffNotActive.push({value: staff[i].id, label: staff[i].staffClassification_title})
                    
                }
              }  
        }
    staffResult.staff = staff
    staffResult.staffActive = staffActive
    staffResult.staffNotActive = staffNotActive
    return await staffResult
    }
    
    return staffResult
   
}
    return {
        fetchstaffClassifications
    }
}
export default staffClassificationsHelper