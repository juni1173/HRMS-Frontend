import {Fragment, useState} from "react" 
import {Label, Row, Col, Input, Form, Spinner, Badge } from "reactstrap" 
import apiHelper from "../../../../../Helpers/ApiHelper"
const AddTopics = ({ CallBack, module_id }) => {
    
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [topicDetail, settopicDetail] = useState({
         course_module : module_id, 
         title : '',
         description: '',
         credit_hours: 0
    })
    
    const onChangeTopicHandler = (InputName, InputType, e) => {
        
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
    
        settopicDetail(prevState => ({
        ...prevState,
        [InputName] : InputValue
        
        
        }))
    
    }

    const Submit = async (e) => {
        e.preventDefault()
        if (topicDetail.title !== '') {
            setLoading(true)
            const formData = new FormData()
            formData['course_module'] = module_id
            formData['title'] = topicDetail.title
            if (topicDetail.description !== '') formData['description'] = topicDetail.description
            if (topicDetail.credit_hours !== '') formData['credit_hours'] = topicDetail.credit_hours
        await Api.jsonPost(`/courses/details/module/${module_id}/topics/`, formData)
        .then(result => {
            console.warn(result.status)
                    if (result.status === 200) { 
                        Api.Toast('success', result.message)
                        CallBack()
                    } else {
                        Api.Toast('error', result.message)
                    }
            })

            setTimeout(() => {
                setLoading(false)
            }, 1000)
         } else {
            Api.Toast('error', 'Title is required!')
         }
        
    }
    return (
        <Fragment>
            {!loading ? (
                <Form >
                <Row>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                        Title<Badge color='light-danger'>*</Badge>
                        </Label>
                        <Input
                            type="text"
                            name="title"
                            onChange={ (e) => { onChangeTopicHandler('title', 'input', e) }}
                            placeholder="Title"
                            
                            />
                    </Col>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                        Description
                        </Label>
                        <Input
                            type="text"
                            name="Description"
                            onChange={ (e) => { onChangeTopicHandler('description', 'input', e) }}
                            placeholder="Description"
                            
                            />
                    </Col>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                        Total Hours
                        </Label>
                        <Input
                            type="number"
                            name="credit_hours"
                            onChange={ (e) => { onChangeTopicHandler('credit_hours', 'input', e) }}
                            placeholder="Total Hours"
                            
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
export default AddTopics