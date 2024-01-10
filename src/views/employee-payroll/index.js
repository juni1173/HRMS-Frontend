import {
    Card,
    CardBody,
    Badge,
    Table,
    CardTitle,
    CardSubtitle,
    Spinner,
    Offcanvas,
    OffcanvasBody,
    OffcanvasHeader,
    Form,
    Button,
    Input,
    ButtonGroup,
    Label,
    Col
  } from "reactstrap"
  import { Eye, Edit, Trash2, Check } from "react-feather"
  import apiHelper from "../Helpers/ApiHelper"
  import { useState, useEffect, Fragment } from "react"
  import PayView from "../admin-payroll/Components/AccountantView.js/PayView"
  import Select from 'react-select'
  
  const Record = () => {
    const Api = apiHelper()
    const yearoptions = []
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [canvasViewPlacement, setCanvasViewPlacement] = useState('end')
    const [canvasViewOpen, setCanvasViewOpen] = useState(false)
    const [selectedData, setSelectedData] = useState()
    const [salaryBatch, setSalaryBatch] = useState()
    const [yearvalue, setyearvalue] = useState()
    for (let i = 0; i < 5; i++) {
        const year = currentYear - i
        yearoptions.push({ value: year, label: year.toString() })
      }
    const getData = async() => {
        const formData = new FormData()
        formData['year'] = yearvalue
      await Api.jsonPost(`/payroll/emp/salary/`, formData).then((response) => {
        if (response.status === 200) {
        setData(response.data)
        } else {
          Api.Toast('error', response.message)
        }
      })
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    }
    useEffect(() => {
      getData()
    }, [yearvalue])
    const toggleViewCanvasEnd = (item) => {
      if (!canvasViewOpen) {
        setSelectedData(item)
      } 
        setCanvasViewPlacement('end')
        setCanvasViewOpen(!canvasViewOpen)
    }
    return (
      <Fragment>
        <Col md={4} className="mx-1">
    <Label>Select Year</Label>
    <Select
      isClearable={false}
      options={yearoptions}
      className='react-select mb-1'
      classNamePrefix='select'
      placeholder="Select Year"
    //   value={yearoptions.find(option => option.value === yearvalue)}
      onChange={(selectedOption) => {
        if (selectedOption !== null) {
            setyearvalue(selectedOption.value)
        }
      }}
    />
  </Col>
      {!loading ? (
        <div className="mx-1">
          {Object.keys(data).length > 0 ? <>
            {data.map((item, index) => (
              <Card key={index} className="mb-3">
                <CardBody>
                  <div className="row">
                    <div className="col-md-3">
                      <CardTitle tag="h1">{item.employee_name}</CardTitle>
                    </div>
                    <div className="col-md-3">
                                              <Badge color='light-success'>
                                                Net Salary : {item.net_salary}
                                              </Badge>
                                          </div>
                    <div className="col-md-3">
                                              <Badge color='light-warning'>
                                                Tax Amount : {item.tax_amount}
                                              </Badge>
                                          </div>
                    <div className="col-md-3 float-right">
                    <div className="float-right">
                      <button
                        className="border-0 no-background"
                        title="View"
                        onClick={() => {
                            setSalaryBatch(item.salary_batch_details)
                            toggleViewCanvasEnd(item)
                          }}
                      >
                        <Eye color="green" />
                      </button>
                    </div>
                  </div>
                      <div className="col-md-3">
                                              <Badge color='light-info'>
                                                Gross Salary :  {item.gross_salary}
                                              </Badge>
                                          </div>
                      <div className="col-md-3">
                                              <Badge color='light-info'>
                                               Add/Ons :  {item.total_addons}
                                              </Badge>
                                          </div>
                       <div className="col-md-3">
                                              <Badge color='light-info'>
                                               Deductions :  {item.total_deductions}
                                              </Badge>
                                          </div> 
                      <div className="col-md-3">
                                              <Badge color='light-info'>
                                               ESS :  {item.total_customized}
                                              </Badge>
                                          </div>                     
                   
                  </div>
                </CardBody>
              </Card>
            ))}
          </> : (
            <div className="text-center">No data found!</div>
          )}
        </div>
      ) : (
        <div className="container h-100 d-flex justify-content-center">
          <div className="jumbotron my-auto">
            <div className="display-3">
              <Spinner type="grow" color="primary" />
            </div>
          </div>
        </div>)}
        <Offcanvas direction={canvasViewPlacement} isOpen={canvasViewOpen} toggle={toggleViewCanvasEnd} className="largeCanvas">
          <OffcanvasHeader toggle={toggleViewCanvasEnd}></OffcanvasHeader>
          <OffcanvasBody className=''>
            <PayView payslipData={selectedData} salaryBatch={salaryBatch} />
          </OffcanvasBody>
        </Offcanvas>
        </Fragment>
      )
  }
  
  export default Record
  