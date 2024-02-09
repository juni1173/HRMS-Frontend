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
  Modal,
  ModalHeader,
  ModalBody
} from "reactstrap"
import { Eye, Edit, Trash2, Check } from "react-feather"
import { useLocation, useHistory } from 'react-router-dom'
import apiHelper from "../../../Helpers/ApiHelper"
import { useState, Fragment, useEffect } from "react"
import PayView from "./PayView"
import { CSVLink } from "react-csv"
import GenerateCSV from "./CSV"
const AllEmpSalary = ({data, active, batchData, CallBack}) => {
  console.log(batchData)
  const Api = apiHelper()
  const location = useLocation()
  const history = useHistory()
  const [loading, setLoading] = useState(false)
  // const [data, setData] = useState([])
  // const [csvData, setCsvData] = useState([])
  const [canvasViewPlacement, setCanvasViewPlacement] = useState('end')
  const [canvasViewOpen, setCanvasViewOpen] = useState(false)
  const [selectedData, setSelectedData] = useState()
  const [selectedItems, setSelectedItems] = useState([])
  const [modal, setModal] = useState(false)
  const [dataTodisplay, setDataToDisplay] = useState([])
  const toggle = () => setModal(!modal)
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
  
const handleverify = () => {
  setLoading(true)
  const formData = new FormData()
  formData['salary_batch'] = location.state.batchData.id
  formData['payroll_batch'] = location.state.batchData.payroll_batch
  formData['employee_data'] = selectedItems
  Api.jsonPost(`/payroll/accountant/verify/`, formData).then((response) => {
    if (response.status === 200) {
      Api.Toast('success', response.message)
      CallBack()
    } else {
      Api.Toast('error', response.message)
    }
  })
  setTimeout(() => {
    setLoading(false)
  }, 1000)
}
const closeModal = () => {
  setModal(false)
}

const handleprocess = () => {
  setLoading(true)
  const formData = new FormData()
  formData['salary_batch'] = location.state.batchData.id
  formData['payroll_batch'] = location.state.batchData.payroll_batch
  formData['employee_data'] = selectedItems
  Api.jsonPost(`/payroll/process/employee/salary/`, formData).then((response) => {
    if (response.status === 200) {
      Api.Toast('success', response.message)
      // getData()
      CallBack()
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
  formData['salary_batch'] = batchData.id
  formData['payroll_batch'] = batchData.payroll_batch
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
const handleGenerateCSV = () => {
  const hasInvalidTransferStatus = selectedItems.some((itemId) => {
    const selectedItem = data.employee_data.find((item) => item === itemId)
    if (selectedItem && selectedItem.transfer_status && selectedItem.is_verified !== undefined) {
      console.log(selectedItem.is_verified)
      console.log(selectedItem.transfer_status)
      return (
        selectedItem.transfer_status === "transferred" || selectedItem.is_verified === false
      )
    }
  
    return false
  })
  

  if (hasInvalidTransferStatus) {
    // Show error message
    Api.Toast("error", "Please select only verified employees's with transfer status 'pending'")
  } else {
    toggle()
  }
}
useEffect(() => {
  if (active === '1') {
    setDataToDisplay(data.unverified_data)
  } else if (active === '2') {
    setDataToDisplay(data.unprocessed_data)
  } else if (active === '3') {
    setDataToDisplay(data.processed_data)
  } else {
    setDataToDisplay([])
  }
}, [data, setDataToDisplay])


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
          <div className="d-flex align-items-center justify-content-end m-1">
      {Object.keys(data).length > 0 && (
        <ButtonGroup className="mr-2 md-2">
          {selectedItems.length > 0 && (
            <>
            {active === '1' ?  <Button color="success" onClick={handleverify} className="mr-1">
              Verify Selected Employee's <Check />
            </Button> : null}
            {active === '2' ?  <>
              <Button color="success" onClick={handleprocess} className="mr-1">
             Process Selected Employee's <Check />
           </Button> 
            <Button color="primary" onClick={() => handleGenerateCSV()} className="mr-1">
            Generate CSV
          </Button> </> : null}
           </>
          )}
          {/* {csvData.length > 0 && (
            <CSVLink data={csvData} filename={'employee_salaries.csv'}>
              <Button color="info">Download CSV</Button>
            </CSVLink>
          )} */}
        </ButtonGroup>
      )}
    </div>
    {active === '3' ? <Card className="mb-3" color="light-success">
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
                                             Add/Ons :  {data.overall_totals.total_addons}
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
            </Card> : null}
    {dataTodisplay.length > 0 ? <>
     {dataTodisplay.map((item, index) => (
            <Card key={index} className="mb-3">
              <CardBody>
                <div className="row">
                  <div className="col-md-3">
                    {active !== '3' ?   <Input
                          type="checkbox"
                          onChange={() => handleCheckboxChange(item)}
                          checked={selectedItems.includes(item)}
                        /> : null}
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
                  
                    <div className="col-md-2">
                                            <Badge color='light-info'>
                                              Gross Salary :  {item.gross_salary}
                                            </Badge>
                                        </div>
                    <div className="col-md-2">
                                            <Badge color='light-info'>
                                             Add/Ons :  {item.total_addons}
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
                                        <div className="col-md-2">
                                        <Badge color='light-warning'>
                                               {item.transfer_status}
                                            </Badge>
                                        </div>                     
                 
                </div>
              </CardBody>
            </Card>
          ))} </> : (
            <div className="text-center">No data found!</div>
          )}
         
            
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
            <PayView payslipData={selectedData} salaryBatch={data.salary} />
          </OffcanvasBody>
        </Offcanvas>
        <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Download CSV</ModalHeader>
        <ModalBody>
        <GenerateCSV selectedData={selectedItems} onclose={closeModal}/>
        </ModalBody>
      </Modal>
      </Fragment>
    )
}

export default AllEmpSalary
