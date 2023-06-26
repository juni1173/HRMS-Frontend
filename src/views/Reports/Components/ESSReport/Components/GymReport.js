import {Fragment, React, useState} from 'react'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { Col, Row, Label, Spinner, Card, CardBody, Table, Badge } from 'reactstrap'
import Select from 'react-select'
import apiHelper from '../../../../Helpers/ApiHelper'
import DownloadPDF from '../../../../Helpers/PDFDownloadHelper/PdfDownload'
import { DownloadCloud } from 'react-feather'
const GymReport = () => {
  const Api = apiHelper()
  const PDF = DownloadPDF()
  const [loading, setLoading] = useState(false)
  const [reportParameters, setReportParameters] = useState({
      start_date: '',
      end_date : '',
      status : ''
  })
  const [data, setData] = useState([])
  const status_choices = [
    {value: '', label: 'All'},
    {value: 'in-progress', label: 'in-progress'},
    {value: 'under-review', label: 'under-review'},
    {value: 'not-approved', label: 'not-approved'},
    {value: 'approved', label: 'approved'}
]
  const onChangeParametersDetailHandler = (InputName, InputType, e) => {
        
    let InputValue
    if (InputType === 'input') {
    
    InputValue = e.target.value
    } else if (InputType === 'select') {
    
    InputValue = e
    } else if (InputType === 'date') {  
        InputValue = Api.formatDate(e)
    } else if (InputType === 'file') {
        InputValue = e.target.files[0].name
    }

    setReportParameters(prevState => ({
    ...prevState,
    [InputName] : InputValue
    
    }))
  }
  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData()
      if (reportParameters.start_date !== '') formData['start_date'] = reportParameters.start_date
      if (reportParameters.end_date !== '') formData['end_date'] = reportParameters.end_date
      if (reportParameters.status !== '') formData['status'] = reportParameters.status 
      await Api.jsonPost(`/reports/analysis/gym/allowance/`, formData)
      .then(result => {
          if (result) {
            if (result.status === 200) {
                setData(result.data)
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
    }, 500)
  }
  const handleDownload = () => {
    PDF.handleDownload('pdf_table', `Gym_Report_${reportParameters.start_date}_${reportParameters.end_date}`)
  }
  return (
    <Fragment>
    <Card>
      <CardBody>
      <Row className='mb-2'>
      <Col md={3}>
        <Label className='form-label' for='default-picker'>
          From
        </Label>
        <Flatpickr className='form-control'  
          onChange={ (e) => { onChangeParametersDetailHandler('start_date', 'date', e) }} 
          id='default-picker' 
          placeholder='Start Date'
        />
      </Col>
      <Col md={3}>
        <Label className='form-label' for='default-picker'>
          To
        </Label>
        <Flatpickr className='form-control'  
          onChange={ (e) => { onChangeParametersDetailHandler('end_date', 'date', e) }} 
          id='default-picker' 
          placeholder='End Date'
        />
      </Col>
     
      <Col md={3}>
        <Label className="form-label">
          Status
        </Label>
        <Select
          isClearable={false}
          className='react-select'
          classNamePrefix='select'
          name="status"
          options={status_choices}
          onChange={ (e) => { onChangeParametersDetailHandler('status', 'select', e.value) }}
        />
      </Col>
      <Col md="3" className="mt-2">
        <button className="btn-lg float-right btn btn-success"  onClick={(e) => onSubmitHandler(e)}><span className="align-middle d-sm-inline-block d-none">Generate</span></button>
      </Col>
    </Row>
      </CardBody>
    </Card>
    
    <Row>
    <Col md={12}>
    {!loading ? (
                Object.values(data).length > 0 ? (
                    <>
                    <Row>
                    <Col md={6}>
                      <h5 className='text-white'>Gym Report {reportParameters.start_date} - {reportParameters.end_date}</h5>
                    </Col>
                    <Col md={6}>
                      <button className='btn btn-sm btn-outline-warning float-right' onClick={handleDownload}>PDF <DownloadCloud/></button>
                    </Col>
                    </Row>
                            <Table bordered striped dark responsive className='my-1' id='pdf_table'>
                                    <thead className='text-center'>
                                    <tr>
                                        <th scope="col" className="text-nowrap">
                                        Employee
                                        </th>
                                        <th scope="col" className="text-nowrap">
                                        Date
                                        </th>
                                        <th scope="col" className="text-nowrap">
                                        Amount
                                        </th>
                                        <th scope="col" className="text-nowrap">
                                        Limit
                                        </th>
                                        <th scope="col" className="text-nowrap">
                                        Receipt
                                        </th>
                                        <th scope="col" className="text-nowrap">
                                        Status
                                        </th>
                                       
                                    </tr>
                                    </thead>
                                    
                                    <tbody className='text-center'>
                                        {Object.values(data).map((item, key) => (
                                            
                                            !loading && (
                                                <tr key={key}>
                                                <td>{item.employee_name ? item.employee_name : 'N/A'}</td>
                                                <td className='nowrap'>{item.date ? item.date : 'N/A'}</td>
                                                <td>{item.amount ? item.amount : 'N/A'}</td>
                                                <td>{item.gym_monthly_limit ? item.gym_monthly_limit : 'N/A'}</td>
                                                <td>{item.gym_receipt ? <a target='_blank' href={`${process.env.REACT_APP_BACKEND_URL}${item.gym_receipt}`}> <img src={`${process.env.REACT_APP_BACKEND_URL}${item.gym_receipt}`} width={20} height={20}/></a> : 'N/A'}</td>
                                                <td>{item.status ? <Badge color='light-success'>{item.status}</Badge> : <Badge color='light-danger'>'N/A'</Badge>}</td>
                                                </tr>
                                                ) 
                                            )
                                        )}
                                    
                                    </tbody>
                                    
                            </Table>
                      </>  
                 ) : (
                  
                  <Card>
                    <CardBody>
                      No data found
                    </CardBody>
                  </Card>
                 )
             ) : (
              <div className="text-center"><Spinner color='white'/></div>
             )
            }
            </Col>
    </Row>
    </Fragment>

  )
}

export default GymReport