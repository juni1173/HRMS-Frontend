import {Fragment, useState} from "react" 
import {Label, Row, Col, Input, Form, Spinner, Badge } from "reactstrap"
import apiHelper from "../../../Helpers/ApiHelper"
const AddInstructor = ({ CallBack }) => {
    
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [instructorDetail, setinstructorDetail] = useState({
         title : '',
         name : ''
    })
    
    const onChangeProgramHandler = (InputName, InputType, e) => {
        
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
    
        setinstructorDetail(prevState => ({
        ...prevState,
        [InputName] : InputValue
        
        
        }))
    
    }
    const Submit = async (e) => {
        e.preventDefault()
        if (instructorDetail.name) {
            setLoading(true)
            const formData = new FormData()
            if (instructorDetail.title !== '') formData['title'] = instructorDetail.title
            formData['name'] = instructorDetail.name
        await Api.jsonPost(`/instructors/`, formData)
            .then(result => {
                if (result) {
                    if (result.status === 200) { 
                        Api.Toast('success', result.message)
                        CallBack()
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
         } else {
            Api.Toast('error', 'Please fill all required fields')
         }
         return false
    }
    return (
        <Fragment>
            {!loading ? (
                <Form >
                <Row>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                        Title
                        </Label>
                        <Input
                            subject="text"
                            name="title"
                            onChange={ (e) => { onChangeProgramHandler('title', 'input', e) }}
                            placeholder="Title"
                            
                            />
                    </Col>
                    
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                       Name<Badge color='light-danger'>*</Badge>
                        </Label>
                        <Input
                            type="text"
                            name="name"
                            onChange={ (e) => { onChangeProgramHandler('name', 'input', e) }}
                            placeholder="name"
                            
                            />
                        
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
            }
             
           
        </Fragment>
    )
}
export default AddInstructor