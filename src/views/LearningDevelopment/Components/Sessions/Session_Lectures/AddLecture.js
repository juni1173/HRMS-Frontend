import {Fragment, useState} from "react" 
import {Label, Row, Col, Input, Form, Spinner, Badge } from "reactstrap" 
import apiHelper from "../../../../Helpers/ApiHelper"
const AddLecture = ({ sessionData, CallBack }) => {
    
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [lectureDetail, setlectureDetail] = useState({
         course : sessionData.id, 
         title : '',
         description: '',
         what_we_learn: '',
         total_hours: 0
    })
    
    const onChangeLectureHandler = (InputName, InputType, e) => {
        
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
    
        setlectureDetail(prevState => ({
        ...prevState,
        [InputName] : InputValue
        
        
        }))
    
    }

    const Submit = async (e) => {
        e.preventDefault()
        if (lectureDetail.title !== '' && lectureDetail.description !== ''
         && lectureDetail.what_we_learn !== '' && lectureDetail.total_hours !== '') {
            setLoading(true)
            const formData = new FormData()
            formData['course'] = lectureDetail.course
            formData['title'] = lectureDetail.title
            formData['description'] = lectureDetail.description
            formData['what_we_learn'] = lectureDetail.what_we_learn
            formData['total_hours'] = lectureDetail.total_hours
        await Api.jsonPost(`/courses/details/${sessionData.slug_title}/${sessionData.uuid}/modules/`, formData)
        .then(result => {
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
                            onChange={ (e) => { onChangeLectureHandler('title', 'input', e) }}
                            placeholder="Title"
                            
                            />
                    </Col>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                        Description<Badge color='light-danger'>*</Badge>
                        </Label>
                        <Input
                            type="text"
                            name="code"
                            onChange={ (e) => { onChangeLectureHandler('description', 'input', e) }}
                            placeholder="Code"
                            
                            />
                    </Col>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                        What we learn ?<Badge color='light-danger'>*</Badge>
                        </Label>
                        <Input
                            type="text"
                            name="what_we_learn"
                            onChange={ (e) => { onChangeLectureHandler('what_we_learn', 'input', e) }}
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
                            onChange={ (e) => { onChangeLectureHandler('total_hours', 'input', e) }}
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
export default AddLecture