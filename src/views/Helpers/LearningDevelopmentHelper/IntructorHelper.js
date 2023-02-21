import { useState } from "react" 
// import { toast, Slide } from 'react-toastify'
import apiHelper from "../ApiHelper"
const InstructorHelper = () => {
    const Api = apiHelper()
   
    const [InstructorList] = useState([])
    
  
    const fetchInstructorList = async () => {
        const response = await Api.get('/instructors/', { headers: {Authorization: Api.token} })
        if (response) {
            if (response.status === 200) {
                InstructorList.splice(0, InstructorList.length)
                const List = response.data 
                if (Object.values(List).length > 0) {
                    for (let i = 0; i < List.length; i++) {
                        if (List[i].is_active) {
                            InstructorList.push(List[i])
                        } 
                      }  
                      return InstructorList
                }
            } else {
                Api.Toast('error', response.message)
            }
        }
    }
 // const postProgram = async (data) => {
    
//             await Api.jsonPost(`/courses/programs/`, data)
//                 .then((result) => {
//                     if (result.status === 200) {
//                     Api.Toast('success', result.message)
//                     } else {
//                         Api.Toast('error', 'not working')
//                     }
//                 })
//             .catch((error) => {
//                 Api.Toast('error', error)
//             }) 
    
//   } 
//   const updateProgram = async (data, slug, uuid) => {
//                 await Api.jsonPatch(`/courses/programs/${slug}/${uuid}`, data)
//                 .then((result) => {
//                     if (result.status === 200) {
//                     Api.Toast('success', result.message)
//                     } else {
//                         Api.Toast('error', 'not working')
//                     }
//                 })
//             .catch((error) => {
//                 Api.Toast('error', error)
//             }) 
    
//   } 
  const deleteInstructor = async (uuid) => {
    if (uuid && slug) {
        await  Api.deleteData(`/instructors/delete/${uuid}/`, {method: 'Delete'})
        .then((result) => {
          const data = {status:result.status, result_data:result.data, message: result.message }
          if (data.status === 200) {
            
            Api.Toast('success', result.message)
            
          } else {
            Api.Toast('error', result.message)
          }
          
        })
        .catch((error) => {
          console.error(error)
          Api.Toast('error', "Invalid Request")
        }) 
        
      } else {
        Api.Toast('error', "Program Not Found!")
      }
      
       return false
     
  }  

    return {
        fetchInstructorList,
        deleteInstructor
    }
}
export default InstructorHelper