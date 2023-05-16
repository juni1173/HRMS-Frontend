// ** React Imports
import { Fragment, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
// ** Reactstrap Imports
import {
  Container,
  Row,
  Col,
  Card,
  Modal,
  Button,
  CardBody,
  ModalBody,
  ModalHeader,
  Spinner
} from 'reactstrap'

import apiHelper from '../../../../../Helpers/ApiHelper'
// ** Third Party Components
import { Plus, Trash2, Edit, User } from 'react-feather'

// ** Custom Components
// import AvatarGroup from '@components/avatar-group'

// ** FAQ Illustrations
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import AddRole from './AddRole'
import UpdateRole from './UpdateRole'
import RolePermissions from './RolePermissions'
import RoleUsers from './RoleUsers'
import Masonry from 'react-masonry-component'
// ** Vars
// const data = [
//   {
//     totalUsers: 4,
//     title: 'Administrator',
//     users: [
//       {
//         size: 'sm',
//         title: 'Vinnie Mostowy',
//         img: require('@src/assets/images/avatars/2.png').default
//       },
//       {
//         size: 'sm',
//         title: 'Allen Rieske',
//         img: require('@src/assets/images/avatars/12.png').default
//       },
//       {
//         size: 'sm',
//         title: 'Julee Rossignol',
//         img: require('@src/assets/images/avatars/6.png').default
//       },
//       {
//         size: 'sm',
//         title: 'Kaith Dsouza',
//         img: require('@src/assets/images/avatars/11.png').default
//       }
//     ]
//   },
//   {
//     totalUsers: 7,
//     title: 'Manager',
//     users: [
//       {
//         size: 'sm',
//         title: 'Jimmy Ressula',
//         img: require('@src/assets/images/avatars/4.png').default
//       },
//       {
//         size: 'sm',
//         title: 'John Doe',
//         img: require('@src/assets/images/avatars/1.png').default
//       },
//       {
//         size: 'sm',
//         title: 'Kristi Lawker',
//         img: require('@src/assets/images/avatars/2.png').default
//       },
//       {
//         size: 'sm',
//         title: 'Kaith D',
//         img: require('@src/assets/images/avatars/5.png').default
//       },
//       {
//         size: 'sm',
//         title: 'Danny Paul',
//         img: require('@src/assets/images/avatars/7.png').default
//       }
//     ]
//   },
//   {
//     totalUsers: 5,
//     title: 'Users',
//     users: [
//       {
//         size: 'sm',
//         title: 'Andrew Tye',
//         img: require('@src/assets/images/avatars/6.png').default
//       },
//       {
//         size: 'sm',
//         title: 'Rishi Swaat',
//         img: require('@src/assets/images/avatars/9.png').default
//       },
//       {
//         size: 'sm',
//         title: 'Rossie Kim',
//         img: require('@src/assets/images/avatars/2.png').default
//       },
//       {
//         size: 'sm',
//         title: 'Kim Merchent',
//         img: require('@src/assets/images/avatars/10.png').default
//       },
//       {
//         size: 'sm',
//         title: 'Sam Dsouza',
//         img: require('@src/assets/images/avatars/8.png').default
//       }
//     ]
//   },
//   {
//     totalUsers: 3,
//     title: 'Support',
//     users: [
//       {
//         size: 'sm',
//         title: 'Kim Karlos',
//         img: require('@src/assets/images/avatars/3.png').default
//       },
//       {
//         size: 'sm',
//         title: 'Katy Turner',
//         img: require('@src/assets/images/avatars/9.png').default
//       },
//       {
//         size: 'sm',
//         title: 'Peter Adward',
//         img: require('@src/assets/images/avatars/12.png').default
//       },
//       {
//         size: 'sm',
//         title: 'Kaith Dsouza',
//         img: require('@src/assets/images/avatars/10.png').default
//       },
//       {
//         size: 'sm',
//         title: 'John Parker',
//         img: require('@src/assets/images/avatars/11.png').default
//       }
//     ]
//   },
//   {
//     totalUsers: 2,
//     title: 'Restricted User',
//     users: [
//       {
//         size: 'sm',
//         title: 'Kim Merchent',
//         img: require('@src/assets/images/avatars/10.png').default
//       },
//       {
//         size: 'sm',
//         title: 'Sam Dsouza',
//         img: require('@src/assets/images/avatars/6.png').default
//       },
//       {
//         size: 'sm',
//         title: 'Nurvi Karlos',
//         img: require('@src/assets/images/avatars/3.png').default
//       },
//       {
//         size: 'sm',
//         title: 'Andrew Tye',
//         img: require('@src/assets/images/avatars/8.png').default
//       },
//       {
//         size: 'sm',
//         title: 'Rossie Kim',
//         img: require('@src/assets/images/avatars/9.png').default
//       }
//     ]
//   }
// ]
const RoleCards = () => {
    const Api = apiHelper()
  // ** States
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)
  const [modalType, setModalType] = useState('Add New')
  const [rolesData, setRolesData] = useState([])
  const [currentRole, setCurrentRole] = useState([])
  const MySwal = withReactContent(Swal)
  // ** Hooks
  
  const getRoles = async () => {
    setLoading(true)
    await Api.get(`/roles/`).then(result => {
        if (result) {
            if (result.status === 200) {
                setRolesData(result.data)
            } else {
                Api.Toast('error', result.message)
            }
        } else {
            Api.Toast('error', 'Server not responding')
        }
      })
    setTimeout(() => {
        setLoading(false)
    }, 1000)
  }
  const CallBack = () => {
    getRoles()
    setShow(false)
  }
  const DiscardModal = () => {
    setShow(false)
  }
  const handleModalClosed = () => {
    setModalType('Add New')
  }
  const removeRole = uuid => {
    MySwal.fire({
        title: 'Are you sure?',
        text: "Do you want to delete the Role!",
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
            Api.deleteData(`/roles/${uuid}/`, {method: 'Delete'})
            .then((deleteResult) => {
                    if (deleteResult.status === 200) {
                        MySwal.fire({
                            icon: 'success',
                            title: 'Role Deleted!',
                            text: 'Role is deleted.',
                            customClass: {
                            confirmButton: 'btn btn-success'
                            }
                        }).then(function (result) {
                            if (result.isConfirmed) {
                                getRoles()
                            }
                        })
                    } else {
                        MySwal.fire({
                            icon: 'error',
                            title: deleteResult.message ? deleteResult.message : 'Role can not be deleted!',
                            text: 'Role is not deleted.',
                            customClass: {
                            confirmButton: 'btn btn-danger'
                            }
                        })
                    }
                        
                })
        } 
    })
  }
  useEffect(() => {
    getRoles()
  }, [])
  return (
    <Fragment>
      <Row>
        <Col md={6} tag={'h3'} className={'pt-1'}>Roles & Permissions</Col> 
        <Col md={6}>
            <Button
                color='success'
                className='text-nowrap mb-1 float-right'
                onClick={() => {
                setModalType('Add New')
                setShow(true)
                }}>
                <Plus/> New Role
            </Button>
        </Col> 
      {!loading ? (
        <>
            {rolesData.length > 0 ? (
                <Container>
                    <Masonry className='row js-animation'>
                        {rolesData.map((item, index) => {
                            return (
                            <Col key={index} xl={4} md={6}>
                                <Card>
                                <CardBody>
                                    <div className='row'>
                                        <div className='col-md-8'>
                                        <h4 className='fw-bolder'>{item.title}</h4>
                                        <span>{`${item.role_type_title}`}</span>
                                        {/* <AvatarGroup data={item.users} /> */}
                                        </div>
                                        <div className='col-md-4'>
                                            <Link
                                                to='/'
                                                className='role-edit-modal'
                                                onClick={e => {
                                                    e.preventDefault()
                                                    setModalType('Users')
                                                    setCurrentRole(item)
                                                    setShow(true)
                                                }}
                                                >
                                                <User className='float-right' color='green'/>
                                            </Link>
                                            
                                        </div>
                                   
                                    </div>
                                    <div className='row pt-2'>
                                        <div className='col-md-8'>
                                            {item.role_type !== 13 && (
                                                <div className='role-heading'>
                                                <Link
                                                to='/'
                                                className='role-edit-modal'
                                                onClick={e => {
                                                    e.preventDefault()
                                                    setModalType('Permissions')
                                                    setCurrentRole(item)
                                                    setShow(true)
                                                }}
                                                >
                                                <small className='fw-bolder'>Permissions</small>
                                                </Link>
                                            </div>
                                            )}
                                            
                                        </div>
                                        <div className='col-md-4 '>
                                                <div className=' float-right d-flex'>
                                                <Edit color='orange'className='mr-1' onClick={e => {
                                                        e.preventDefault()
                                                        setModalType('Edit')
                                                        setCurrentRole(item)
                                                        setShow(true)
                                                    }} />
                                                     <Trash2 color='red' onClick={() => removeRole(item.uuid ? item.uuid : 1)}/>
                                                </div>
                                        </div>        
                                    </div>
                                </CardBody>
                                </Card>
                            </Col>
                            )
                        })}
                    </Masonry>
                </Container>
            ) : (
                <Container>
                    <Card>
                        <CardBody>
                            <p>No Role Found!</p>
                        </CardBody>
                    </Card>
                </Container>
            )}
        </>
        ) : (
            <div className='text-center'><Spinner type='grow'/></div>
        )
        }
      </Row>
      <Modal
        isOpen={show}
        onClosed={handleModalClosed}
        toggle={() => setShow(!show)}
        className='modal-dialog-centered modal-lg'
      >
        <ModalHeader className='bg-transparent' toggle={() => setShow(!show)}></ModalHeader>
        <ModalBody className='px-5 pb-5'>
          <div className='text-center mb-2'>
            <h1>{modalType} Role</h1>
          </div>
          {modalType === 'Permissions' && (
            <RolePermissions role_id={currentRole.id} CallBack={CallBack} DiscardModal={DiscardModal}/>
          )}
          {modalType === 'Add New' && (
            <AddRole CallBack={CallBack} DiscardModal={DiscardModal}/>
          ) }
          {modalType === 'Edit' && (
            <UpdateRole role={currentRole} CallBack={CallBack} DiscardModal={DiscardModal}/>
          )}
          {modalType === 'Users' && (
            <RoleUsers role_id={currentRole.id} CallBack={CallBack} DiscardModal={DiscardModal}/>
          )}
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default RoleCards
