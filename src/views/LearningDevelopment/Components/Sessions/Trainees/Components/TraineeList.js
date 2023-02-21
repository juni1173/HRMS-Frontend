import React, { Fragment } from 'react'
import { Table } from 'reactstrap'
import { Trash2 } from 'react-feather'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import apiHelper from '../../../../../Helpers/ApiHelper'

const TraineeList = ({ data, CallBack }) => {
    const Api = apiHelper()
    const MySwal = withReactContent(Swal)
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
                          <td colSpan={3}>No Trainee Found...</td>
                      </tr>
                    )}
                </tbody>
                </Table>
        </Fragment>
      )
    }
  
export default TraineeList