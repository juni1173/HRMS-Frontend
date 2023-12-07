import { Fragment, useState, useEffect } from 'react'
import { Label, Row, Col, Input, Button, Spinner, Table, Badge,  Modal, ModalBody, ModalHeader, Card, CardBody } from "reactstrap" 
import Select from 'react-select'
import apiHelper from '../../../Helpers/ApiHelper'
const ViewRecord = ({content, apiCall, batch}) => {
    const Api = apiHelper() 
    const [data, setData] = useState([])
    const [AllData, setAllData] = useState()
    const [loading, setLoading] = useState(false)
    const getData = async () => {
      if (content && apiCall) {
    const apiendpoint = content.payroll_attribute_title.includes('Gym') ? '/payroll/batch/gym/data/' : content.payroll_attribute_title.includes('Medical') ? '/payroll/batch/medical/data/' : content.payroll_attribute_title.includes('Certifications') ? '/payroll/batch/certifications/data/' : content.payroll_attribute_title.includes('Training') ? '/payroll/batch/training/data/' : null
      setLoading(true)
    const formdata = new FormData()
    formdata['salary_batch'] = batch.salary.id
    formdata['payroll_batch'] = content.payroll_batch
    const response = await Api.jsonPost(apiendpoint, formdata)
        if (response.status === 200) {
          setLoading(false) 
            setAllData(response.data)
            setData(response.data.data)
        } else {
          setLoading(false)
        Api.Toast('error', response.message)
           
        }
        }
      }
      useEffect(() => {
getData()
      }, [setAllData, content])
    
      return (
<Fragment>
        <Row>
            <Col md={12}>
            <Card>
                    <CardBody>
                        <Row className='mb-2'>
                            <Col md={6}>
                                <h3>Records</h3>
                            </Col>
                            <Col md={6}>
                            </Col>
                        </Row>
        {!loading ? <>
     
        {Object.values(data).length > 0 ? (
                    <Row>
                        <div className="row">
  <div className="col-md-4">
    <div className="d-flex justify-content-between align-items-center">
      <span>Total Amount:</span>
      <Badge color='light-warning'>
        {AllData.total_amount}
      </Badge>
    </div>
  </div>
  <div className="col-md-4">
    <div className="d-flex justify-content-between align-items-center">
      <span>Data Processed:</span>
      <Badge color='light-info'>
        {AllData.data_processed}
      </Badge>
    </div>
  </div>
</div>

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
                                        <th scope="col" className="text-nowrap">
                                        Status
                                        </th>
                                    </tr>
                                    </thead>
                                    
                                    <tbody className='text-center'>
                                        {Object.values(data).map((item, key) => (
                                                <tr key={key}>
                                                <td>{item.employee_name}</td>
                                                <td>{item.amount ? item.amount : item.cost ? item.cost : item.reimbursed_cost ? item.reimbursed_cost : null}</td>
                                                <td>{item.status ? item.status : item.reimbursement_status_title}</td>
                                                </tr>
                                        )
                                        )}

                                    </tbody>
                                    
                            </Table>
                        </Col>
                    </Row>
                        ) : (
                            <div className="text-center">No Data Found!</div>
                        )} </> : <div className='text-center'><Spinner type='grow' color='primary'/></div>}
        <hr></hr>
        </CardBody>
        </Card>
            </Col>

        </Row>
     
    </Fragment>
      )
}
export default ViewRecord