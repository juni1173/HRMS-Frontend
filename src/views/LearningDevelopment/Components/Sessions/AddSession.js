import {Fragment, useState, useEffect} from "react" 
import {Label, Row, Col, Input, Form, Spinner, Badge } from "reactstrap" 
import Select from 'react-select'
import Flatpickr from 'react-flatpickr'
import apiHelper from "../../../Helpers/ApiHelper"
const AddSession = ({ CallBack }) => {
    
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [instructors] = useState([])
    const [courses] = useState([])
    const [course_session_types] = useState([])
    const [duration, setDuration] = useState(0)
    const [sessionDetail, setsessionDetail] = useState({
        course_session_type : '',
        course: '',
        start_date : '',
        end_date : '',
        duration: '',
        total_lectures: '',
        no_of_students: 0,
        instructor: ''
    })

    const onChangeSessionHandler = (InputName, InputType, e) => {
        
        let InputValue
        if (InputType === 'input') {
        
        InputValue = e.target.value
        } else if (InputType === 'select') {
        
        InputValue = e.value
        } else if (InputType === 'date') {
            InputValue = e
        } else if (InputType === 'file') {
            InputValue = e.target.files[0].name
        }
    
        setsessionDetail(prevState => ({
        ...prevState,
        [InputName] : InputValue
        }))
    
    }
    const dateConverter = (startDate, timeEnd) => {
        if (startDate !== '' && timeEnd !== '') {
            const newStartDate = new Date(startDate)
            const newEndDate = new Date(timeEnd)
            const one_day = 1000 * 60 * 60 * 24
            const result = Math.ceil((newEndDate.getTime() - newStartDate.getTime()) / (one_day))
            console.warn('date Converter result', result)
            if (result < 0) { return 0 }
            setsessionDetail(prevState => ({
                ...prevState,
                [duration] : result
            }))
            return result
        }
      }
    const GetPreData = async () => {
        setLoading(true)
       await Api.get(`/instructors/pre/course/sessions/data/view/`, { headers: {Authorization: Api.token} }).then(result => {
        if (result) {
            if (result.status === 200) {
                instructors.splice(0, instructors.length)
                courses.splice(0, courses.length)
                course_session_types.splice(0, course_session_types.length)
                const finalData = result.data
                const instructorData = finalData.instructors
                const coursesData = finalData.courses
                const course_session_typesData = finalData.session_types

                for (let i = 0; i < instructorData.length; i++) {
                    instructors.push({value: instructorData[i].id, label: instructorData[i].name})
                }

                for (let i = 0; i < coursesData.length; i++) {
                    courses.push({value: coursesData[i].id, label: coursesData[i].title})
                }

                for (let i = 0; i < course_session_typesData.length; i++) {
                    course_session_types.push({value: course_session_typesData[i].id, label: course_session_typesData[i].title})
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
        if (sessionDetail.course !== '' && sessionDetail.start_date !== ''
        && sessionDetail.end_date !== '' && duration !== ''
        && sessionDetail.total_lectures !== ''
        && sessionDetail.no_of_students !== 0) {
            setLoading(true)
            const formData = new FormData()
           if (sessionDetail.course_session_type !== '') formData['course_session_type'] = sessionDetail.course_session_type
            formData['course'] = sessionDetail.course
            formData['start_date'] = sessionDetail.start_date
            formData['end_date'] = sessionDetail.end_date
            formData['duration'] = duration
            formData['total_lectures'] = sessionDetail.total_lectures
            formData['no_of_students'] = sessionDetail.no_of_students
            if (sessionDetail.instructor !== '') formData['instructor'] = sessionDetail.instructor
        await Api.jsonPost(`/instructors/session/`, formData)
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
                       Course<Badge color='light-danger'>*</Badge>
                        </Label>
                        <Select
                            type="text"
                            name="course"
                            options={courses}
                            onChange={ (e) => { onChangeSessionHandler('course', 'select', e) }}
                            />
                    </Col>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                        Session Type
                        </Label>
                        <Select
                            type="text"
                            name="course_session_type"
                            options={course_session_types}
                            onChange={ (e) => { onChangeSessionHandler('course_session_type', 'select', e) }}
                            />
                    </Col>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                        Start Date<Badge color='light-danger'>*</Badge>
                        </Label>
                        <Flatpickr 
                            className='form-control'
                            id='default-picker'
                            options={{
                                altInput: true,
                                altFormat: 'F j, Y',
                                dateFormat: 'Y-m-d'
                            }}
                            onChange={ (date) => { 
                                onChangeSessionHandler('start_date', 'date', Api.formatDate(date))
                                setDuration(dateConverter(date, sessionDetail.end_date))
                            }}
                        />
                    </Col>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                        End Date<Badge color='light-danger'>*</Badge>
                        </Label>
                        <Flatpickr 
                            className='form-control'
                            id='default-picker'
                            options={{
                                altInput: true,
                                altFormat: 'F j, Y',
                                dateFormat: 'Y-m-d'
                            }}
                            onChange={ (date) => { 
                                onChangeSessionHandler('end_date', 'date', Api.formatDate(date)) 
                                setDuration(dateConverter(sessionDetail.start_date, date))
                            }}
                        />
                    </Col>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                        Duration (in days)<Badge color='light-danger'>*</Badge>
                        </Label>
                        <Input
                            type="text"
                            name="duration"
                            value={duration}
                            // onChange={ (e) => { onChangeSessionHandler('duration', 'input', e) }}
                            disabled
                            />
                    </Col>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                        Total Lectures<Badge color='light-danger'>*</Badge>
                        </Label>
                        <Input
                            type="number"
                            name="total_lectures"
                            onChange={ (e) => { onChangeSessionHandler('total_lectures', 'input', e) }}
                            placeholder="Total Lectures"
                            
                            />
                    </Col>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                       Instructor
                        </Label>
                        <Select
                            type="text"
                            name="Instructor"
                            options={instructors}
                            onChange={ (e) => { onChangeSessionHandler('instructor', 'select', e) }}
                            />
                    </Col>
                    
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                       Total Students<Badge color='light-danger'>*</Badge>
                        </Label>
                        <Input
                            type="text"
                            name="no_of_students"
                            onChange={ (e) => { onChangeSessionHandler('no_of_students', 'input', e) }}
                            placeholder="Total Students"
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
export default AddSession