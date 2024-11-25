import React, { Fragment, useEffect, useState, useCallback, useRef } from 'react'
import { Spinner} from 'reactstrap'
import apiHelper from '../../Helpers/ApiHelper'
import TotalKpiAndStatusCard from './TotalKpiAndStatusCard'
import DashboardSearch from './DashboardSearch'
const KpiStatusCounts = ({ segmentation, dropdownData, searchTool, evaluationReport }) => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const isMounted = useRef(true)
    const [data, setData] = useState([])
    const [callbackParams, setCallBackParams] = useState(null)
    const getKpiData = async (kpiData) => {
        
        const url = `/kpis/report/data/`
        const formData = new FormData()
        if (kpiData) {
            if (kpiData.yearly_segmentation) formData['ep_yearly_segmentation'] = kpiData.yearly_segmentation.value
            if (kpiData.ep_batch) formData['ep_batch'] = kpiData.ep_batch.value
            if (kpiData.department) formData['department'] = kpiData.department
        }
        await Api.jsonPost(`${url}`, formData).then(result => {
                if (result) {
                    if (isMounted.current) setLoading(true)
                    if (result.status === 200) {
                        if (isMounted.current)  setData(result.data)
                    } else {
                        Api.Toast('error', result.message)
                    }
                    setTimeout(() => {
                        setLoading(false)
                    }, 500)
                } else (
                 Api.Toast('error', 'Server not responding!')
                )
            })
        
    }
    useEffect(() => {
        getKpiData()
        return () => {
            isMounted.current = false
          }
    }, [])
    const CallBack = useCallback(kpiData => {
        getKpiData(kpiData)
        if (isMounted.current) setCallBackParams(kpiData)
      }, [data])
  return (
    <Fragment>
        {!loading ? (
             <div className="container mt-1">
              <TotalKpiAndStatusCard 
                employees={data} 
                dropdownData={dropdownData}
                searchComponent={() => <DashboardSearch callbackParams={callbackParams} segmentation={segmentation} dropdownData={dropdownData} 
                Callback={CallBack}/>}
                searchTool={searchTool}
                evaluationReport={evaluationReport}
                />  
           </div>
        ) : <div className='text-center'><Spinner /></div>}
    </Fragment>
    
  )
}

export default KpiStatusCounts