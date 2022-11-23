import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
// import { toast, Slide } from 'react-toastify'
import apiHelper from "./ApiHelper"
const CandidateHelper = () => {
    const Api = apiHelper()
    const MySwal = withReactContent(Swal)
    const onStageUpdate = async (uuid, stage_id) => {

        const formData = new FormData()
        formData['uuid'] = uuid
        formData['stage'] = stage_id
        const url = `${process.env.REACT_APP_API_URL}/candidates/stage/update/`
            MySwal.fire({
                title: 'Are you sure?',
                text: "Do you want to update the Stage!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, update it!',
                customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-danger ms-1'
                },
                buttonsStyling: false
            }).then(function (result) {
                if (result.value) {
                    fetch(url, {
                        method: "patch",
                        headers: {Authorization: Api.token },
                        body:JSON.stringify(formData)
                        })
                        .then((response) => response.json())
                        .then((result) => {
                            if (result.status === 200) {
                                Api.Toast('success', result.message)
                                MySwal.fire({
                                    icon: 'success',
                                    title: 'Stage Updated!',
                                    text: result.message,
                                    customClass: {
                                    confirmButton: 'btn btn-success'
                                    }
                                })
                                return true
                                } else {
                                    MySwal.fire({
                                        title: 'Error',
                                        text: result.message ? result.message : 'Something went wrong',
                                        icon: 'error',
                                        customClass: {
                                          confirmButton: 'btn btn-warning'
                                        }
                                      })
                                      return false
                                }
                        })
                } 
            })
        }
    return {
        onStageUpdate
    }
}
export default CandidateHelper