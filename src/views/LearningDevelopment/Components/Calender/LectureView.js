import { useState, useEffect } from "react"
import { Card, CardBody, CardTitle, Badge, Spinner } from "reactstrap"
import apiHelper from "../../../Helpers/ApiHelper"
const LectureView = ({ id }) => {
    const Api = apiHelper()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const getData = async () => {
        setLoading(true)
        await Api.get(`/instructors/lectures/manage/${id}/`).then(result => {
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
            <div className="Lecture-single-card" key={id}>
                <Card key={id}>
                    <CardTitle className="mb-0">
                        <div className={data.status === 4 ? `row bg-green` : `row bg-grey`}>
                                    <div className="col-lg-4 col-md-4 col-sm-4">
                                    </div>
                                    <div className='col-lg-4 col-md-4 col-sm-4'>
                                        <h4 className="text-center text-white">{data.course_title} - {data.title}</h4>
                                    </div>
                                    <div className="col-lg-4 col-md-4 col-sm-4"> 
                                       
                                        
                                    </div>
                        </div>
                    </CardTitle>
                    
                    <CardBody>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="row">
                                    <div className="col-md-4">
                                        <Badge color='light-warning'>
                                            Status
                                        </Badge><br></br>
                                        <span style={{color: "black", fontWeight:"10px", padding:"0.3rem 0.5rem"}}>{data.status_title ? data.status_title : 'N/A'}</span>
                                    </div>
                                    <div className="col-md-4">
                                        <Badge color='light-warning'>
                                            Date
                                        </Badge><br></br>
                                        <span style={{color: "black", fontWeight:"10px", padding:"0.3rem 0.5rem"}}>{data.date ? data.date : 'N/A'}</span>
                                    </div>
                                    <div className="col-md-4">
                                        <Badge color='light-warning'>
                                            Time
                                        </Badge><br></br>
                                        <span style={{color: "black", fontWeight:"10px", padding:"0.3rem 0.5rem"}}>{data.start_time ? data.start_time : 'N/A'}</span>
                                    </div>
                                    <div className="col-md-4 pt-2">
                                        <Badge color='light-warning'>
                                            Duration
                                        </Badge><br></br>
                                        <span style={{color: "black", fontWeight:"10px", padding:"0.3rem 0.5rem"}}>{data.duration ? data.duration : 'N/A'}</span>
                                    </div>
                                    <div className="col-md-4 pt-2">
                                        <Badge color='light-warning'>
                                            Mode of Instruction
                                        </Badge><br></br>
                                        <span className="mode" style={{color: "black", fontWeight:"20px", padding:"0.3rem 0.5rem"}}>{data.mode_of_instruction_title ? data.mode_of_instruction_title : 'N/A'}</span>
                                    </div>
                                    <div className="col-md-4 pt-2">
                                        <Badge color='light-warning'>
                                            Instructor
                                        </Badge><br></br>
                                        <span className="mode" style={{color: "black", fontWeight:"20px", padding:"0.3rem 0.5rem"}}>{data.instructor_name ? data.instructor_name : 'N/A'}</span>
                                    </div>
                                    <div className="col-md-8 pt-2">
                                        <Badge color='light-warning'>
                                            Description
                                        </Badge><br></br>
                                        <span className="mode" style={{color: "black", fontWeight:"20px", padding:"0.3rem 0.5rem"}}>{data.description ? data.description : 'N/A'}</span>
                                    </div>

                                    <div className="col-md-4 pt-2">
                                       
                                            {data.is_taken ? (
                                                'Lecture Completed'
                                            ) : (
                                                'Lecture not taken yet!'
                                            )}
                                            
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        <hr></hr>
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