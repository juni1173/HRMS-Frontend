import { useState } from "react" 
// import { toast, Slide } from 'react-toastify'
import apiHelper from "../../ApiHelper"
const ModuleHelper = () => {
    const Api = apiHelper()
   
    const [ModuleList] = useState([])
    
  
    const fetchModuleList = async (uuid, slug) => {
        const response = await Api.get(`/courses/details/${slug}/${uuid}/modules/`, { headers: {Authorization: Api.token} })
        if (response) {
            if (response.status === 200) {
                ModuleList.splice(0, ModuleList.length)
                const List = response.data 
                if (Object.values(List).length > 0) {
                    for (let i = 0; i < List.length; i++) {
                        if (List[i].is_active) {
                            ModuleList.push(List[i])
                        } 
                      }  
                      return ModuleList
                }
            } else {
                Api.Toast('error', response.message)
            }
        }
    }
  const postModule = async (uuid, slug, data) => {
    
            await Api.jsonPost(`/courses/details/${slug}/${uuid}/modules/`, data)
                .then((result) => {
                    if (result) {
                    return result
                    } else {
                        Api.Toast('error', 'Server Not Responding')
                    }
                })
            .catch((error) => {
                Api.Toast('error', error)
            }) 
    
  } 
  const updateModule = async (data, slug, uuid) => {
                await Api.jsonPatch(`/courses/details/${slug}/${uuid}/modules/`, data)
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
  const deleteModule = async (uuid, slug, id) => {
    if (uuid && slug) {
        await  Api.deleteData(`/courses/details/${slug}/${uuid}/modules/${id}/`, {method: 'Delete'})
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
        Api.Toast('error', "Module Not Found!")
      }
      
       return false
     
  }  

    return {
        postModule,
        fetchModuleList,
        deleteModule,
        updateModule
    }
}
export default ModuleHelper