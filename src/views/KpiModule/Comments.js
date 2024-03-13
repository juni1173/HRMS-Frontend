import React, { Fragment, useState, useEffect } from 'react'
import apiHelper from '../Helpers/ApiHelper'
import defaultAvatar from '@src/assets/images/avatars/user_blank.png'
import { Input, Button, Row, Spinner, Col, Badge } from 'reactstrap'
import { Save } from 'react-feather'
const Comments = ({ data, by, callBack }) => {
    console.warn(data)
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [comment, setComment] = useState('')
    const [commentData, setCommentData] = useState([])
    const getCommentData = async () => {
        setLoading(true)
        await Api.get(`/kpis/get/comments/${data.id}/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    const resData = result.data
                   setCommentData(resData)
                    
                } else {
                    Api.Toast('error', result.message)
                }
            } else (
             Api.Toast('error', 'Server not responding!')   
            )
        })  
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }
    const submitForm = async () => {
        if (comment !== '') {
            const formData = new FormData()
            formData['comments'] = comment
            await Api.jsonPost(`/kpis/add/comments/${data.id}/`, formData).then(result => {
                if (result) {
                    if (result.status === 200) {
                        setLoading(true)
                        setCommentData(result.data)
                        setTimeout(() => {
                            setLoading(false)
                        }, 500)
                    } else {
                        Api.Toast('error', result.message)
                    }
                } else {
                    Api.Toast('error', result.message)
                }
            })
        } else {
            Api.Toast('error', 'Comment cannot be empty!')
        }
    }
    const KpiHRApprove = async (id) => {
        // return false
        if (id) {  
            setLoading(true)
                await Api.jsonPost(`/kpis/hr/approval/list/`, {kpis_array: [id]})
                .then(result => {
                    if (result) {
                        if (result.status === 200) {
                        Api.Toast('success', result.message)
                        callBack()
                        } else {
                            Api.Toast('error', result.message)
                        }
                    } else {
                        Api.Toast('error', 'Server not responding!')
                    }
                })
        setTimeout(() => {
            setLoading(false)
        }, 500)
        } 
    }
    const KpiTLApprove = async () => {
        // return false
        if (id) {  
            setLoading(true)
                await Api.jsonPost(`/kpis/team/lead/approval/list/`, {kpis_array: [id]})
                .then(result => {
                    if (result) {
                        if (result.status === 200) {
                        Api.Toast('success', result.message)
                        } else {
                            Api.Toast('error', result.message)
                        }
                    } else {
                        Api.Toast('error', 'Server not responding!')
                    }
                })
        setTimeout(() => {
            setLoading(false)
        }, 500)
        }
    }
    useEffect(() => {
        getCommentData()
       return false
        }, [setCommentData])
  return (
    <Fragment>
        {data && (
            <>
            <Row>
            <Col md={12} className="mb-2">
                <h3>{data.title && data.title}</h3>
            </Col>
            <Col md={4}>
                <b>Evaluator</b><br></br> <Badge>{data.evaluator_name && data.evaluator_name}</Badge>
            </Col>
            <Col md={4}>
                <b>Type</b><br></br> <Badge>{data.ep_type_title && data.ep_type_title}</Badge>
            </Col>
            
            {(by && by === 'tl') && (
                (data.kpis_status_level === 2) && (
                    <Col md={4}>
                        <Button className='btn btn-warning mb-1' onClick={() => KpiTLApprove(data.id)}>
                            Team Lead Approval
                        </Button>
                    </Col>
                )
            )}
            {(by && by === 'hr') && (
                (data.kpis_status_level === 3 || data.kpis_status_level === 11) && (
                <Col md={4}>
                    <Button className='btn btn-warning mb-1' onClick={() => KpiHRApprove(data.id)}>
                        HR Approval
                    </Button>
                </Col>
                )
            )}
            <Col md={4}>
                <b>Status</b> <br></br><Badge>{data.kpis_status_title && data.kpis_status_title}</Badge>
            </Col>
            <Col md={4}>
            <br></br>
                <b>Scale Group</b> <br></br><Badge>{data.scale_group_title && data.scale_group_title}</Badge>
            </Col>
            
        </Row>
        <Input 
        className='mt-2'
        type="textarea"
        name="comment"
        onChange={ (e) => setComment(e.target.value)}
        placeholder="Write your comment!"  />
        <Button color="primary" className="btn-next mt-2" onClick={submitForm}>
            <span className="align-middle d-sm-inline-block">
            Save
            </span>
            <Save
            size={14}
            className="align-middle ms-sm-25 ms-0"
            ></Save>
        </Button>
        {!loading ? (
            <Row className='mt-2'>
            <Col md={12}>
                <h5>Comments</h5>
                <div className='commentBox'>
                    {commentData && Object.values(commentData).length > 0 ? (
                            (commentData).map((comment, key) => (
                            <Row key={key} className='mt-2'>
                            <Col md={2} className="text-center">

                                <img src={comment.image ? comment.image : defaultAvatar} width="50" height={50} />
                            </Col>
                            <Col md={10}>
                                <h6>{comment.employee_name ? comment.employee_name : 'N/A'}</h6>
                                <span>{Api.formatDate(comment.created_at)}      {Api.formatTime(comment.created_at)}</span>
                                <p><b>{comment.comments ? comment.comments : 'N/A'}</b></p>
                            </Col>
                        </Row>
                        )
                    )
                    ) : (
                        <p>No comments found!</p>
                    )}
                </div>
            </Col>
        </Row>
        ) : (
            <div className='text-center'><Spinner /></div>
        )}
        </>
        )}
        
    </Fragment>
  )
}

export default Comments