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
  Badge
} from 'reactstrap'

const PayView = ({ payslipData, salaryBatch }) => {
    const [monthname, setmonthName] = useState()
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
  }, [salaryBatch])

  if (!payslipData) {
    return <div className='text-center'>Nothing to show</div>
  }

  return (
    <Container>
      <Row>
        <Col md={12}>
          <Card>
            <CardHeader>
              <h4 className="card-title">{payslipData.employee_name}</h4>
            </CardHeader>
            <CardSubtitle className='ms-2'>
               <div className='col-md-3'>
                Month : <Badge color='light-success'>{monthname}</Badge>
                </div> 
            </CardSubtitle>
            <CardBody>
              <div>
                <h5> Gross Salary: </h5> {payslipData.gross_salary}
              </div>
              {payslipData.addons.length > 0 ? (
                <div className="mt-1">
                  <h5>Addons</h5>
                  {payslipData.addons.map((addon, index) => (
                    <div key={index}>
                      {addon.attribute_name}: {addon.amount}
                    </div>
                  ))}
                </div>
              ) : null}
              {payslipData.deductions.length > 0 ? (
                <div className="mt-1">
                  <h5>Deductions</h5>
                  {payslipData.deductions.map((deduction, index) => (
                    <div key={index}>
                      {deduction.attribute_name}: {deduction.amount}
                    </div>
                  ))}
                </div>
              ) : null}
              {payslipData.customised.length > 0 ? (
                <div className="mt-1">
                  <h5>ESS</h5>
                  {payslipData.customised.map((custom, index) => (
                    <div key={index}>
                      {custom.attribute_name}: {custom.amount}
                    </div>
                  ))}
                </div>
              ) : null}
              <div>
                <h5>Tax Deduction:</h5> {payslipData.tax_amount}
              </div>
              <div>
                <h5>Net Salary:</h5> {payslipData.net_salary}
              </div>
            </CardBody>
          </Card>
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
