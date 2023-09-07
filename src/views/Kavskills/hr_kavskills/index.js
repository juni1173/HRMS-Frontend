import { Fragment, useEffect, useState } from "react"
import { Spinner, Card, Row, Col, CardBody, CardSubtitle, CardTitle, Badge, Offcanvas, OffcanvasHeader, OffcanvasBody} from "reactstrap"
import { Download, Eye, File } from "react-feather"
import apiHelper from "../../Helpers/ApiHelper"
import KavSkillsLogo from "../../../assets/images/logo/kavskills-logo.png"
import { CSVLink } from "react-csv"
import KavskillView from "./KavskillView"
 
const index = () => {
    
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [preData, setPreData] = useState([])
    const [data, setData] = useState([])
    const [canvasViewPlacement, setCanvasViewPlacement] = useState('end')
    const [canvasViewOpen, setCanvasViewOpen] = useState(false)
    const getPreData = async () => {
        setLoading(true)
        await Api.get(`/kav_skills/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    setPreData(result.data)
                } else {
                    Api.Toast('error', result.message)
                }
            } else (
             Api.Toast('error', 'Server not responding!')   
            )
        })  
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }
    const csvData = [
        ["Name", "Skill", "Contact", "Financial Aid", "CNIC", "Email", "Resume"],
        ...preData.map((item) => [
            item.full_name,
            item.skill_type_title,
            item.contact_number,
            item.financial_aid ? (
                item.financial_aid_reason ? (
                    item.financial_aid_reason
                ) : (
                    'Applied but reason not given'
                )
            ) : (
                'N/A'
            ),
            item.cnic_no,
            item.email,
            item.kav_skills_resume
        ])
    ]
    const toggleViewCanvasEnd = item => {
        setData(item) 
        setCanvasViewPlacement('end')
        setCanvasViewOpen(!canvasViewOpen)
    }
    useEffect(() => {
        getPreData()
        }, [setPreData])
   return (
    <Fragment>
        <Row>
        <Col md={6}>
            <img
            className='mb-4'
            src={KavSkillsLogo}
            alt="Kavskills"
            width="200"
            />
        </Col>
        <Col md={6} >
            <CSVLink className="btn btn-primary float-right mt-2" filename="HRMS_Kavskills_List" data={csvData}>Download <Download/> </CSVLink>
        </Col>
        </Row>
                                
        {!loading ? (
            
            preData && Object.values(preData).length > 0 ? (
                <Row>
               {preData.map((item, key) => (
                <Col md={6}>
                    <Card key={key}>
                        <CardBody>
                            <Row>
                                <Col md={6}>
                                <CardTitle tag='h1'>{item.full_name}</CardTitle>
                                    <CardSubtitle><Badge color='light-primary'> 
                                    {item.skill_type_title}
                                        </Badge></CardSubtitle>
                                </Col>
                                <div className="col-lg-6 float-right">
                                            
                                            <div className="float-right">
                                            <button
                                                    className="border-0 no-background"
                                                    title="View"
                                                    onClick={() => toggleViewCanvasEnd(item)}
                                                    >
                                                    <Eye color="green"/>
                                                </button>
                                                <a target="_blank" href={`${item.kav_skills_resume}`}>
                                                <button
                                                    className="border-0 no-background"
                                                    title="Resume"
                                                    >
                                                    <File color="orange"/>
                                                </button>
                                                </a>
                                            </div>
                                        </div>
                                
                            </Row>
                        </CardBody>
                    </Card>
                    </Col>
                ))}
                </Row>
                ) : (
                    <div className='text-center'>No Data Found!</div>
                )
                    //    <Table bordered striped responsive className='my-1'>
                    //     <thead  className='table-dark text-center'>
                    //         <tr>
                    //         <th>Name</th>
                    //         <th>Skill</th>
                    //         <th>Date</th>
                    //         <th>Contact</th>
                    //         <th>Finanical aid</th>
                    //         <th>Cnic</th>
                    //         <th>Email</th>
                    //         <th>Resume</th>
                    //         </tr>
                    //     </thead>
                        
                    //     {preData && Object.values(preData).length > 0 ? (
                    //     preData.map((item, key) => (
                    //         <tbody>
                    //         <tr key={key}>
                    //             <td>{item.full_name}</td>
                    //             <td>{item.skill_type_title}</td>
                    //             <td>{item.date && item.date}</td>
                    //             <td>{item.contact_number}</td>
                    //             {item.financial_aid ? (
                    //                 item.financial_aid_reason ? (
                    //                     <td>{item.financial_aid_reason}</td>
                    //                 ) : (
                    //                     <td>Applied but reason not given</td>
                    //                 )
                    //             ) : (
                    //                 <td>N/A</td>
                    //             )}
                    //             <td>{item.cnic_no}</td>
                    //             <td>{item.email}</td>
                    //             <td>
                    //                 <a className="btn btn-primary btn-sm" target="_blank" href={`${item.kav_skills_resume}`}><File/></a>
                    //             </td>
                    //         </tr>
                    //     </tbody>    
                    //     ))
                        
                    //     ) : (
                    //         <div className='text-center'>No Data Found!</div>
                    //     )}
                        
                    //    </Table>
                
            
        ) : (
            <div className='text-center'><Spinner/></div>
        )
        }
        <Offcanvas direction={canvasViewPlacement} isOpen={canvasViewOpen} toggle={toggleViewCanvasEnd} >
          <OffcanvasHeader toggle={toggleViewCanvasEnd}></OffcanvasHeader>
          <OffcanvasBody className=''>
            <KavskillView data={data} />
          </OffcanvasBody>
        </Offcanvas>
    </Fragment>
   )
}
export default index