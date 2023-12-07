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
import { useLocation, useHistory } from 'react-router-dom'
import apiHelper from "../../../Helpers/ApiHelper"
import { useState, useEffect, Fragment } from "react"
import PayView from "./PayView"

const AllEmpSalary = () => {
  const Api = apiHelper()
  const location = useLocation()
  const history = useHistory()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [canvasViewPlacement, setCanvasViewPlacement] = useState('end')
  const [canvasViewOpen, setCanvasViewOpen] = useState(false)
  const [selectedData, setSelectedData] = useState()
  const [selectedItems, setSelectedItems] = useState([])
  const handleCheckboxChange = (itemId) => {
    // Step 3
    const updatedSelection = [...selectedItems]

    if (updatedSelection.includes(itemId)) {
      updatedSelection.splice(updatedSelection.indexOf(itemId), 1)
    } else {
      updatedSelection.push(itemId)
    }
    setSelectedItems(updatedSelection)
  }
  // const [salaryBatch, setSalaryBatch] = useState()

  const getData = () => {
    setLoading(true)
    const formData = new FormData()
    formData['salary_batch'] = location.state.batchData.id
    formData['payroll_batch'] = location.state.batchData.payroll_batch
    Api.jsonPost(`/payroll/accountant/view/`, formData).then((response) => {
      if (response.status === 200) {
      setData(response.data)
      // setSalaryBatch(response.data.salary)
      } else {
        Api.Toast('error', response.message)
      }
    })
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }
const handleverify = () => {
  setLoading(true)
  const formData = new FormData()
  formData['salary_batch'] = location.state.batchData.id
  formData['payroll_batch'] = location.state.batchData.payroll_batch
  formData['employee_data'] = selectedItems
  Api.jsonPost(`/payroll/accountant/verify/`, formData).then((response) => {
    if (response.status === 200) {
      Api.Toast('success', response.message)
      getData()
    } else {
      Api.Toast('error', response.message)
    }
  })
  setTimeout(() => {
    setLoading(false)
  }, 1000)
}
const handletransfer = () => {
  setLoading(true)
  const formData = new FormData()
  formData['salary_batch'] = location.state.batchData.id
  formData['payroll_batch'] = location.state.batchData.payroll_batch
  formData['salary_amount'] = data.overall_totals.net_salary
  formData['tax_amount'] = data.overall_totals.tax_amount
  formData['addons_amount'] = data.overall_totals.total_addons
  formData['deduction_amount'] = data.overall_totals.total_deductions
  formData['customised_amount'] = data.overall_totals.total_customized
  formData['batch_total'] = data.overall_totals.batch_total
  Api.jsonPost(`/payroll/accountant/transfer/`, formData).then((response) => {
    if (response.status === 200) {
      Api.Toast('success', response.message)
      // getData()
      history.goBack()
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
        {selectedItems.length > 0 ? <Button
                          className='btn btn-success mb-2'
                          onClick={() => handleverify()}
                        >
                          Verify Selected Employee's <Check />
                        </Button> : null}
          {data.employee_data.map((item, index) => (
            <Card key={index} className="mb-3">
              <CardBody>
                <div className="row">
                  <div className="col-md-3">
                  <Input
                          type="checkbox"
                          onChange={() => handleCheckboxChange(item)}
                          checked={selectedItems.includes(item)}
                        />
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
                     <div className="col-md-2">
                                            <Badge color='light-info'>
                                             Deductions :  {item.total_deductions}
                                            </Badge>
                                        </div> 
                    <div className="col-md-2">
                                            <Badge color='light-info'>
                                             ESS :  {item.total_customized}
                                            </Badge>
                                        </div>  
                                         <div className="col-md-2">
                                            <Badge color='light-warning'>
                                               {item.is_verified ? 'Verified' : 'Not-Verified' }
                                            </Badge>
                                        </div>                     
                 
                </div>
              </CardBody>
            </Card>
          ))}
          <Card className="mb-3" color="light-success">
              <CardBody>
                <div className="row">
                  <div className="col-md-3">
                    <CardTitle tag="h1">{data.salary.batch_no}</CardTitle>
                  </div>
                  <div className="col-md-3">
                                            <Badge color='light-success'>
                                              Total Amount : {data.overall_totals.batch_total}
                                            </Badge>
                                        </div>
                  <div className="col-md-3">
                                            <Badge color='light-warning'>
                                              Tax Amount : {data.overall_totals.tax_amount}
                                            </Badge>
                                        </div>
                                        <div className='col-lg-3'>
                        <Button
                          className='btn btn-success'
                          onClick={() => handletransfer()}
                        >
                          Complete Batch <Check />
                        </Button>
                      </div>
                    <div className="col-md-3">
                                            <Badge color='light-info'>
                                             Addons :  {data.overall_totals.total_addons}
                                            </Badge>
                                        </div>
                     <div className="col-md-3">
                                            <Badge color='light-info'>
                                             Deductions :  {data.overall_totals.total_deductions}
                                            </Badge>
                                        </div> 
                    <div className="col-md-3">
                                            <Badge color='light-info'>
                                             ESS :  {data.overall_totals.total_customized}
                                            </Badge>
                                        </div>                       
                 
                </div>
              </CardBody>
            </Card>
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
            <PayView payslipData={selectedData} salaryBatch={data.salary} />
          </OffcanvasBody>
        </Offcanvas>
      </Fragment>
    )
}

export default AllEmpSalary
