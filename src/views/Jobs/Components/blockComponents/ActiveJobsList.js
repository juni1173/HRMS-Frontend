import { useState, useEffect } from "react"
import { Edit, User, XCircle } from "react-feather"
import { Card, CardBody, CardTitle, CardText, Spinner } from "reactstrap"
const ActiveJobsList = () => {
    const [Loading, setLoading] = useState(true)
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
            <Card>
            <CardBody>
                <CardTitle tag='h4'>Active Job title</CardTitle>
                    <div className="col-lg-6">
                        <User size={14}/> 10   a day go
                    </div>
                    <div className="col-lg-6 float-right">
                        <div className="float-right">
                            <button
                                className="border-0 no-background"
                                title="Edit Job"
                                >
                                <Edit color="grey"/>
                            </button>
                            <button
                                className="border-0 no-background"
                                title="Delete Job"
                                >
                                <XCircle color="grey"/>
                            </button>
                        </div>
                    </div>
            </CardBody>
            </Card> 
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
export default ActiveJobsList