import { useState, useEffect, useCallback } from 'react'
import apiHelper from '../../../../Helpers/ApiHelper'
import { Spinner } from "reactstrap"
import ApprovalsList from './ApprovalsList'
const index = () => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const status_choices = [
        {value: 1, label: 'Pending'},
        {value: 4, label: 'Approved By HR'},
        {value: 5, label: 'Rejected By HR'}
    ]
   
    const getPreData = async () => {
        setLoading(true)
        await Api.get(`/certification/hr/list/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    setData(result.data)
                } else {
                    Api.Toast('error', result.message)
                }
            } else (
             Api.Toast('error', 'Server not responding!')   
            )
        })  
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }
    useEffect(() => {
         getPreData()
        }, [])

        const CallBack = useCallback(() => {
            getPreData()
          }, [data])
  return (
    <>
    {!loading ? (
        <ApprovalsList CallBack={CallBack} data={data} status_choices={status_choices}/>
    ) : (
        <div className='text-center'><Spinner color='white'/></div>
    )}
    </>
  )
}

export default index