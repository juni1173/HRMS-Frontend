import {useState, useEffect} from "react" 
import {Label, Row, Col, Input, Form, Badge, Spinner } from "reactstrap" 
import Flatpickr from 'react-flatpickr'
import Select from 'react-select'
import apiHelper from "../../Helpers/ApiHelper"
const CreateEmpDependent = ({uuid, CallBack}) => {
    
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [relationshipsArr] = useState([])
    const [employeeDependent, setEmployeeDependent] = useState({
         dependentName : '',
         dependentRelationship : '',
         dependentDOB : ''
    })
    
    const onChangeDependentHandler = (InputName, InputType, e) => {
        
        let InputValue
        if (InputType === 'input') {
        
        InputValue = e.target.value
        } else if (InputType === 'select') {
        
        InputValue = e
        } else if (InputType === 'date') {
            const dateFormat = Api.formatDate(e)
               
            InputValue = dateFormat
        } else if (InputType === 'file') {
            InputValue = e.target.files[0].name
        }
    
        setEmployeeDependent(prevState => ({
        ...prevState,
        [InputName] : InputValue
        
        
        }))
    
        // console.log(employeeDependent)
    }
    const GetPreData = async () => {
        setLoading(true)
       await Api.get(`/employees/pre/dependent/data/`, { headers: {Authorization: Api.token} }).then(result => {
        if (result) {
            relationshipsArr.splice(0, relationshipsArr.length)
            if (result.status === 200) {
                const relation_result = result.data.dependent
                for (let i = 0; i < relation_result.length; i++) {
                    relationshipsArr.push({value: relation_result[i].id, label: relation_result[i].relationship})
                }
            } else {
                Api.Toast('error', result.message)
            }
        } else {
            Api.Toast('error', 'Server not responding')
        }
        })
        setTimeout(() => {
            setLoading(false)
        }, 1000)
        return false
     } 
    const Submit = async (e) => {
        e.preventDefault()
        if (employeeDependent.dependentName !== '' && employeeDependent.dependentRelationship
         && employeeDependent.dependentDOB !== '') {
            const formData = new FormData()
            formData['name'] = employeeDependent.dependentName
            formData['relationship'] = employeeDependent.dependentRelationship.value
            formData['date_of_birth'] = employeeDependent.dependentDOB
        await Api.jsonPost(`/employees/${uuid}/dependent/contact/`, formData)
            .then(result => {
                if (result) {
                    if (result.status === 200) { 
                        const finalResult = result.data
                        console.warn(finalResult)
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
    useEffect(() => {
        GetPreData()
    }, [])
  return (
    !loading ? (
        <Form >
            <Row>
                <Col md="6" className="mb-1">
                    <Label className="form-label">
                    Name<Badge color='light-danger'>*</Badge>
                    </Label>
                    <Input
                        type="text"
                        name="dependentName"
                        defaultValue={employeeDependent.dependentName}
                        onChange={ (e) => { onChangeDependentHandler('dependentName', 'input', e) }}
                        placeholder="Dependent Name"
                        
                        />
                </Col>
                <Col md="6" className="mb-1">
                    <Label className="form-label">
                RelationShip<Badge color='light-danger'>*</Badge>
                    </Label>
                    <Select
                        type="text"
                        name="dependentRelationship"
                        options={relationshipsArr}
                        onChange={ (e) => { onChangeDependentHandler('dependentRelationship', 'select', e) }}
                        />
                </Col>
                <Col md="6" className="mb-1">
                    <Label className="form-label">
                Date Of Birth
                    </Label>
                    <div className='calendar-container'>
                        <Flatpickr 
                        className='form-control' 
                        value={employeeDependent.dependentDOB ? employeeDependent.dependentDOB : ''}
                        defaultValue={employeeDependent.dependentDOB ? employeeDependent.dependentDOB : ''} 
                        placeholder="Date Of Birth"
                        onChange={ (date) => { onChangeDependentHandler('dependentDOB', 'date', date) }} 
                        id='default-picker' />
                    </div> 
                    
                </Col>
            </Row>
            <Row>
                <Col md="12" className="mb-1">
                <button className="btn-next float-right btn btn-success" onClick={(e) => Submit(e)}><span className="align-middle d-sm-inline-block d-none">Save</span></button>
                </Col>
            </Row>
        </Form>
    ) : (
        <div className="text-center"><Spinner/></div>
    )
    
  )
}

export default CreateEmpDependent