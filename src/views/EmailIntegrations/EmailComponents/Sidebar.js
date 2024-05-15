// ** Third Party Components
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Mail, Send, Edit2, Star, Info, Trash } from 'react-feather'

// ** Reactstrap Imports
import { Button, ListGroup, ListGroupItem, Badge } from 'reactstrap'
import { useState } from 'react'

const Sidebar = props => {
  // ** Props
  const { sidebarOpen, toggleCompose, setSidebarOpen, getMails, handleParams } = props

  const [folderInfo, setFolderInfo] = useState({
    folder: 'inbox',
    activeFolder: 'inbox'
  })

  // ** Functions To Handle Folder, Label & Compose
  const handleFolder = folder => {
    setFolderInfo({folder, activeFolder: folder})
    handleParams(folder)
    getMails(folder)
    // dispatch(resetSelectedMail())
  }

//   const handleLabel = label => {
    // dispatch(getMails({ ...store.params, label }))
    // dispatch(resetSelectedMail())
//   }

  const handleComposeClick = () => {
    toggleCompose()
    setSidebarOpen(false)
  }

  // ** Functions To Active List Item
  const handleActiveItem = value => {
    if ((folderInfo.folder && folderInfo.folder === value) || (folderInfo.activeFolder && folderInfo.activeFolder === value)) {
      return true
    } else {
      return false
    }
  }

  return (
    <div
      className={classnames('sidebar-left', {
        show: sidebarOpen
      })}
    >
      <div className='sidebar'>
        <div className='sidebar-content email-app-sidebar'>
          <div className='email-app-menu'>
            <div className='form-group-compose text-center compose-btn'>
              <Button className='compose-email' color='primary' block onClick={handleComposeClick}>
                Compose
              </Button>
            </div>
            <PerfectScrollbar className='sidebar-menu-list' options={{ wheelPropagation: false }}>
              <ListGroup tag='div' className='list-group-messages'>
                <ListGroupItem
                //   tag={Link}
                //   to='/apps/email/inbox'
                  className='cursor-pointer'
                  onClick={() => handleFolder('inbox')}
                  action
                  active={!Object.keys(folderInfo).length || handleActiveItem('inbox')}
                >
                  <Mail size={18} className='me-75' />
                  <span className='align-middle'>Inbox</span>
                  {/* {store.emailsMeta.inbox ? ( */}
                    {/* <Badge className='float-end' color='light-primary' pill> 
                      0
                     </Badge> */}
                  {/* ) : null} */}
                </ListGroupItem>
                <ListGroupItem
                //   tag={Link}
                //   to='/apps/email/sent'
                  className='cursor-pointer'
                  onClick={() => handleFolder('sent')}
                  action
                  active={handleActiveItem('sent')}
                >
                  <Send size={18} className='me-75' />
                  <span className='align-middle'>Sent</span>
                </ListGroupItem>
                <ListGroupItem
                //   tag={Link}
                //   to='/apps/email/draft'
                  className='cursor-pointer'
                  onClick={() => handleFolder('drafts')}
                  action
                  active={handleActiveItem('draft')}
                >
                  <Edit2 size={18} className='me-75' />
                  <span className='align-middle'>Draft</span>
                  {/* {store.emailsMeta.draft ? (
                    <Badge className='float-end' color='light-warning' pill>
                      {store.emailsMeta.draft}
                    </Badge>
                  ) : null} */}
                </ListGroupItem>
                <ListGroupItem
                //   tag={Link}
                //   to='/apps/email/draft'
                  className='cursor-pointer'
                  onClick={() => handleFolder('templates')}
                  action
                  active={handleActiveItem('templates')}
                >
                  <Edit2 size={18} className='me-75' />
                  <span className='align-middle'>Templates</span>
                  {/* {store.emailsMeta.draft ? (
                    <Badge className='float-end' color='light-warning' pill>
                      {store.emailsMeta.draft}
                    </Badge>
                  ) : null} */}
                </ListGroupItem>
                <ListGroupItem
                //   tag={Link}
                //   to='/apps/email/starred'
                  className='cursor-pointer'
                  onClick={() => handleFolder('starred')}
                  action
                  active={handleActiveItem('starred')}
                >
                  <Star size={18} className='me-75' />
                  <span className='align-middle'>Starred</span>
                </ListGroupItem>
                <ListGroupItem
                //   tag={Link}
                //   to='/apps/email/spam'
                  className='cursor-pointer'
                  onClick={() => handleFolder('spam')}
                  action
                  active={handleActiveItem('spam')}
                >
                  <Info size={18} className='me-75' />
                  <span className='align-middle'>Spam</span>
                  {/* {store.emailsMeta.spam ? (
                    <Badge className='float-end' color='light-danger' pill>
                      {store.emailsMeta.spam}
                    </Badge>
                  ) : null} */}
                </ListGroupItem>
                <ListGroupItem
                //   tag={Link}
                //   to='/apps/email/trash'
                  className='cursor-pointer'
                  onClick={() => handleFolder('trash')}
                  action
                  active={handleActiveItem('trash')}
                >
                  <Trash size={18} className='me-75' />
                  <span className='align-middle'>Trash</span>
                </ListGroupItem>
              </ListGroup>
              {/* <h6 className='section-label mt-3 mb-1 px-2'>Labels</h6>
              <ListGroup tag='div' className='list-group-labels'>
                <ListGroupItem
                //   tag={Link}
                //   to='/apps/email/label/personal'
                  className='cursor-pointer'
                  onClick={() => handleLabel('personal')}
                  active={handleActiveItem('personal')}
                  action
                >
                  <span className='bullet bullet-sm bullet-success me-1'></span>
                  Personal
                </ListGroupItem>
                <ListGroupItem
                //   tag={Link}
                //   to='/apps/email/label/company'
                  className='cursor-pointer'
                  onClick={() => handleLabel('company')}
                  active={handleActiveItem('company')}
                  action
                >
                  <span className='bullet bullet-sm bullet-primary me-1'></span>
                  Company
                </ListGroupItem>
                <ListGroupItem
                //   tag={Link}
                //   to='/apps/email/label/important'
                  className='cursor-pointer'
                  onClick={() => handleLabel('important')}
                  active={handleActiveItem('important')}
                  action
                >
                  <span className='bullet bullet-sm bullet-warning me-1'></span>
                  Important
                </ListGroupItem>
                <ListGroupItem
                //   tag={Link}
                //   to='/apps/email/label/private'
                  className='cursor-pointer'
                  onClick={() => handleLabel('private')}
                  active={handleActiveItem('private')}
                  action
                >
                  <span className='bullet bullet-sm bullet-danger me-1'></span>
                  Private
                </ListGroupItem>
              </ListGroup> */}
            </PerfectScrollbar>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
