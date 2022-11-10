import { useState, useEffect, Fragment } from "react"
import { Edit, User, XCircle } from "react-feather"
import { Card, CardBody, CardTitle, Spinner } from "reactstrap"
import JDHelper from "../../../Helpers/JDHelper"
const JDList = ({count}) => {
    const Helper = JDHelper()
    const [loading, setLoading] = useState(true)
    const [JD_List, setJDList] = useState(null)
const getJD = async () => {
    setLoading(true)
    if (JD_List !== null) {
        JD_List.splice(0, JD_List.length)
    }
    await Helper.fetchJDList().then(data => {
        if (data) {
            if (Object.values(data).length > 0) {
                setJDList(data)
            } else {
                setJDList(null)
            }
        } 
        
    })
    setTimeout(() => {
        setLoading(false)
        }, 1000)
}
    
    useEffect(() => {
        if (count !== 0) {
            getJD()
        } else {
            getJD()
        }
    }, [count])

    const deleteJD = async id => {
        await Helper.deleteJD(id).then(() => {
            getJD()
        })
    }
    return (        
        <Fragment>
        
        {JD_List ? (
            !loading ? (
                Object.values(JD_List).map((item, key) => (
                    <Card key={key}>
                    <CardBody>
                        <CardTitle tag='h4'>{item.title}</CardTitle>
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
                                        title="Delete JD"
                                        onClick={() => deleteJD(item.id)}
                                        >
                                        <XCircle color="red"/>
                                    </button>
                                </div>
                            </div>
                        </div>
                           
                    </CardBody>
                    </Card> 
                ))
                
            ) : (
                <div className="text-center"><Spinner /></div>
            )
           
        ) : (
            <Card>
            <CardBody>
                <CardTitle tag='h4'>No Data Found</CardTitle>
            </CardBody>
            </Card> 
        )}
        </Fragment>
    )
}
JDList.defaultProp = {
    count: 1
}
export default JDList