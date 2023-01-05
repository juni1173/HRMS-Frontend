import {Fragment, useState} from "react" 
import {Label, Row, Col, Input, Form, Spinner, Badge } from "reactstrap" 
import apiHelper from "../../../../Helpers/ApiHelper"

const UpdateModule = ({ moduleData, CallBack, courseData }) => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [moduleDetail, setmoduleDetail] = useState({
        course : moduleData.course,
        title : moduleData.title ? moduleData.title : '',
        description: moduleData.description ? moduleData.description : '',
        what_we_learn: moduleData.what_we_learn ? moduleData.what_we_learn : '',
        total_hours: moduleData.total_hours ? moduleData.total_hours : 0
   })
    
    const onChangeModuleHandler = (InputName, InputType, e) => {
        
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
    
        setmoduleDetail(prevState => ({
        ...prevState,
        [InputName] : InputValue
        
        
        }))
    
    }

     const Submit = async (e) => {
        e.preventDefault()
        if (moduleDetail.title !== '' && moduleDetail.description !== ''
        && moduleDetail.what_we_learn !== '' && moduleDetail.total_hours !== '') {
            setLoading(true)
            const formData = new FormData()
            formData['course'] = moduleDetail.course
            formData['title'] = moduleDetail.title
            formData['description'] = moduleDetail.description
            formData['what_we_learn'] = moduleDetail.what_we_learn
            formData['total_hours'] = moduleDetail.total_hours
        await Api.jsonPatch(`/courses/details/${courseData.slug_title}/${courseData.uuid}/modules/${moduleData.id}/`, formData)
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
                            defaultValue={moduleData.title}
                            onChange={ (e) => { onChangeModuleHandler('title', 'input', e) }}
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
                            defaultValue={moduleData.description}
                            onChange={ (e) => { onChangeModuleHandler('description', 'input', e) }}
                            placeholder="Description"
                            
                            />
                    </Col>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                        What we learn ?<Badge color='light-danger'>*</Badge>
                        </Label>
                        <Input
                            type="text"
                            name="what_we_learn"
                            defaultValue={moduleData.what_we_learn}
                            onChange={ (e) => { onChangeModuleHandler('what_we_learn', 'input', e) }}
                            placeholder="What we learn ?"
                            
                            />
                    </Col>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                        Total Hours<Badge color='light-danger'>*</Badge>
                        </Label>
                        <Input
                            type="number"
                            name="total_hours"
                            defaultValue={moduleData.total_hours}
                            onChange={ (e) => { onChangeModuleHandler('total_hours', 'input', e) }}
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

export default UpdateModule