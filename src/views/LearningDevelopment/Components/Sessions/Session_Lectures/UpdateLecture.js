import {Fragment, useState, useEffect} from "react" 
import {Label, Row, Col, Input, Form, Spinner } from "reactstrap" 
import Select from 'react-select'
import Flatpickr from 'react-flatpickr'
import apiHelper from "../../../../Helpers/ApiHelper"

const UpdateLecture = ({ lectureData, CallBack }) => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [mode_of_instruction] = useState([])
    const [lectureDetail, setlectureDetail] = useState({
        course : lectureData.course_id ? lectureData.course_id : '',
        title : lectureData.title ? lectureData.title : '',
        start_time: lectureData.start_time ? lectureData.start_time : '',
        duration: lectureData.duration ? lectureData.duration : '',
        description: lectureData.description ? lectureData.description : '',
        mode_of_instruction: lectureData.mode_of_instruction ? lectureData.mode_of_instruction : '',
        // status : lectureData.status ? lectureData.status : '',
        date : lectureData.date ? lectureData.date : ''
   })
//    const status = [
//     {value: 1, label: 'Scheduled'},
//     {value: 2, label: 'Not Scheduled'},
//     {value: 3, label: 'In Progress'},
//     {value: 4, label: 'Completed'}
//     ]
    
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

        } else if (InputType === 'time') {
            const timeFormat = Api.formatTime(e)
            InputValue = timeFormat
        }
    
        setlectureDetail(prevState => ({
        ...prevState,
        [InputName] : InputValue
        }))
    }

     const Submit = async (e) => {
        e.preventDefault()
        if (lectureDetail.course !== '') {
            // console.warn(lectureDetail.start_time)
            // return false
            setLoading(true)
            const formData = new FormData()
            formData['course'] = lectureDetail.course
            if (lectureDetail.title !== '') formData['title'] = lectureDetail.title
            if (lectureDetail.description !== '') formData['description'] = lectureDetail.description
            if (lectureDetail.start_time !== '')  formData['start_time'] = lectureDetail.start_time
            if (lectureDetail.duration !== '') formData['duration'] = lectureDetail.duration
            if (lectureDetail.mode_of_instruction !== '') formData['mode_of_instruction'] = lectureDetail.mode_of_instruction.value
            // if (lectureDetail.status !== '') formData['status'] = lectureDetail.status.value
            if (lectureDetail.date !== '') formData['date'] = lectureDetail.date 
        await Api.jsonPatch(`/instructors/lectures/manage/${lectureData.id}/`, formData)
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
            Api.Toast('error', 'Not Specified Course Available')
         }
        
    }
    const fetchModeOfInstructions = async () => {
        setLoading(true)
            await Api.get(`/mode/of/instructions/`)
            .then(result => {
                if (result) {
                    if (result.length > 0) {
                        mode_of_instruction.splice(0, mode_of_instruction.length)
                        for (let i = 0; i < result.length; i++) {
                            mode_of_instruction.push({value: result[i].id, label: result[i].mode})
                        }
                        return false
                    } else {
                        mode_of_instruction.splice(0, mode_of_instruction.length)
                    }
                } else {
                    Api.Toast('error', 'Server not responding!')
                }
            })
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }
    useEffect(() => {
        fetchModeOfInstructions()
    }, [])
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
                            type="text"
                            name="title"
                            defaultValue={lectureDetail.title}
                            onChange={ (e) => { onChangeLectureHandler('title', 'input', e) }}
                            placeholder="Title"
                            
                            />
                    </Col>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                        Date
                        </Label>
                        <Flatpickr 
                            className='form-control'
                            id='default-picker'
                            options={{
                                altInput: true,
                                altFormat: 'F j, Y',
                                dateFormat: 'Y-m-d'
                            }}
                            defaultValue={lectureDetail.date}
                            onChange={ (date) => { onChangeLectureHandler('date', 'date', Api.formatDate(date)) }}
                        />
                    </Col>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                        Start Time
                        </Label>
                        <Flatpickr
                            className='form-control'
                            value={lectureDetail.start_time}
                            id='timepicker'
                            options={{
                            enableTime: true,
                            noCalendar: true,
                            dateFormat: 'H:i',
                            time_24hr: false
                            }}
                            onChange={(e) => { onChangeLectureHandler('start_time', 'time', e) }}
                        />
                    </Col>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                        Duration
                        </Label>
                        <Input
                            type="text"
                            name="description"
                            defaultValue={lectureDetail.duration}
                            onChange={ (e) => { onChangeLectureHandler('duration', 'input', e) }}
                            placeholder="Duration"
                            />
                    </Col>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                       Mode of Instruction
                        </Label>
                        {!loading && (
                            <Select
                            type="text"
                            name="mode_of_instruction"
                            options={mode_of_instruction}
                            defaultValue={mode_of_instruction.find(pre => pre.value === lectureDetail.mode_of_instruction) ? mode_of_instruction.find(pre => pre.value === lectureDetail.mode_of_instruction) : ''}
                            onChange={ (e) => { onChangeLectureHandler('mode_of_instruction', 'select', e) }}
                            />
                        )}
                    </Col>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                        Description
                        </Label>
                        <Input
                            type="textarea"
                            name="description"
                            defaultValue={lectureDetail.description}
                            onChange={ (e) => { onChangeLectureHandler('description', 'input', e) }}
                            placeholder="Description"
                            
                            />
                    </Col>
                    {/* <Col md="6" className="mb-1">
                        <Label className="form-label">
                       Status
                        </Label>
                        <Select
                            type="text"
                            name="status"
                            options={status}
                            defaultValue={status.find(pre => pre.value === lectureDetail.status) ? status.find(pre => pre.value === lectureDetail.status) : ''}
                            onChange={ (e) => { onChangeLectureHandler('status', 'select', e) }}
                            />
                    </Col> */}
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

export default UpdateLecture