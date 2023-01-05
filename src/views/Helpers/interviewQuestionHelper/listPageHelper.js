import { useState } from "react" 
// import { toast, Slide } from 'react-toastify'
import apiHelper from "../ApiHelper"
 
const listPageHelper = () => {
    const Api = apiHelper()
    const [questionsList] = useState([])
     const typeDropdownFunc = () => {
        const typeDropdown = [
            { value: '2', label: 'Non-Technical' },
            { value: '1', label: 'Technical' }
          ]
       return typeDropdown   
     }
     const getQuestionsApi = async (formdata) => {
        await Api.jsonPost(`/assessments/list/questions/all/`, formdata).then(result => {
            if (result) {
                if (result.status === 200) {
                    questionsList.splice(0, questionsList.length)
                    if ((result.data).length > 0) {
                        const list = result.data
                        for (let i = 0; i < list.length; i++) {
                            questionsList.push(list[i])
                        }
                    } else {
                        Api.Toast('error', 'No Question Data Available For This Type/Position')
                    }
                } else {
                    Api.Toast('error', result.message)
                }
                return questionsList
            } else {
                Api.Toast('error', 'Something Went Wrong')
            }
        })
     }
    return {
        typeDropdownFunc,
        getQuestionsApi
    }
}
export default listPageHelper