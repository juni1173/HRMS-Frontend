import {Fragment, useState, useEffect} from "react" 
import {Label, Row, Col, Input, Form, Table, Spinner, Badge } from "reactstrap" 
import Flatpickr from 'react-flatpickr'
import Select from 'react-select'
import apiHelper from "../../../Helpers/ApiHelper"
import {  XCircle } from 'react-feather'
const DependentDetail = ({emp_state}) => {
    
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [employeeDependentArray] = useState([])
    const [relationshipsArr] = useState([])
    const [employeeDependent, setEmployeeDependent] = useState({
         dependentName : '',
         dependentRelationship : '',
         dependentDOB : ''
    })
    
    const onChangeDependentHandler = (InputName, InputType, e) => {
        
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
    
        setEmployeeDependent(prevState => ({
        ...prevState,
        [InputName] : InputValue
        
        
        }))
    
        // console.log(employeeDependent)
    }

    const removeAction = async (value, item_id) => {
        setLoading(true)
         const uuid = emp_state['emp_data'].uuid
        await Api.deleteData(`/employees/${uuid}/dependent/contact/${item_id}`, {method:"Delete"})
             .then(result => {
                 if (result) {
                     if (result.status === 200) {
                        employeeDependentArray.splice(value)
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
        }, 2000)
    }
    const GetPreData = async () => {
        setLoading(true)
       await Api.get(`/employees/pre/dependent/data/`, { headers: {Authorization: Api.token} }).then(result => {
        if (result) {
            console.warn(result)
           
            relationshipsArr.splice(0, relationshipsArr.length)
            if (result.status === 200) {
                const relation_result = result.data.dependent
                for (let i = 0; i < relation_result.length; i++) {
                    relationshipsArr.push({value: relation_result[i].id, label: relation_result[i].relationship})
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
        return false
     } 
    const Submit = async (e) => {
        e.preventDefault()
        const uuid = emp_state['emp_data'].uuid
        // const uuid = '38e1aa09-1b3e-4f4f-a4e3-8909907bd3da'
        if (employeeDependent.dependentName !== '' && employeeDependent.dependentRelationship
         && employeeDependent.dependentDOB !== '') {
            setLoading(true)
            const formData = new FormData()
            formData['name'] = employeeDependent.dependentName
            formData['relationship'] = employeeDependent.dependentRelationship.value
            formData['date_of_birth'] = employeeDependent.dependentDOB
        await Api.jsonPost(`/employees/${uuid}/dependent/contact/`, formData)
            .then(result => {
                if (result) {
                    if (result.status === 200) { 
                        const finalResult = result.data
                        console.warn(finalResult)
                        // for (let i = 0; i < finalResult.length; i++) {
                            employeeDependentArray.push(finalResult)
                        // }  
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
            <Row>
                <Col md={12}>
                    <Form >
                        <Row>
                            <Col md="6" className="mb-1">
                                <Label className="form-label">
                                Name<Badge color='light-danger'>*</Badge>
                                </Label>
                                <Input
                                    type="text"
                                    name="dependentName"
                                    onChange={ (e) => { onChangeDependentHandler('dependentName', 'input', e) }}
                                    placeholder="name"
                                    
                                    />
                            </Col>
                            <Col md="6" className="mb-1">
                                <Label className="form-label">
                            RelationShip<Badge color='light-danger'>*</Badge>
                                </Label>
                                <Select
                                    type="text"
                                    name="dependentRelationship"
                                    options={relationshipsArr}
                                    onChange={ (e) => { onChangeDependentHandler('dependentRelationship', 'select', e) }}
                                    />
                            </Col>
                            <Col md="6" className="mb-1">
                                <Label className="form-label">
                            Date Of Birth
                                </Label>
                                <div className='calendar-container'>
                                    <Flatpickr className='form-control' value={employeeDependent.dependentDOB ? employeeDependent.dependentDOB : ''} onChange={ (date) => { onChangeDependentHandler('dependentDOB', 'date', date) }} id='default-picker' />
                                </div> 
                                
                            </Col>
                        </Row>
                        <Row>
                            <Col md="12" className="mb-1">
                            <button className="btn-next float-right btn btn-success" onClick={(e) => Submit(e)}><span className="align-middle d-sm-inline-block d-none">Save</span></button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
            {!loading ? (
                Object.values(employeeDependentArray).length > 0 ? (
                    <Row>
                        <Col md={12}>
                            <Table bordered striped responsive className='my-1'>
                                <thead className='table-dark text-center'>
                                <tr>
                                    <th scope="col" className="text-nowrap">
                                Dependent Name
                                    </th>
                                    <th scope="col" className="text-nowrap">
                                    Dependent Relationship
                                    </th>
                                    <th scope="col" className="text-nowrap">
                                    Date of Birth
                                    </th>
                                    {/* <th scope="col" className="text-nowrap">
                                    Leaving Date
                                    </th>
                                    <th scope="col" className="text-nowrap">
                                    Leaving Reason
                                    </th> */}
                                    <th scope="col" className="text-nowrap">
                                    Actions
                                    </th>
                                </tr>
                                </thead>
                                
                                <tbody className='text-center'>
                                    {Object.values(employeeDependentArray).map((item, key) => (
                                            <tr key={key}>
                                            <td>{item.name}</td>
                                            <td>{item.relationship_name}</td>
                                            <td>{item.date_of_birth}</td>
                                            {/* <td>{item.leavingDate}</td>
                                            <td>{item.leavingReason}</td> */}
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
                        </Col>
                    </Row>
                ) : null
            ) : (
                <div className="text-center"><Spinner/></div>
            )
            } 
        </Fragment>
    )
}
export default DependentDetail