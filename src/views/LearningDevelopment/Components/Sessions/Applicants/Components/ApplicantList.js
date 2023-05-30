import React, { Fragment, useState } from 'react'
import { Table, Button, Modal, ModalBody, ModalHeader } from 'reactstrap'
import DecisionForm from './DecisionForm'
import apiHelper from '../../../../../Helpers/ApiHelper'
import { Mail } from 'react-feather'
import CustomEmail from '../../CustomEmail/index'
const ApplicantList = ({ data, getApplicants, Session_id }) => {
    const Api = apiHelper()
    const [desicionModal, setDesicionModal] = useState(false)
    const [emailModal, setEmailModal] = useState(false)
    const [selectedApplicant, setSelectedApplicantID] = useState('')
    const [checkedItems, setCheckedItems] = useState([])

    const handleCheck = (event) => {
      const { id } = event.target
      const isChecked = event.target.checked
  
      if (isChecked) {
        setCheckedItems([...checkedItems, id])
      } else {
        setCheckedItems(checkedItems.filter((item) => item !== id))
      }
    }
    const openDesicionModal = (id) => {
        setSelectedApplicantID(id)
        setDesicionModal(true)
        } 
    const openEmailModal = (id) => {
        setSelectedApplicantID(id)
        setEmailModal(true)
        } 
    const CallBack = () => {
        setDesicionModal(false)
        getApplicants()
    }
    // const MakeTrainee = async (id) => {
    //     if (id) {
    //         await Api.jsonPost(`/applicants/enrolled/as/trainee/${id}/`, {})
    //         .then(result => {
    //             if (result) {
    //                 if (result.status === 200) {
    //                     Api.Toast('success', result.message)
    //                     getApplicants()
    //                 } else {
    //                     Api.Toast('error', result.message)
    //                 }
    //             } else {
    //                 Api.Toast('error', 'Server not responding!')
    //             }
    //         })
    //     }
    // }
    const multipleMakeTrainee = async () => {
        // console.warn(checkedItems)
        if (checkedItems.length > 0) {
            const employee_arr = []
            for (let i = 0; i < checkedItems.length; i++) {
                employee_arr.push({course_applicant: parseInt(checkedItems[i])})
            }
              
                await Api.jsonPost(`/applicants/multiple/trainees/${Session_id}/`, employee_arr)
                .then(result => {
                    if (result) {
                        if (result.status === 200) {
                        Api.Toast('success', result.message)
                        getApplicants()
                        } else {
                            Api.Toast('error', result.message)
                        }
                    } else {
                        Api.Toast('error', 'Server not responding!')
                    }
                })
        
        } else {
            Api.Toast('error', 'Please select an employee to add!')
        }
    }
  return (
    <Fragment>
        {checkedItems.length > 0 && (
            <Button className='btn btn-primary mb-1' onClick={multipleMakeTrainee}>
                Make Trainee
            </Button>
        )}
        
         <Table bordered striped responsive>
          <thead className='table-dark text-center'>
            <tr>
                <th scope="col" className="text-nowrap">
                    Select
                </th>
              <th scope="col" className="text-nowrap">
              Applicant Name
              </th>
              <th scope="col" className="text-nowrap">
              Course
              </th>
              <th scope="col" className="text-nowrap">
              Email
              </th>
              <th scope="col" className="text-nowrap">
              Status
              </th>

              <th scope="col" className="text-nowrap">
              Decision
              </th>
            </tr>
          </thead>
          
          <tbody className='text-center'>
                {data.length > 0 ? (
                    data.map((applicant, key) => (
                        !applicant.is_trainee && (
                            <tr key={key}>
                            <td>
                                {(applicant.status === 3 || applicant.status === 5) ? (
                                    
                                    <input className='form-check-primary' type="checkbox" id={applicant.id} onChange={handleCheck} />
                                    
                                ) : (
                                    <input className='form-check-primary' type="checkbox" id={applicant.id} onChange={handleCheck} disabled/>
                                )}
                                
                            </td>
                            <td>{applicant.employee_name}</td>
                            <td>{applicant.course_title}</td>
                            <td>
                            <div className="row">
                                <div className='col-lg-12'>
                                    <Button className="btn btn-primary" onClick={() => openEmailModal(applicant.id)}>
                                        <Mail />
                                    </Button>
                                </div>
                            </div>
                            </td>
                            <td>{applicant.status_title}</td>
                            <td>
                            <div className="row">
                                <div className='col-lg-12'>
                                    <Button className="btn btn-primary" onClick={() => openDesicionModal(applicant.id)}>
                                        Make Decision
                                    </Button>
                                </div>
                                {/* <div className='col-lg-6'>
                                    <Button className="btn btn-primary" onClick={() => MakeTrainee(applicant.id)}>
                                        Make Trainee
                                    </Button>
                                </div> */}
                            </div>

                            </td>
                        </tr>
                        )
                       
                    )) 
                ) : (
                    <tr>
                      <td colSpan={5}>No Applicant Found...</td>
                  </tr>
                )}
            </tbody>
            </Table>
            <Modal isOpen={desicionModal} toggle={() => setDesicionModal(!desicionModal)} className='modal-dialog-centered modal-lg'>
                <ModalHeader className='bg-transparent' toggle={() => setDesicionModal(!desicionModal)}></ModalHeader>
                <ModalBody className='px-sm-5 mx-50 pb-5'>
                    <DecisionForm applicant={selectedApplicant} CallBack={CallBack}/>
                </ModalBody>
            </Modal>
            <Modal isOpen={emailModal} toggle={() => setEmailModal(!emailModal)} className='modal-dialog-centered modal-lg'>
                <ModalHeader className='bg-transparent' toggle={() => setEmailModal(!emailModal)}></ModalHeader>
                <ModalBody className='px-sm-5 mx-50 pb-5'>
                    <CustomEmail applicant_id={selectedApplicant} />
                </ModalBody>
            </Modal>
    </Fragment>
  )
}

export default ApplicantList