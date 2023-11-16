import React, { Fragment } from 'react'
import { Table } from 'reactstrap'
import apiHelper from '../../../../Helpers/ApiHelper'
const ReasonsTable = ({ reasonsData }) => {
    
    const Api = apiHelper()
  return (
    <Fragment>
        <Table bordered striped responsive className='my-1'>
                                <thead className='table-dark text-center'>
                                <tr>
                                    <th scope="col" className="text-nowrap">
                                    Status
                                    </th>
                                    <th scope="col" className="text-nowrap">
                                    Updated At
                                    </th>
                                    <th scope="col" className="text-nowrap">
                                    Decision Reason
                                    </th>
                                    
                                </tr>
                                </thead>
                                
                                <tbody className='text-center'>
                                    {reasonsData && reasonsData.length > 0 ? (
                                         Object.values(reasonsData).map((item, key) => (
                                            <tr key={key}>
                                              <td>{item.certification_status_title ? item.certification_status_title : 'N/A'}</td>
                                              <td><span>{Api.formatDate(item.updated_at)}      {Api.formatTime(item.updated_at)}</span></td>
                                              <td>{item.decision_reason ? item.decision_reason : ' N/A'}</td>
                                              </tr>
                                              )
                                          )
                                    ) : (
                                        <tr>
                                            <td colSpan={3}>No data found</td>
                                        </tr>
                                    )
                                    }
                                
                                </tbody>
                                
        </Table>
    </Fragment>
  )
}

export default ReasonsTable