import {useState} from "react" 
import {Label, Row, Col, Input, Form,   Badge} from "reactstrap" 
import Flatpickr from 'react-flatpickr'
import apiHelper from "../../Helpers/ApiHelper"
 
const CreateEmpExperience = ({uuid, CallBack}) => {
    // const [date, setDate] = useState(new Date())
     
    const Api = apiHelper()
    const [experienceDetail, setExperienceDetail] = useState({
         companyName : '',
         designation : '',
         joiningDate : '',
         leavingDate : '',
         is_currently_employed: false,
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
            const dateFormat = Api.formatDate(e)
               
            InputValue = dateFormat
        } else if (InputType === 'file') {
            InputValue = e.target.files[0]
        } else if (InputType === 'switch') {
            InputValue = e.target.checked
        }
       
        setExperienceDetail(prevState => ({
           ...prevState,
          [InputName] : InputValue
           
           
        }))
      
   }
    const Submit = async (e) => {
        e.preventDefault()
        if (!experienceDetail.is_currently_employed && experienceDetail.leavingDate === '') {
            Api.Toast('error', 'Please fill all required fields')
            return false
        }
        if (experienceDetail.companyName !== '' && experienceDetail.designation !== ''
         && experienceDetail.joiningDate !== '') {
            const formData = new FormData()
            formData.append('company_name', experienceDetail.companyName) 
            formData.append('designation', experienceDetail.designation) 
            formData.append('joining_date', experienceDetail.joiningDate) 
           if (experienceDetail.is_currently_employed) {
            formData.append('is_currently_employed', experienceDetail.is_currently_employed) 
            } else {
               if (experienceDetail.leavingDate !== '') {
                formData.append('leaving_date', experienceDetail.leavingDate) 
                } else return Api.Toast('error', 'Leaving Date is required!')
            }
            if (experienceDetail.leavingReason) formData.append('leaving_reason', experienceDetail.leavingReason) 
            if (experienceDetail.experienceLetter) formData.append('experience_letter', experienceDetail.experienceLetter)
         await Api.jsonPost(`/employee/${uuid}/companies/`, formData, false)
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
         } else {
            Api.Toast('error', 'Please fill all required fields')
         }
        
    }
  return (
    <Form >
    <Row>
        <Col md="6" className="mb-1">
            <Label className="form-label">
            Company Name <Badge color='light-danger'>*</Badge>
            </Label>
            <Input type="text" 
               onChange={ (e) => { onChangeExperienceHandler('companyName', 'input', e) }}
            placeholder="Company Name"  />
        </Col>
        <Col md="6" className="mb-1">
            <Label className="form-label">
            Designation <Badge color='light-danger'>*</Badge>
            </Label>
            <Input placeholder="Designation" name="designation" onChange={ (e) => { onChangeExperienceHandler('designation', 'input', e) }}/>
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
                 placeholder="Joining Date"
                 onChange={ (date) => { onChangeExperienceHandler('joiningDate', 'date', date) }}
                 className="form-control"    />
            </div>  
        </Col>
        <Col md="6" className="mb-1">
            {!experienceDetail.is_currently_employed && (
                <>
                    <Label className="form-label">
                    Leaving Date <Badge color='light-danger'>*</Badge>
                    </Label>
                    <div className='calendar-container'>
                        <Flatpickr
                        name="leavingDate"  
                        value={experienceDetail.leavingDate ? experienceDetail.leavingDate : ''}
                        placeholder="Leaving Date"
                        onChange={ (date) => { onChangeExperienceHandler('leavingDate', 'date', date) }}
                        className="form-control"   />
                    </div> 
                 </>
            )}
            
            <div className='form-check form-switch'>
                <Input type='switch' name='customSwitch' id='exampleCustomSwitch' onChange={e => onChangeExperienceHandler('is_currently_employed', 'switch', e)}/>
                <Label for='exampleCustomSwitch' className='form-check-label'>
                    Currently Working
                </Label>
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
                placeholder="Leaving Reason"
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
        <Col md="12" className="mb-1">
           <button className="btn-next float-right btn btn-success" onClick={(e) => Submit(e)}><span className="align-middle d-sm-inline-block d-none">Save</span></button>
        </Col>
    </Row>
    
    </Form>
  )
}

export default CreateEmpExperience