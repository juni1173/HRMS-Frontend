import { useState } from "react" 
// import { toast, Slide } from 'react-toastify'
import apiHelper from "../ApiHelper"
const ProgramHelper = () => {
    const Api = apiHelper()
   
    const [ProgramList] = useState([])
    
  
    const fetchProgramList = async () => {
        const response = await Api.get('/courses/programs/', { headers: {Authorization: Api.token} })
        if (response) {
            if (response.status === 200) {
                ProgramList.splice(0, ProgramList.length)
                const List = response.data 
                if (Object.values(List).length > 0) {
                    for (let i = 0; i < List.length; i++) {
                        if (List[i].is_active) {
                            ProgramList.push(List[i])
                        } 
                      }  
                      return ProgramList
                }
            } else {
                Api.Toast('error', response.message)
            }
        }
    }
  const postProgram = async (data) => {
    
            await Api.jsonPost(`/courses/programs/`, data)
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
  const updateProgram = async (data, slug, uuid) => {
                await Api.jsonPatch(`/courses/programs/${slug}/${uuid}`, data)
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
  const deleteProgram = async (uuid, slug) => {
    if (uuid && slug) {
        await  Api.deleteData(`/courses/programs/${slug}/${uuid}/`, {method: 'Delete'})
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
        postProgram,
        fetchProgramList,
        deleteProgram,
        updateProgram
    }
}
export default ProgramHelper