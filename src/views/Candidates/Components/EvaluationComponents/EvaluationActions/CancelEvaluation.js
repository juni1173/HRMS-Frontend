import React, { Fragment, useState } from 'react'
import { Button, Input, Label } from 'reactstrap'
import apiHelper from '../../../../Helpers/ApiHelper'
const CancelEvaluation = ({ uuid, evaluationID, CallBack }) => {
    const Api = apiHelper()
    const [reason_for_cancel, setReason] = useState('')
    const onCancelEvaluation = async () => {
        if (reason_for_cancel !== '') {
            const formData = new FormData()
            formData['reason_for_cancel'] = reason_for_cancel
            await Api.jsonPatch(`/evaluations/candidate/job/cancel/${uuid}/${evaluationID}/`, formData)
            .then(result => {
                if (result) {
                    if (result.status === 200) {
                        // const resultData = result.data
                        Api.Toast('error', result.message)
                        CallBack()
                    } else {
                        Api.Toast('error', result.message)
                    }
                } else {
                    Api.Toast('error', 'Server not responding!')
                }
            })
        } else {
            Api.Toast('error', 'Reason is required to cancel the evaluation!')
        }
        
    }
  return (
    <Fragment>
        <form>
            <div className='row'>
                <div className='col-lg-8'>
                    <Label className="form-label">
                        <p><b>Reason for cancel</b></p>
                    </Label>
                    <Input 
                    name='reason'
                    id='reason'
                    type='textarea'
                    onChange={(e) => setReason(e.target.value)}
                    />
                </div>
                <div className='col-lg-4'></div>
                <div className='col-lg-4 mt-1'>
                    <Button className='btn btn-danger' onClick={onCancelEvaluation}>
                        Cancel Evaluation
                    </Button>
                </div>
                
            </div>
        </form>
    </Fragment>
  )
}

export default CancelEvaluation