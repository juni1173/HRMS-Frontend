import { Fragment, useEffect, useState } from "react"
import { Spinner, Table, Row, Col} from "reactstrap"
import { Download, File } from "react-feather"
import apiHelper from "../../Helpers/ApiHelper"
import KavSkillsLogo from "../../../assets/images/logo/kavskills-logo.png"
import { CSVLink } from "react-csv"
// import KpiList from "./KpiList"
 
const index = () => {
    
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [preData, setPreData] = useState([])
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
                       <Table bordered striped responsive className='my-1'>
                        <thead  className='table-dark text-center'>
                            <tr>
                            <th>Name</th>
                            <th>Skill</th>
                            <th>Date</th>
                            <th>Contact</th>
                            <th>Finanical aid</th>
                            <th>Cnic</th>
                            <th>Email</th>
                            <th>Resume</th>
                            </tr>
                        </thead>
                        
                        {preData && Object.values(preData).length > 0 ? (
                        preData.map((item, key) => (
                            <tbody>
                            <tr key={key}>
                                <td>{item.full_name}</td>
                                <td>{item.skill_type_title}</td>
                                <td>{item.date && item.date}</td>
                                <td>{item.contact_number}</td>
                                {item.financial_aid ? (
                                    item.financial_aid_reason ? (
                                        <td>{item.financial_aid_reason}</td>
                                    ) : (
                                        <td>Applied but reason not given</td>
                                    )
                                ) : (
                                    <td>N/A</td>
                                )}
                                <td>{item.cnic_no}</td>
                                <td>{item.email}</td>
                                <td>
                                    <a className="btn btn-primary btn-sm" target="_blank" href={`${item.kav_skills_resume}`}><File/></a>
                                </td>
                            </tr>
                        </tbody>    
                        ))
                        
                        ) : (
                            <div className='text-center'>No Data Found!</div>
                        )}
                        
                       </Table>
                
            
        ) : (
            <div className='text-center'><Spinner/></div>
        )
        }
    </Fragment>
   )
}
export default index