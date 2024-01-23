import { Fragment, useState, useEffect } from 'react'
import { Label, Row, Col, Input, Button, Spinner, Table, Badge,  Modal, ModalBody, ModalHeader, Form } from "reactstrap" 
import apiHelper from '../../../../Helpers/ApiHelper'
const SelectEmployees = ({content}) => {
    const Api = apiHelper() 
    const [data, setData] = useState([])
    const [empList, setempList] = useState([])
    const [loading, setLoading] = useState(false)
    const [checkedEmployees, setCheckedEmployees] = useState([])
    const [selectAll, setSelectAll] = useState(false)
    
    const getData = async () => {
      if (content) {
    setLoading(true)
    const formData = new FormData()
    formData['payroll_attribute'] = content.payroll_attribute
    formData['payroll_batch'] = content.payroll_batch
    const employeeformData = new FormData()
    employeeformData['payroll_batch'] = content.payroll_batch
    const response = await Api.jsonPost(`/payroll/batch/employees/records/`, employeeformData)
    const checkedresponse = await Api.jsonPost(`/payroll/monthly/eligible/employees/view/`, formData)
        // console.warn(response)
        if (response.status === 200) {
            setempList(response.data) 
            setLoading(false)
        } else {
            // Api.Toast('error', response.message)
            setLoading(false)
        } 
        
        if (checkedresponse.status === 200) {
             setData(checkedresponse.data)
             const employeeIds = checkedresponse.data.map((item) => item.employee)
             setCheckedEmployees(employeeIds)
        }
        //  else {
        //   // console.warn(checkedresponse.message)
        //     // Api.Toast('error', checkedresponse.message)
        // }
      }
        }
        const updateemplist = async() => {
            const formData = new FormData()
              formData['payroll_attribute'] = content.payroll_attribute
              formData['payroll_batch'] = content.payroll_batch
              formData['employee'] = checkedEmployees
              await Api.jsonPost(`/payroll/monthly/eligible/employees/`, formData).then(result => {
                if (result) {
                    if (result.status === 200) {
                        // CallBack()
                        Api.Toast('success', result.message)
                    } else {
                        Api.Toast('error', result.message)
                    }
                } else {
                    Api.Toast('error', 'Server not responding')
                }
              })
          } 
  

        const handleEmployeeCheckboxChange = (employeeId) => {
            if (selectAll) {
                // If "Select All" is checked, uncheck it
                setSelectAll(false)
                setCheckedEmployees([])
              } else {
            const isEmployeeInData = data.some((item) => item.employee === employeeId)
            const isEmployeeChecked = checkedEmployees.includes(employeeId) 
            if (isEmployeeInData) {
              if (isEmployeeChecked) {
                setCheckedEmployees(checkedEmployees.filter((id) => id !== employeeId))
              } else {
                setCheckedEmployees([...checkedEmployees, employeeId])
              }
            } else {
              if (isEmployeeChecked) {
                setCheckedEmployees(checkedEmployees.filter((id) => id !== employeeId))
              } else {
                setCheckedEmployees([...checkedEmployees, employeeId])
              }
            }
        }
          }
          
          const handleSelectAllCheckboxChange = () => {
            if (selectAll) {
              setCheckedEmployees([])
            } else {
              // Check all employees
              const allEmployeeIds = empList.map((item) => item.id)
              setCheckedEmployees(allEmployeeIds)
            }
            setSelectAll(!selectAll)
          }
      
      useEffect(() => {
getData()
      }, [])
   

      return (
<Fragment>
        <Row>
            <Col md={12}>
         <div className='content-header' >
          <h5 className='mb-2'>Select Employee</h5>
        </div>
       {!loading ? <>
        <Button color="primary" className="btn-next mt-2" 
                        onClick={updateemplist}
                        >Update</Button>
        {Object.values(empList).length > 0 ? (
                        <Row>
                        <Col md={12}>
                            <Table bordered striped responsive className='my-1'>
                                    <thead className='table-dark text-center'>
                                    <tr>
                                    <th>
                                    <Input
                              type="checkbox"
                              checked={selectAll}
                              onChange={handleSelectAllCheckboxChange}
                            />Check
                            </th>
                                        <th scope="col" className="text-nowrap">
                                        Employee ID
                                        </th>
                                        <th scope="col" className="text-nowrap">
                                         Employee Name
                                        </th>
                                       
                                    </tr>
                                    </thead>
                                    
                                    <tbody className='text-center'>
                                        {Object.values(empList).map((item, key) => (
                                                <tr key={key}>
                                                     <td>
                              <Input
                                type="checkbox"
                                checked={checkedEmployees.includes(item.id)}
                                onChange={() => handleEmployeeCheckboxChange(item.id)}
                              />
                            </td>
                                                <td>{item.emp_code}</td>
                                                <td>{item.name}</td>
                                                </tr>
                                        )
                                        )}
                                    
                                    </tbody>
                                    
                            </Table>
                        </Col>
                    </Row>
                        ) : (
                            <div className="text-center">No Data Found!</div>
                        )
                    }
                    </> : <div className="text-center"><Spinner /></div>}
        <hr></hr>
            </Col>
        </Row>
    </Fragment>
      )
}
export default SelectEmployees