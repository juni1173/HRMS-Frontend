import React, { Fragment, useEffect, useState } from 'react'
import { Edit2, Send, Trash, Trash2 } from 'react-feather'
import { Button, Row, Col, Input, Spinner } from 'reactstrap'
import apiHelper from '../../../Helpers/ApiHelper'
import Avatar from '@components/avatar'
import defaultAvatar from '@src/assets/images/avatars/user_blank.png'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const TaskComments = ({ task_id }) => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')
    const [hoveredIndex, setHoveredIndex] = useState(null)
    const MySwal = withReactContent(Swal)
    const ActionComments = async (type) => {
        const url = `/taskify/comment/${task_id}/`
        if (type === 'get') {
            await Api.get(url).then(result => {
                if (result) {
                    if (result.status === 200) {
                        const commentsData = result.data
                        if (commentsData.length > 0) {
                            setComments(commentsData)
                        }
                    } else {
                        Api.Toast('error', result.message)
                    }
                } else {
                    Api.Toast('error', 'Server error!')
                }
            })
        }
        if (type === 'post' && newComment !== '') {
            const formData = new FormData()
            formData['comment'] = newComment
            await Api.jsonPost(url, formData).then(result => {
                if (result) {
                    if (result.status === 200) {
                        const commentsData = result.data
                        if (commentsData.length > 0) {
                            setLoading(true)
                            setComments(commentsData)
                            setNewComment('')
                            setTimeout(() => {
                                setLoading(false)
                            }, 500)
                        }
                    } else {
                        Api.Toast('error', result.message)
                    }
                } else {
                    Api.Toast('error', 'Server error!')
                }
            })
        }
        
      }
      useEffect(() => {
        ActionComments('get')
      }, [setComments])
      const commentMouseEnter = (index) => {
        setHoveredIndex(index)
    }

    const commentMouseLeave = () => {
        setHoveredIndex(null)
    }
    const deleteComment = (id) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "Do you want to delete the comment!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Delete it!',
            customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-danger ms-1'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.value) {
              Api.deleteData(`/taskify/comment/details/${id}/`, {method: 'DELETE'}).then((result) => {
                    if (result && result.status === 200) {
                        MySwal.fire({
                            icon: 'success',
                            title: 'Comment Deleted!',
                            text: 'Comment is deleted.',
                            customClass: {
                            confirmButton: 'btn btn-success'
                            }
                        }).then(function (result) {
                            if (result.isConfirmed) {
                                ActionComments('get')
                            }
                        })
                     } else {
                        MySwal.fire({
                            icon: 'error',
                            title: 'Comment is not Deleted!',
                            text: 'Some server side error occured!.',
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
        <Row>
            <Col md="12"><h5>Comments</h5></Col>
            <Col md={1} className="text-center">
                <Avatar img={Api.user ? Api.user.profile_image : defaultAvatar} />
            </Col>
            <Col md="8">
                <Input 
                    type='textarea'
                    aria-rowspan={2}
                    name="new-comment"
                    placeholder="Enter new comment!"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
            </Col>
            <Col md="3">
                <Button className='btn btn-primary btn-sm' onClick={() => ActionComments('post')}><Send color='white'/></Button>
            </Col>
            <Col md="12" className='mt-2'>
                <div className='commentBox'>
                    {!loading ? (
                    Object.values(comments).length > 0 ? (
                            (comments).map((comment, key) => (
                            <Row key={key} onMouseEnter={() => commentMouseEnter(key)} onMouseLeave={commentMouseLeave}>
                            <Col md={1} className="text-center">
                            <Avatar img={comment.profile_image ? comment.profile_image : defaultAvatar} />
                            </Col>
                            <Col md={10}>
                                <h6>{comment.created_by_name}</h6>
                                <p>{comment.comment}</p>
                                <span style={{color: '#808080b5'}}>{Api.formatDateDifference(comment.updated_at)}</span>
                                <hr></hr>
                            </Col>
                            {hoveredIndex === key && (
                                <Col md={1} className='d-flex'>
                                    {/* <Edit2 color='orange' size={16} className="border-right"/> */}
                                    <Trash2 color='red' size={16} onClick={() => deleteComment(comment.id)}/>
                                </Col>
                            )}
                            
                            
                        </Row>
                        )
                    )
                    ) : (
                        <p>No comments found!</p>
                    )) : <div className='text-center'><Spinner color='darkblue' type='grow'/></div>}
                </div>
            </Col>
            
        </Row>
    </Fragment>
  )
}

export default TaskComments