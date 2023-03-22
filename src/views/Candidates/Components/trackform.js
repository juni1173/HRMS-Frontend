import { Fragment, useState } from "react"
import { Col, Button, Modal, ModalHeader, ModalBody } from 'reactstrap'
import {Clock} from "react-feather"
import InputMask from 'react-input-mask'
import {useParams} from "react-router-dom" 
import ApplySuccess from "./ApplySuccess"
import apiHelper from "../../Helpers/ApiHelper"
 
const trackForm = () => {
    const Api = apiHelper() 

    const [loading, setLoading] = useState(false)
    const [trackCnicError, setTrackCnicError] = useState('')
    const [trackCnic, setTrackCnic] = useState('')
    const [applySuccessData, setApplySuccessData] = useState([])
    const [successMsg, setSuccessMsg] = useState('')
    const [url_params] = useState(useParams())
    const [successModal, setSuccessModal] = useState(false)
    const checkCnic = (cnic, track = false) => {
    const getCnicNumberCount = cnic.replace(/[^0-9]/g, '')
        if (getCnicNumberCount.length !== 13) {
            if (!track) {
                setCnicError("Your Cnic Length must be 13")
            } else {
                setTrackCnicError("Your Cnic Length must be 13")
            }
            
            return false
        }
        return true
    }

    const onValidateCnic = (event, track) => {
        checkCnic(event.target.value, track)
    }

    const onChangeCnic = (event, track = false) => {
        
        if (!track) {
            setCnic(event.target.value)
            setCnicError("")
        } else {
            setTrackCnic(event.target.value)
            setTrackCnicError("")
        }
        
    }
    const submitTrack = () => {
        setLoading(true)
        const job_uuid = url_params.uuid
        if (trackCnic !== '') {
            const isValidCnic = checkCnic(trackCnic)
            if (!isValidCnic) {
                Api.Toast('error',   "Cnic is not valid")
                return
            }
            Api.get(`/assessments/candidate/check/job/post/${trackCnic}/${job_uuid}/`).then(result => {
                if (result) {
                    if (result.status === 200) {
                        setLoading(true)
                        setApplySuccessData(result.data)
                        setSuccessMsg(result.message)
                       setTimeout(() => {
                            setLoading(false)
                       }, 1000)
                       setSuccessModal(true)
                    } else {
                        Api.Toast('error', result.message)
                    }
                } else {
                    Api.Toast('error', 'Something Went Wrong')
                }
            })
            
            } else {
                Api.Toast('error', 'Something Went Wrong')
            } 
            setTimeout(() => {
                setLoading(false)
              }, 1000)  
        }
    
    return (
        <Fragment>
            <>
            <div className="row apply-head-row">
            <div className="col-lg-12 text-center">
                <h1 className="apply-heading">TRACK JOB APPLICATION</h1>
            </div>
            </div>
            <div className="row">
                <div className="col-lg-4">
                </div>
                <div className="col-lg-4 my-5 already-applied-form">
                    <Col md='12' className='mb-1'>
                        <label className='form-label'>
                        Track by ID card #:
                        </label>
                        <InputMask className="form-control"
                        mask="99999-9999999-9"  
                        id="cnic"
                        value={trackCnic}
                        name="track_cnic"
                        placeholder="cnic #"
                        onBlur={e => onValidateCnic(e, true)}
                        onChange={e => onChangeCnic(e, true)}
                        />
                            <p style={{fontSize:'10px', color:'red'}}>{trackCnicError ? trackCnicError : null}</p> 
                        </Col>
                        <div className="text-center">
                            {!loading && (
                                <Button color='primary' className='btn-next' onClick={submitTrack}>
                                <span className='align-middle d-sm-inline-block d-none'>Track</span>
                                <Clock size={14} className='align-middle ms-sm-25 ms-0'></Clock>
                            </Button>
                            )}
                            
                        </div>
                </div>
                <div className="col-lg-4">
                
                </div>
            </div>
            
            </>
            <Modal isOpen={successModal} toggle={() => setSuccessModal(!successModal)} className='modal-lg modal-dialog-centered'>
            <ModalHeader toggle={() => setSuccessModal(!successModal)}>Job Application Status</ModalHeader>
            <ModalBody>
                <ApplySuccess successData={applySuccessData} message={successMsg}/>
            </ModalBody>
            </Modal>
        </Fragment>
    )
}
export default trackForm