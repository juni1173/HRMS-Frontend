import {React} from 'react'
import { Card, CardBody, CardTitle, Badge } from 'reactstrap'
const JDView = ({data}) => {
  
  return (
    <>
    <div className='row'>
        <div className='col-lg-6'>
            <div className='row'>
                <div className='col-lg-12'>
                <Card>
                <CardTitle className='text-center py-1'>
                    <strong>{data.title}</strong> 
                </CardTitle>
                <CardBody>
                <div className='row'>
                    <div className='col-lg-6'>
                    <Badge color='light-info'>
                            Position 
                    </Badge>
                    <span className="jd_position" style={{color: "black", fontWeight:"20px", marginLeft:"34px"}}>{data.position_title && data.position_title}</span>
                    </div>
                    <div className='col-lg-6'>
                        <Badge color='light-success'>
                            Department
                        </Badge>
                        <span style={{color: "black", fontWeight:"10px", marginLeft:"34px"}}>{data.department_title && data.department_title}</span>
                    </div>
                </div>
                <hr></hr>
                <div className="row">      
                    <div className="col-lg-6 text-center">
                        <Badge color='light-danger'>
                            Specification
                        </Badge> 
                        <table className="table mt-2 JD-Card-table">
                            <thead className='table-dark'>
                                <tr>
                                <th>Dimension</th>
                                <th>Essentail</th>
                                <th>Desirable</th>
                                </tr>
                            </thead>
                            <tbody>
                        {data.jd_specifications && (
                            Object.values(data.jd_specifications).length > 0 ? (
                                Object.values(data.jd_specifications).map((specification) => ( 
                                    <tr key={specification.id}>
                                        {specification.jd_dimension < 5 && (
                                            <>
                                                <td>{specification.jd_dimension}</td> 
                                                <td>{specification.desirable}</td>
                                                <td>{specification.desirable}</td> 
                                                </>
                                        )}
                                        
                                    </tr>
                                    ))
                            ) : (
                                <tr> 
                                    <td colSpan={3}> No Data </td>
                                </tr>
                            ))
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className="col-lg-6 text-center">
                        <Badge color='light-primary'>
                            Additional Information
                        </Badge>
                        <table className="table mt-2 JD-Card-table">
                            <thead className='table-dark'>
                                <tr>
                                <th>Dimension</th>
                                <th>Essentail</th>
                                <th>Desirable</th>
                                </tr>
                            </thead>
                            <tbody>
                        {data.jd_specifications && (
                            Object.values(data.jd_specifications).length > 0 ? (
                                Object.values(data.jd_specifications).map((specification) => ( 
                                    <tr key={specification.id}>
                                        {specification.jd_dimension > 4 && (
                                            <>
                                                <td>{specification.jd_dimension}</td> 
                                                <td>{specification.desirable}</td>
                                                <td>{specification.desirable}</td> 
                                                </>
                                        )}
                                        
                                    </tr>
                                    ))
                            ) : (
                                <tr> 
                                    <td colSpan={3}> No Data </td>
                                </tr>
                            ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                </CardBody>
                </Card>
                </div>
                
            </div>
            
        </div>
        <div className='col-lg-6'>
            <Card>
                <CardTitle className='text-center py-1'>
                    Job Description
                </CardTitle>
                <hr></hr>
                <CardBody>
                     <div dangerouslySetInnerHTML={{__html: `${data.main_responsibilities}`}} />
                </CardBody>
            </Card>
        </div>
    </div>
    </>
  )
}

export default JDView