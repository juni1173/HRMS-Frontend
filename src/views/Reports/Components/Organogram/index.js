import {useState, useEffect} from 'react'
import DepartmentOrganogram from './DepartmentOrganogram'
import apiHelper from '../../../Helpers/ApiHelper'
const index = () => {
    const Api = apiHelper()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        setLoading(true)
        Api.jsonPost(`/reports/organogram/departments/`, {})
        .then(result => {
            if (result) {
                if (result.status === 200) {
                    setData(result.data)
                    console.warn(result.data)
                } else {
                    Api.Toast('error', result.message)
                }
            } else {
                Api.Toast('error', 'Server not responding!')
            }
        })
        setTimeout(() => {
            setLoading(false)
        }, 500)
    }, [])
  return (
    <>
    {!loading && (
        Object.values(data).length > 0 && (
            <div className='overflowx-scroll'>
            <DepartmentOrganogram data={data} />
            </div>
        )
        
    )}
    </>
  )
}

export default index