import React, { Fragment, useState } from 'react'
import { Button, Input, Label } from 'reactstrap'
import apiHelper from '../../../Helpers/ApiHelper'
const Disqualify = ({ data, CallBack }) => {
    const Api = apiHelper()
    const [reason_for_cancel, setReason] = useState('')
    const onDisqualify = async () => {
        if (reason_for_cancel !== '') {
            const formData = new FormData()
            formData['candidate_status'] = 0
            formData['reason_for_cancel'] = reason_for_cancel
            await Api.jsonPost(`/candidates/job/status/update/${data.uuid}/`, formData)
            .then(result => {
                if (result) {
                    if (result.status === 200) {
                        // const resultData = result.data
                        Api.Toast('success', result.message)
                        CallBack()
                    } else {
                        Api.Toast('error', result.message)
                    }
                } else {
                    Api.Toast('error', 'Server not responding!')
                }
            })
        } else {
            Api.Toast('error', 'Reason is required to cancel the interview!')
        }
        
    }
  return (
    <Fragment>
        <form>
            <div className='row'>
                <div className='col-lg-12'>
                    <Label className="form-label">
                        <p><b>Reason to Disqualify "{data.candidate_name && data.candidate_name }"</b></p>
                    </Label>
                    <Input 
                    name='reason'
                    id='reason'
                    type='textarea'
                    onChange={(e) => setReason(e.target.value)}
                    />
                </div>
                <div className='col-lg-6'></div>
                <div className='col-lg-6 mt-1'>
                    <Button className='btn btn-danger float-right' onClick={onDisqualify}>
                       Disqualify
                    </Button>
                </div>
                
            </div>
        </form>
    </Fragment>
  )
}

export default Disqualify