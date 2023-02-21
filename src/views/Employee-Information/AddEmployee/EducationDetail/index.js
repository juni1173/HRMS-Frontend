
import {Fragment, useState, useEffect} from "react" 
import {Label, Row, Col, Input, Form,  Table, Spinner } from "reactstrap" 
import Select from 'react-select'
import Flatpickr from 'react-flatpickr'
import {  XCircle } from 'react-feather'
import apiHelper from "../../../Helpers/ApiHelper"
const EducationDetail = ({emp_state}) => {
    const durationList = [
        {value : 1, label : '1 years'},
        {value : 2, label : '2 years'},
        {value : 3, label : '3 years'},
        {value : 4, label : '4 years'}
    ]
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [employeeEducationArray] = useState([])
    const [degree_type] = useState([])
    const [institutes] = useState([])
    const [educationDetail, setEducationDetail] = useState({
        degreeType: degree_type[0],
        degreeTitle : '',
        instituteName : institutes[0],
        degreeCompletionDate : '',
        duration : '',
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

    const removeAction = async (value, item_id) => {
        setLoading(true)
        const uuid = emp_state['emp_data'].uuid
        await Api.deleteData(`/emp/${uuid}/institutes/${item_id}`, {method:"Delete"})
            .then(result => {
                if (result) {
                    if (result.status === 200) {
                        employeeEducationArray.splice(value)
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
        const uuid = emp_state['emp_data'].uuid
        console.warn(emp_state)
        // const uuid = '38e1aa09-1b3e-4f4f-a4e3-8909907bd3da'
        // const id = 1
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
         await  Api.jsonPost(`/emp/${uuid}/institutes/`, formData, false).then(result => {
                if (result) {
                    if (result.status === 200) {
                        employeeEducationArray.push(result.data)
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
        <Fragment>

                <Form >
                <Row>
                    <Col md="4" className="mb-1">
                        <Label className="form-label">
                        Degree Type
                        </Label>
                        <Select
                            type="text"
                            name="degree type"
                            options={degree_type}
                            onChange={ (e) => { onChangeEducationHandler('degreeType', 'select', e) }}
                            
                            />
                    </Col>
                    <Col md="4" className="mb-1">
                        <Label className="form-label">
                        Degree Title
                        </Label>
                        <Input
                            type="text"
                            name="degree type"
                            onChange={ (e) => { onChangeEducationHandler('degreeTitle', 'input', e) }}
                            />
                    </Col>
                    <Col md="4" className="mb-1">
                        <Label className="form-label">
                        Institute Name
                        </Label>
                        <Select
                            type="text"
                            name="instituteName"
                            options={institutes}
                            onChange={ (e) => { onChangeEducationHandler('instituteName', 'select', e) }}
                            />
                    </Col>
                    
                </Row>
                <Row>
                    <Col md="4" className="mb-1">
                        <Label className="form-label">
                        Year of completion
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
                          Duration
                        </Label>
                        <Select options={durationList}
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
                       <button className="btn-next float-right btn btn-success" onClick={(e) => Submit(e)}><span className="align-middle d-sm-inline-block d-none">Save</span></button>
                    </Col>
            </Row>
                </Form>
            
            {!loading ? (
                Object.values(employeeEducationArray).length > 0 ? (
          
                    <Table bordered striped responsive className='my-1'>
                        <thead className='table-dark text-center'>
                        <tr>
                            <th scope="col" className="text-nowrap">
                            Degree Name
                            </th>
                            <th scope="col" className="text-nowrap">
                            Institute Name
                            </th>
                            <th scope="col" className="text-nowrap">
                            Completion Date
                            </th>
                            <th scope="col" className="text-nowrap">
                            Actions
                            </th>
                        </tr>
                        </thead>
                        
                        <tbody className='text-center'>
                            {Object.values(employeeEducationArray).map((item, key) => (
                                
                                    <tr key={key}>
                                    <td>{item.degree_title}</td>
                                    <td>{item.selected_institute_name}</td>
                                    <td>{item.year_of_completion}</td>
                                    <td>
                                        <div className="d-flex row">
                                        <div className="col">
                                            <button
                                            className="border-0"
                                            onClick={() => removeAction(key, item.id)}
                                            >
                                            <XCircle color="red" />
                                            </button>
                                        </div>
                                        </div>
                                    </td>
                                    </tr>
                            
                                )
                            )}
                        
                        </tbody>
                        
                    </Table>
                
                ) : null
            ) : (
                <div className="text-center"><Spinner/></div>
            )
            } 
        </Fragment>
   )
}
export default EducationDetail