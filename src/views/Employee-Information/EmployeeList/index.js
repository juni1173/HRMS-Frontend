import { Fragment, useEffect, useState } from "react"
import {  Eye, Search} from "react-feather"
import {Card, CardBody, CardTitle, Badge, CardSubtitle, InputGroup, Input, InputGroupText} from "reactstrap"
import user_blank  from "../../../assets/images/avatars/user_blank.png"
import apiHelper from "../../Helpers/ApiHelper"
 
const viewEmployee = () => {
    const ApiBaseLink = process.env.REACT_APP_BACKEND_URL 
    const Api = apiHelper()
    const [employeeList, setEmployeeList] = useState([])
    
    const getEmployeeData = () => {
        Api.get(`/employees/`).then(result => {
            if (result.status === 200) {
                setEmployeeList(result.data)
                console.log(result)
                // Api.Toast('success', result.message)
                 
                // stepper.next()
            } else {
                Api.Toast('error', result.message)
            }
        })  
    }

    useEffect(() => {
        getEmployeeData()
    }, [])

   return (
    <Fragment>
        <div className='row  my-1'>
            <div className='col-lg-6'>
                <div className="col-lg-6">
                   <InputGroup className='input-group-merge mb-2'>
                        <InputGroupText>
                           <Search size={14} />
                        </InputGroupText>
                    <Input placeholder='search title...'  />
                   </InputGroup>
                
                </div>
            </div>
             
                {Object.values(employeeList).map((item) => (
                <Card key={item.uuid}>
                    <CardBody>
                        <div className="row">
                            <div className="col-md-3">
                              <CardTitle tag='h1'> </CardTitle>
                                <Badge color='light-warning'>
                                {item.profile_image ?  <img src={`${ApiBaseLink}${item.profile_image}`} style={{height: '50px', width: "50px"}} alt="logo" /> : <img src={user_blank} style={{height: '100px', width: "50px"}} alt="logo" />}   
                                </Badge> 
                            </div>
                            <div className="col-md-3">
                                <Badge color='light-info p-0'>
                                         Name
                                </Badge>
                                <br></br>
                                <strong>{item.name}</strong>
                            </div>
                            <div className="col-md-3">
                                <Badge color='light-success'>
                                    Employee Code
                                </Badge><br></br>
                                <strong>{item.code}</strong>
                                
                            </div>
                            <div className="col-lg-3 float-right">
                                
                                <div className="float-right">
                                <a href={`/employeeDetail/${item.uuid}`}>
                                <button
                                        className="border-0 no-background"
                                        title="View Employee Detail"
                                        >
                                        <Eye color="green"/>
                                    </button>
                                </a>
                                    
                                </div>
                            </div>
                        </div>
                        </CardBody>
                    </Card> 
                ))}
            
        </div>
    </Fragment>
   )
}
export default viewEmployee