import { Fragment, useEffect, useState, useCallback } from 'react'
import apiHelper from '../../../../Helpers/ApiHelper'
import TrainingList from './TrainingList'
import { Spinner } from 'reactstrap'
const ProjectBasedTrainings = () => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const preDataApi = async () => {
        setLoading(true)
        const response = await Api.get('/training/project/employee/data/')
        if (response.status === 200) {
          console.warn(response.data)
          const responseData = response.data
         setData(responseData)
        } else {
            return Api.Toast('error', 'Data not found')
        }
        setTimeout(() => {
            setLoading(false)
        }, 500)
    }
    useEffect(() => {
        preDataApi()
        }, [])
        const handleDataProcessing = useCallback(() => {
          preDataApi()
        }, [data])
  return (
    <Fragment>
        {!loading ? (
            <TrainingList data={data} CallBack={handleDataProcessing} is_project_base={true}/>
        ) : <div className="text-center"><Spinner type="grow" color="white"/></div>
        }
        
    </Fragment>
  )
}

export default ProjectBasedTrainings