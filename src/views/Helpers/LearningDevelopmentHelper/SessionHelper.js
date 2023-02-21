// import { toast, Slide } from 'react-toastify'
import apiHelper from "../ApiHelper"
const SessionHelper = () => {
    const Api = apiHelper()
   
    // const [SessionList] = useState([])
    const fetchSessionList = async () => {
         await Api.get('/instructors/session/instructors/', { headers: {Authorization: Api.token} })
         .then(response => {
            if (response) {
                if (response.status === 200) {
                    const List = response.data 
                    console.warn(response.data)
                    // if (List.length > 0) {
                        // for (let i = 0; i < List.length; i++) {
                        //         SessionList.push(List[i])
                        //   }  
                    //       return List
                    // }
                    return response.data
                } else {
                    Api.Toast('error', response.message)
                }
            }
         })
        
    }
  const postSession = async (data) => {
    
            await Api.jsonPost(`/Sessions/`, data)
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
  const updateSession = async (data, slug, uuid) => {
                await Api.jsonPatch(`/Sessions/${slug}/${uuid}`, data)
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
  const deleteSession = async (uuid, slug) => {
    if (uuid && slug) {
        await  Api.deleteData(`/Sessions/${slug}/${uuid}/`, {method: 'Delete'})
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
        Api.Toast('error', "Session Not Found!")
      }
      
       return false
     
  }  

    return {
        postSession,
        fetchSessionList,
        deleteSession,
        updateSession
    }
}
export default SessionHelper