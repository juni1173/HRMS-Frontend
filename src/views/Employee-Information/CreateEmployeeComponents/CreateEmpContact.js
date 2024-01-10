import {Fragment, useState, useEffect} from "react" 
import {Label, Row, Col, Input, Form, Badge } from "reactstrap" 
import apiHelper from "../../Helpers/ApiHelper"
import Select from 'react-select'
import InputMask from 'react-input-mask'
const CreateEmpContact = ({uuid, CallBack}) => {
     
    const Api = apiHelper()
    const [relations] = useState([])
    const [contactDetail, setContactDetail] = useState({
        organization: Api.org.id,
        relation : '',
        name : '',
        email : '',
        address : '',
        mobile_no : '',
        landline : ''
   })

   const onChangeContactDetailHandler = (InputName, InputType, e) => {
        
        let InputValue
        if (InputType === 'input') {
        
        InputValue = e.target.value
        } else if (InputType === 'select') {
        
        InputValue = e
        } else if (InputType === 'date') {
            let dateFomat = e.split('/')
                dateFomat = `${dateFomat[2]}-${dateFomat[1]}-${dateFomat[0]}`    
            InputValue = dateFomat
        } else if (InputType === 'file') {
            InputValue = e.target.files[0].name
        }

        setContactDetail(prevState => ({
        ...prevState,
        [InputName] : InputValue
        
        }))
    }
    const fetchContactRelations = async () => {
        await Api.get('/employees/contact/relations/').then((result) => {
            if (result) {
                    if (Object.values(result).length > 0) {
                        relations.splice(0, relations.length)
                        for (let i = 0; i < Object.values(result).length; i++) {
                            relations.push({value: result[i].id, label: result[i].relation})
                        }
                        return relations
                    }
            } else {    
                Api.Toast('error', 'server not responding')
            }
        })
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
            await Api.jsonPost(`/employees/${uuid}/emergency/contact/`, contactDetail)
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
    }
     
    useEffect(() => {
         
        fetchContactRelations()
        
    }, [])
  return (
    <Fragment>
         <Form >
                <Row>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                        Contact Relation <Badge color='light-danger'>*</Badge>
                        </Label>
                        <Select
                            isClearable={false}
                            className='react-select'
                            classNamePrefix='select'
                            name="relation"
                            options={relations}
                            defaultValue= {relations[0]}
                            onChange={ (e) => { onChangeContactDetailHandler('relation', 'select', e.value) }}
                        />
                    </Col>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                         Name <Badge color='light-danger'>*</Badge>
                        </Label>
                        <Input type="text" 
                        name="name"
                        onChange={ (e) => { onChangeContactDetailHandler('name', 'input', e) }}
                        placeholder="Name"  />
                    </Col>
                </Row>
                <Row className="mt-1">
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                         Email 
                        </Label>
                        <Input type="email"
                         name="email"
                         onChange={ (e) => { onChangeContactDetailHandler('email', 'input', e) }}
                         placeholder="Email"  />
                    </Col>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                       Address
                        </Label>
                        <Input type="text"
                         name="address"
                         onChange={ (e) => { onChangeContactDetailHandler('address', 'input', e) }}
                         placeholder="Address"  />
                        
                    </Col>
                </Row>
                <Row>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                         Mobile Number
                        </Label>
                        <InputMask
                            mask="+\929999999999"
                            name="mobile_no"
                            className="phone form-control"
                            placeholder="Mobile Number"
                            onChange={ (e) => { onChangeContactDetailHandler('mobile_no', 'input', e) }}
                            
                            />
                    </Col>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                        Landline Number
                        </Label>
                        <InputMask
                            mask="+\929999999999"
                            name="landline"
                            className="phone form-control"
                            placeholder="Landline Number"
                            onChange={ (e) => { onChangeContactDetailHandler('landline', 'input', e) }}
                            
                            />
                    </Col>
                </Row>
                <Row>
                    
                    <Col md="12" className="mb-1">
                    <button className="btn-next float-right btn btn-success"  onClick={(e) => onSubmitHandler(e)}><span className="align-middle d-sm-inline-block d-none">Save</span></button>
                    </Col>
                </Row>
                
            </Form>
    </Fragment>
  )
}

export default CreateEmpContact