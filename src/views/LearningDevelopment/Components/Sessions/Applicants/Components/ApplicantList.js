import React, { Fragment, useState } from 'react'
import { Table, Button, Modal, ModalBody, ModalHeader } from 'reactstrap'
import DecisionForm from './DecisionForm'
import apiHelper from '../../../../../Helpers/ApiHelper'
const ApplicantList = ({ data, getApplicants }) => {
    const Api = apiHelper()
    const [desicionModal, setDesicionModal] = useState(false)
    const [selectedApplicant, setSelectedApplicantID] = useState('')
    const openDesicionModal = (id) => {
        setSelectedApplicantID(id)
        setDesicionModal(true)
        } 
    const CallBack = () => {
        setDesicionModal(false)
        getApplicants()
    }
    const MakeTrainee = async (id) => {
        if (id) {
            await Api.jsonPost(`/applicants/enrolled/as/trainee/${id}/`, {})
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
        }
    }
  return (
    <Fragment>
         <Table bordered striped responsive>
          <thead className='table-dark text-center'>
            <tr>
              <th scope="col" className="text-nowrap">
              Applicant Name
              </th>
              <th scope="col" className="text-nowrap">
              Course
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
                        <tr key={key}>
                            <td>{applicant.employee_name}</td>
                            <td>{applicant.course_title}</td>
                            <td>{applicant.status_title}</td>
                            <td>
                            <div className="row">
                                <div className='col-lg-6 border-right'>
                                    <Button className="btn btn-primary" onClick={() => openDesicionModal(applicant.id)}>
                                        Make Decision
                                    </Button>
                                </div>
                                <div className='col-lg-6'>
                                    <Button className="btn btn-primary" onClick={() => MakeTrainee(applicant.id)}>
                                        Make Trainee
                                    </Button>
                                </div>
                            </div>

                            </td>
                        </tr>
                    )) 
                ) : (
                    <tr>
                      <td colSpan={4}>No Applicant Found...</td>
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
    </Fragment>
  )
}

export default ApplicantList