import { React, useEffect, useState, useCallback, Fragment } from "react"
import apiHelper from "../../../Helpers/ApiHelper"
import { Spinner } from "reactstrap"
import RequestCertification from "./RequestCertification"
import CertificatesList from "./CertificatesList"
const CertificationFunction = () => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [employeesList] = useState([])
    const mode_of_course_choice = [
        {value: 1, label: 'External'},
        {value: 2, label: 'Online'}
    ]
    const relevance_choice = [
        {value: 1, label: 'Project'},
        {value: 2, label: 'Personal Goal'}
    ]
    const getPreData = async () => {
        setLoading(true)
        await Api.get(`/certification/employee/`).then(result => {
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
        await Api.get(`/certification/pre/data/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    employeesList.splice(0, employeesList.length)
                    const data = result.data.employees
                    const dataEmployeesLength = data.length
                    
                    for (let i = 0; i < dataEmployeesLength; i++) {
                        employeesList.push({value: data[i].id, label: data[i].name})
                    }
                    
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
            return false
          }, [data])
  return (
    <Fragment>
        {!loading ? (
            <>
            {employeesList.length > 0 ? (
                <RequestCertification CallBack={CallBack} preData={{employeesList, mode_of_course_choice, relevance_choice}} />
            ) : (
                <div className='text-center'>No Data Found</div>
            )}
            
            <CertificatesList data={data} CallBack={CallBack}/>
            
            </>
           
        ) : (
            <div className='text-center'><Spinner color="white"/></div>
        )}
    </Fragment>
  )
}

export default CertificationFunction