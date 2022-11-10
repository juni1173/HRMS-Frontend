// ** React Imports
import {  Fragment, useState, useEffect } from 'react'

import {  X, Check } from 'react-feather'

// ** Reactstrap Imports
import {  Spinner } from 'reactstrap'
import { toast, Slide } from 'react-toastify'
import Avatar from '@components/avatar'
// import axios from 'axios'

import addPosition from './addPosition'
import positionsList from './positionsList'
import  apiHelper  from '../../../Helpers/ApiHelper'
const Position = ({ stepper, stepperStatus, list, createForm, fetchPositions, count}) => {

  const [loading, setLoading] = useState(true)
  const [PositionList, setList] = useState([])
  const api = apiHelper()
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
  const fetchData = async () => {
      setLoading(true)
      api.get('/organization/Positions/')
        .then(res => {
            if (res && res.data) {
              setList(res.data)
            }
        })
        .catch(err => console.log(err))
      
      setTimeout(() => {
        setLoading(false)
      }, 1000)
      
    }
    const fetchingPositions = () => {
      fetchData()
    }
  useEffect(() => {
    if (count !== 0) {
      fetchingPositions()
    } else {
      fetchingPositions()
    }
  }, [count])
  
  const deletePosition = (id) => {
    if (id) {
      api.deleteData(`/Positions/${id}/`, {method: 'Delete'})
      .then((result) => {
        const data = {status:result.status, result_data:result.data, message: result.message }
        if (data.status === 200) {
          api.Toast('success', result.message)
          fetchingPositions()
          if (typeof (fetchPositions) !== undefined) {
            fetchPositions()
          }
        } else {
          api.Toast('error', result.message)
        }
      })
      .catch((error) => {
        console.error(error)
        api.Toast('error', "Invalid Request")
      }) 
      
    } else {
      console.warn(formData)
      api.Toast('error', "Something Went Wrong. Try Again!")
    }
  } 
  const updatePosition = (id) => {
      if (id) {
        fetchingPositions()
      } else {
        // console.warn(formData)
        toast.error(
          <ToastContent type='error' message='Something Went Wrong. Try Again!' />,
          { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
        )
      }
  }
 
  const updatedGHeadID = (index) => { // the callback. 
    updatePosition(index)
  }
  const deleteGHeadID = (index) => { // the callback. 
    deletePosition(index)
  }
 
  return (
    <Fragment>
      
      {createForm && (
        <>
          <addPosition  fetchPositions={fetchPositions} CallBack={fetchingPositions}/> 
        </>
      )}
      
    {list && (
      (loading) ? <Fragment><div className="text-center align-middle"><Spinner color='primary' /></div></Fragment> : <positionsList PositionList={PositionList} deleteGHeadID={deleteGHeadID} updatedGHeadID={updatedGHeadID} fetchPositions={fetchPositions} /> 
    )}
    </Fragment>
  )
}
Position.defaultProps = {
  stepperStatus: true,
  list: false,
  createForm: false,
  count: 0
}

export default Position
