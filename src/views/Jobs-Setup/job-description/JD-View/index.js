import {React} from 'react'
import {Table } from 'reactstrap'
const JDView = ({data}) => {
  
  return (
    <>
    <div className='row'>
        <div className='col-lg-12 text-center'>
            <h2><strong>{data.title ? data.title : 'N/A'}</strong> </h2>
        </div>
        <div className='col-lg-12 bg-blue my-1 text-center'>
            <h4 color='white'>Job Description Profile</h4>
        </div>
        <div className='col-lg-6'>
            <p className='label'>Job Description Title</p>
            <p><strong>{data.title ? data.title : 'N/A'}</strong></p>
        </div>
        <div className='col-lg-6'>
            <p className='label'>Job Description Code</p>
            <p><strong>{data.code ? data.code : 'N/A'}</strong></p>
        </div>
        <div className='col-lg-6'>
            <p className='label'>Department</p>
            <p><strong>{data.department_title ? data.department_title : 'N/A'}</strong></p>
        </div>
        <div className='col-lg-6'>
            <p className='label'>Position</p>
            <p><strong>{data.position_title ? data.position_title : 'N/A'}</strong></p>
        </div>
        <div className='col-lg-6'>
            <p className='label'>Project</p>
            <p><strong>{data.project ? data.project : 'N/A'}</strong></p>
        </div>
        <div className='col-lg-6'>
            <p className='label'>Status</p>
            <p><strong>{data.status ? data.status : 'N/A'}</strong></p>
        </div>
        <div className='col-lg-6'>
            <p className='label'>Approved on</p>
            <p><strong>{data.approved_on ? data.approved_on : 'N/A'}</strong></p>
        </div>
        <div className='col-lg-6'>
            <p className='label'>Last Revised</p>
            <p><strong>{data.last_revised ? data.last_revised : 'N/A'}</strong></p>
        </div>
        <div className='col-lg-12 bg-blue my-1 text-center'>
            <h4 color='white'>Main Responsibilities</h4>
        </div>
        <div className='col-lg-12'>
            <div dangerouslySetInnerHTML={{__html: `${data.main_responsibilities}`}} />
        </div>
        <div className='col-lg-12 bg-blue my-1 text-center'>
            <h4 color='white'>Job Specifications</h4>
        </div>
        <div className='col-lg-12'>
            <Table>
                <thead className='table-dark '>
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
                        <tr key={specification.id} className='JD-Card-table'>
                            {specification.jd_dimension < 5 && (
                                <>
                                    <td>{specification.jd_dimension_title}</td> 
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
            </Table>
        </div>
        <div className='col-lg-12 bg-blue my-1 text-center'>
            <h4 color='white'>Additional Info</h4>
        </div>
        <div className='col-lg-12'>
            <Table>
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
                                <tr key={specification.id} className='JD-Card-table'>
                                    {specification.jd_dimension > 4 && (
                                        <>
                                            <td>{specification.jd_dimension_title}</td> 
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
            </Table>
        </div>
    </div>
  
    </>
  )
}

export default JDView