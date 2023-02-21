import { useState } from "react" 
// import { toast, Slide } from 'react-toastify'
import apiHelper from "../ApiHelper"
const LectureHelper = () => {
    const Api = apiHelper()
   
    const [LectureList] = useState([])
    
  
    const fetchLectureList = async (id) => {
        const response = await Api.get(`/instructors/lectures/${id}`, { headers: {Authorization: Api.token} })
        if (response) {
            if (response.status === 200) {
                LectureList.splice(0, LectureList.length)
                const List = response.data 
                if (Object.values(List).length > 0) {
                    for (let i = 0; i < List.length; i++) {
                        if (List[i].is_active) {
                            LectureList.push(List[i])
                        } 
                      }  
                      return LectureList
                }
            } else {
                Api.Toast('error', response.message)
            }
        }
    } 
    const StartLecture = async (id) => {
        await Api.jsonPost(`/applicants/trainee/start/lecture/${id}/`, {})
        .then(result => {
            if (result) {
                if (result.status === 200) {
                    return result.data
                } else {
                    Api.Toast('error', result.message)
                }
            } else {
                Api.Toast('error', 'Server not responding!')
            }
        })
    }
    return {
        fetchLectureList,
        StartLecture
    }
}
export default LectureHelper