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
                    <p className='label'>Bank: &nbsp;  &nbsp;<strong>{data.bank_name ? data.bank_name : "N/A"}</strong></p>
                    <p className='label'>Account No : &nbsp;  &nbsp;<strong>{data.account_no ? data.account_no : "N/A"}</strong></p>
                    <p className='label'>Branch Name: &nbsp;  &nbsp;<strong>{data.branch_name ? data.branch_name : "N/A" }</strong></p>
                    
                </Col>
                <Col md="6" className="">
                    <p className='label'>Account Title: &nbsp;  &nbsp;<strong>{data.account_title ? data.account_title : "N/A"}</strong></p>
                    <p className='label'>IBAN No: &nbsp;  &nbsp;<strong>{data.iban ? data.iban : "N/A"}</strong></p>
                </Col>
            </Row>
        ) : (
            <p>No Data Found</p>
        )
  )
}

export default BankDetailView