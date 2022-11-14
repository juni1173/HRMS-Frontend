import { useState } from "react" 
// import { toast, Slide } from 'react-toastify'
import apiHelper from "./ApiHelper"
const JobHelper = () => {
    const Api = apiHelper()
    
    const [result] = useState({
        Staff_Classification:[],
        Department:[],
        Position:[],
        Job_Types:[],
        JD:[]
    })
    const fetchFormPreData = async () => {
        const response = await Api.get(`/jobs/pre/data/${Api.org.id}/`, { headers: {Authorization: Api.token} })
        // console.warn(response)
        if (response.status === 200) {
            const data = response.data 
            if (Object.values(data).length > 0) {
                const SC = data.staff_classification
                const Dep = data.department
                const Pos = data.position
                const JT = data.job_types
                const JD = data.jd
                for (let i = 0; i < SC.length; i++) {
                    result.Staff_Classification.push({value: SC[i].id, label: SC[i].title})
                }
                for (let i = 0; i < Dep.length; i++) {
                    result.Department.push({value: Dep[i].id, label: Dep[i].title})
                }
                for (let i = 0; i < Pos.length; i++) {
                    result.Position.push({value: Pos[i].id, label: Pos[i].title})
                }
                for (let i = 0; i < JT.length; i++) {
                    result.Job_Types.push({value: JT[i].id, label: JT[i].title})
                }
                for (let i = 0; i < JD.length; i++) {
                    result.JD.push({value: JD[i].id, label: JD[i].title})
                }
                return result
            } else {
                Api.Toast('error', response.message)
            }
        } else {
            Api.Toast('error', response.message)
        }
    }    
    return {
        fetchFormPreData
    }
}
export default JobHelper