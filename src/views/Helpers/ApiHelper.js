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
    if (!token) {
      localStorage.clear()
      // window.location.href = "/login"
    } else {
      token = token.replaceAll('"', '')
     token = `Bearer ${token}`
    
    }
    const org = JSON.parse(localStorage.getItem('organization'))
    const user_id = JSON.parse(localStorage.getItem('user_id'))
     
    const ApiBaseLink = process.env.REACT_APP_API_URL

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
        options.signal = controller.signal

        options.method = options.method || defaultHTTPMethod

        options.headers = options.headers ? { ...defaultHTTPHeaders, ...options.headers } : defaultHTTPHeaders
        
        options.body = JSON.stringify(options.body) || false
        if (!options.body) delete options.body
        
        setTimeout(() => { // cancel request if it will take more then 5s 
            controller.abort()
        }, 5000)
        
        try {

            const apiResponse = await fetch(endpointurl, options)
            // debugger
            if (!apiResponse.ok) {
              if ([401, 403].includes(apiResponse.status)) {
                  localStorage.clear()
                  window.location.href = "/login"
                  return false
              }
              if (apiResponse.status === 404) {
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
          if ([401, 403].includes(apiResult.status)) {
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
      const options = {headers: null, method: null, body: null}
      
      options.method = "Patch"
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
          if ([401, 403].includes(apiResult.status)) {
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
     return  MySwal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: result.message,
        customClass: {
          confirmButton: 'btn btn-success'
        }
      })
    }
    const cancelModal = (result) => {
      return  MySwal.fire({
         icon: 'success',
         title: 'Not Deleted',
         text: result.message,
         customClass: {
           confirmButton: 'btn btn-success'
         }
       })
     }
    
     // format date function

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

    // const fetchDepartments = () => {
            
    //       get('/organization/department/')
    //         .then(res => {
    //         if (res && res.data) {
    //         setList({result: res.data})   
    //         } 
    //     })
    //     .catch(err => console.log(err))
    //     // console.warn(list)
    //     return list
        
    //   }  
    return {
        get,
        post,
        jsonPost,
        jsonPatch,
        put,
        deleteData,
        Toast,
        deleteModal,
        successModal,
        cancelModal,
        formatDate,
        org,
        user_id,
        token,
        ApiBaseLink
        
    }
}
export default apiHelper