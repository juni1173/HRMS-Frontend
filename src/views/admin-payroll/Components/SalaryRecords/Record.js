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
    ButtonGroup
  } from "reactstrap"
  import { Eye, Edit, Trash2, Check } from "react-feather"
  import { useLocation } from 'react-router-dom'
  import apiHelper from "../../../Helpers/ApiHelper"
  import { useState, useEffect, Fragment } from "react"
  import PayView from "../AccountantView.js/PayView"
  import { CSVLink, CSVDownload } from "react-csv"
  
  const Record = () => {
    const Api = apiHelper()
    const location = useLocation()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [csvData, setCsvData] = useState([])
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
    const getUniqueCompositions = (salaries) => {
      const compositionsSet = new Set()
      salaries.forEach((salary) => {
        salary.compositions.forEach((comp) => compositionsSet.add(Object.keys(comp)[0]))
      })
      return Array.from(compositionsSet)
    }
  
    const getUniqueAttributes = (salaries, attributeKey, nestedKey) => {
      const attributesSet = new Set()
      salaries.forEach((salary) => {
        salary[attributeKey].forEach((attribute) => attributesSet.add(attribute[nestedKey]))
      })
      return Array.from(attributesSet)
    }
  
    const formatCompositions = (compositions, employeeCompositions) => {
      return compositions.map((comp) => {
        const compValue = employeeCompositions.find((c) => Object.keys(c)[0] === comp)
        return compValue ? compValue[comp] : ''
      })
    }
  
    const formatAttributes = (attributes, employeeAttributes) => {
      return attributes.map((attr) => {
        const attrValue = employeeAttributes.find((a) => a.attribute_name === attr)
        return attrValue ? `${attrValue.amount}` : ''
      })
    }
    const generateCSVData = () => {
      const addons = getUniqueAttributes(data, 'addons', 'attribute_name')
      const customised = getUniqueAttributes(data, 'customised', 'attribute_name')
      const deductions = getUniqueAttributes(data, 'deductions', 'attribute_name')
  
      const csvdata = [
        [
          'Employee Name',
          ...getUniqueCompositions(data),
          ...addons,
          ...customised,
          ...deductions,
          'Taxable Total',
          'Non Taxable Total',
          'Tax Rate',
          'Tax Amount',
          'To Be Paid'
        ],
        ...data.map((salary) => [
          salary.employee_name,
          ...formatCompositions(getUniqueCompositions(data), salary.compositions),
          ...formatAttributes(addons, salary.addons),
          ...formatAttributes(customised, salary.customised),
          ...formatAttributes(deductions, salary.deductions),
          salary.taxable_total,
          salary.non_taxable_total,
          salary.tax_rate || 'N/A',
          salary.tax_amount || 0,
          salary.net_salary
        ])
      ]
      setCsvData(csvdata)
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
      <div className="d-flex align-items-center justify-content-end">
      {Object.keys(data).length > 0 && (
        <ButtonGroup className="mr-2 md-2">
          <Button className="mr-2 md-2" color="primary" onClick={generateCSVData}>
            Generate CSV
          </Button>
          {csvData.length > 0 && (
            <CSVLink data={csvData} filename={'employee_salaries.csv'}>
              <Button color="info">Download CSV</Button>
            </CSVLink>
          )}
        </ButtonGroup>
      )}
    </div>
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
        <Offcanvas direction={canvasViewPlacement} isOpen={canvasViewOpen} toggle={toggleViewCanvasEnd} className="largeCanvas" >
          <OffcanvasHeader toggle={toggleViewCanvasEnd}></OffcanvasHeader>
          <OffcanvasBody className=''>
            <PayView payslipData={selectedData} salaryBatch={location.state.batchData} />
          </OffcanvasBody>
        </Offcanvas>
        </Fragment>
      )
  }
  
  export default Record
  