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
    Input
  } from "reactstrap"
  import { Eye, Edit, Trash2, Check } from "react-feather"
  import { useLocation } from 'react-router-dom'
  import apiHelper from "../../../Helpers/ApiHelper"
  import { useState, useEffect, Fragment } from "react"
  import PayView from "../AccountantView.js/PayView"
  
  const Record = () => {
    const Api = apiHelper()
    const location = useLocation()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [canvasViewPlacement, setCanvasViewPlacement] = useState('end')
    const [canvasViewOpen, setCanvasViewOpen] = useState(false)
    const [selectedData, setSelectedData] = useState()
    // const [salaryBatch, setSalaryBatch] = useState()
  
    const getData = () => {
      setLoading(true)
      const formData = new FormData()
      formData['salary_batch'] = location.state.batchData.id
      formData['payroll_batch'] = location.state.batchData.payroll_batch
      Api.jsonPost(`/payroll/salary/record/`, formData).then((response) => {
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
    }, [])
    const toggleViewCanvasEnd = (item) => {
      if (!canvasViewOpen) {
        setSelectedData(item)
      } 
        setCanvasViewPlacement('end')
        setCanvasViewOpen(!canvasViewOpen)
    }
    return (
      <Fragment>
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
                        onClick={() => toggleViewCanvasEnd(item)}
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
                                               Addons :  {item.total_addons}
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
        <Offcanvas direction={canvasViewPlacement} isOpen={canvasViewOpen} toggle={toggleViewCanvasEnd} >
          <OffcanvasHeader toggle={toggleViewCanvasEnd}></OffcanvasHeader>
          <OffcanvasBody className=''>
            <PayView payslipData={selectedData} salaryBatch={location.state.batchData} />
          </OffcanvasBody>
        </Offcanvas>
        </Fragment>
      )
  }
  
  export default Record
  