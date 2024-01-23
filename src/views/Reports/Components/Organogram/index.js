import {useState, useEffect} from 'react'
import apiHelper from '../../../Helpers/ApiHelper'
import TreeComponent from './DepartmentOrganogram'
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
            // <div className='overflowx-scroll'>
            <TreeComponent treeData={data} />
            // </div>
        )
        
    )}
    </>
  )
}

export default index