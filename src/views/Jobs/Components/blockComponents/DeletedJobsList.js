// import { useState } from "react"
import { Edit, User, XCircle } from "react-feather"
import { Card, CardBody, CardTitle, CardText } from "reactstrap"
const DeletedJobsList = () => {
  
    return (

        <div>
         <Card>
            <CardBody>
                <CardTitle tag='h4'>Deleted Job title</CardTitle>
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
     
        </div>
    )
}
export default DeletedJobsList