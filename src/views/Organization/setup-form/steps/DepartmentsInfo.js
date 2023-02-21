// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Third Party Components
// import Select from 'react-select'
import { ArrowLeft, Save, Check, X } from 'react-feather'

// ** Utils
// import { selectThemeColors } from '@utils'

// ** Reactstrap Imports
import { Label, Row, Col, Form, Input, Button, Spinner } from 'reactstrap'

import { toast, Slide } from 'react-toastify'
import Avatar from '@components/avatar'
import axios from 'axios'

import DepListView from './DepartmentsBlocks/DepartmentListView'
// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import DepartmentAdd from '../../DepartmentComponents/DepartmentAdd'

const DepartmentsInfo = ({ stepper, stepperStatus, count, createForm, list, fetchDepCallBack }) => {
  const [DepList, setList] = useState([])
  const [groupHead] = useState([])
  const [groupHeadActive] = useState([])
  const [groupHeadNotActive] = useState([])
  const [loading, setLoading] = useState(true)
  const [gHeadLoading, setGHeadLoading] = useState(true)
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
    const org = localStorage.getItem('organization').id
    const fetchGHead = async () => {
      setGHeadLoading(true)
      try {
        const {data: response} = await axios.get(`${process.env.REACT_APP_API_URL}/organization/grouphead/`, {
         headers: {
          Accept : 'application/json',
          Authorization : token
         }
        })
        // console.warn(response.data)
        
        if (response.status === 200) {
          groupHead.splice(0, groupHead.length)
          groupHeadActive.splice(0, groupHeadActive.length)
          groupHeadNotActive.splice(0, groupHeadNotActive.length)
            for (let i = 0; i < response.data.length; i++) {
              if (response.data[i].is_active) {
                groupHeadActive.push({value: response.data[i].id, label: response.data[i].title})
              } else {
                groupHeadNotActive.push({value: response.data[i].id, label: response.data[i].title})
              }
                groupHead.push({value: response.data[i].id, label: response.data[i].title})
        }  
        
        } else {
          if (org !== undefined) {
            toast.error(
              <ToastContent type='error' message={response.message} />,
              { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
            )
          }
          setGHeadLoading([])
        }
      } catch (error) {
        if (error.response) {
          toast.error(
            <ToastContent type='error' message='No Organization Found! Please enter info...' />,
            { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
          )
          setGHeadLoading([])
        }
      }
      setTimeout(() => {
        setGHeadLoading(false)
      }, 1000)
      
    }
    const fetchDepartments = async () => {
      setLoading(true)
      try {
        const {data: response} = await axios.get(`${process.env.REACT_APP_API_URL}/organization/department/`, {
         headers: {
          Accept : 'application/json',
          Authorization : token
         }
        })
        // console.warn(response.data)
        if (response.status === 200) {
            setList(response.data)
            // console.warn(response.data)
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
            <ToastContent type='error' message='No Department Found!' />,
            { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
          )
          setList([])
        }
      }
      setTimeout(() => {
        setLoading(false)
      }, 1000)
      
    }  
  const  fetchDepartmentsData = () => {
      fetchDepartments()
      fetchGHead()
    }
  useEffect(() => {
    if (count !== 0) {
      fetchDepartmentsData()
    } else {
      fetchDepartmentsData()
    }
  }, [count])


const deleteDep = (id) => {
  if (id) {
    // ** Api DELETE Request
    fetch(`${process.env.REACT_APP_API_URL}/organization/department/${id}/`, {
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
        fetchDepartmentsData()
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
    // console.warn(formData)
    toast.error(
      <ToastContent type='error' message='Something Went Wrong. Try Again!' />,
      { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
    )
  }
} 
const updateDep = (id) => {
    if (id) {
      fetchDepartmentsData()
    } else {
      // console.warn(formData)
      toast.error(
        <ToastContent type='error' message='Something Went Wrong. Try Again!' />,
        { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
      )
    }
}
const updatedDepID = (index) => { // the callback. 
  updateDep(index)
}
const deleteDepID = (index) => { // the callback. 
  deleteDep(index)
}
  return (
    <Fragment>
      {createForm && (
        <>
          <DepartmentAdd stepper={stepper} stepperStatus={stepperStatus} gHeadLoading={gHeadLoading} groupHeadActive={groupHeadActive} fetchDepartments={fetchDepartmentsData} fetchDepCallBack={fetchDepCallBack} /> 
        </>
      )}
      {list && (
        loading ? <Fragment><div className="text-center align-middle"><Spinner color='primary' /></div></Fragment> : <DepListView  DepList={DepList} groupHead={groupHead} deleteDepID={deleteDepID} updatedDepID={updatedDepID} groupHeadActive={groupHeadActive}/>
      )}
       
    </Fragment>
  )
}
DepartmentsInfo.defaultProps = {
  stepperStatus:true,
  count:0
}
export default DepartmentsInfo
