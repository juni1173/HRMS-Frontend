import {Fragment, useState, useEffect} from "react" 
import {Label, Row, Col, Input, Form, Spinner, Badge } from "reactstrap" 
import Select from 'react-select'
import apiHelper from "../../../Helpers/ApiHelper"
const AddCourse = ({ CallBack }) => {
    
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [programArr] = useState([])
    const [courseDetail, setcourseDetail] = useState({
         title : '',
         code: '',
         program : '',
         what_will_you_learn: '',
         skills_you_gain: '',
         credit_hours: 0,
         mode_of_course: '',
         complexity_level: '',
         offered_by : ''
    })

    const mode_of_course_choices = [
        { value: 1, label: 'Online' },
        { value: 2, label: 'In House' },
        { value: 3, label: 'Out House' }
    ]
    const complexity_level_choices = [
        { value: 1, label: 'Beginner' },
        { value: 2, label: 'Intermediate' },
        { value: 3, label: 'Advance' }
    ]
    
    const onChangeCourseHandler = (InputName, InputType, e) => {
        
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
    
        setcourseDetail(prevState => ({
        ...prevState,
        [InputName] : InputValue
        
        
        }))
    
    }

    const GetPreData = async () => {
        setLoading(true)
       await Api.get(`/courses/pre/course/data/view/`, { headers: {Authorization: Api.token} }).then(result => {
        if (result) {
            console.warn(result)
            programArr.splice(0, programArr.length)
            if (result.status === 200) {
                const finalData = result.data
                for (let i = 0; i < finalData.length; i++) {
                    programArr.push({value: finalData[i].id, label: finalData[i].title})
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
     } 
    const Submit = async (e) => {
        e.preventDefault()
        if (courseDetail.title !== '' && courseDetail.program !== ''
        && courseDetail.description !== ''
        && courseDetail.mode_of_course !== ''
        && courseDetail.complexity_level !== '') {
            const formData = new FormData()
            formData['title'] = courseDetail.title
            formData['code'] = courseDetail.code
            formData['program'] = courseDetail.program.value
           if (courseDetail.what_will_you_learn !== '') formData['what_will_you_learn'] = courseDetail.what_will_you_learn
           if (courseDetail.skills_you_gain !== '') formData['skills_you_gain'] = courseDetail.skills_you_gain
           if (courseDetail.credit_hours !== 0) formData['credit_hours'] = courseDetail.credit_hours
            formData['mode_of_course'] = courseDetail.mode_of_course.value
            formData['complexity_level'] = courseDetail.complexity_level.value
            if (courseDetail.offered_by !== '') formData['offered_by'] = courseDetail.offered_by
        await Api.jsonPost(`/courses/`, formData)
            .then(result => {
                if (result) {
                    if (result.status === 200) { 
                        Api.Toast('success', result.message)
                        setLoading(true)
                            CallBack()
                        setTimeout(() => {
                            setLoading(false)
                        }, 1000)
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
                            onChange={ (e) => { onChangeCourseHandler('title', 'input', e) }}
                            placeholder="Title"
                            
                            />
                    </Col>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                        Code<Badge color='light-danger'>*</Badge>
                        </Label>
                        <Input
                            type="text"
                            name="code"
                            onChange={ (e) => { onChangeCourseHandler('code', 'input', e) }}
                            placeholder="Code"
                            
                            />
                    </Col>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                       Program<Badge color='light-danger'>*</Badge>
                        </Label>
                        <Select
                            type="text"
                            name="type"
                            options={programArr}
                            onChange={ (e) => { onChangeCourseHandler('program', 'select', e) }}
                            />
                    </Col>

                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                        What will you learn ?
                        </Label>
                        <Input
                            type="text"
                            name="what_will_you_learn"
                            onChange={ (e) => { onChangeCourseHandler('what_will_you_learn', 'input', e) }}
                            placeholder="What will you learn ?"
                            
                            />
                    </Col>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                        Skills you will gain ?
                        </Label>
                        <Input
                            type="text"
                            name="skills_you_gain"
                            onChange={ (e) => { onChangeCourseHandler('skills_you_gain', 'input', e) }}
                            placeholder="Skill you will gain ?"
                            
                            />
                    </Col>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                        Credit Hours
                        </Label>
                        <Input
                            type="number"
                            name="credit_hours"
                            onChange={ (e) => { onChangeCourseHandler('credit_hours', 'input', e) }}
                            placeholder="Credit Hours"
                            
                            />
                    </Col>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                       Mode of course<Badge color='light-danger'>*</Badge>
                        </Label>
                        <Select
                            type="text"
                            name="mode_of_course"
                            options={mode_of_course_choices}
                            onChange={ (e) => { onChangeCourseHandler('mode_of_course', 'select', e) }}
                            />
                    </Col>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                       Complexity Level<Badge color='light-danger'>*</Badge>
                        </Label>
                        <Select
                            type="text"
                            name="mode_of_course"
                            options={complexity_level_choices}
                            onChange={ (e) => { onChangeCourseHandler('complexity_level', 'select', e) }}
                            />
                    </Col>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                       Offered By
                        </Label>
                        <Input
                            type="text"
                            name="offered_by"
                            onChange={ (e) => { onChangeCourseHandler('offered_by', 'input', e) }}
                            placeholder="Offered By"
                            
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
export default AddCourse