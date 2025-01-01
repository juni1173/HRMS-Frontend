import { Fragment } from 'react'
import {  X, Check } from 'react-feather'
import Swal from "sweetalert2"
import withReactContent from 'sweetalert2-react-content'
// ** Reactstrap Imports
import { toast, Slide } from 'react-toastify'
import Avatar from '@components/avatar'
  const apiHelper = () => {
    const MySwal = withReactContent(Swal)
    let token = localStorage.getItem('accessToken')
    // const controller = new AbortController()
    if (!token) {
      localStorage.clear()
      // window.location.href = "/login"
    } else {
      token = token.replaceAll('"', '')
     token = `Bearer ${token}`
    
    }
    
    const org = JSON.parse(localStorage.getItem('organization'))
    const user = JSON.parse(localStorage.getItem('user'))
    const user_id = localStorage.getItem('user_id') ? JSON.parse(localStorage.getItem('user_id')) : null
    const role = localStorage.getItem('userData') && JSON.parse(localStorage.getItem('userData')).user_role
     
    const ApiBaseLink = process.env.REACT_APP_API_URL
    const BaseUrl = process.env.REACT_APP_PUBLIC_URL
    const BackendBaseLink = process.env.REACT_APP_BACKEND_URL 
    const FrontendBaseUrl = process.env.REACT_APP_FRONTEND_URL 

    const ToastContent = ({ type, message }) => (
        type === 'success' ? (
        <Fragment>
          <div className='toastify-header'>
            <div className='title-wrapper'>
              <Avatar size='sm' color='success' icon={<Check size={12} />} />
              <h6 className='toast-title fw-bold'>Successfull</h6>
            </div>
          </div>
          <div className='toastify-body'>
            <span>{message}</span>
          </div>
        </Fragment>) : (
        <Fragment>
          <div className='toastify-header'>
            <div className='title-wrapper'>
              <Avatar size='sm' color='danger' icon={<X size={12} />} />
              <h6 className='toast-title fw-bold'>Error</h6>
            </div>
          </div>
          <div className='toastify-body'>
            <span>{message}</span>
          </div>
        </Fragment>
        )
      )
      const Toast = (type, message) => {
        type === 'success' ? (
            toast.success(
                <ToastContent type='success' message={message} />,
                { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
              )
        ) : (
            toast.error(
                <ToastContent type='error' message={message ? message : 'No Response From Server'} />,
                { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
              )
              
        )
      }
    
    const callAPI = async (endpointurl, options = {}) => {
      
        endpointurl = ApiBaseLink + endpointurl
        const defaultHTTPMethod = "GET"
        const defaultHTTPHeaders = {  //set defaultHeaders of Http request
            // Accept: "application/json",
            Authorization: token
        }
         const controller = new AbortController() //using  AbortController to cancel ongoing fetch requests
        if (!options.signal) {
          options.signal = controller.signal
        }
        
        options.method = options.method || defaultHTTPMethod

        options.headers = options.headers ? { ...defaultHTTPHeaders, ...options.headers } : defaultHTTPHeaders
        
        options.body = JSON.stringify(options.body) || false
        if (!options.body) delete options.body
        
        setTimeout(() => { // cancel request if it will take more then 5s 
            controller.abort()
        }, 10000)
        
        try {

            const apiResponse = await fetch(endpointurl, options)
            // debugger
            if (!apiResponse.ok) {
              if ([401, 405].includes(apiResponse.status)) {
                  localStorage.clear()
                  window.location.href = "/"
                  return false
              }
              if (apiResponse.status === 404) {
                localStorage.clear()
                  window.location.href = "/"
                  return false
              }
            }   
            return await apiResponse.json()
           
        } catch (err) {
           
            return err
        }
    }
    
    //calling get API For fetching data
    const get = (endpointurl, options = {}) => callAPI(endpointurl, options)

    //Post to insert 
    const post = (endpointurl, options) => {
        options.method = "POST"
        return callAPI(endpointurl, options)
    }
    
    const jsonPost = async (url, formData, json = true) => {
      url = ApiBaseLink + url
      const options = {headers: null, method: null, body: null}
      
      options.method = "POST"
      if (json) { 
        options.headers = {'content-type': 'application/json', Authorization: token}
        options.body = JSON.stringify(formData)
      } else {
        options.headers = {Authorization: token}
        options.body = formData
      }
      
      try {
        const apiResult =  await fetch(url, options)
        if (!apiResult.ok) {
          if ([401, 405].includes(apiResult.status)) {
              localStorage.clear()
              window.location.href = "/login"
              return false
          }
        }    
        return await apiResult.json()
      } catch (err) {
          return err
      }
    }

    const jsonPatch = async (url, formData, json = true) => {
      url = ApiBaseLink + url
      const options = {headers: null, method: "PATCH", body: null}
      
      options.method = "PATCH"
      if (json) { 
        options.headers = {'content-type': 'application/json', Authorization: token}
        options.body = JSON.stringify(formData)
      } else {
        options.headers = {Authorization: token}
        options.body = formData
      }
      try {
        const apiResult =  await fetch(url, options)
        if (!apiResult.ok) {
          if ([401, 405].includes(apiResult.status)) {
              localStorage.clear()
              window.location.href = "/login"
              return false
          }
        }    
        return await apiResult.json()
      } catch (err) {
          return err
      }
    }
    const getJiraTokens = async () => {
      const response = await fetch(`${ApiBaseLink}/jira/tokens/`, {
        method: 'GET',
        headers: {
          Authorization: token
        }
      })
      const json = response.json()
      return await json
      
    }
    const postJiraTokens = async (data) => {
     
      const response = await fetch(`${ApiBaseLink}/jira/tokens/`, {
        method: 'POST',
        headers: {
          Authorization: token,
          'content-type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      const json = response.json()
      return await json
  }
    const JiraAccessToken = async () => {
      let local_tokens_data = []
        const tokens_data = await getJiraTokens()
        if (tokens_data.status === 200) {
          local_tokens_data = tokens_data.data[0]
          if (Object.values(local_tokens_data).length > 0) {
            const response = await fetch(`https://auth.atlassian.com/oauth/token`, {
            method: 'POST',
            headers: {
              'content-type': 'application/json'
            },
            body: JSON.stringify({
                grant_type: 'refresh_token',
                client_id: 'q6m1aQ2HZYuIWSiDDyPnB6tbVnDVwwCm',
                client_secret: 'ATOA42fMjBgj8BY96jal5V7KXTzg41XSzYGz5bsvKhZGEUY5pO6iX0lxB_GwMtHE3R1a8CE8FC61',
                refresh_token: local_tokens_data.refresh_token
              })
            })
            if (response.status === 200) {
              const json = await response.json()
          
              if (Object.values(json).length > 0) {
                const post_local_tokens = await postJiraTokens(json)
                return post_local_tokens.data
              }
            }
          }
        }
        // console.warn(`Local Server api response : ${local_tokens_data}`)
        if (!tokens_data.ok) {
          if ([401, 405].includes(tokens_data.status)) {
              localStorage.clear()
              window.location.href = "/login"
              return false
          }
        }   
      return local_tokens_data
    }
    
    const jiraGet = async (url) => {
      url = `https://api.atlassian.com/ex/jira/ebd17c20-72d8-441c-81eb-b6185d42c9d8${url}`
      let local_tokens = []
      const tokens_data = await getJiraTokens()
      local_tokens = tokens_data.data[0]
      if (local_tokens && Object.values(local_tokens).length > 0) {
        const Authorization = `Bearer ${local_tokens.access_token}`
        const options = {headers: null, method: null, body: null}
        
        options.method = "GET"
        options.headers = {Authorization, Accept: 'application/json'}
        
        try {
          const apiResult =  await fetch(url, options)
          if (!apiResult.ok) {
            if ([401, 405].includes(apiResult.status)) {
              local_tokens = await JiraAccessToken()
                const Auth = `Bearer ${local_tokens.access_token}`
                const Jira_options = {headers: null, method: null, body: null}        
                Jira_options.method = "GET"
                Jira_options.headers = {Authorization: Auth, Accept: 'application/json'}
                try {
                  const JiraApi = await fetch(url, Jira_options)
                  if (!JiraApi.ok) {
                    Toast('error', JiraApi.message)
                  }
                  return await JiraApi.json()
                } catch (err) {
                  return err
                }
            }
          }    
          return await apiResult.json()
        } catch (err) {
            return err
        }
      } else {
        Toast('error', 'Jira Tokens are empty')
      }
      
    }
    const jiraPost = async (url, data) => {
      
      url = `https://api.atlassian.com/ex/jira/ebd17c20-72d8-441c-81eb-b6185d42c9d8${url}`
      let local_tokens = []
      const tokens_data = await getJiraTokens()
      local_tokens = tokens_data.data[0]
      if (local_tokens && Object.values(local_tokens).length > 0) {
        const Authorization = `Bearer ${local_tokens.access_token}`
        const options = {headers: null, method: null, body: null}
      
      options.method = "POST"
      options.headers = {Authorization, Accept: 'application/json', 'Content-Type': 'application/json'}
      options.body = data
      try {
        const apiResult =  await fetch(url, options)
        if (!apiResult.ok) {
          if ([401, 405].includes(apiResult.status)) {
            local_tokens = await JiraAccessToken()
            const Auth = `Bearer ${local_tokens.access_token}`
            const Jira_options = {headers: null, method: null, body: null}        
            Jira_options.method = "POST"
            Jira_options.headers = {Authorization: Auth, Accept: 'application/json'}
            try {
              const JiraApi = await fetch(url, Jira_options)
              if (!JiraApi.ok) {
                Toast('error', JiraApi.message)
              }
              const jiraData = await JiraApi.json()
              const jiraResponse = {status: JiraApi.status, jiraData}
              return  jiraResponse
            } catch (err) {
              return err
            }
          }
        }    
        const data = await apiResult.json()
        const response = {status: apiResult.status, data}
        return  response
      } catch (err) {
          return err
      }
    } else {
      Toast('error', 'Jira Tokens are empty')
    }
    }

    //Put Api calling
    const put = (endpointurl, options) => {
        options.method = "PATCH"
        options.headers = {Authorization: token}
        return callAPI(endpointurl, options)
    }

    //Delete Api calling
    const deleteData = (endpointurl, options) => {
        options.method = "DELETE"
        options.headers = {Authorization: token}
        return callAPI(endpointurl, options)
    }

    //Modal Functions 
    const deleteModal = async () => {
      return  MySwal.fire({  
        title: 'Are you sure?',  
        text: 'This entry will be deleted!',  
        icon: 'warning',  
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-danger ms-1'
        },
        buttonsStyling: false
      })
    }
    const successModal = (result) => {
      if (result) {
        if (result.status === 200) {
          return  MySwal.fire({
            icon: 'success',
            title: result.message ? result.message : 'Successfully Processed',
            // text: result.message,
            customClass: {
              confirmButton: 'btn btn-success'
            }
          })
        } else {
          return  MySwal.fire({
            icon: 'error',
            title: result.message ? result.message : 'Something went wrong!',
            // text: result.message,
            customClass: {
              confirmButton: 'btn btn-danger'
            }
          })
        }
      } else {
        return  MySwal.fire({
          icon: 'error',
          title: 'Server not responding!',
          // text: result.message,
          customClass: {
            confirmButton: 'btn btn-danger'
          }
        })
      }
    }
    const cancelModal = () => {
      return  MySwal.fire({
         icon: 'success',
         title: 'Cencelled',
         text: 'Request aborted!',
         customClass: {
           confirmButton: 'btn btn-success'
         }
       })
     }
    
     // format date function
     const formatDateWithMonthName = (dateString) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', options) // May 20, 2024
    }
    const formatDate = (date) => {
      const d = new Date(date)
        let month = (`${d.getMonth() + 1}`)
        let day = `${d.getDate()}`
        const year = d.getFullYear()
  
      if (month.length < 2) {
        month = `0${month}`
      }
      if (day.length < 2) {
        day = `0${day}`
      }
         
      return [year, month, day].join('-')
    }
    const dmyformat = (date) => {
      const d = new Date(date)
      console.log(d)
        let month = (`${d.getMonth() + 1}`)
        let day = `${d.getDate()}`
        const year = d.getFullYear()

      if (month.length < 2) {
        month = `0${month}`
      }
      if (day.length < 2) {
        day = `0${day}`
      }
         
      return [day, month, year].join('-')
    }
    const formatDateDifference = (date) => {
      const currentDate = new Date()
      const givenDate = new Date(date)
      
      const differenceInMilliseconds = currentDate - givenDate
      const differenceInSeconds = differenceInMilliseconds / 1000
      const differenceInMinutes = differenceInSeconds / 60
      const differenceInHours = differenceInMinutes / 60
      const differenceInDays = differenceInHours / 24
    
      if (differenceInDays < 1) {
        // Less than a day, show time
        const options = { hour: 'numeric', minute: 'numeric' }
        const formattedTime = givenDate.toLocaleTimeString([], options)
        return `Today at ${formattedTime}`
      } else if (differenceInDays >= 1 && differenceInDays < 30) {
        // Less than a month, show days
        return `${Math.floor(differenceInDays)} day${Math.floor(differenceInDays) > 1 ? 's' : ''} ago`
      } else if (differenceInDays >= 30 && differenceInDays < 365) {
        // Less than a year, show months
        const differenceInMonths = differenceInDays / 30
        return `${Math.floor(differenceInMonths)} month${Math.floor(differenceInMonths) > 1 ? 's' : ''} ago`
      } else {
        // More than a year, show years
        const differenceInYears = differenceInDays / 365
        return `${Math.floor(differenceInYears)} year${Math.floor(differenceInYears) > 1 ? 's' : ''} ago`
      }
    }
    //format time function

    const formatTime = (date) => {
      const d = new Date(date)
      let hours = `${d.getHours()}`
      let mins = `${d.getMinutes()}`
      if (hours.length < 2) {
        hours = `0${hours}`
      }
      if (mins.length < 2) {
        mins = `0${mins}`
      }
      const hoursMin = `${hours}:${mins}`
         
      return hoursMin
    }
    const currentTime = () => { 
      const current = new Date()
      const time = current.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    })
    return time
  }
    // get month name by date

    const getMonth = (date) => {
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ]
      const d = new Date(date)
       const monthName = monthNames[d.getMonth()]
       return monthName
    }
    const getMonthName = (month_number) => {
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ]
       const monthName = monthNames[(month_number - 1)]
       return monthName
    }
    const convertUTCtoDate = date => {
      if (date) {
          let d = new Date(date)
          d = formatDate(d)
          return d
      }
  }
    //Copy to Clipboard Function
    const copyToClipboard = (text) => {
      if (navigator.clipboard?.writeText) {
        // Use modern Clipboard API if available
        navigator.clipboard
          .writeText(text)
          .then(() => {
            Toast('success', 'Copied to clipboard!')
          })
          .catch((err) => {
            Toast('error', `Failed to copy: ${err.message}`)
          })
      } else {
        // Fallback for older browsers
        try {
          const textArea = document.createElement('textarea')
          textArea.value = text
          textArea.style.position = 'fixed' // Prevent scrolling
          textArea.style.left = '-9999px'  // Hide the textarea
          document.body.appendChild(textArea)
          textArea.focus()
          textArea.select()
    
          const successful = document.execCommand('copy')
          document.body.removeChild(textArea)
          if (document.queryCommandSupported && !document.queryCommandSupported('copy')) {
            console.warn('Clipboard copying is not supported in this browser.')
            return
          }
          if (!window.isSecureContext) {
            console.warn('Clipboard API requires a secure context (HTTPS).')
          }
          if (successful) {
            Toast('success', 'Copied to clipboard!')
          } else {
            throw new Error('Fallback copy failed')
          }
        } catch (err) {
          Toast('error', `Failed to copy: ${err.message}`)
        }
      }
    }
    
    return {
        get,
        post,
        jsonPost,
        jsonPatch,
        put,
        deleteData,
        jiraGet,
        jiraPost,
        Toast,
        deleteModal,
        successModal,
        cancelModal,
        formatDate,
        formatDateWithMonthName,
        dmyformat,
        formatTime,
        formatDateDifference,
        getMonth,
        getMonthName,
        convertUTCtoDate,
        currentTime,
        copyToClipboard,
        // controller,
        org,
        user_id,
        user,
        role,
        token,
        ApiBaseLink,
        BaseUrl,
        BackendBaseLink,
        FrontendBaseUrl
        
    }
}
export default apiHelper