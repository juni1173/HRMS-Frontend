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
        {value: 2, label: 'Approved By Team Lead'},
        {value: 3, label: 'Rejected By Team Lead'}
    ]
   
    const getPreData = async () => {
        setLoading(true)
        await Api.get(`/certification/team/lead/list/`).then(result => {
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