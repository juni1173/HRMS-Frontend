import { useState } from "react" 
// import { toast, Slide } from 'react-toastify'
import apiHelper from "./ApiHelper"
const JDHelper = () => {
    const Api = apiHelper()
    const [JDSpecifications] = useState([])
    const [JDAddInfo] = useState([])
    const [JDResult] = useState({
        dim: {},
        JDSpecifications: {},
        JDAddInfo: {}
    } 
    )
  const fetchDimensions = async () => {
    
    const response = await Api.get('/jd/dimensions/', { headers: {Authorization: Api.token} })
    if (response) {
    
        // emptying the array
    
        JDSpecifications.splice(0, JDSpecifications.length)
        JDAddInfo.splice(0, JDAddInfo.length)

        const dim = response
        
        console.warn(dim)
        if (Object.values(dim).length > 0) {
            for (let i = 0; i < dim.length; i++) {
                if (dim[i].jd_type === 1) {
                    JDSpecifications.push({value: dim[i].id, label: dim[i].title})
                } else if (dim[i].jd_type === 2) {
                    JDAddInfo.push({value: dim[i].id, label: dim[i].title})
                }
              }  
        }
        JDResult.dim = dim
        JDResult.JDSpecifications = JDSpecifications
        JDResult.JDAddInfo = JDAddInfo
    return JDResult
    }
    // console.warn(depResult)
    
    return JDResult
   
    }

  const postJD = async (data) => {
    let formData = new FormData()
        formData = JSON.stringify(Object.assign(data))
        console.warn(typeof (formData))
        console.warn(formData)
    
    const url = `${Api.ApiBaseLink}/jd/`
                fetch(url, {
                method: "POST",
                headers: { "Content-Type": "Application/json", Authorization: Api.token },
                body: formData
                })
                .then((response) => response.json())
                .then((result) => {
                    if (result.status === 200) {
                    Api.Toast('success', result.message)
                    } else {
                        Api.Toast('error', 'not working')
                    }
                })
            .catch((error) => {
                Api.Toast('error', error)
            }) 
    
  }  
    return {
        fetchDimensions,
        postJD
    }
}
export default JDHelper