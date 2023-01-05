import {Fragment, useState} from "react" 
import {Label, Row, Col, Input, Form, Table, Spinner} from "reactstrap" 
import Flatpickr from 'react-flatpickr'
import {  XCircle } from 'react-feather'
import apiHelper from "../../../Helpers/ApiHelper"
 
const ExperienceDetail = ({emp_state}) => {
    // const [date, setDate] = useState(new Date())
     
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [employeeExperienceArray] = useState([])
    const [experienceDetail, setExperienceDetail] = useState({
         companyName : '',
         designation : '',
         joiningDate : '',
         leavingDate : '',
         leavingReason : '',
         experienceLetter : ''
    })
    const onChangeExperienceHandler = (InputName, InputType, e) => {
        
        let InputValue
        if (InputType === 'input') {
           
           InputValue = e.target.value
        } else if (InputType === 'select') {
           
           InputValue = e
        } else if (InputType === 'date') {
            console.warn(e)
            const dateFormat = Api.formatDate(e)
               
            InputValue = dateFormat
        } else if (InputType === 'file') {
            InputValue = e.target.files[0]
        }
       
        setExperienceDetail(prevState => ({
           ...prevState,
          [InputName] : InputValue
           
           
        }))
      
   }
   const removeAction = async (value, item_id) => {
        setLoading(true)
        const uuid = emp_state['emp_data'].uuid
        await Api.deleteData(`/employee/${uuid}/companies/${item_id}`, {method:"Delete"})
            .then(result => {
                if (result) {
                    if (result.status === 200) {
                        employeeExperienceArray.splice(value)
                        Api.Toast('success', result.message)
                    } else {
                        Api.Toast('error', result.message)
                    }
                } else {
                    Api.Toast('error', 'Server Not Responding')
                }
            })
        setTimeout(() => {
        setLoading(false)
        }, 1000)
    }
    const Submit = async (e) => {
        e.preventDefault()
        const uuid = emp_state['emp_data'].uuid
        // const uuid = '38e1aa09-1b3e-4f4f-a4e3-8909907bd3da'
        if (experienceDetail.companyName !== '' && experienceDetail.designation !== ''
         && experienceDetail.joiningDate !== '' && experienceDetail.leavingDate !== '') {
            setLoading(true)
            const formData = new FormData()
            formData.append('company_name', experienceDetail.companyName) 
            formData.append('designation', experienceDetail.designation) 
            formData.append('joining_date', experienceDetail.joiningDate) 
            formData.append('leaving_date', experienceDetail.leavingDate) 
            formData.append('leaving_reason', experienceDetail.leavingReason) 
            formData.append('experience_letter', experienceDetail.experienceLetter)
         await Api.jsonPost(`/employee/${uuid}/companies/`, formData, false)
            .then(result => {
                if (result) {
                    if (result.status === 200) { 
                        const finalResult = result.data
                        // for (let i = 0; i < finalResult.length; i++) {
                            employeeExperienceArray.push(finalResult)
                        // }  
                        Api.Toast('success', result.message)
                    } else {
                        Api.Toast('error', result.message)
                    }
                } else {
                    Api.Toast('error', 'Server Not Responding')
                }
            })
            setTimeout(() => {
                setLoading(false)
            }, 1000)
            console.warn(employeeExperienceArray)
         } else {
            Api.Toast('error', 'Please fill all required fields')
         }
        
    }

    return (
        <Fragment>
             <Form >
                <Row>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                        Company Name
                        </Label>
                        <Input type="text" 
                           onChange={ (e) => { onChangeExperienceHandler('companyName', 'input', e) }}
                        placeholder="Company Name"  />
                    </Col>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                        Designation
                        </Label>
                        <Input placeholder="Designation" name="designation" onChange={ (e) => { onChangeExperienceHandler('designation', 'input', e) }}/>
                    </Col>
                </Row>
                <Row className="mt-1">
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                       Joining Date
                        </Label>
                        <div className='calendar-container'>
                           <Flatpickr 
                             name="joiningDate" 
                             value={experienceDetail.joiningDate ? experienceDetail.joiningDate : ''}
                             onChange={ (date) => { onChangeExperienceHandler('joiningDate', 'date', date) }}
                             className="form-control"    />
                        </div>  
                    </Col>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                       Leaving Date
                        </Label>
                        <div className='calendar-container'>
                           <Flatpickr
                            name="leavingDate"  
                            value={experienceDetail.leavingDate ? experienceDetail.leavingDate : ''}
                            onChange={ (date) => { onChangeExperienceHandler('leavingDate', 'date', date) }}
                            className="form-control"    />
                        </div> 
                    </Col>
                </Row>
                <Row>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                         Leaving Reason
                        </Label>
                        <Input
                            type="text"
                            placeholder="leaving reason"
                            name="leavingReason"
                            onChange={ (e) => { onChangeExperienceHandler('leavingReason', 'input', e) }}
                            
                            />
                    </Col>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                       Experience Letter Attachement
                        </Label>
                        <Input
                            type="file" multiple
                            onChange={ (e) => { onChangeExperienceHandler('experienceLetter', 'file', e) }} />
                    </Col>
                </Row>
                <Row>
                    
                    {/* <Col md="2" className="mb-1">
                       <button className="btn-next float-right btn btn-success" onClick={(e) => addmoreSubmit(e)}><span className="align-middle d-sm-inline-block d-none">Add </span></button>
                    </Col> */}
                    <Col md="12" className="mb-1">
                       <button className="btn-next float-right btn btn-success" onClick={(e) => Submit(e)}><span className="align-middle d-sm-inline-block d-none">Save</span></button>
                    </Col>
                </Row>
                
            </Form>
            {!loading ? (
                Object.values(employeeExperienceArray).length > 0 ? (
                    <Table bordered striped responsive>
                        <thead className='table-dark text-center'>
                        <tr>
                            <th scope="col" className="text-nowrap">
                            Company Name
                            </th>
                            <th scope="col" className="text-nowrap">
                            Designation Type
                            </th>
                            <th scope="col" className="text-nowrap">
                            Joining Date
                            </th>
                            
                            <th scope="col" className="text-nowrap">
                            Actions
                            </th>
                        </tr>
                        </thead>
                        
                        <tbody className='text-center'>
                            {Object.values(employeeExperienceArray).map((item, key) => (
                                
                                    <tr key={key}>
                                    <td>{item.company_name ? item.company_name : 'N/A'}</td>
                                    <td>{item.designation ? item.designation : 'N/A'}</td>
                                    <td>{item.joining_date ? item.joining_date : 'N/A'}</td>
                                    <td>
                                        <div className="d-flex row">
                                        <div className="col">
                                            <button
                                            className="border-0"
                                            onClick={() => removeAction(key, item.id)}
                                            >
                                            <XCircle color="red" />
                                            </button>
                                        </div>
                                        </div>
                                    </td>
                                    </tr>
                                )
                            )}
                        
                        </tbody>
                    </Table>
                
                    ) : null
            ) : (
                <div className="text-center"> <Spinner /></div>
            )} 
        </Fragment>
     )
}
export default ExperienceDetail