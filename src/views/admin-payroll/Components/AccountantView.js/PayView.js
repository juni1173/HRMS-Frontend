import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardSubtitle,
  Badge,
  Button
} from 'reactstrap'
import html2pdf from 'html2pdf.js'

const PayView = ({ payslipData, salaryBatch }) => {
    const [monthname, setmonthName] = useState()
    const organizationString = localStorage.getItem('organization')
  const organization = organizationString ? JSON.parse(organizationString) : null
  const { name, logo, tagline, locations } = organization || {}
  const [base64logo, setbase64logo] = useState()
  if (typeof logo === 'string') {
    fetch(logo)
      .then(response => response.blob())
      .then(blob => {
        const reader = new FileReader()
        reader.onloadend = function () {
          setbase64logo(reader.result)
          console.log(base64logo)
        }
        reader.readAsDataURL(blob)
      })
      .catch(error => console.error('Error fetching or converting image:', error))
  } else {
    console.error('Invalid logo format. Expected a URL string.')
  }
  useEffect(() => {
    const getMonthName = (monthNumber) => {
        const monthOptions = { month: 'long' }
        return new Intl.DateTimeFormat('en-US', monthOptions).format(
          new Date(2000, monthNumber - 1, 1)
        )
      }
  
      if (salaryBatch && salaryBatch.month) {
          setmonthName(getMonthName(salaryBatch.month))
      }
  }, [setbase64logo, salaryBatch])

  const generatePdf = () => {
    const element = document.getElementById('payView')
    const options = {
      margin: 10,
      filename: `${payslipData.employee_name} - ${monthname}${salaryBatch.year}.pdf`,
      image: { type: 'png', quality: 1.5 },
      html2canvas: { scale: 2 }, // Adjust the scale for better resolution
      jsPDF: { unit: 'mm', format: 'a3', orientation: 'portrait' }
    } 
    html2pdf(element, options)
  }

  if (!payslipData) {
    return <div className='text-center'>Nothing to show</div>
  }

  return (
    <Container>
      <Row>
        <Col md={12}>
          <Card>
            <CardBody id="payView">
            <Row className='align-items-center' style={{ backgroundColor: '#0A2A6C', color: '#fff', border : '3px solid #000'  }}>
        <div className='col-md-9 fw-bolder fs-4'>
          <div>
            Monthly Payslip
          </div>
          <div>
            {monthname}, {salaryBatch.year}
          </div>
        </div>
        <div className='col-md-3'>
            <div className='row bg-info p-2 fw-bolder fs-4' >
            <div>
                Net Amount
            </div>
            <div>
              {payslipData.net_salary}
            </div>
            </div>
        </div>
        
    </Row> 
    <Row>
      <div className='ms-2 mt-2 fs-4 fw-bolder' style={{color:'#888888'}}>TRANSFERRED TO</div>
      <hr className="border-top border-dark bg-dark" />
      <Row className='text-dark fs-5 fw-bolder'>
      <Col md={3}>
        Full Name
      </Col>
      <Col md={3}>
        {payslipData.employee_name}
      </Col>
      <Col md={3}>
        Employee ID
      </Col>
      <Col md={3}>
        {payslipData.employee_id}
      </Col>
      <Col md={3}>
        Job Title
      </Col>
      <Col md={3}>
        {payslipData.jobtitle}
      </Col>
      <Col md={3}>
      Employment Type
      </Col>
      <Col md={3}>
        {payslipData.employee_type}
      </Col>
      <Col md={3}>
        Email
      </Col>
      <Col md={3}>
        {payslipData.email}
      </Col>
      <Col md={3}>
      Joining Date
      </Col>
      <Col md={3}>
        {payslipData.joining_date}
      </Col>
      <Col md={3}>
        Bank Name
      </Col>
      <Col md={3}>
        {payslipData.bank_name}
      </Col>
      <Col md={3}>
      Department
      </Col>
      <Col md={3}>
        {payslipData.department}
      </Col>
      <Col md={3}>
        Account#
      </Col>
      <Col md={3}>
        {payslipData.bank_account_no || payslipData.employee_bank_account_no}
      </Col>
      <Col md={3}>
      CNIC
      </Col>
      <Col md={3}>
        {payslipData.cnic}
      </Col>
    </Row>
      <hr className="border-top border-dark bg-dark" />
    </Row>
    <Row>
      <Col md={6}>
      <div className='ms-2 mt-2 fs-4 fw-bolder' style={{color:'#888888'}}>TAXABLE EARNINGS</div> 
      <div className='text-dark fs-5 fw-bolder'> 
      <hr className="border-top border-dark bg-dark" />
      {payslipData.compositions.length > 0 ? (
                <div className="mt-1">
      {payslipData.compositions.map((composition, index) => (
  <div key={index}>
    <Row className='text-nowrap'>
    <Col md={6}>
    {Object.keys(composition)[0]}
    </Col>
    <Col md={6} className='d-flex justify-content-end'>
    {Object.values(composition)[0]}
    </Col>
    </Row>
  </div>
))}
                  </div>
              ) : null}
    {payslipData.addons.length > 0 ? (
    <div className="mt-1">
      {payslipData.addons
        .filter(addon => addon.is_Taxable)
        .map((addon, index) => (
          <div key={index}>
            <Row className='text-nowrap'>
              <Col md={6}>
                {addon.attribute_name}
              </Col>
              <Col md={6} className='d-flex justify-content-end'>
                {addon.amount}
              </Col>
            </Row>
          </div>
        ))}
    </div>
  ) : null}
        {payslipData.customised.length > 0 ? (
                <div className="mt-1">
                  {payslipData.customised.filter(custom => custom.is_Taxable).map((custom, index) => (
                    <div key={index}>
                       <Row className='text-nowrap'>
                        <Col md={6}>
                      {custom.attribute_name}
                      </Col>
                      <Col md={6} className='d-flex justify-content-end'>
                       {custom.amount}
                       </Col>
                      </Row>
                      {/* {custom.attribute_name}: {custom.amount} */}
                    </div>
                  ))}
                </div>
              ) : null}
      <hr className="border-top border-dark bg-dark" />
      </div>
      <Row style={{fontSize:'18px', fontWeight:'bold'}}>
      <Col md={6} style={{color:'#888888'}}>
        Total
        </Col>
        <Col md={6} className='d-flex justify-content-end text-dark'>
    PKR {payslipData.taxable_amount_addons}
    </Col>
    </Row>
      </Col>
      <Col md={6}>
      <div className='ms-2 mt-2 fw-bolder fs-4' style={{color:'#888888'}}>DEDUCTIONS</div> 
      <div className='text-dark fw-bolder fs-5'> 
      <hr className="border-top border-dark bg-dark" /> 
      {payslipData.deductions.length > 0 ? (
                <div className="mt-1">
                  {payslipData.deductions.map((deduction, index) => (
                    <div key={index}>
                       <Row className='text-nowrap'>
                        <Col md={6}>
                      {deduction.attribute_name}
                      </Col>
                      <Col md={6} className='d-flex justify-content-end'>
                       {deduction.amount}
                       </Col>
                      </Row>
                    </div>
                  ))}

                </div>
              ) : null}
               <Row>
                        <Col md={6}>
                      Income Tax
                      </Col>
                      <Col md={6} className='d-flex justify-content-end'>
                      {payslipData.tax_amount}
                       </Col>
                      </Row>
              <hr className="border-top border-dark bg-dark" />
              </div>
              <Row className='fs-4 fw-bolder'>
        <Col md={6} style={{color:'#888888'}}>
        Total
        </Col>
        <Col md={6} className='d-flex justify-content-end text-dark'>
    PKR {payslipData.total_deductions}
    </Col>
    </Row>
      </Col>
      <Col md={6}>
      <div className='ms-2 mt-2 fs-4 fw-bolder' style={{color:'#888888'}}>NON TAXABLE EARNINGS</div> 
      <div className='text-dark fs-5 fw-bolder'> 
      <hr className="border-top border-dark bg-dark" /> 
      {payslipData.addons.length > 0 ? (
    <div className="mt-1">
      {payslipData.addons
        .filter(addon => !addon.is_Taxable)
        .map((addon, index) => (
          <div key={index}>
            <Row className='text-nowrap'>
              <Col md={6}>
                {addon.attribute_name}
              </Col>
              <Col md={6} className='d-flex justify-content-end'>
                {addon.amount}
              </Col>
            </Row>
          </div>
        ))}
       
    </div>
  ) : null}
  {payslipData.customised.length > 0 ? (
                <div className="mt-1">
                  {payslipData.customised.filter(custom => !custom.is_Taxable).map((custom, index) => (
                    <div key={index}>
                       <Row className='text-nowrap'>
                        <Col md={6}>
                      {custom.attribute_name}
                      </Col>
                      <Col md={6} className='d-flex justify-content-end'>
                       {custom.amount}
                       </Col>
                      </Row>
                      {/* {custom.attribute_name}: {custom.amount} */}
                    </div>
                  ))}
                </div>
              ) : null}
              <hr className="border-top border-dark bg-dark" />
              </div>
              <Row className='fs-4 fw-bolder'>
        <Col md={6} style={{color:'#888888'}}>
        Total
        </Col>
        <Col md={6} className='d-flex justify-content-end text-dark'>
   PKR {payslipData.non_taxable_amount_addons}
    </Col>
    </Row>
      </Col>
      <Col md={6}></Col>
      <Col md={6} className='mt-3'>
      <div className='ms-2 mt-2 fs-4 fw-bolder' style={{color:'#888888'}}>TOTAL AMOUNT TO BE PAID</div> 
      <hr className="border-top border-dark bg-dark" />
      <div className='ms-2 mt-2 d-flex justify-content-end fs-4 fw-bolder text-dark'>PKR {payslipData.net_salary}</div> 
    </Col>
    </Row>
    <Row>
    </Row>
    <hr className="border-top border-dark bg-dark mt-4"/>
    <Row>
        <Col md={6}>
          {base64logo && (
            <img
              src={base64logo}
              alt={`${name} Logo`}
              className='img-fluid'
            />
          )}
        </Col>
        <Col>
          {name && (
            <div className='text-dark fs-4 fw-bolder'>{name}</div>
          )}
          {tagline && <div>{tagline}</div>}
          {locations && locations.length > 0 && (
            <div>
              <strong className='text-dark fs-4 fw-bolder'>Address:</strong>
              <ul className='list-unstyled'>
                {locations.map((location) => (
                  <li key={location.id}>{location.address}</li>
                ))}
              </ul>
            </div>
          )}
        </Col>
      </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={12} className='text-center mt-3'>
          <Button color='primary' onClick={generatePdf}>
            Generate PDF
          </Button>
        </Col>
      </Row>
    </Container>
  )
}

PayView.propTypes = {
  payslipData: PropTypes.object,
  SalaryBatch: PropTypes.any.isRequired
}

export default PayView
