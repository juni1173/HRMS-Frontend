import {Fragment, useState, useEffect} from "react" 
import {Label, Row, Col, Input, Form, Spinner, Badge } from "reactstrap" 
import Select from 'react-select'
import apiHelper from "../../../Helpers/ApiHelper"

const updateProgram = ({ programData, CallBack }) => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [subjectArr] = useState([])
    const [programDetail, setprogramDetail] = useState({
         title : programData.title ? programData.title : '',
         subject : '',
         description : programData.description ? programData.description : ''
    })
    
    const onChangeProgramHandler = (InputName, InputType, e) => {
        
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
    
        setprogramDetail(prevState => ({
        ...prevState,
        [InputName] : InputValue
        
        
        }))
    
    }

    const GetPreData = async () => {
        setLoading(true)
       await Api.get(`/courses/pre/program/data/view/`, { headers: {Authorization: Api.token} }).then(result => {
        if (result) {
            const finalData = result.data.subject
            subjectArr.splice(0, subjectArr.length)
                for (let i = 0; i < finalData.length; i++) {
                    subjectArr.push({value: finalData[i].id, label: finalData[i].title})
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
     const updateProgramApi = async (e) => {
        e.preventDefault()
        if (programData.title !== '' && programData.subject !== ''
         && programData.description !== '') {
            setLoading(true)
            const formData = new FormData()
            formData['title'] = programDetail.title
            formData['subject'] = programDetail.subject.value
            formData['description'] = programDetail.description
        await Api.jsonPatch(`/courses/programs/${programData.slug_title}/${programData.uuid}/`, formData)
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
    useEffect(() => {
        GetPreData()
        return false
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
                            defaultValue={programDetail.title}
                            onChange={ (e) => { onChangeProgramHandler('title', 'input', e) }}
                            placeholder="Title"
                            
                            />
                    </Col>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                       subject<Badge color='light-danger'>*</Badge>
                        </Label>
                        <Select
                            type="text"
                            name="subject"
                            options={subjectArr}
                            defaultValue={subjectArr.find(pre => pre.value === programData.subject) ? subjectArr.find(pre => pre.value === programData.subject) :  subjectArr[0]}
                            onChange={ (e) => { onChangeProgramHandler('subject', 'select', e) }}
                            />
                    </Col>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                       Description
                        </Label>
                        <Input
                            type="text-area"
                            name="description"
                            defaultValue={programDetail.description}
                            onChange={ (e) => { onChangeProgramHandler('description', 'input', e) }}
                            placeholder="Description"
                            
                            />
                        
                    </Col>
                </Row>
                <Row>
                    <Col md="12" className="mb-1">
                       <button className="btn-next float-right btn btn-warning" onClick={(e) => updateProgramApi(e)}><span className="align-middle d-sm-inline-block d-none">Update</span></button>
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

export default updateProgram