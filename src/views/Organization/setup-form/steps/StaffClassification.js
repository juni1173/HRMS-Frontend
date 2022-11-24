// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Icons Imports
import {Check, X} from 'react-feather'
// ** Reactstrap Imports
import { Spinner } from 'reactstrap'
import { toast, Slide } from 'react-toastify'
import Avatar from '@components/avatar'
import axios from 'axios'

import '@styles/react/libs/input-number/input-number.scss'
import SClassListView from './StaffClassificationsBlocks/SClassListView'

import StaffClassificationAdd from '../../StaffClassificationComponents/StaffClassificationAdd'

const StaffClassification = ({ stepper, list, createForm, stepperStatus, fetchStaffClassification, count }) => {

  const [loading, setLoading] = useState(true)
  // const [title, setTitle] = useState('')
  // const [plevel, setPLevel] = useState(null)
  // const [sclass_status, setStatus] = useState(0)
  const [SClassList, setList] = useState([])
  // const staffStatus = [
  //   { value: '0', label: 'Inactive' },
  //   { value: '1', label: 'Active' }
  // ]
  // const organization = JSON.parse(localStorage.getItem('organization'))
  const ToastContent = ({ type, message }) => (
    type === 'success' ? (
    <Fragment>
      <div className='toastify-header'>
        <div className='title-wrapper'>
          <Avatar size='sm' color='success' icon={<Check size={12} />} />
          <h6 className='toast-title fw-bold'>Succesfull</h6>
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
  let token = localStorage.getItem('accessToken')
    token = token.replaceAll('"', '')
    token = `Bearer ${token}`
  const fetchData = async () => {
      setLoading(true)
      try {
        const {data: response} = await axios.get(`${process.env.REACT_APP_API_URL}/organization/staff_classification/`, {
         headers: {
          Accept : 'application/json',
          Authorization : token
         }
        })
        // console.warn(response.data)
        if (response.status === 200) {
          
            setList(response.data)        
        } else {
          toast.error(
            <ToastContent type='error' message={response.message} />,
            { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
          )
          setList([])
        }
      } catch (error) {
        if (error.response) {
          toast.error(
            <ToastContent type='error' message='No Organization Found! Please enter info...' />,
            { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
          )
          setList([])
        }
      }
      setTimeout(() => {
        setLoading(false)
      }, 1000)
      
    }
    const fetchingStaffClassification = () => {
      fetchData()
    }
  useEffect(() => {
    if (count !== 0) {
      fetchingStaffClassification()
    } else {
      fetchingStaffClassification()
    }
    
  }, [count])
 
  const deleteSClass = (id) => {
    if (id) {
      // ** Api DELETE Request
      fetch(`${process.env.REACT_APP_API_URL}/organization/staff_classification/${id}/`, {
        method: "DELETE",
        headers: { "Content-Type": "Application/json", Authorization: token }
      })
      .then((response) => response.json())
      .then((result) => {
        const data = {status:result.status, result_data:result.data, message: result.message }
        if (data.status === 200) {
          toast.success(
            <ToastContent type='success' message={data.message} />,
            { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
          )
          fetchData()
        } else {
          toast.error(
            <ToastContent type='error' message={data.message} />,
            { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
          )
        }
      })
      .catch((error) => {
        console.error(error)
        toast.error(
          <ToastContent type='error' message={data.message} />,
          { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
        )

        
      }) 
      
    } else {
      console.warn(formData)
      toast.error(
        <ToastContent type='error' message='Something Went Wrong. Try Again!' />,
        { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
      )
    }
  } 
  const updateSClass = (id) => {
      if (id) {
        fetchData()
      } else {
        // console.warn(formData)
        toast.error(
          <ToastContent type='error' message='Something Went Wrong. Try Again!' />,
          { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
        )
      }
  }
  const updatedSClassID = (index) => { // the callback. 
    updateSClass(index)
  }
  const deleteSClassID = (index) => { // the callback. 
    deleteSClass(index)
  }
  return (
    <Fragment>
      {createForm && (
        <>
          <StaffClassificationAdd stepper={stepper}  stepperStatus={stepperStatus} fetchStaffClassification={fetchStaffClassification} fetchingStaffClassification={fetchingStaffClassification}/> 
        </>
      )}
      {list && (
      loading ? <Fragment><div className="text-center align-middle"><Spinner color='primary' /></div></Fragment> : <SClassListView  SClassList={SClassList} deleteSClassID={deleteSClassID} updatedSClassID={updatedSClassID}/> 
      )}
      </Fragment>
  )
}
StaffClassification.defaultProps = {
  stepperStatus: true,
  list: false,
  createForm: false,
  count: 0
}
export default StaffClassification
