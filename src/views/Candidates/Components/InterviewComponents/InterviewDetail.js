import { Fragment, useEffect, useState } from 'react'
import Select from 'react-select'
import { Button, Form, Label, Spinner } from 'reactstrap'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import apiHelper from '../../../Helpers/ApiHelper'

const InterviewDetail = ({uuid}) => {
    const Api = apiHelper()
    const [interviewData, setInterviewData] = useState([])
    const [loading, setLoading] = useState(false)
   
    const getInterviewData = async () => {
        setLoading(true)
        await Api.get(`/interviews/candidate/job/${uuid}/`).then(result => {
            if (result) {
                
                if (result.status === 200) {
                    setInterviewData(result.data)
                } else {
                    Api.Toast('error', result.message)
                }
            } else {
                Api.Toast('error', 'Server not responding')
            }
        })
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }
    useEffect(() => {
        getInterviewData()
    }, [])
  return (
    <Fragment>
         {!loading ? (
            Object.values(interviewData).length > 0 ? (
                interviewData.map((data, index) => (
                    <div className='row' key={index}>
                       <p>{data}</p> 
                    </div>
                )
            )
                
            ) : (
                <div className='row'>
                    <p>No Interview Data</p>
                </div>
            )
        ) : (
            <div className="text-center"><Spinner/></div>
        )}
    </Fragment>
  )
}

export default InterviewDetail