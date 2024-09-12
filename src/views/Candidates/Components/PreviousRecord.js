import { Fragment, useEffect, useState } from "react"
// import { Row } from "reactstrap"
import apiHelper from "../../Helpers/ApiHelper"
import { Spinner, Row, Col, Badge } from "reactstrap"
import { File } from "react-feather"

const PreviousRecord = ({cnic}) => {
    const Api = apiHelper()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const fetchdata = async() => {
        await Api.get(`/assessments/candidate/check/job/post/${cnic}/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    console.log(result)
                    setData(result.data)
                    setLoading(false)
                } else {
                    Api.Toast('error', result.message)
                    setLoading(false)
                }
            } else {
                Api.Toast('error', 'Server not responding')
            }
        })
    }
useEffect(() => {
   fetchdata()
   console.log(data)
}, [])
    return (
        <Fragment>
           {!loading ? <>
           {data.length > 0 ? <>
                {data.map((item, index) => {
                    return (
                     <div key={index} className="mb-2">
                        <Row className='bg-secondary py-1'>
                        {/* <div className="bg-primary text-white"> */}
                            <Col md={9} className=''>
<h5 className="text-white">{item.job_title}</h5>
</Col>
<Col md={3} className=''>
<a className="btn btn-sm justify-content-end" target="_blank" href={`${process.env.REACT_APP_PUBLIC_URL}${item.resume}`}><File size={20} color="white"/></a>
</Col>
</Row>
<Row>
{/* </div> */}

    <Col md={6}>
        Evaluation Score: {item.evaluation_score ? item.evaluation_score : <Badge color='light-danger'>N/A</Badge>}
    </Col>
    <Col md={6}>
    Stage: {item.stage_title ? item.stage_title : <Badge color='light-danger'>N/A</Badge>}
    </Col>
    <Col md={6}>
        Non Tech Score: {(Object.values(item.candidate_job_assessments).length > 0) ? (
                                        <>
                                         {item.candidate_job_assessments.non_tech_test ? `${item.candidate_job_assessments.non_tech_test[0].percentage}%` : <Badge color="light-danger">N/A</Badge>}
                                     
                                        </>
                                        ) : <Badge color="light-danger">N/A</Badge>}
    </Col>
    <Col md={6}>
     Tech Score: {(Object.values(item.candidate_job_assessments).length > 0) ? (
                                        <>
                                         {item.candidate_job_assessments.tech_test ? `${item.candidate_job_assessments.tech_test[0].percentage}%` : <Badge color="light-danger">N/A</Badge>}
                                     
                                        </>
                                        ) : <Badge color="light-danger">N/A</Badge>}
    </Col>
    <Col md={6}>
    
    </Col>
    
</Row>
</div>
)
})} </> : <div className="text-center">No data found </div>  } </> : <Spinner className='text-center' color='primary'/> }
        </Fragment>
    )
    
}
export default PreviousRecord