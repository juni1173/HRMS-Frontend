import { Fragment, useEffect, useState, useCallback } from 'react'
import apiHelper from '../../../../Helpers/ApiHelper'
import { Spinner } from 'reactstrap'
import TrainingList from './TrainingList'
const EvaluateTrainings = () => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const preDataApi = async () => {
        setLoading(true)
        const response = await Api.get('/training/evaluator/data/')
        if (response.status === 200) {
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
            <TrainingList data={data} CallBack={handleDataProcessing} is_evaluate={true}/>
        ) : <div className="text-center"><Spinner type="grow" color="white"/></div>
        }
        
    </Fragment>
  )
}

export default EvaluateTrainings