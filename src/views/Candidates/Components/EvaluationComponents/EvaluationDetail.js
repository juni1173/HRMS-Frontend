import { Fragment, useEffect, useState } from 'react'
import {  Badge, Spinner, Table } from 'reactstrap'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import apiHelper from '../../../Helpers/ApiHelper'

const EvaluationDetail = ({uuid}) => {
    const Api = apiHelper()
    const [EvaluationData, setEvaluationData] = useState([])
    const [loading, setLoading] = useState(false)
   
    const getEvaluationData = async () => {
        setLoading(true)
        await Api.get(`/evaluations/candidate/job/list/${uuid}/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    setEvaluationData(result.data)
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
        getEvaluationData()
    }, [])
  return (
    <Fragment>
                <Table bordered striped responsive>
                <thead className='table-dark text-center'>
                    <tr>
                        <th>Title</th>
                        <th>Evaluated by</th>
                        <th>Recommendation</th>
                        <th>Comment</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
            {!loading ? (                    
            Object.values(EvaluationData).length > 0 ? (
                EvaluationData.map((data, index) => (
                    <tr key={index}>
                        <td>{data.evaluation_title}</td>
                        <td>{data.evaluated_by_name}</td>
                        <td>{data.recommendation}</td>
                        <td>{data.comment}</td>
                        <td>{(!data.is_cancel && !data.is_rechecked && !data.is_start
                            && !data.is_completed) && 'N/A'}
                            {data.is_cancel && <p><Badge color='danger'>Cancelled</Badge></p>}
                            {/* <br/> */}
                            {data.is_rechecked && <p><Badge color='warning'>Rechecked</Badge></p>}
                            {/* <br/> */}
                            {data.is_start && <p><Badge color='primary'>Started</Badge></p>}
                            {/* <br/> */}
                            {data.is_completed && <p><Badge color='success'>Completed</Badge></p>}
                            </td>
                    </tr>
                )
            )
                
            ) : (
                
                <tr className="text-center">
                <td colSpan={6}>No Evaluation Data</td>
            </tr>
            )
        ) : (
            <tr className="text-center">
                <td colSpan={6}><Spinner/></td>
            </tr>
        )}
            </tbody>
        </Table>
    </Fragment>
  )
}

export default EvaluationDetail