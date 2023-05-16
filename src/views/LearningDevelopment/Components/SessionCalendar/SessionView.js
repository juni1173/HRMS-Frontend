import { useState, useEffect } from "react"
import { Card, CardBody, CardTitle, Badge, Spinner } from "reactstrap"
import apiHelper from "../../../Helpers/ApiHelper"
const LectureView = ({ id }) => {
    const Api = apiHelper()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const getData = async () => {
        setLoading(true)
        await Api.get(`/instructors/session/${id}/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    setData(result.data)
                } else {
                    Api.Toast('error', result.message)
                }
            }
        })
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }
    useEffect(() => {
        getData()
    }, [setData])
  return (
    !loading ? (
        Object.values(data).length > 0 ? (
            <div className="Session-single-card" >
            <Card>
                <CardTitle className="mb-0">
                    <div className="row bg-blue">
                                <div className="col-lg-4 col-md-4 col-sm-4">
                                
                                </div>
                                <div className='col-lg-4 col-md-4 col-sm-4'>
                                    <h4 color='white' className="text-center">{data.course_title} <br></br> {data.start_date} - {data.end_date}</h4>
                                </div>
                                <div className="col-lg-4 col-md-4 col-sm-4">
                                  
                                </div>
                    </div>
                </CardTitle>
                <CardBody>
                    <div className="row">
                                <div className="col-md-4">
                                    <Badge color='light-warning'>
                                        Type  
                                    </Badge><br></br>
                                    <span className="mode" style={{color: "black", fontWeight:"20px", padding:"0.3rem 0.5rem"}}>{data.course_session_type_title && data.course_session_type_title}</span>
                                </div>
                                <div className="col-md-4">
                                    <Badge color='light-warning'>
                                        Start Date / End Date
                                    </Badge><br></br>
                                    <span style={{color: "black", fontWeight:"10px", padding:"0.3rem 0.5rem"}}>{data.start_date && data.start_date} / {data.end_date && data.end_date}</span>
                                </div>
                                <div className="col-md-4">
                                    <Badge color='light-warning'>
                                        Duration 
                                    </Badge><br></br>
                                    <span className="mode" style={{color: "black", fontWeight:"20px", padding:"0.3rem 0.5rem"}}>{data.duration && data.duration}</span>
                                </div>
                                <div className="col-md-4 pt-2">
                                    <Badge color='light-warning'>
                                            Total Lectures 
                                    </Badge><br></br>
                                    <span className="mode" style={{color: "black", fontWeight:"20px", padding:"0.3rem 0.5rem"}}>{data.total_lectures && data.total_lectures}</span>
                                </div>
                                <div className="col-md-4 pt-2">
                                    <Badge color='light-warning'>
                                        Total Students
                                    </Badge><br></br>
                                    <span style={{color: "black", fontWeight:"10px", padding:"0.3rem 0.5rem"}}>{data.no_of_students && data.no_of_students}</span>
                                </div>
                                    <div className="col-md-4 pt-2">
                                        <Badge color='light-warning'>
                                            Instructor
                                        </Badge><br></br>
                                        <span style={{color: "black", fontWeight:"10px", padding:"0.3rem 0.5rem"}}>{
                                            data.cs_instructor.length > 0 ? (
                                                data.cs_instructor.map((insrtuctor) => (
                                                    insrtuctor.instructor_name
                                                ))
                                            ) : (
                                                'N/A'
                                            )
                                        }</span>
                                    </div>
                            </div>
                    
                </CardBody>
            
            </Card>
        </div>
        ) : (
        <p>No data found!</p>
    )
    ) : (
        <div className="text-center"><Spinner/></div> 
    )
   
  )
}

export default LectureView