import {useState, useEffect} from "react" 
import {Label, Row, Col, Input, Form, Spinner, Badge } from "reactstrap" 
import Select from 'react-select'
import apiHelper from "../../Helpers/ApiHelper"
const UpdateEmpBank = ({empData, uuid, CallBack}) => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [bankList] = useState([])
    const [bankDetail, setBankDetail] = useState({
        bankName : '',
        accountNo : empData.account_no ? empData.account_no : '',
        branchName : empData.branch_name ? empData.branch_name : '',
        accountTitle : empData.account_title ? empData.account_title : '',
        ibanNo : empData.iban ? empData.iban : ''
         
   })
    const GetBanks = async () => {
       await Api.get(`/banks/`, { headers: {Authorization: Api.token} }).then(result => {
        if (bankList.length > 0) {
            bankList.splice(0, bankList.length)
        }
        for (let i = 0; i < result.length; i++) {
            bankList.push({value: result[i].id, label: result[i].name})
        }
       })
       bankDetail.bankName = bankList.find(pre => pre.value === empData.bank) ? bankList.find(pre => pre.value === empData.bank) : ''
       return bankList
    } 
   const onChangeBankDetailHandler = (InputName, InputType, e) => {
        
        let InputValue
        if (InputType === 'input') {
        
        InputValue = e.target.value
        } else if (InputType === 'select') {
        
        InputValue = e
        } else if (InputType === 'date') {
            let dateFomat = e.split('/')
            dateFomat = `${dateFomat[2]}-${dateFomat[1]}-${dateFomat[0]}`    
            InputValue = dateFomat
        } else if (InputType === 'file') {
            InputValue = e.target.files[0].name
        }
    
        setBankDetail(prevState => ({
        ...prevState,
        [InputName] : InputValue
        
        
        }))
    
    }

    const onSubmitHandler = (e) => {
        setLoading(true)
        e.preventDefault()
        if (bankDetail.bankName !== '' && bankDetail.accountNo !== '' && bankDetail.branchName !== ''
        && bankDetail.accountTitle !== '') {
            const formData = new FormData()
            formData['bank'] = bankDetail.bankName.value
            formData['branch_name'] = bankDetail.branchName
            formData['account_no'] = bankDetail.accountNo
            formData['account_title'] = bankDetail.accountTitle
            formData['iban'] = bankDetail.ibanNo
            Api.jsonPatch(`/employee/${uuid}/banks/details/${empData.id}/`, formData).then(result => {
                if (result) {
                    if (result.status === 200) {
                        CallBack()
                        Api.Toast('success', result.message)
                    } else {
                        Api.Toast('error', result.message)
                    }
                } else {
                    Api.Toast('error', 'Server Not Responding')
                }
            })
            
        } else {
            Api.Toast('error', 'All Fileds are required')
        }
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }
    useEffect(() => {
        GetBanks()
    }, [])
  return (
    !loading ? (      
            <>
                <Form >
                    <Row>
                        <Col md="4" className="mb-1">
                            <Label className="form-label">
                            Bank Name <Badge color='light-danger'>*</Badge>
                            </Label>
                            <Select
                                type="text"
                                placeholder="bank name"
                                name="bankName"
                                options={bankList}
                                defaultValue={bankList.find(pre => pre.value === empData.bank) ? bankList.find(pre => pre.value === empData.bank) : ''}
                                onChange={ (e) => { onChangeBankDetailHandler('bankName', 'select', e) }}
                                />
                        </Col>
                        <Col md="4" className="mb-1">
                            <Label className="form-label">
                        Account No <Badge color='light-danger'>*</Badge>
                            </Label>
                            <Input
                                type="text"
                                placeholder="account name"
                                name="accountNo"
                                defaultValue={bankDetail.accountNo}
                                onChange={ (e) => { onChangeBankDetailHandler('accountNo', 'input', e) }}
                                />
                        </Col>
                        <Col md="4" className="mb-1">
                            <Label className="form-label">
                            Branch Name <Badge color='light-danger'>*</Badge>
                            </Label>
                            <Input
                                type="text"
                                placeholder="branch name"
                                name="branchName"
                                defaultValue={bankDetail.branchName}
                                onChange={ (e) => { onChangeBankDetailHandler('branchName', 'input', e) }}
                                />
                        </Col>
                    </Row>
                    <Row>
                        <Col md="4" className="mb-1">
                            <Label className="form-label">
                            Account Title <Badge color='light-danger'>*</Badge>
                            </Label>
                            <Input
                                type="text"
                                placeholder="account title"
                                name="accountTitle"
                                defaultValue={bankDetail.accountTitle}
                                onChange={ (e) => { onChangeBankDetailHandler('accountTitle', 'input', e) }}
                                />
                        </Col>
                        <Col md="6" className="mb-1">
                            <Label className="form-label">
                            IBAN No <Badge color='light-danger'>*</Badge>
                            </Label>
                            <Input
                                type="text"
                                placeholder="Iban No"
                                name="ibanNo"
                                defaultValue={bankDetail.ibanNo}
                                onChange={ (e) => { onChangeBankDetailHandler('ibanNo', 'input', e) }}
                                />
                        </Col>
                        
                    </Row>
                    <Row>
                        <Col md="8" className="mb-1">

                        </Col>
                        <Col md="4" className="mb-1">
                        <button className="btn-next float-right btn btn-warning"  onClick={(e) => onSubmitHandler(e)}><span className="align-middle d-sm-inline-block d-none">Update</span></button>
                        </Col>
                    </Row>
                </Form>
            </>
    ) : (
        <div className="text-center"><Spinner /></div>
    )
  )
}

export default UpdateEmpBank