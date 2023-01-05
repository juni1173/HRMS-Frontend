import { useState } from "react" 
// import { toast, Slide } from 'react-toastify'
import apiHelper from "../../ApiHelper"
const TopicHelper = () => {
    const Api = apiHelper()
   
    const [TopicList] = useState([])
    
  
    const fetchTopicList = async (module_id) => {
        const response = await Api.get(`/courses/details/module/${module_id}/topics/`, { headers: {Authorization: Api.token} })
        if (response) {
            if (response.status === 200) {
                TopicList.splice(0, TopicList.length)
                const List = response.data 
                if (Object.values(List).length > 0) {
                    for (let i = 0; i < List.length; i++) {
                        if (List[i].is_active) {
                            TopicList.push(List[i])
                        } 
                      }  
                      return TopicList
                }
            } else {
                Api.Toast('error', response.message)
            }
        }
    }
  const postTopic = async (module_id, data) => {
    
            await Api.jsonPost(`/courses/details/module/${module_id}/topics/`, data)
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
  const updateTopic = async (module_id, data) => {
                await Api.jsonPatch(`/courses/details/module/${module_id}/topics/${data.id}/`, data)
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
  const deleteTopic = async (module_id, id) => {
    if (uuid && slug) {
        await  Api.deleteData(`/courses/details/module/${module_id}/topics/${id}/`, {method: 'Delete'})
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
        Api.Toast('error', "Topic Not Found!")
      }
      
       return false
     
  }  

    return {
        postTopic,
        fetchTopicList,
        deleteTopic,
        updateTopic
    }
}
export default TopicHelper