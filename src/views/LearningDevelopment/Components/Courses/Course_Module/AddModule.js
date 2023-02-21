import {Fragment, useState} from "react" 
import {Label, Row, Col, Input, Form, Spinner, Badge } from "reactstrap" 
import ModuleHelper from "../../../../Helpers/LearningDevelopmentHelper/Course-subModules/ModuleHelper"
import apiHelper from "../../../../Helpers/ApiHelper"
const AddModule = ({ courseData, CallBack }) => {
    
    const Helper = ModuleHelper()
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [moduleDetail, setmoduleDetail] = useState({
         course : courseData.id, 
         title : '',
         description: '',
         what_we_learn: '',
         total_hours: 0
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
        if (moduleDetail.title !== '') {
            setLoading(true)
            const formData = new FormData()
            formData['course'] = moduleDetail.course
            formData['title'] = moduleDetail.title
           if (moduleDetail.description !== '') formData['description'] = moduleDetail.description
           if (moduleDetail.what_we_learn !== '') formData['what_we_learn'] = moduleDetail.what_we_learn
           if (moduleDetail.total_hours !== '') formData['total_hours'] = moduleDetail.total_hours
        await Api.jsonPost(`/courses/details/${courseData.slug_title}/${courseData.uuid}/modules/`, formData)
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
                            onChange={ (e) => { onChangeModuleHandler('title', 'input', e) }}
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
                            onChange={ (e) => { onChangeModuleHandler('description', 'input', e) }}
                            placeholder="Description"
                            
                            />
                    </Col>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                        What we learn ?
                        </Label>
                        <Input
                            type="text"
                            name="what_we_learn"
                            onChange={ (e) => { onChangeModuleHandler('what_we_learn', 'input', e) }}
                            placeholder="What we learn ?"
                            
                            />
                    </Col>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                        Total Hours
                        </Label>
                        <Input
                            type="number"
                            name="total_hours"
                            onChange={ (e) => { onChangeModuleHandler('total_hours', 'input', e) }}
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
export default AddModule