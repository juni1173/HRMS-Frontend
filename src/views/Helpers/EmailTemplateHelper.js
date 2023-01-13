import { useState } from "react" 
// import { toast, Slide } from 'react-toastify'
import apiHelper from "./ApiHelper"
const EmailTemplateHelper = () => {
    const Api = apiHelper()
    const [EmailTemplateSpecifications] = useState([])
    const [EmailTemplateAddInfo] = useState([])
    const [EmailTemplateResult] = useState({
        dim: {},
        EmailTemplateSpecifications: {},
        EmailTemplateAddInfo: {}
    })
    const [EmailTemplateList] = useState([])
    const [EmailTemplateVariables] = useState([])
    
  const fetchDimensions = async () => {
    
    const response = await Api.get('/EmailTemplate/dimensions/', { headers: {Authorization: Api.token} })
    if (response) {
    
        // emptying the array
    
        EmailTemplateSpecifications.splice(0, EmailTemplateSpecifications.length)
        EmailTemplateAddInfo.splice(0, EmailTemplateAddInfo.length)

        const dim = response
        
        if (Object.values(dim).length > 0) {
            for (let i = 0; i < dim.length; i++) {
                if (dim[i].EmailTemplate_type === 1) {
                    EmailTemplateSpecifications.push({value: dim[i].id, label: dim[i].title})
                } else if (dim[i].EmailTemplate_type === 2) {
                    EmailTemplateAddInfo.push({value: dim[i].id, label: dim[i].title})
                }
              }  
        }
        EmailTemplateResult.dim = dim
        EmailTemplateResult.EmailTemplateSpecifications = EmailTemplateSpecifications
        EmailTemplateResult.EmailTemplateAddInfo = EmailTemplateAddInfo
    return EmailTemplateResult
    }
    // console.warn(depResult)
    
    return EmailTemplateResult
   
    }
    const fetchEmailList = async () => {
        const response = await Api.get('/email/templates/', { headers: {Authorization: Api.token} })
        if (response) {
            if (response.status === 200) {
                const List = response.data 
                // console.warn(result)
                if (Object.values(List).length > 0) {
                    for (let i = 0; i < List.length; i++) {
                        if (List[i].is_active) {
                            EmailTemplateList.push(List[i])
                        } 
                      }  
                      return EmailTemplateList
                }
            } else {
                Api.Toast('error', response.message)
            }
        } else {
            Api.Toast('error', 'Server Not Found')
            return EmailTemplateList
        }
    }
    const fetchEmailVariables = async () => {
        const response = await Api.get('/email/template/variables/', { headers: {Authorization: Api.token} })
        if (response) {
            if (response.status === 200) {
                const List = response.data 
                // console.warn(result)
                if (Object.values(List).length > 0) {
                    for (let i = 0; i < List.length; i++) {
                            EmailTemplateVariables.push(List[i])
                      }  
                      return EmailTemplateVariables
                }
            } else {
                Api.Toast('error', response.message)
            }
        } else {
            Api.Toast('error', 'Server Not Found')
            return EmailTemplateVariables
        }
    }
  const postEmailTemplate = async (data) => {
    let formData = new FormData()
        formData = JSON.stringify(Object.assign(data))
    const url = `${Api.ApiBaseLink}/EmailTemplate/`
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
  const updateEmailTemplate = async (data, id) => {
    let formData = new FormData()
        formData = JSON.stringify(Object.assign(data))
        // console.warn(Object.assign(data))
    const url = `${Api.ApiBaseLink}/EmailTemplate/${id}/`
                fetch(url, {
                method: "Patch",
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
  const deleteEmailTemplate = async id => {
    if (id) {
        await  Api.deleteData(`/email/templates/${id}/`, {method: 'Delete'})
        .then((result) => {
          const data = {status:result.status, result_data:result.data, message: result.message }
          if (data.status === 200) {
            Api.Toast('success', result.message)
            return true
            
          } else {
            Api.Toast('error', result.message)
          }
        })
        .catch((error) => {
          console.error(error)
          Api.Toast('error', "Invalid Request")
        }) 
        
      } else {
        Api.Toast('error', "EmailTemplate Not Found!")
      }
      
       return false
     
  }  

    return {
        fetchDimensions,
        postEmailTemplate,
        fetchEmailList,
        fetchEmailVariables,
        deleteEmailTemplate,
        updateEmailTemplate
    }
}
export default EmailTemplateHelper