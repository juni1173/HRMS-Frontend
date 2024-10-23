import React, { Fragment, useEffect, useState } from 'react'
import { Send, Trash2, Paperclip, XCircle, FileText } from 'react-feather'
import { Button, Row, Col, Input, Spinner, Card, CardBody, CardText, CardImg } from 'reactstrap'
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
    const [files, setFiles] = useState([])
    const [hoveredIndex, setHoveredIndex] = useState(null)
    const MySwal = withReactContent(Swal)

    const handleFileChange = (e) => {
        setFiles([...files, ...e.target.files])  // Allow adding multiple files
    }

    const handleRemoveFile = (index) => {
        const newFiles = files.filter((_, i) => i !== index)
        setFiles(newFiles)
    }

    const ActionComments = async (type) => {
        const url = `/taskify/comment/${task_id}/`
        if (type === 'get') {
            await Api.get(url).then(result => {
                if (result && result.status === 200) {
                    setComments(result.data)
                } else {
                    Api.Toast('error', result.message || 'Server error!')
                }
            })
        }
        if (type === 'post' && newComment !== '') {
            const formData = new FormData()
            formData.append('comment', newComment)
            files.forEach(file => {
                formData.append('attachments', file)
            })
            await Api.jsonPost(url, formData, false).then(result => {
                if (result && result.status === 200) {
                    setLoading(true)
                    setComments(result.data)
                    setNewComment('')
                    setFiles([])
                    setTimeout(() => {
                        setLoading(false)
                    }, 500)
                } else {
                    Api.Toast('error', result.message || 'Server error!')
                }
            })
        }
    }

    useEffect(() => {
        ActionComments('get')
    }, [])
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
    const handleImageClick = (url) => {
        window.open(url, '_blank')
    }
    const renderFilePreview = (file, index) => {
        return (
            <div key={index} className="file-preview position-relative">
                {file.type.startsWith('image/') ? (
                    <img src={URL.createObjectURL(file)} alt="preview" style={{ height: '50px', width: 'auto' }} />
                ) : (
                    <Paperclip size={20} className="mx-1" />
                )}
                <XCircle className="position-absolute" style={{ top: 0, right: 0, cursor: 'pointer' }} size={16} color="red" onClick={() => handleRemoveFile(index)} />
                <div className="file-name small text-center">{file.name}</div>
            </div>
        )
    }

    return (
        <Fragment>
            <Row>
                <Col md="12"><h5>Comments</h5></Col>
                <Col md={1} className="text-center">
                    <Avatar img={Api.user ? Api.user.profile_image : defaultAvatar} />
                </Col>
                <Col md="6" className="position-relative">
                    <Input
                        type='textarea'
                        name="new-comment"
                        placeholder="Enter new comment!"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <label className="position-absolute top-0 end-0 mt-2 me-2" style={{ cursor: 'pointer' }}>
                        <Paperclip size={24} />
                        <Input type='file' multiple onChange={handleFileChange} style={{ display: 'none' }} />
                    </label>
                </Col>
                <Col md="3">
                    <Button className='btn btn-primary btn-sm' onClick={() => ActionComments('post')}>
                        <Send color='white' />
                    </Button>
                </Col>
                <Col md="12" className='mt-1'>
                    {files.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '10px' }}>
                            {files.map((file, index) => renderFilePreview(file, index))}
                        </div>
                    )}
                </Col>
                <Col md="12" className='mt-2'>
                    <div className='commentBox'>
                        {!loading ? (
                            comments.length > 0 ? (
                                comments.map((comment, key) => (
                                    <Row key={key} onMouseEnter={() => commentMouseEnter(key)} onMouseLeave={() => commentMouseLeave(key)}>
                                        <Col md={1} className="text-center">
                                            <Avatar img={comment.profile_image ? comment.profile_image : defaultAvatar} />
                                        </Col>
                                        <Col md={10}>
                                            <h6>{comment.created_by_name}</h6>
                                            <p>{comment.comment}</p>
                                            {comment.attachments && comment.attachments.length > 0 ? (
                                        <Row>
                                            {comment.attachments.map(attachment => {
                                                const isImage = /\.(jpeg|jpg|gif|png|svg)$/i.test(attachment.attachment)
                                                return (
                                                    <Col md={4} key={attachment.id} className="mb-2">
                                                        <Card className="text-center">
                                                            {isImage ? (
                                                                <CardImg
                                                                    top
                                                                    width="150px"
                                                                    height="150px"
                                                                    src={attachment.attachment}
                                                                    alt="Attachment preview"
                                                                    onClick={() => handleImageClick(attachment.attachment)}
                                                                    style={{ cursor: 'pointer' }}
                                                                />
                                                            ) : (
                                                                <CardBody onClick={() => handleImageClick(attachment.attachment)}>
                                                                    <FileText size={50} />
                                                                    <CardText className="">
                                                                        {attachment.attachment.split('/').pop()}
                                                                    </CardText>
                                                                </CardBody>
                                                            )}
                                                        </Card>
                                                    </Col>
                                                )
                                            })}
                                        </Row>) : (
                                        null
                                    )}
                                            <span style={{ color: '#808080b5' }}>{Api.formatDateDifference(comment.updated_at)}</span>
                                            <hr></hr>
                                        </Col>
                                        {hoveredIndex === key && (
                                            <Col md={1} className='d-flex'>
                                                <Trash2 color='red' size={16} onClick={() => deleteComment(comment.id)} />
                                            </Col>
                                        )}
                                    </Row>
                                ))
                            ) : (
                                <p>No comments found!</p>
                            )) : <div className='text-center'><Spinner color='darkblue' type='grow' /></div>}
                    </div>
                </Col>
            </Row>
        </Fragment>
    )
}

export default TaskComments
