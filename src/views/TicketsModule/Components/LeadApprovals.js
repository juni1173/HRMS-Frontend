import {Fragment, useState, useEffect, useCallback} from 'react'
import { Row, Col, Label, Spinner, Button, Badge, CardBody, Card, Input, Offcanvas, OffcanvasHeader, OffcanvasBody } from 'reactstrap'
import { Eye, Edit, XCircle } from 'react-feather'
import TicketDetails from './TicketDetails'
import apiHelper from '../../Helpers/ApiHelper'
import Select from 'react-select'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { FaUserGear, FaUserTie  } from "react-icons/fa6"
import { GrStatusInfo } from "react-icons/gr"
import { MdCategory } from "react-icons/md"
import { CiViewTimeline } from "react-icons/ci"
import { TbEditCircle } from "react-icons/tb"
const LeadApprovals = () => {
  const Api = apiHelper()
  const MySwal = withReactContent(Swal)
  const [loading, setLoading] = useState(false)
  const [canvasPlacement, setCanvasPlacement] = useState('end')
    const [canvasOpen, setCanvasOpen] = useState(false)
    const [data, setData] = useState([])
    const [UpdateData, setUpdateData] = useState([])
    const status_choices = [
        {value: 1, label: 'Pending'},
        {value: 2, label:'In Progress by Team Lead'},
        {value: 3, label: 'Rejected by Team Lead'},
        {value: 4, label: 'Approved by Team Lead'},
        // {value: 5, label: 'In Progress by CTO'},
        // {value: 6, label: 'Rejected by CTO'},
        // {value: 7, label: 'Approved by CTO'},
        {value: 8, label: 'In Progress by Admin'},
        {value: 9, label: 'Rejected by Admin'},
        {value: 10, label: 'Solved by Admin'}
        // {value: 11, label: 'In Progress by HR'},
        // {value: 12, label: 'Reject by HR'},
        // {value: 13, label: 'Solved by HR'}
    ]
    const lead_choices = [
        {value: 2, label:'In Progress by Team Lead'},
        {value: 3, label: 'Rejected by Team Lead'},
        {value: 4, label: 'Approved by Team Lead'}
    ]
    const toggleCanvasEnd = () => {
      setCanvasPlacement('end')
      setCanvasOpen(!canvasOpen)
    }
    const DetailsToggle = (item) => {
      if (item !== null) {
          setUpdateData(item)
      }
      setCanvasPlacement('end')
      setCanvasOpen(!canvasOpen)
      
    }
    const getTicketsData = async () => {
        setLoading(true)
        await Api.get(`/ticket/team/lead/employee/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    const resultData = result.data
                    console.warn(resultData)
                    setData(resultData)
                } else {
                    // Api.Toast('error', result.message)
                }
            } else (
             Api.Toast('error', 'Server not responding!')   
            )
        }) 
         
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }
  useEffect(() => {
    getTicketsData()
    }, [])

    const CallBack = useCallback(() => {
        getTicketsData()
      }, [data])
      const theme = (theme) => ({
        ...theme,
        spacing: {
            ...theme.spacing,
            controlHeight: 30,
            baseUnit: 2
        }
    })
    const customStyles = {
    control: (base, state) => ({
        ...base,
        background: "#2229351a",
        fontWeight: "600",
        textAlign: "center",
        cursor: 'pointer',
        // match with the menu
        borderRadius: state.isFocused ? "3px 3px 0 0" : 3,
        // Overwrittes the different states of border
        borderColor: state.isFocused ? "yellow" : "green",
        // Removes weird border around container
        boxShadow: state.isFocused ? null : null,
        "&:hover": {
            // Overwrittes the different states of border
            borderColor: state.isFocused ? "red" : "gray"
        }
        })
    }
    const onStatusUpdate = async (id, status_value, comment) => {
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
                formData['ticket_status'] = status_value
                if (comment !== '') {
                    formData['decision_reason'] = comment
                    Api.jsonPatch(`/ticket/team/lead/employee/${id}/`, formData)
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
                                    await CallBack()
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
                } else Api.Toast('error', 'Comment is required!')
            } 
        })
    }
    const StatusComponent = ({ item, index }) => {
        const [toggleThisElement, setToggleThisElement] = useState(false)
        const [comment, setComment] = useState('')
        const [statusValue, setStatusValue] = useState('')
        return (
            <div className="single-history" key={index}>
            
            {toggleThisElement ? (
                <div className="row">
                <div className="col-lg-11">
                <Select
                    isClearable={false}
                    options={lead_choices}
                    className='react-select mb-1'
                    classNamePrefix='select'
                    styles={customStyles}
                    theme={theme}
                    defaultValue={status_choices.find((value) => value === item.ticket_status) ? status_choices.find((value) => value === item.ticket_status) : status_choices[0] }
                    onChange={(statusData) => setStatusValue(statusData.value)}
                    menuPlacement="auto"
                    menuPosition="fixed"
                    />
                    <>
                        <Label>
                            Comment
                        </Label>
                        <Input 
                            type='textarea'
                            className='mb-1'
                            name='commentText'
                            placeholder="Add Remarks"
                            onChange={ (e) => { setComment(e.target.value) }}
                        />
                    </>
                    
                    <Button className="btn btn-primary" onClick={ async () => {
                        await onStatusUpdate(item.id, statusValue, comment).then(() => {
                            setToggleThisElement((prev) => !prev)
                        })
                    }}>
                        Submit
                    </Button>
                </div>
                <div className="col-lg-1 float-right m-0 p-0">
                <XCircle color="red" size={12} className='m-0 p-0' onClick={() => setToggleThisElement((prev) => !prev)}/>
                </div>
            </div>
            ) : (
                <div className="row ">
                    <div className="col-lg-12">
                        <button
                            className="border-0 no-background float-right"
                            title="Update Status"
                            style={{fontSize:'14px'}}
                            onClick={() => setToggleThisElement((prev) => !prev)}
                            >
                            <TbEditCircle color="#315180" size={'18px'}/> Status
                        </button>
                    </div>
                </div>
            )
                
            }
            </div>
        )
        }
  return (
    <Fragment>
    {!loading ? (
            data && Object.values(data).length > 0 ? (
                <div className="row" >
                    {Object.values(data).map((item, key) => (
                                    <Col md={6} className='' key={key}>
                                        <Card bg="light" style={{ backgroundColor: '#F2F3F4' }} className='text-nowrap'>    
                                            <CardBody>
                                                <Row>
                                                    <Col md={3} className='mb-1'><h4>{item.subject ? (item.subject).substring(0, 25) : 'N/A'}</h4></Col>
                                                    <Col md={6} >
                                                     <h5 title='Employee Name'><span style={{color: 'grey', fontSize:'10px'}}>from</span> {item.employee_name ? item.employee_name : 'N/A'}</h5>
                                                    </Col>
                                                    <Col md={3}>
                                                    <button
                                                        className="border-0 no-background float-right"
                                                        title="View Detail"
                                                        style={{fontSize:'14px'}}
                                                        onClick={() => DetailsToggle(item)}
                                                        >
                                                        <CiViewTimeline  color="#315180" size={'18px'}/> View
                                                    </button>
                                                    </Col>
                                                    <Col md={3}>
                                                        {item.ticket_status_title ? (
                                                        <>
                                                            <GrStatusInfo /> <Badge color="light-success" className='cursor-pointer' title='status'>{item.ticket_status_title}</Badge>
                                                        </>
                                                        ) : <Badge color="light-danger">N/A</Badge>}<br></br>
                                                        <MdCategory /> <Badge color='light-warning' className='cursor-pointer' title='category'>{item.category_title ? item.category_title : 'N/A'}</Badge>
                                                    </Col>
                                                    <Col md={4}>
                                                        <br></br>
                                                        <FaUserGear /> <Badge color='light-secondary' className='cursor-pointer' title='Assigned to'>{item.assign_to_name ? item.assign_to_name : 'N/A'}</Badge>
                                                    </Col>
                                                    <Col md={5} className="">

                                                       {(item.ticket_status < 5) && <StatusComponent item={item} key={key}/>} 
                                                        {/* <Trash2 color='red' onClick={() => deleteAction(item.id)}/> */}
                                                    </Col>
                                                    
                                                </Row>
                                        
                                            </CardBody>
                                        </Card>
                                    </Col>
                        ))}
                </div>   
            ) : (
                <div className="text-center">No Ticket Data Found!</div>
            )
        ) : <div className='text-center'><Spinner type='grow'/></div>    
    }
     <Offcanvas direction={canvasPlacement} isOpen={canvasOpen} toggle={toggleCanvasEnd} >
          <OffcanvasHeader toggle={toggleCanvasEnd}></OffcanvasHeader>
          <OffcanvasBody className=''>
           <TicketDetails data={UpdateData}/>
            
          </OffcanvasBody>
        </Offcanvas>
    </Fragment>
  )
}

export default LeadApprovals