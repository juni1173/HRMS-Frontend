// ** React Imports
import { Fragment } from 'react'

// ** Utils
import { formatDate } from '@utils'

// ** Third Party Components
import classnames from 'classnames'
import apiHelper from '../../Helpers/ApiHelper'
import {
  Star,
  Tag,
  Mail,
  Info,
  Trash,
  Edit2,
  Folder,
  Trash2,
  Paperclip,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  CornerUpLeft,
  CornerUpRight,
  Download
} from 'react-feather'
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Reactstrap Imports
import {
  Row,
  Col,
  Badge,
  Card,
  Table,
  CardBody,
  CardFooter,
  CardHeader,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
  Spinner
} from 'reactstrap'

const MailDetails = props => {
  // ** Props
  const {
    mail,
    openMail,
    // dispatch,
    // labelColors,
    load,
    setOpenMail,
    params,
    // paginateMail,
    // handleMailToTrash,
    // handleFolderUpdate,
    // handleLabelsUpdate,
    // handleMailReadUpdate,
    formatDateToMonthShort
  } = props
const Api = apiHelper()
  // ** States
  
  // ** Renders Labels
//   const renderLabels = arr => {
//     if (arr && arr.length) {
//       return arr.map(label => (
//         <Badge key={label} color={`light-${labelColors[label]}`} className='me-50 text-capitalize' pill>
//           {label}
//         </Badge>
//       ))
//     }
//   }
const attachmentsDownload = async () => {
    const formData = new FormData()
            formData['action'] = params.action
        const response = await Api.jsonPost(`/integrations/download/attachment/data/${mail.Message_ID}/`, formData)
        if (response.status === 200) {
            
        } else {
            Api.Toast('error', response.message)
        }
} 
  // ** Renders Attachments
  const renderAttachments = arr => {
    return arr.map((item, index) => {
      return (
        <div
          key={item.filename}
        //   href='/'
        //   onClick={e => e.preventDefault()}
          className={classnames({
            'mb-50': index + 1 !== arr.length
          })}
        >
          {/* <img src={item.thumbnail} alt={item.filename} width='16' className='me-50' /> */}
          <span className='text-muted fw-bolder align-text-top'>{item.filename}</span>
          {/* <span className='text-muted font-small-2 ms-25'>{<Download />}</span> */}
        </div>
      )
    })
  }

  // ** Renders Messages
  const renderMessage = obj => {
    return (
        
      <Card>
        {!load ? (
            <>
            <CardHeader className='email-detail-head'>
          <div className='user-details d-flex justify-content-between align-items-center flex-wrap'>
            {/* <Avatar img={obj.from.avatar} className='me-75' imgHeight='48' imgWidth='48' /> */}
            <div className='mail-items'>
              <h5 className='mb-0'>{obj.From}</h5>
              <UncontrolledDropdown className='email-info-dropup'>
                <DropdownToggle className='font-small-3 text-muted cursor-pointer' tag='span' caret>
                  <span className='me-25'>{obj.From}</span>
                </DropdownToggle>
                <DropdownMenu>
                  <Table className='font-small-3' size='sm' borderless>
                    <tbody>
                      <tr>
                        <td className='text-end text-muted align-top'>CC:</td>
                        <td>{obj.CC}</td>
                      </tr>
                      <tr>
                        <td className='text-end text-muted align-top'>Date:</td>
                        <td>
                          {formatDateToMonthShort(obj.Date)}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
          </div>
          <div className='mail-meta-item d-flex align-items-center'>
            <small className='mail-date-time text-muted'>{formatDate(obj.Date)}</small>
            {/* <UncontrolledDropdown className='ms-50'>
              <DropdownToggle className='cursor-pointer' tag='span'>
                <MoreVertical size={14} />
              </DropdownToggle>
              <DropdownMenu end>
                <DropdownItem className='d-flex align-items-center w-100'>
                  <CornerUpLeft className='me-50' size={14} />
                  Reply
                </DropdownItem>
                <DropdownItem className='d-flex align-items-center w-100'>
                  <CornerUpRight className='me-50' size={14} />
                  Forward
                </DropdownItem>
                <DropdownItem className='d-flex align-items-center w-100'>
                  <Trash2 className='me-50' size={14} />
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown> */}
          </div>
        </CardHeader>
        <CardBody className='mail-message-wrapper pt-2'>
          <div className='mail-message' dangerouslySetInnerHTML={{ __html: obj.Body ? obj.Body : '<b>No email body found!</b>' }}></div>
        </CardBody>
        </>
            ) : <div className='text-center'><Spinner/></div>}
        
        {obj.email_attachments && obj.email_attachments.length ? (
          <CardFooter>
            <div className='mail-attachments'>
              <div className='d-flex align-items-center mb-1'>
                <Paperclip size={16} />
                <h5 className='fw-bolder text-body mb-0 mx-50'>{obj.email_attachments.length} Attachment</h5>
                <Download size={16} onClick={() => attachmentsDownload()}/>
              </div>
              <div className='d-flex flex-column'>{renderAttachments(obj.email_attachments)}</div>
            </div>
          </CardFooter>
        ) : null}
      </Card>
    )
  }

  // ** Renders Replies
//   const renderReplies = arr => {
//     if (arr.length && showReplies === true) {
//       return arr.map((obj, index) => (
//         <Row key={index}>
//           <Col sm='12'>{renderMessage(obj)}</Col>
//         </Row>
//       ))
//     }
//   }

  // ** Handle show replies, go back, folder & read click functions
//   const handleShowReplies = e => {
//     e.preventDefault()
//     setShowReplies(true)
//   }

  const handleGoBack = () => {
    setOpenMail(false)
  }

//   const handleFolderClick = (e, folder, id) => {
//     // handleFolderUpdate(e, folder, [id])
//     handleGoBack()
//   }

//   const handleReadClick = () => {
//     // handleMailReadUpdate([mail.id], false)
//     handleGoBack()
//   }

  return (
    <div
      className={classnames('email-app-details', {
        show: openMail
      })}
    >
      {mail !== null && mail !== undefined ? (
        <Fragment>
          <div className='email-detail-header'>
            <div className='email-header-left d-flex align-items-center'>
              <span className='go-back me-1' onClick={handleGoBack}>
                <ChevronLeft size={20} />
              </span>
              <h4 className='email-subject mb-0'>{mail.Subject}</h4>
            </div>
            <div className='email-header-right ms-2 ps-1'>
              <ul className='list-inline m-0'>
                
                {/* <li className='list-inline-item me-1'>
                  <UncontrolledDropdown>
                    <DropdownToggle tag='span'>
                      <Folder size={18} />
                    </DropdownToggle>
                    <DropdownMenu end>
                      <DropdownItem
                        tag='a'
                        href='/'
                        // onClick={e => handleFolderClick(e, 'draft', mail.id)}
                        className='d-flex align-items-center'
                      >
                        <Edit2 className='me-50' size={18} />
                        <span>Draft</span>
                      </DropdownItem>
                      <DropdownItem
                        tag='a'
                        href='/'
                        // onClick={e => handleFolderClick(e, 'spam', mail.id)}
                        className='d-flex align-items-center'
                      >
                        <Info className='me-50' size={18} />
                        <span>Spam</span>
                      </DropdownItem>
                      <DropdownItem
                        tag='a'
                        href='/'
                        // onClick={e => handleFolderClick(e, 'trash', mail.id)}
                        className='d-flex align-items-center'
                      >
                        <Trash className='me-50' size={18} />
                        <span>Trash</span>
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </li> */}
                {/* <li className='list-inline-item me-1'>
                  <UncontrolledDropdown>
                    <DropdownToggle tag='span'>
                      <Tag size={18} />
                    </DropdownToggle>
                    <DropdownMenu end>
                      <DropdownItem
                        tag='a'
                        href='/'
                        // onClick={e => handleLabelsUpdate(e, 'personal', [mail.id])}
                        className='d-flex align-items-center'
                      >
                        <span className='bullet bullet-success bullet-sm me-50' />
                        <span>Personal</span>
                      </DropdownItem>
                      <DropdownItem
                        tag='a'
                        href='/'
                        // onClick={e => handleLabelsUpdate(e, 'company', [mail.id])}
                        className='d-flex align-items-center'
                      >
                        <span className='bullet bullet-primary bullet-sm me-50' />
                        <span>Company</span>
                      </DropdownItem>
                      <DropdownItem
                        tag='a'
                        href='/'
                        // onClick={e => handleLabelsUpdate(e, 'important', [mail.id])}
                        className='d-flex align-items-center'
                      >
                        <span className='bullet bullet-warning bullet-sm me-50' />
                        <span>Important</span>
                      </DropdownItem>
                      <DropdownItem
                        tag='a'
                        href='/'
                        // onClick={e => handleLabelsUpdate(e, 'private', [mail.id])}
                        className='d-flex align-items-center'
                      >
                        <span className='bullet bullet-danger bullet-sm me-50' />
                        <span>Private</span>
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </li> */}
                {/* <li className='list-inline-item me-1'>
                  <span className='action-icon'>
                    <Mail size={18} />
                  </span>
                </li>
                <li className='list-inline-item me-1'>
                  <span
                    className='action-icon'
                    onClick={() => {
                    //   handleMailToTrash([mail.id])
                      handleGoBack()
                    }}
                  >
                    <Trash size={18} />
                  </span>
                </li> */}
              </ul>
            </div>
          </div>
          <PerfectScrollbar className='email-scroll-area' options={{ wheelPropagation: false }}>
            <Row>
              <Col sm='12'>
                {/* <div className='email-label'>{renderLabels(mail.labels)}</div> */}
              </Col>
            </Row>
           
            <Row>
              <Col sm='12'>{renderMessage(mail)}</Col>
            </Row>
          </PerfectScrollbar>
        </Fragment>
      ) : null}
    </div>
  )
}

export default MailDetails
