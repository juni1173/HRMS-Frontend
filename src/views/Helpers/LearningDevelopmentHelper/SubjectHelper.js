import { useState } from "react" 
// import { toast, Slide } from 'react-toastify'
import apiHelper from "../ApiHelper"
const SubjectHelper = () => {
    const Api = apiHelper()
   
    const [SubjectList] = useState([])
    
  
    const fetchSubjectList = async () => {
        const response = await Api.get('/courses/subjects/', { headers: {Authorization: Api.token} })
        if (response) {
            if (response.status === 200) {
                SubjectList.splice(0, SubjectList.length)
                const List = response.data 
                if (Object.values(List).length > 0) {
                    for (let i = 0; i < List.length; i++) {
                        if (List[i].is_active) {
                            SubjectList.push(List[i])
                        } 
                      }  
                      return SubjectList
                }
            } else {
                Api.Toast('error', response.message)
            }
        }
    }
  const postSubject = async (data) => {
    
            await Api.jsonPost(`/courses/subjects/`, data)
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
  const updateSubject = async (data, slug, uuid) => {
                await Api.jsonPatch(`/courses/subjects/${slug}/${uuid}`, data)
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
  const deleteSubject = async (uuid, slug) => {
    if (uuid && slug) {
        await  Api.deleteData(`/courses/subjects/${slug}/${uuid}/`, {method: 'Delete'})
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
        Api.Toast('error', "Subject Not Found!")
      }
      
       return false
     
  }  

    return {
        postSubject,
        fetchSubjectList,
        deleteSubject,
        updateSubject
    }
}
export default SubjectHelper