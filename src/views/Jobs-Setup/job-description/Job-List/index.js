import { useState, useEffect } from "react"
import { Edit, User, XCircle } from "react-feather"
import { Card, CardBody, CardTitle, Spinner } from "reactstrap"
const JDList = () => {
    const [loading, setLoading] = useState(true)
    const ActiveJobsObj = {
        firstrow: {
            title: 'Software Engineer',
            appliedUser: 10
        }
    }
    const getActiveJobs = () => {
        if (Object.values(ActiveJobsObj).length > 0) {
            setLoading(false)
        }
    }
    useEffect(() => {
        getActiveJobs()
    }, [])
    return (
        
        <>
        
        {Object.values(ActiveJobsObj).length > 0 ? (
            !loading ? (
                <Card>
                <CardBody>
                    <CardTitle tag='h4'>Active JD Title</CardTitle>
                    <div className="row">
                        <div className="col-lg-6">
                            <User size={14}/> 10   a day go
                        </div>
                        <div className="col-lg-6 float-right">
                            <div className="float-right">
                                <button
                                    className="border-0 no-background"
                                    title="Edit Job"
                                    >
                                    <Edit color="green"/>
                                </button>
                                <button
                                    className="border-0 no-background"
                                    title="Delete Job"
                                    >
                                    <XCircle color="red"/>
                                </button>
                            </div>
                        </div>
                    </div>
                       
                </CardBody>
                </Card> 
            ) : (
                <Spinner />
            )
           
        ) : (
            <Card>
            <CardBody>
                <CardTitle tag='h4'>No Data Found</CardTitle>
            </CardBody>
            </Card> 
        )}
        </>
    )
}
export default JDList