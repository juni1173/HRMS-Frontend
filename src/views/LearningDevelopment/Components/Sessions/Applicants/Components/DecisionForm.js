import { Fragment, useState } from 'react'
import apiHelper from '../../../../../Helpers/ApiHelper'
import Select from 'react-select'
import { Label, Input, Spinner, Button } from 'reactstrap'
const DecisionForm = ({ applicant, CallBack }) => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [decision_status, set_decision_status] = useState('')
    const [decision_reason, set_decision_reason] = useState('')
    const desicion_choices = [
        {value: 1, label: 'Approved'},
        {value: 2, label: 'Rejected'},
        {value: 3, label: 'Pending'}
    ]
    const SubmitDecision = async () => {
        if (decision_status !== '' && Api.user_id) {
            const formData = new FormData()
            formData['decision_status'] = decision_status
            formData['decision_by'] = Api.user_id
            if (decision_reason !== '') formData['decision_reason'] = decision_reason
            await Api.jsonPatch(`/applicants/get/approval/${applicant}/`, formData)
            .then(result => {
                if (result) {
                    if (result.status === 200) {
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
            Api.Toast('error', 'Please select your desicion!')
        }
        setLoading(true)
            
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }
  return (
    <Fragment>
        {!loading ? (
            <div className='row'>
                <div className='col-md-6'>
                    <Label>
                        Select Desicion
                    </Label>
                    <Select 
                        type="text"
                        options={desicion_choices}
                        onChange={e => set_decision_status(e.value)}
                    />
                </div>
                <div className='col-md-6'></div>
                <div className='col-md-6'>
                    <Label>
                        Reason
                    </Label>
                    <Input 
                        type='textarea'
                        placeholder='Reason'
                        name='reason'
                        onChange={e => set_decision_reason(e.target.value)}
                    />

                </div>
                <div className='col-md-6'></div>
                <div className='col-md-4 pt-2'>
                    <Button className='btn btn-success' onClick={SubmitDecision}>
                            Submit
                    </Button>
                </div>
            </div>
        ) : (
            <div className="text-center"><Spinner/></div>
        )}
        
    </Fragment>
  )
}

export default DecisionForm