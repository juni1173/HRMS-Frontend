import {useState} from "react" 
import {Label, Row, Col, Input, Form, Spinner, Badge } from "reactstrap" 
import Flatpickr from 'react-flatpickr'
import apiHelper from "../../Helpers/ApiHelper"

const UpdateEmpExperience = ({CallBack, empData, uuid}) => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [employeeExperienceArray] = useState([])
    const [experienceDetail, setExperienceDetail] = useState({
         companyName : empData.choosen_company_name ? empData.choosen_company_name  : (empData.company_name ? empData.company_name : ''),
         designation : empData.designation ? empData.designation : '',
         joiningDate : empData.joining_date ? empData.joining_date : '',
         leavingDate : empData.leaving_date ? empData.leaving_date : '',
         leavingReason : empData.leaving_reason ? empData.leaving_reason : '',
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
   const Submit = async (e) => {
    e.preventDefault()
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
     await Api.jsonPatch(`/employee/${uuid}/companies/${empData.id}/`, formData, false)
        .then(result => {
            if (result) {
                if (result.status === 200) { 
                    CallBack() 
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
    !loading ? (
        <Form >
                <Row>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                        Company Name <Badge color='light-danger'>*</Badge>
                        </Label>
                        <Input type="text" 
                        defaultValue={experienceDetail.companyName}
                           onChange={ (e) => { onChangeExperienceHandler('companyName', 'input', e) }}
                        placeholder="Company Name"  />
                    </Col>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                        Designation <Badge color='light-danger'>*</Badge>
                        </Label>
                        <Input 
                        placeholder="Designation" 
                        name="designation" 
                        defaultValue={experienceDetail.designation}
                        onChange={ (e) => { onChangeExperienceHandler('designation', 'input', e) }}/>
                    </Col>
                </Row>
                <Row className="mt-1">
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                       Joining Date <Badge color='light-danger'>*</Badge>
                        </Label>
                        <div className='calendar-container'>
                           <Flatpickr 
                             name="joiningDate" 
                             value={experienceDetail.joiningDate ? experienceDetail.joiningDate : ''}
                             defaultValue={experienceDetail.joiningDate ? experienceDetail.joiningDate : ''}
                             onChange={ (date) => { onChangeExperienceHandler('joiningDate', 'date', date) }}
                             className="form-control"    />
                        </div>  
                    </Col>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                       Leaving Date <Badge color='light-danger'>*</Badge>
                        </Label>
                        <div className='calendar-container'>
                           <Flatpickr
                            name="leavingDate"  
                            value={experienceDetail.leavingDate ? experienceDetail.leavingDate : ''}
                            defaultValue={experienceDetail.leavingDate ? experienceDetail.leavingDate : ''}
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
                            defaultValue={experienceDetail.leavingReason}
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
                       <button className="btn-next float-right btn btn-warning" onClick={(e) => Submit(e)}><span className="align-middle d-sm-inline-block d-none">Update</span></button>
                    </Col>
                </Row>
                
            </Form>
    ) : (
        <div className="text-center"><Spinner/></div>
    )
  )
}

export default UpdateEmpExperience