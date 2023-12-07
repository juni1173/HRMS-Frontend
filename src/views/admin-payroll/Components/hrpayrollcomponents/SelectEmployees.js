import { Fragment, useState, useEffect } from 'react'
import { Label, Row, Col, Input, Button, Spinner, Table, Badge,  Modal, ModalBody, ModalHeader } from "reactstrap" 
import Select from 'react-select'
import apiHelper from '../../../Helpers/ApiHelper'
const SelectEmployees = ({content, apiCall}) => {
    const Api = apiHelper() 
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const getData = async () => {
      if (content && !apiCall) {
    setLoading(true)
    const formData = new FormData()
    formData['payroll_attribute'] = content.payroll_attribute
    formData['payroll_batch'] = content.payroll_batch
    const checkedresponse = await Api.jsonPost(`/payroll/monthly/eligible/employees/view/`, formData)
    try {
      if (checkedresponse.status === 200) {
        setData(checkedresponse.data)
        setLoading(false)
   } else {
    setLoading(false)
     Api.Toast('error', checkedresponse.message)
   }
    } catch (error) {
      setLoading(false)
      Api.Toast('error', 'No response from server')
    }
       
      }
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
        {Object.values(data).length > 0 ? (
                        <Row>
                        <Col md={12}>
                            <Table bordered striped responsive className='my-1'>
                                    <thead className='table-dark text-center'>
                                    <tr>
                                        <th scope="col" className="text-nowrap">
                                        Employee ID
                                        </th>
                                        <th scope="col" className="text-nowrap">
                                         Employee Name
                                        </th>
                                       
                                    </tr>
                                    </thead>
                                    
                                    <tbody className='text-center'>
                                        {Object.values(data).map((item, key) => (
                                                <tr key={key}>
                                                <td>{item.employee}</td>
                                                <td>{item.employee_name}</td>
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