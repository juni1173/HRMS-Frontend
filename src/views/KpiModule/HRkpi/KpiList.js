import React, { Fragment, useState } from 'react'
import { Row, Col, Table, Modal, ModalHeader, ModalBody, Spinner, Button, Badge, CardBody, Card } from 'reactstrap'
// import { Edit2, Trash2 } from 'react-feather'
// import Swal from 'sweetalert2'
// import withReactContent from 'sweetalert2-react-content'
import apiHelper from '../../Helpers/ApiHelper'
// import UpdateKpi from '../UpdateKpi/update'
const KpiList = ({ data, CallBack, index }) => {
    
    const Api = apiHelper()
    // const MySwal = withReactContent(Swal)
    const [loading, setLoading] = useState(false)
    // const [UpdateModal, setUpdateModal] = useState(false)
    const [checkedItems, setCheckedItems] = useState([])
    // const [UpdateData, setUpdateData] = useState([])
    const handleCheck = (event) => {
        const { id } = event.target
        const isChecked = event.target.checked
        if (isChecked) {
          // Add the ID to checkedItems if it's not already there
          setCheckedItems([...checkedItems, id])
        } else {
          // Remove the ID from checkedItems if it's already there
          setCheckedItems(checkedItems.filter((item) => item !== id))
        }
      }
      
      const handlecheckall = (event, tableData) => {
        const isChecked = event.target.checked
      
        if (isChecked) {
          // Select all checkboxes in the current table
          const allIds = tableData
      .filter((item) => item.kpis_status_level !== 4)
      .map((item) => item.id.toString())
    setCheckedItems(allIds)
          setCheckedItems([...checkedItems, ...allIds])
        } else {
          // Deselect all checkboxes in the current table
          const tableIds = tableData.map((item) => item.id.toString())// Convert to strings
          setCheckedItems(checkedItems.filter((item) => !tableIds.includes(item)))
        }
      }
      
      const multipleKpiApprove = async () => {
        // return false
        if (checkedItems.length > 0) {  
            setLoading(true)
                await Api.jsonPost(`/kpis/hr/approval/list/`, {kpis_array: checkedItems})
                .then(result => {
                    if (result) {
                        if (result.status === 200) {
                        Api.Toast('success', result.message)
                        CallBack()
                        } else {
                            Api.Toast('error', result.message)
                        }
                    } else {
                        Api.Toast('error', 'Server not responding!')
                    }
                })
        setTimeout(() => {
            setLoading(false)
        }, 500)
        } else {
            Api.Toast('error', 'Please select a kpi to send!')
        }
    }
  
  return (
    <Fragment key={index}>
        <h3>Evaluator: <b>{data.evaluator_name ? data.evaluator_name : 'N/A'}</b></h3>
        {(checkedItems.length > 0) && (
                            <Button className='btn btn-primary mb-1' onClick={multipleKpiApprove}>
                                Approve Selected Kpi's
                            </Button>
                        )}
    {!loading ? (  
    data.employee_kpis_data && Object.values(data.employee_kpis_data[0]).length > 0 ? (
    <>
    {Object.values(data.employee_kpis_data).map((dataItem, dataKey) => (
       <>
        <Card key={dataKey}>
            <CardBody>
                <h5>Kpi's of <b>{dataItem[0].name}</b></h5>
                {dataItem[0].employee_kpis_data && Object.values(dataItem[0].employee_kpis_data).length > 0 ? (    
                    <Row>
                    <Col md={12}>
                       
                        <Table bordered striped responsive className='my-1'>
                                <thead className='table-dark text-center'>
                                <tr>
                                    <th scope="col" className="text-nowrap">
                                    <input
                    type="checkbox"
                    onChange={(event) => handlecheckall(event, dataItem[0].employee_kpis_data)}
                  />
                  
                  {/* <label className="form-check-label">Select</label> */}
                                    </th>

                                    <th scope="col" className="text-nowrap">
                                    Detail
                                    </th>
                                    <th scope="col" className="text-nowrap">
                                    Type
                                    </th>
                                    <th scope="col" className="text-nowrap">
                                    Complexity
                                    </th>
                                    <th scope="col" className="text-nowrap">
                                    Status
                                    </th>
                                    
                                </tr>
                                </thead>
                                
                                <tbody className='text-center'>
                                    {Object.values(dataItem[0].employee_kpis_data).map((item, key) => (
                                            <tr key={key}>
                                            <td>{item.kpis_status_level !== 4 ?  <input
          className='form-check-primary'
          type="checkbox"
          id={item.id}
          onChange={handleCheck}
          checked={checkedItems.includes(item.id.toString())}
          // checked={checkedItems.includes(item.id)}
        /> : <input className='form-check-primary' type="checkbox" disabled/>}</td>
                                            <td>{item.title ? item.title : 'N/A'}</td>
                                            <td>{item.ep_type_title ? item.ep_type_title : 'N/A'}</td>
                                            <td>{item.ep_complexity_title ? item.ep_complexity_title : 'N/A'}</td>
                                            <td>{item.kpis_status_title ? <Badge color="light-success">{item.kpis_status_title}</Badge> : <Badge color="light-danger">N/A</Badge>}</td>
                                            </tr>
                                    )
                                    )}
                                
                                </tbody>
                                
                        </Table>
                        
                    </Col>
                    </Row>          
                ) : (
                    <div className="text-center">No Kpi Data Found!</div>
                )}
            </CardBody>
        </Card>
        </>
    ))}
    </>
    ) : (
        <div className="text-center">No Evaluation Reuests Found!</div>
    )
  ) : (
    <div className='text-center'><Spinner/></div>
    )}
    {/* <div className='vertically-centered-modal'>
        <Modal isOpen={UpdateModal} toggle={() => setUpdateModal(!UpdateModal)} className='modal-dialog-Update modal-lg'>
          <ModalHeader toggle={() => setUpdateModal(!UpdateModal)}>Update Kpi</ModalHeader>
          <ModalBody>
            {UpdateData && Object.values(UpdateData).length > 0 && (
                <UpdateKpi data={UpdateData} dropdownData={dropdownData} CallBack={CallBack} />
            )}
            
          </ModalBody>
        </Modal>
      </div> */}
    </Fragment>
  )
}

export default KpiList