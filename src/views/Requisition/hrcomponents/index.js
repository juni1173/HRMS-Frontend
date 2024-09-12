import { Fragment, useEffect, useState, useRef } from 'react'
import { Offcanvas, OffcanvasBody, OffcanvasHeader, Label, Row, Col, Input, Button, Spinner, Table, Badge, UncontrolledTooltip, Card, CardBody  } from "reactstrap" 
import { Save, XCircle, HelpCircle, FileText, Check, Edit } from 'react-feather'
import apiHelper from '../../Helpers/ApiHelper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import Select from 'react-select'
import JobsAddForm from '../../Jobs/Components/blockComponents/CreateJobsForm'
import ActiveJobsList from './AssignJob'
// import JDList from './jd'
const RequisitionRequest = () => {
    const Api = apiHelper()
    const selectedItemRef = useRef(null)
    const status_choices = [
        {value: 3, label: 'Initiated by HR'},
        {value: 4, label: 'Request Approved'},
        {value: 5, label: 'Request Rejected'}
]
    const MySwal = withReactContent(Swal)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [selectedData, setSelectedData] = useState()
      const fetchrequisitionData = async () => {
        setLoading(true)
        const response = await Api.get('/requisition/hr/view/request/')
        if (response.status === 200) {
            setData(response.data)
            setLoading(false)
        } else {
            setLoading(false)
            return Api.Toast('error', 'Pre server data not found')
        }
    }
    const fetchCallBack = () => {
        fetchrequisitionData()
       }
       
    const [canvasPlacement, setCanvasPlacement] = useState('end')
    const [canvasOpen, setCanvasOpen] = useState(false)
    const toggleCanvasEnd = (item) => {
        if (item) {
        selectedItemRef.current = item.id
        setSelectedData(item)
        }
         setCanvasPlacement('end')
         setCanvasOpen(!canvasOpen)
       }
       const [canvasPlacementList, setCanvasPlacementList] = useState('end')
       const [canvasOpenList, setCanvasOpenList] = useState(false)
       const toggleCanvasEndList = (item) => {
        if (item) {
           selectedItemRef.current = item.id
            setSelectedData(item)
        }
            setCanvasPlacementList('end')
            setCanvasOpenList(!canvasOpenList)
          }
          const assign = async (id) => {
            // setLoading(true) 
            if (selectedItemRef.current !== null && selectedItemRef.current !== undefined) {
            const formData = new FormData()
            formData['job'] = id
           const response =  await Api.jsonPatch(`/requisition/hr/update/${selectedItemRef.current}/`, formData)
           if (response) {
             if (response.status === 200) {
                // assignCallBack()
                Api.Toast('success', response.message)
                fetchrequisitionData()
                // setLoading(false)    
             } else {
               Api.Toast('error', response.message)
            //    setLoading(false)
             }
           } else {
            Api.Toast('error', "Unable to connect to server")
           }
        } else {  
            Api.Toast('error', 'Something went wrong please try again')
        }
        }
    const CallBack = (id) => {
        toggleCanvasEnd()
        assign(id)
    }
    const assignCallBack = () => {
        toggleCanvasEndList()
        fetchrequisitionData()
       }
    
useEffect(() => {
fetchrequisitionData()
}, [setData])
const StatusComponent = ({ item, index }) => {
    const [toggleThisElement, setToggleThisElement] = useState(false)
    const [comment, setComment] = useState('')
    const [statusValue, setStatusValue] = useState('')
    const onStatusUpdate = async (id, status_value) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "Do you want to update the Status!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, update it!',
            customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-danger ms-1'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.value) {
                const formData = new FormData()
                formData['status'] = status_value
                if (comment !== '') formData['reason'] = comment
                 Api.jsonPatch(`/requisition/hr/status/update/${id}/`, formData)
                    .then((result) => {
                        if (result.status === 200) {
                            MySwal.fire({
                                icon: 'success',
                                title: 'Status Updated!',
                                text: 'Status is updated.',
                                customClass: {
                                confirmButton: 'btn btn-success'
                                }
                            }).then(async function (result) {
                                if (result.isConfirmed) {
                                    setLoading(true)
                                    await fetchCallBack()
                                    setTimeout(() => {
                                        setLoading(false)
                                    }, 1000)
                                }
                            })
                            } else {
                                MySwal.fire({
                                    title: 'Error',
                                    text: result.message ? result.message : 'Something went wrong',
                                    icon: 'error',
                                    customClass: {
                                      confirmButton: 'btn btn-success'
                                    }
                                  })
                            }
                    })
            } 
        })
    }
    return (
        <div className="single-history" key={index}>
        
        {toggleThisElement ? (
            <div className="row min-width-300">
            <div className="col-lg-8">
            <Select
                isClearable={false}
                options={status_choices}
                className='react-select mb-1'
                classNamePrefix='select'
                defaultValue={status_choices.find(({value}) => value === item.status) ? status_choices.find(({value}) => value === item.status) : status_choices[0] }
                onChange={(statusData) => setStatusValue(statusData.value)}
                />
                {((statusValue === 4) || (statusValue === 5)) && (
                    <>
                    <Label>
                    Reason
                </Label>
                <Input 
                    type='textarea'
                    className='mb-1'
                    name='commentText'
                    placeholder="Add Remarks"
                    onChange={ (e) => { setComment(e.target.value) }}
                />
                </>
                ) 
                }
                
                <Button className="btn btn-primary" onClick={ async () => {
                    await onStatusUpdate(item.id, statusValue).then(() => {
                        setToggleThisElement((prev) => !prev)
                    })
                }}>
                    Submit
                </Button>
            </div>
            <div className="col-lg-4 float-right">
            <XCircle color="red" onClick={() => setToggleThisElement((prev) => !prev)}/>
            </div>
        </div>
        ) : (
            <div className="row min-width-225">
                <div className="col-lg-8">
                <h3><Badge color='light-secondary'>{status_choices.find(({value}) => value === item.status) ? status_choices.find(({value}) => value === item.status).label : status_choices[0].label }</Badge></h3>
                </div>
                
                <div className="col-lg-4 float-right">
                    <Edit color="orange" onClick={() => setToggleThisElement((prev) => !prev)}/>
                 </div>
            </div>
        )
            
        }
        </div>
    )
    }
   
  return (
    <Fragment>
        <Row>
            <Col md={12}>
         <div className='content-header' >
          {/* <h5 className='mb-2'>Employee Requisition</h5> */}
        </div>
        {!loading ? (
                <>   
            {(data && Object.values(data).length > 0) ? (
                <>
                {Object.values(data).map((item, key) => (
                    <Card>
                    <CardBody>  
                <Row>
                <Col md={4}>
                   <Badge color='light-success'> Position :</Badge> {item.position_title ? item.position_title : <Badge color='light-danger'>N/A</Badge>}
                </Col> 
                <Col md={4}>
                <Badge color='light-warning'> Supervisor :</Badge> {item.supervisor_name ? item.supervisor_name : <Badge color='light-danger'>N/A</Badge>}
                </Col> 
                <Col md={4}>
                <Badge color='light-primary'>Initiated By :</Badge> {item.created_by_name ? item.created_by_name : <Badge color='light-danger'>N/A</Badge>}
                </Col> 
                <Col md={4}>
                <Badge color='light-secondary'> Individuals Required :</Badge> {item.no_of_individuals ? item.no_of_individuals : <Badge color='light-danger'>N/A</Badge>}
                </Col> 
                <Col md={4}>
                <Badge color='light-danger'>Desired Start Date :</Badge> {item.desired_start_date ? item.desired_start_date : <Badge color='light-danger'>N/A</Badge>}
                </Col> 
                <Col md={4}>
                <StatusComponent item={item} key={key}/>
                </Col> 
                {item.status <= 3 && (<>  
                                                {item.job === null ?      <>
                <Col md={4}>
                <Button
                                             className="btn btn-primary"
                                             onClick={() => toggleCanvasEnd(item)}
                                             >
                                             Open New Job
                                             </Button>
                </Col>
                <Col md={4}>
                <Button
                                          className="btn btn-primary"
                                          onClick={() => toggleCanvasEndList(item)}
                                          >
                                          Assign Job
                                          </Button>
                </Col>
                </> : null }</>)}
                </Row> </CardBody>
            </Card>))}</>) : <div className='text-center'>No data found</div> }
            
                </>
            ) : (
                <div className="text-center"><Spinner /></div>
            )
            
       }
        <hr></hr>
            </Col>
        </Row>
        <Offcanvas direction={canvasPlacement} isOpen={canvasOpen} toggle={toggleCanvasEnd} className="largeCanvas">
          <OffcanvasHeader toggle={toggleCanvasEnd}></OffcanvasHeader>
          <OffcanvasBody className=''>
            <JobsAddForm count={1} CallBack={CallBack} selectedData={selectedData}/>
          </OffcanvasBody>
        </Offcanvas>
        <Offcanvas direction={canvasPlacementList} isOpen={canvasOpenList} toggle={toggleCanvasEndList} className="largeCanvas">
          <OffcanvasHeader toggle={toggleCanvasEndList}></OffcanvasHeader>
          <OffcanvasBody className=''>
            <ActiveJobsList selectedData={selectedData} assignCallBack={assignCallBack}/>
          </OffcanvasBody>
        </Offcanvas>
    </Fragment>
  )
}

export default RequisitionRequest