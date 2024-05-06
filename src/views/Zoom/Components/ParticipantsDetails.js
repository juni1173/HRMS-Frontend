import React, { Fragment } from 'react'
import { Table, Badge } from 'reactstrap'
const ParticipantsDetails = ({data}) => {
    console.warn(data)
  return (
    <Fragment>
        <h3>Employees Participants</h3>
        <Table responsive bordered striped>
                            <thead className='table-dark text-center'>
                                <tr>
                                    <th>Meeting#</th>
                                    <th>Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.values(data.hrms_users).length > 0 ? (
                                        data.hrms_users.slice().reverse().map(participant => (
                                            <tr key={participant.meeting_id}>
                                            <td>{participant.meeting_id}</td>
                                            <td className="text-center">
                                                    {participant.name} {participant.is_host && (
                                                        <>
                                                        | <Badge color='primary'>
                                                            host
                                                        </Badge>
                                                        </>
                                                    )}</td>
                                            </tr>
                                        ))                                  
                                        ) : (
                                            <tr>
                                                <td colSpan={2} className='text-center'> No Employee Participant Found!</td>
                                            </tr>
                                        )
                                
                                }
                            </tbody>
        </Table>
        <hr></hr>
        <h3>Other Participants</h3>
        <Table responsive bordered striped>
                            <thead className='table-dark text-center'>
                                <tr>
                                    <th>Meeting#</th>
                                    <th>Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.values(data.other_users).length > 0 ? (
                                        data.other_users.slice().reverse().map(participant => (
                                            <tr key={participant.meeting_id}>
                                            <td>{participant.meeting_id}</td>
                                            <td className="text-center">
                                                    {participant.name} {participant.is_host && (
                                                        <>
                                                        | <Badge color='primary'>
                                                            host
                                                        </Badge>
                                                        </>
                                                    )}
                                            </td>
                                            </tr>
                                        ))                                  
                                        ) : (
                                            <tr>
                                                <td colSpan={2} className='text-center'> No Other Participant Found!</td>
                                            </tr>
                                        )
                                
                                }
                            </tbody>
        </Table>
    </Fragment>
  )
}

export default ParticipantsDetails