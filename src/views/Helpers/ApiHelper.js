import { Fragment } from 'react'
import {  X, Check } from 'react-feather'

// ** Reactstrap Imports
import { toast, Slide } from 'react-toastify'
import Avatar from '@components/avatar'
  const apiHelper = () => {

    let token = localStorage.getItem('accessToken')
     token = token.replaceAll('"', '')
     token = `Bearer ${token}`
    const org = JSON.parse(localStorage.getItem('organization'))
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
                <ToastContent type='error' message={message} />,
                { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
              )
              
        )
        console.warn(message)
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


    //Put Api calling
    const put = (endpointurl, options) => {
        options.method = "PATCH"
        return callAPI(endpointurl, options)
    }

    //Delete Api calling
    const deleteData = (endpointurl, options) => {
        options.method = "DELETE"
        return callAPI(endpointurl, options)
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
        put,
        deleteData,
        Toast,
        org,
        token
        
    }
}
export default apiHelper