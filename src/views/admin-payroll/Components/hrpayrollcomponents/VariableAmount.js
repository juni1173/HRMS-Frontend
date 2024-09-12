import { Fragment, useState, useEffect } from 'react'
import { Label, Row, Col, Input, Button, Spinner, Table, Badge,  Modal, ModalBody, ModalHeader } from "reactstrap" 
import { Edit2, Save, Users, XCircle } from 'react-feather'
import Select from 'react-select'
import apiHelper from '../../../Helpers/ApiHelper'
const VariableAmount = ({content, apiCall, batch}) => {
    const Api = apiHelper() 
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [EmpList, setEmpList] = useState([])
    const [variableData, setvariableData] = useState({
        employee: '',
        amount : ''
   })

   
    const getData = async () => {
      if (content && !apiCall) { 
      setLoading(true)
    const formdata = new FormData()
    formdata['payroll_attribute'] = content.payroll_attribute
    formdata['salary_batch'] = batch.salary.id
    const empformdata = new FormData()
    console.log(content)
    empformdata['payroll_batch'] = content.payroll_batch
        const response = await Api.jsonPost('/payroll/batch/employees/records/', empformdata)
        if (response.status === 200) {
            setLoading(false) 
            const newEmpList = response.data.map(item => ({
                value: item.id,
                label: item.name
              }))
              setEmpList(newEmpList)
        } else {
            Api.Toast('error', response.message)
            setLoading(false)
        } 
        const variableresponse = await Api.jsonPost('/payroll/variable/amount/view/', formdata)
        if (variableresponse.status === 200) {
            setLoading(false) 
            setData(variableresponse.data)
        } else {
            Api.Toast('error', variableresponse.message)
            setLoading(false)
        } 
      }
        }
        const onChangeHandler = (InputName, InputType, e) => {
        
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
    
            setvariableData(prevState => ({
            ...prevState,
            [InputName] : InputValue
            
            }))
    
        }
        const CallBack = () => {
            getData()
        }
        const submitForm = async () => {
            setLoading(true)
            if (variableData.amount !== '' && variableData.employee !== '') {
                const formData = new FormData()
                formData['employee'] = variableData.employee
                formData['amount'] = variableData.amount 
                formData['payroll_attribute'] = content.payroll_attribute
                formData['salary_batch'] = batch.salary.id
                await Api.jsonPost(`/payroll/variable/amount/`, formData).then(result => {
                    if (result) {
                        if (result.status === 200) {
                            Api.Toast('success', result.message)
                            CallBack()
                        } else {
                            Api.Toast('error', result.message)
                        }
                    }
                })
                
            } else {
                Api.Toast('error', 'Please fill all required fields!')
            }
            setTimeout(() => {
                setLoading(false)
            }, 1000)
        }
        
      useEffect(() => {
getData()
      }, [])
    
      return (
<Fragment>
        <Row>
            <Col md={12}>
         <div className='content-header' >
          <h5 className='mb-2'>Set Amount</h5>
        </div>
        <hr></hr>
        { !loading ? <Row>
            <Col md="4" className="mb-1">
                <Label className="form-label">
                Employee <Badge color='light-danger'>*</Badge>
                </Label>
                
                <Select
                    isClearable={false}
                    className='react-select'
                    classNamePrefix='select'
                    name="staff_classification"
                    options={EmpList}
                    onChange={ (e) => { onChangeHandler('employee', 'select', e.value) }}
                    menuPlacement="auto" 
                    menuPosition='fixed'
               />
               </Col>
               <Col md='4' className='mb-1'>
                <label className='form-label'>
                  Amount <Badge color='light-danger'>*</Badge>
                </label>
                <Input type="number" 
                    name="amount"
                    onChange={ (e) => { onChangeHandler('amount', 'input', e) }}
                    placeholder="Amount" />
              </Col>
              <Col md={4}>
                <Button color="primary" className="btn-next mt-2" onClick={submitForm}>
                <span className="align-middle d-sm-inline-block">
                  Save
                </span>
                <Save
                  size={14}
                  className="align-middle ms-sm-25 ms-0"
                ></Save>
              </Button>
                </Col>
                {Object.values(data).length > 0 ? (
                    <Row>
                        <Col md={12}>
                        <Table bordered striped responsive className='my-1'>
                                    <thead className='table-dark text-center'>
                                    <tr>
                                        <th scope="col" className="text-nowrap">
                                        Employee Name
                                        </th>
                                        <th scope="col" className="text-nowrap">
                                         Amount
                                        </th>
                                        {/* <th scope="col" className="text-nowrap">
                                        Status
                                        </th> */}
                                    </tr>
                                    </thead>
                                    
                                    <tbody className='text-center'>
                                        {Object.values(data).map((item, key) => (
                                                <tr key={key}>
                                                <td>{item.employee_name}</td>
                                                <td>{item.amount}</td>
                                                {/* <td>{item.status}</td> */}
                                                </tr>
                                        )
                                        )}

                                    </tbody>
                                    
                            </Table>
                        </Col>
                    </Row>
                        ) : (
                            <div className="text-center">No Data Found!</div>
                        )}
        </Row> : <div className='text-center'><Spinner type='grow' color='primary'/></div>}
            </Col>
        </Row>
    </Fragment>
      )
}
export default VariableAmount