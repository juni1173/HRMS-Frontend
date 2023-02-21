import {Fragment, useState, useEffect} from "react" 
import {Label, Row, Col, Input, Form, Spinner, Badge } from "reactstrap" 
import Select from 'react-select'
import apiHelper from "../../../Helpers/ApiHelper"
const AddSubject = ({ CallBack }) => {
    
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [typeArr] = useState([])
    const [subjectDetail, setsubjectDetail] = useState({
         title : '',
         type : '',
         description : ''
    })
    
    const onChangeSubjectHandler = (InputName, InputType, e) => {
        
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
    
        setsubjectDetail(prevState => ({
        ...prevState,
        [InputName] : InputValue
        
        
        }))
    
    }

    const GetPreData = async () => {
        setLoading(true)
       await Api.get(`/subjects/`, { headers: {Authorization: Api.token} }).then(result => {
        if (result) {
            typeArr.splice(0, typeArr.length)
                for (let i = 0; i < result.length; i++) {
                    typeArr.push({value: result[i].id, label: result[i].title})
                }
            
        } else {
            Api.Toast('error', 'Server not responding')
        }
        })
        setTimeout(() => {
            setLoading(false)
        }, 1000)
        return false
     } 
    const Submit = async (e) => {
        e.preventDefault()
        if (subjectDetail.title !== '' && subjectDetail.type) {
            setLoading(true)
            const formData = new FormData()
            formData['title'] = subjectDetail.title
            formData['type'] = subjectDetail.type.value
            if (subjectDetail.description !== '') formData['description'] = subjectDetail.description
        await Api.jsonPost(`/courses/subjects/`, formData)
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
                        Title<Badge color='light-danger'>*</Badge>
                        </Label>
                        <Input
                            type="text"
                            name="title"
                            onChange={ (e) => { onChangeSubjectHandler('title', 'input', e) }}
                            placeholder="Title"
                            
                            />
                    </Col>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                       Type<Badge color='light-danger'>*</Badge>
                        </Label>
                        <Select
                            type="text"
                            name="type"
                            options={typeArr}
                            onChange={ (e) => { onChangeSubjectHandler('type', 'select', e) }}
                            />
                    </Col>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                       Description
                        </Label>
                        <Input
                            type="text-area"
                            name="description"
                            onChange={ (e) => { onChangeSubjectHandler('description', 'input', e) }}
                            placeholder="Description"
                            
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
export default AddSubject