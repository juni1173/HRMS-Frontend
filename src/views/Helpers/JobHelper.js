import { useState } from "react" 
// import { toast, Slide } from 'react-toastify'
import apiHelper from "./ApiHelper"
const JobHelper = () => {
    const Api = apiHelper()
    const [jdActive] = useState([])
    const [jdNotActive] = useState([])
    const [jdResult] = useState({
        jd: {},
        jdActive: {},
        jdNotActive: {}
    } 
    )
  const fetchJD = async () => {
    
    const response = await Api.get('/jd/', { headers: {Authorization: Api.token} })
    // console.warn(response)
    if (response.status === 200) {
    
        // emptying the array
    
    jdActive.splice(0, jdActive.length)
    jdNotActive.splice(0, jdNotActive.length)

        const jd = response.data 
        
        // console.warn(result)
        if (Object.values(jd).length > 0) {
            for (let i = 0; i < jd.length; i++) {
                if (jd[i].is_active) {
                    
                  jdActive.push({value: jd[i].id, label: jd[i].title})
                } else {
                  
                   jdNotActive.push({value: jd[i].id, label: jd[i].title})
                    
                }
              }  
        }
        jdResult.jd = jd
        jdResult.jdActive = jdActive
        jdResult.jdNotActive = jdNotActive
        return jdResult
        } else {
            Api.Toast('error', response.message)
        }
   
    }
    return {
        fetchJD
    }
}
export default JobHelper