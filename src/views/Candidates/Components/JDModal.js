import React from 'react'
const JDModal = ({ data }) => {
  return (
    <>
        <div className='row'>
        <div className='col-lg-12 text-center'>
            <h2><strong>{data.title ? data.title : 'N/A'}</strong> </h2>
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
            <ul>
                {data.jd_specifications && (
                Object.values(data.jd_specifications).length > 0 ? (
                    Object.values(data.jd_specifications).map((specification, key) => ( 
                       specification.jd_dimension < 5 && (
                                <>
                                <li key={key}>
                                    <h3>{specification.jd_dimension_title}</h3> 
                                   
                                        <p>{specification.essential}</p>
                                  
                                        <p>{specification.desirable}</p> 
                                   
                                </li>
                                </>
                            )
                        ))
                ) : (
                        <li> No Data </li>
                    
                ))}
            </ul>
            {/* <Table>
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
                                    <td>{specification.essential}</td>
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
            </Table> */}
        </div>
        <div className='col-lg-12 bg-blue my-1 text-center'>
            <h4 color='white'>Additional Info</h4>
        </div>
        <div className='col-lg-12'>
        <ul>
                {data.jd_specifications && (
                Object.values(data.jd_specifications).length > 0 ? (
                    Object.values(data.jd_specifications).map((specification) => ( 
                       specification.jd_dimension > 4 && (
                                <>
                                <li>
                                    <h3>{specification.jd_dimension_title}</h3> 
                                   
                                        <p>{specification.essential}</p>
                                    
                                        <p>{specification.desirable}</p> 
                                       
                                </li>
                                </>
                            )
                        ))
                ) : (
                        <li> No Data </li>
                    
                ))}
            </ul>
            {/* <Table>
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
                                            <td>{specification.essential}</td>
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
            </Table> */}
        </div>
    </div>
    </>
  )
}

export default JDModal