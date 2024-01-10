import {useState, useEffect} from "react" 
import {Label, Row, Col, Input, Form,  Table, Spinner, Badge } from "reactstrap" 
import Select from 'react-select'
import Flatpickr from 'react-flatpickr'
import apiHelper from "../../Helpers/ApiHelper"

const UpdateEmpEducation = ({CallBack, empData, uuid}) => {
    const durationList = [
        {value : 1, label : '1 years'},
        {value : 2, label : '2 years'},
        {value : 3, label : '3 years'},
        {value : 4, label : '4 years'}
    ]
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [degree_type] = useState([])
    const [institutes] = useState([])
    const [educationDetail, setEducationDetail] = useState({
        degreeType: degree_type[0],
        degreeTitle : empData.degree_title ? empData.degree_title : '',
        instituteName : institutes[0],
        degreeCompletionDate : empData.year_of_completion ? empData.year_of_completion : '',
        duration : durationList.find(pre => pre.value === empData.duration) ? durationList.find(pre => pre.value === empData.duration) : '',
        educationAttachement : ''
         
   })
   const onChangeEducationHandler = (InputName, InputType, e) => {
        
    let InputValue
    if (InputType === 'input') {
    
    InputValue = e.target.value
    } else if (InputType === 'select') {
    
    InputValue = e
    } else if (InputType === 'date') {
        
        InputValue = e
    } else if (InputType === 'file') {
        InputValue = e.target.files[0]
    }

    setEducationDetail(prevState => ({
    ...prevState,
    [InputName] : InputValue
    }))
    console.log(educationDetail)
    }
    const GetPreData = async () => {
        setLoading(true)
        await Api.get(`/emp/pre/institutes/data/details/`, { headers: {Authorization: Api.token} }).then(result => {
        if (result) {
            if (result.status === 200) {
                degree_type.splice(0, degree_type.length)
                institutes.splice(0, institutes.length)
                const degree_type_result = result.data.degree_type
                const institutes_result = result.data.institutes
                for (let i = 0; i < degree_type_result.length; i++) {
                    degree_type.push({value: degree_type_result[i].id, label: degree_type_result[i].title})
                }
                for (let i = 0; i < institutes_result.length; i++) {
                    institutes.push({value: institutes_result[i].id, label: institutes_result[i].name})
                }
                educationDetail.degreeType = degree_type.find(pre => pre.value === empData.degree_type) ? degree_type.find(pre => pre.value === empData.degree_type) : ''
                educationDetail.instituteName = institutes.find(pre => pre.value === empData.institutes) ? institutes.find(pre => pre.value === empData.institutes) : ''
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
      
        if (educationDetail.degreeType !== '' && educationDetail.degreeTitle !== '' && educationDetail.institutes !== ''
         && educationDetail.duration !== '' && educationDetail.degreeCompletionDate !== '') {
            setLoading(true)
            const formData = new FormData()
            formData.append('degree_type', educationDetail.degreeType.value)
            formData.append('degree_title', educationDetail.degreeTitle) 
            formData.append('institutes', educationDetail.instituteName.value) 
            formData.append('duration', educationDetail.duration.value) 
            formData.append('year_of_completion', educationDetail.degreeCompletionDate) 
            formData.append('experience_letter', educationDetail.educationAttachement)
         await  Api.jsonPatch(`/emp/${uuid}/institutes/${empData.id}/`, formData, false).then(result => {
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
    useEffect(() => {
        GetPreData()
    }, [])
  return (
        !loading ? (
            <Form >
                <Row>
                    <Col md="4" className="mb-1">
                        <Label className="form-label">
                        Degree Type <Badge color='light-danger'>*</Badge>
                        </Label>
                        <Select
                            type="text"
                            name="degree type"
                            options={degree_type}
                            defaultValue={educationDetail.degreeType ? educationDetail.degreeType : ''}
                            onChange={ (e) => { onChangeEducationHandler('degreeType', 'select', e) }}
                            
                            />
                    </Col>
                    <Col md="4" className="mb-1">
                        <Label className="form-label">
                        Degree Title <Badge color='light-danger'>*</Badge>
                        </Label>
                        <Input
                            type="text"
                            name="degree title"
                            defaultValue={educationDetail.degreeTitle}
                            onChange={ (e) => { onChangeEducationHandler('degreeTitle', 'input', e) }}
                            />
                    </Col>
                    <Col md="4" className="mb-1">
                        <Label className="form-label">
                        Institute Name <Badge color='light-danger'>*</Badge>
                        </Label>
                        <Select
                            type="text"
                            name="instituteName"
                            options={institutes}
                            defaultValue={educationDetail.instituteName ? educationDetail.instituteName : ''}
                            onChange={ (e) => { onChangeEducationHandler('instituteName', 'select', e) }}
                            />
                    </Col>
                    
                </Row>
                <Row>
                    <Col md="4" className="mb-1">
                        <Label className="form-label">
                        Year of completion <Badge color='light-danger'>*</Badge>
                        </Label>
                        <div className='calendar-container'>
                        <Flatpickr 
                              className='form-control'
                               id='default-picker'
                               defaultValue={educationDetail.degreeCompletionDate ? educationDetail.degreeCompletionDate : ''}
                               options={{
                                  altInput: true,
                                  altFormat: 'F j, Y',
                                  dateFormat: 'Y-m-d'
                                }}
                                onChange={ (date) => { onChangeEducationHandler('degreeCompletionDate', 'date', Api.formatDate(date)) }}
                                />
                             
                        </div>
                    </Col>
                    <Col md="4"  className="mb-1">
                       <Label className="form-label">
                          Duration <Badge color='light-danger'>*</Badge>
                        </Label>
                        <Select options={durationList}
                        defaultValue={educationDetail.duration}
                        name="duration"
                        onChange={ (e) => { onChangeEducationHandler('duration', 'select', e) }}
                        />
                    </Col>
                    <Col md="4"  className="mb-1">
                       <Label className="form-label">
                        Certificate Attachement
                        </Label>
                        <Input
                            type="file"
                            name="educationAttachement"
                            onChange={ (e) => { onChangeEducationHandler('educationAttachement', 'file', e) }}
                            />
                    </Col>
                </Row>
            <Row>
                
                {/* <Col md="2" className="mb-1">
                       <button className="btn-next float-right btn btn-success" onClick={(e) => addmoreSubmit(e)}><span className="align-middle d-sm-inline-block d-none">Add </span></button>
                </Col> */}
                <Col md="12" className="mb-1">
                       <button className="btn-next float-right btn btn-update" onClick={(e) => Submit(e)}><span className="align-middle d-sm-inline-block d-none">Update</span></button>
                    </Col>
            </Row>
                </Form>
        ) : (
            <div className="text-center"><Spinner/></div>
        )
  )
}

export default UpdateEmpEducation