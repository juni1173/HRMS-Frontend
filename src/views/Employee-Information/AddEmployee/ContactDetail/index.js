import {Fragment, useState, useEffect} from "react" 
import {Label, Row, Col, Input, Form, Table, Spinner } from "reactstrap" 
import {  XCircle } from 'react-feather'
import apiHelper from "../../../Helpers/ApiHelper"
import Select from 'react-select'
import InputMask from 'react-input-mask'
const ContactDetail = ({emp_state}) => {
     
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [relations] = useState([])
    const [employeeContactArray] = useState([])
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

        console.log(contactDetail)
    }

    const removeAction = async (value, item_id) => {
        setLoading(true)
         const uuid = emp_state['emp_data'].uuid
        await Api.deleteData(`/employees/${uuid}/emergency/contact/${item_id}`, {method:"Delete"})
             .then(result => {
                 if (result) {
                     if (result.status === 200) {
                        employeeContactArray.splice(value)
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
            const uuid = emp_state['emp_data'].uuid
            await Api.jsonPost(`/employees/${uuid}/emergency/contact/`, contactDetail)
            .then(result => {
                if (result) {
                    if (result.status === 200) {
                        employeeContactArray.push(result.data)
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
                        Contact Relation
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
                         Name
                        </Label>
                        <Input type="text" 
                        name="name"
                        onChange={ (e) => { onChangeContactDetailHandler('name', 'input', e) }}
                        placeholder="name"  />
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
                         placeholder="email"  />
                    </Col>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                       Address
                        </Label>
                        <Input type="text"
                         name="address"
                         onChange={ (e) => { onChangeContactDetailHandler('address', 'input', e) }}
                         placeholder="address"  />
                        
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
            {!loading ? (
                Object.values(employeeContactArray).length > 0 ? (
          
                    <Table bordered striped responsive className='my-1'>
                        <thead className='table-dark text-center'>
                        <tr>
                            <th scope="col" className="text-nowrap">
                             Contact Name
                            </th>
                            <th scope="col" className="text-nowrap">
                            Contact Type
                            </th>
                            <th scope="col" className="text-nowrap">
                            Contact Email
                            </th>
                            <th scope="col" className="text-nowrap">
                            Actions
                            </th>
                        </tr>
                        </thead>
                        
                        <tbody className='text-center'>
                            {Object.values(employeeContactArray).map((item, key) => (
                                
                                !loading && (
                                    <tr key={key}>
                                    <td>{item.name}</td>
                                    <td>{relations.find(pre => pre.value === item.relation) ? relations.find(pre => pre.value === item.relation).label : 'N/A'}</td>
                                    <td>{item.email}</td>
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
export default ContactDetail