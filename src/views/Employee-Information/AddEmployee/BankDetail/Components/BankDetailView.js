import {React, useEffect, useState} from 'react'
import {Label, Row, Col} from "reactstrap" 
const BankDetailView = ({data}) => {
    const [bankList] = useState([])
    const GetBanks = async () => {
        await Api.get(`/banks/`, { headers: {Authorization: Api.token} }).then(result => {
         if (bankList.length > 0) {
             bankList.splice(0, bankList.length)
         }
         for (let i = 0; i < result.length; i++) {
             bankList.push({value: result[i].id, label: result[i].name})
         }
        })
        return bankList
     } 
     useEffect(() => {
        GetBanks()
    }, [])
  return (
        Object.values(data).length > 0 ? (
            <Row>
                <Col md="6" className="mb-1">
                    <Label className="form-label"  >
                       <strong>Bank </strong>   
                    </Label>
                    <p className="form-control">{data.bank_name ? data.bank_name : "N/A" }</p>
                    <Label className="form-label mt-2"  >
                    Account No 
                    </Label>
                    <p className="form-control">{data.account_no ? data.account_no : "N/A" }</p>
                    <Label className="form-label mt-2"  >
                        Branch Name
                    </Label>
                    <p className="form-control">{data.branch_name ? data.branch_name : "N/A" }</p>
                    
                </Col>
                <Col md="6" className="">
                    <Label className="form-label"  >
                        Account Title
                    </Label>
                    <p className="form-control">{data.account_title ? data.account_title : "N/A" }</p>
                    <Label className="form-label mt-2"  >
                        IBAN No
                    </Label>
                    <p className="form-control">{data.iban ? data.iban : "N/A" }</p>
                </Col>
            </Row>
        ) : (
            <p>No Data Found</p>
        )
  )
}

export default BankDetailView