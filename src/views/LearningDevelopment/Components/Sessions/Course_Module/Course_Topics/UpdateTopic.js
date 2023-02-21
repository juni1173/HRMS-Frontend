import {Fragment, useState} from "react" 
import {Label, Row, Col, Input, Form, Spinner, Badge } from "reactstrap" 
import apiHelper from "../../../../../Helpers/ApiHelper"

const UpdateTopic = ({ topicData, CallBack, module_id }) => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [topicDetail, settopicDetail] = useState({
        course_module : module_id,
        title : topicData.title ? topicData.title : '',
        description: topicData.description ? topicData.description : '',
        credit_hours: topicData.credit_hours ? topicData.credit_hours : 0
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
        await Api.jsonPatch(`/courses/details/module/${module_id}/topics/${topicData.id}/`, formData)
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
         } else {
            Api.Toast('error', 'Please fill all required fields')
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
                            defaultValue={topicData.title}
                            onChange={ (e) => { onChangeTopicHandler('title', 'input', e) }}
                            placeholder="Title"
                            
                            />
                    </Col>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                        Description<Badge color='light-danger'>*</Badge>
                        </Label>
                        <Input
                            type="text"
                            name="description"
                            defaultValue={topicData.description}
                            onChange={ (e) => { onChangeTopicHandler('description', 'input', e) }}
                            placeholder="Description"
                            
                            />
                    </Col>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                        Total Hours<Badge color='light-danger'>*</Badge>
                        </Label>
                        <Input
                            type="number"
                            name="credit_hours"
                            defaultValue={topicData.credit_hours}
                            onChange={ (e) => { onChangeTopicHandler('credit_hours', 'input', e) }}
                            placeholder="Total Hours"
                            
                            />
                    </Col>
                </Row>
                <Row>
                    <Col md="12" className="mb-1">
                       <button className="btn-next float-right btn btn-warning" onClick={(e) => Submit(e)}><span className="align-middle d-sm-inline-block d-none">Update</span></button>
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

export default UpdateTopic