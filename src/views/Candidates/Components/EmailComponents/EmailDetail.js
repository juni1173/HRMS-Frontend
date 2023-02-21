import { Fragment, useEffect, useState } from 'react'
import { Spinner, Table } from 'reactstrap'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import apiHelper from '../../../Helpers/ApiHelper'

const EmailDetail = ({ uuid }) => {
    const Api = apiHelper()
    const [EmailData, setEmailData] = useState([])
    const [loading, setLoading] = useState(false)
   
    const getEmailData = async () => {
        setLoading(true)
        await Api.get(`/email/templates/candidate/job/${uuid}/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    setEmailData(result.data)
                } else {
                    Api.Toast('error', result.message)
                }
            } else {
                Api.Toast('error', 'Server not responding')
            }
        })
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }
    useEffect(() => {
        getEmailData()
    }, [])
  return (
    <Fragment>
                <Table bordered striped responsive>
                <thead className='table-dark text-center'>
                    <tr>
                        <th>Stage</th>
                        <th>Email Template</th>
                        <th>Date/Time</th>
                    </tr>
                </thead>
                <tbody>
            {!loading ? (                    
            Object.values(EmailData).length > 0 ? (
                EmailData.map((data, index) => (
                    <tr key={index}>
                        <td>{data.stage_title ? data.stage_title : 'N/A'}</td>
                        <td>{data.email_template_title ? data.email_template_title : 'N/A'}</td>
                        <td>{data.created_at ? data.created_at : 'N/A'}</td>
                    </tr>
                )
            )
                
            ) : (
                
                <tr className="text-center">
                <td colSpan={6}>No Email Data</td>
            </tr>
            )
        ) : (
            <tr className="text-center">
                <td colSpan={6}><Spinner/></td>
            </tr>
        )}
            </tbody>
        </Table>
    </Fragment>
  )
}

export default EmailDetail