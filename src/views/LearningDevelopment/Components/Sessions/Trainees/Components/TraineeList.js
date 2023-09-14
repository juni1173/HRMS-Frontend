import React, { Fragment, useState } from 'react'
import { Table, Button, Modal, ModalBody, ModalHeader } from 'reactstrap'
import { Trash2, Mail } from 'react-feather'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import apiHelper from '../../../../../Helpers/ApiHelper'
import CustomEmail from '../../CustomEmail/index'

const TraineeList = ({ data, CallBack }) => {
    const Api = apiHelper()
    const MySwal = withReactContent(Swal)
    const [emailModal, setEmailModal] = useState(false)
    const [selectedApplicant, setSelectedApplicantID] = useState('')
    const openEmailModal = (id) => {
        setSelectedApplicantID(id)
        setEmailModal(true)
        } 
    const removeTrainee = (id) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "Do you want to remove the Trainee?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Remove it!',
            customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-danger ms-1'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.value) {
                Api.deleteData(`/applicants/trainee/data/${id}/`, {method: 'Delete'})
                .then((deleteResult) => {
                        if (deleteResult.status === 200) {
                            MySwal.fire({
                                icon: 'success',
                                title: 'Trainee Removed!',
                                text: 'Trainee removed successfully.',
                                customClass: {
                                confirmButton: 'btn btn-success'
                                }
                            }).then(function (result) {
                                if (result.isConfirmed) {
                                    CallBack()
                                } else {
                                    CallBack()   
                                }
                            })
                        } else {
                            MySwal.fire({
                                icon: 'error',
                                title: deleteResult.message ? deleteResult.message : 'Trainee can not be removed!',
                                text: 'Trainee does not removed.',
                                customClass: {
                                confirmButton: 'btn btn-danger'
                                }
                            })
                        }
                            
                    })
            } 
        })
    }
    return (
        <Fragment>
            <div className='text-center'>
                <h3>
                    Trainees
                </h3>
            </div>
             <Table bordered striped responsive>
              <thead className='table-dark text-center'>
                <tr>
                  <th scope="col" className="text-nowrap">
                  Applicant Name
                  </th>
                  <th scope="col" className="text-nowrap">
                  Course
                  </th>
                  <th>
                    Email
                  </th>

                  <th>
                    Status
                  </th>
                  <th>
                    Remove Trainee
                  </th>
                </tr>
              </thead>
              
              <tbody className='text-center'>
                    {data.length > 0 ? (
                        data.map((applicant, key) => (
                            <tr key={key}>
                                <td>{applicant.course_applicant_name}</td>
                                <td>{applicant.course_title}</td>
                                <td>
                                <div className="row">
                                <div className='col-lg-12'>
                                    <Button className="btn btn-primary" onClick={() => openEmailModal(applicant.course_applicant)}>
                                        <Mail />
                                    </Button>
                                    </div>
                                </div>
                                </td>
                                <td>{applicant.trainee_status ? applicant.trainee_status : 'N/A'}</td>
                                <td>
                                    <button
                                        className="border-0 no-background"
                                        title="Remove Trainee"
                                        onClick={() => removeTrainee(applicant.id)}
                                        >
                                        <Trash2 color="red"/>
                                    </button>
                                </td>
                            </tr>
                        )) 
                    ) : (
                        <tr>
                          <td colSpan={5}>No Trainee Found...</td>
                      </tr>
                    )}
                </tbody>
                </Table>
                <Modal isOpen={emailModal} toggle={() => setEmailModal(!emailModal)} className='modal-dialog-centered modal-lg'>
                <ModalHeader className='bg-transparent' toggle={() => setEmailModal(!emailModal)}></ModalHeader>
                <ModalBody className='px-sm-5 mx-50 pb-5'>
                    <CustomEmail applicant_id={selectedApplicant} />
                </ModalBody>
            </Modal>
        </Fragment>
      )
    }
  
export default TraineeList