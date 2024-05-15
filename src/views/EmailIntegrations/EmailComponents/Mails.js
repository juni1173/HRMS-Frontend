// ** React Imports
import { Fragment, useState } from 'react'

// ** Mail Components Imports
import MailCard from './MailCard'
import MailDetails from './MailDetails'
import ComposePopUp from './ComposePopup'
// ** Third Party Components
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Menu, Search, Folder, Tag, Mail, Trash, Edit2, Info, Eye, EyeOff } from 'react-feather'

// ** Reactstrap Imports
import {
  Input,
  Label,
  InputGroup,
  DropdownMenu,
  DropdownItem,
  InputGroupText,
  ButtonGroup,
  Button,
  Spinner, Pagination, PaginationItem, PaginationLink
} from 'reactstrap'
import apiHelper from '../../Helpers/ApiHelper'
const Mails = props => {
   const Api = apiHelper()
   const [detailLoading, setDetailLoading] = useState(false)
   const [mail, setMailDetail] = useState([])
  
    
  // ** Props
  const {
    // query,
    // store,
    // setQuery,
    // dispatch,
    // selectMail,
    mails,
    handleParams,
    params,
    setParams,
    composeOpen,
    // updateMails,
    // paginateMail,
    // selectAllMail,
    toggleCompose,
    setSidebarOpen
    // updateMailLabel
    // resetSelectedMail,
    // selectCurrentMail
  } = props
  
 
//   const { mails, selectedMails } = store

  // ** States
  const [openMail, setOpenMail] = useState(false)

  // ** Variables
  const labelColors = {
    personal: 'success',
    company: 'primary',
    important: 'warning',
    private: 'danger'
  }
  const formatDateToMonthShort = (dateString) => {
    const date = new Date(dateString)
  
    // Get the day of the week
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' })
    
    // Get the month abbreviation
    const month = date.toLocaleDateString('en-US', { month: 'short' })
    
    // Get the day of the month
    const dayOfMonth = date.getDate()
    
    // Get the year
    const year = date.getFullYear()
    
    // Get the time
    const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
  
    // Construct the formatted date string
    const formattedDate = `${dayOfWeek}, ${dayOfMonth} ${month} ${year} ${time}`
  
    return formattedDate
  }
  const getMailDetail = async (id) => {
    setDetailLoading(true)
    const formData = new FormData()
            formData['action'] = params.action
            formData['status'] = params.type
        const response = await Api.jsonPost(`/integrations/get/mail/data/${id}/`, formData)
        if (response.status === 200) {
            const data = response.data 
            if (Object.values(data).length > 0) {
                setMailDetail(data)
                setOpenMail(true)
            } else {
                Api.Toast('error', response.message)
            }
        } else {
            Api.Toast('error', response.message)
        }
        setDetailLoading(false)
} 
  // ** Handles Update Functions
  const handleMailClick = id => {
    setOpenMail(true)
    // return false
    getMailDetail(id)
  }
 
  // ** Handles Move to Trash
//   const handleMailToTrash = ids => {
    // console.warn(ids)
    // dispatch(updateMails({ emailIds: ids, dataToUpdate: { folder: 'trash' } }))
    // dispatch(resetSelectedMail())
//   }
  /*eslint-enable */

  // ** Renders Mail
  const renderMails = () => {
    if (mails.length) {
      return mails.map((mail, index) => {
        return (
          <MailCard
            mail={mail}
            key={index}
            // dispatch={dispatch}
            // selectMail={selectMail}
            // updateMails={updateMails}
            labelColors={labelColors}
            // selectedMails={selectedMails}
            handleMailClick={handleMailClick}
            // handleMailReadUpdate={handleMailReadUpdate}
            formatDateToMonthShort={formatDateToMonthShort}
          />
        )
      })
    }
  }
  const renderPagination = () => {
    return (
        Array.from({ length: 10 }, (_, i) => (
            <PaginationItem key={i} className={params.page_number === (i + 1) ? 'active' : ''}>
                <PaginationLink href='#' onClick={() => handleParams(params.action, params.type, (i + 1), params.page_size)}>
                    {i + 1}
                </PaginationLink>
            </PaginationItem>
        ))
    )
}
  return (
    <Fragment>
      <div className='email-app-list'>
        <div className='app-fixed-search d-flex align-items-center'>
          <div className='sidebar-toggle d-block d-lg-none ms-1' onClick={() => setSidebarOpen(true)}>
            <Menu size='21' />
          </div>
          <div className='d-flex align-content-center justify-content-between w-100'>
            <InputGroup className='input-group-merge'>
              <InputGroupText>
                <Search className='text-muted' size={14} />
              </InputGroupText>
              <Input
                id='email-search'
                placeholder='Search email'
                // value={query}
                // onChange={e => setQuery(e.target.value)}
              />
            </InputGroup>
          </div>
        </div>
        <div className='app-action'>
          <div className='action-left form-check'>
           
          </div>
            <div className='action-right'>
                    <ButtonGroup className=''>
                        <Button color='primary' onClick={() => handleParams(params.action, 'seen')} active={params.type === 'seen'}>
                            Read
                        </Button>
                        <Button color='primary' onClick={() => handleParams(params.action, 'unseen')} active={params.type === 'unseen'}>
                            Unread
                        </Button>
                    </ButtonGroup>
              {/* <ul className='list-inline m-0'>
               
                <li className='list-inline-item me-1 border-right'>
                  <span className='action-icon' onClick={() => handleParams(params.action, 'seen')}>
                    <Eye size={18} />Seen
                  </span>
                </li>
                <li className='list-inline-item'>
                  <span className='action-icon' onClick={() => handleParams(params.action, 'unseen')}>
                    <EyeOff size={18} />UnSeen
                  </span>
                </li>
              </ul> */}
            </div>
        </div>

        <PerfectScrollbar className='email-user-list' options={{ wheelPropagation: false }}>
          {mails.length ? (
                <ul className='email-media-list'>{renderMails()}</ul>
              ) : (
                <div className='no-results d-block'>
                  <h5>No Items Found</h5>
                </div>
              )}
              <Pagination className='d-flex justify-content-center mt-3'>{renderPagination()}</Pagination>
        </PerfectScrollbar>
      </div>
      <MailDetails
        openMail={openMail}
        params={params}
        setParams={setParams}
        handleParams={handleParams}
        mail={mail}
        load={detailLoading}
        // labelColors={labelColors}
        setOpenMail={setOpenMail}
        // updateMails={updateMails}
        // paginateMail={paginateMail}
        // updateMailLabel={updateMailLabel}
        // handleMailToTrash={handleMailToTrash}
        // handleFolderUpdate={handleFolderUpdate}
        // handleLabelsUpdate={handleLabelsUpdate}
        // handleMailReadUpdate={handleMailReadUpdate}
        formatDateToMonthShort={formatDateToMonthShort}
      />
      <ComposePopUp composeOpen={composeOpen} toggleCompose={toggleCompose} />
    </Fragment>
  )
}

export default Mails
