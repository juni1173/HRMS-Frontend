import React, { Fragment } from 'react'
import { Share2, Tag } from 'react-feather'
import Masonry from 'react-masonry-component'
import { Badge, Row, Col, Card, CardBody, UncontrolledTooltip } from 'reactstrap'
import apiHelper from '../../Helpers/ApiHelper'
import Avatar from '@components/avatar'
const list = ({ data, projects }) => {
    const Api = apiHelper()
    console.warn(data)
  return (
        <Fragment>
            <h3>All Files</h3>
            <Masonry className="row kavpedia js-animation">
                <Row>
                    {Object.values(data).map((item) => {
                        const icons = require.context('@src/assets/images/icons/kavpedia-icons')
                        const defaultIcon = require('@src/assets/images/icons/kavpedia-icons/doc.png')
                        const formatImage = item.file.split('.').pop()
                        return (
                        <Col md='4'>
                            <Card key={item.id}>
                                <CardBody className='py-1 px-2'>
                                    <div className='d-flex justify-content-between'>
                                        <div>
                                            <img 
                                            src={icons.keys().includes(`./${formatImage}.png`) ? icons(`./${formatImage}.png`).default : defaultIcon.default}
                                            style={{ cursor: 'pointer', width: '100%', height: '30px' }}
                                            />
                                        </div>
                                        <div><span className='text-muted small'>Created on {Api.dmyformat(item.created_at)}</span></div>
                                    </div>
                                <div className="row mb-2" >
                                    <div className="col-md-12">
                                    <a href={item.file && item.file} target='_blank' className='link'>
                                        <h1 className='kavpediaHeading'>
                                            {projects.find(pre => pre.value === item.project).label} - {item.title && item.title}
                                        </h1>
                                    </a>
                                        {item.tags.length > 0 && (
                                            <>
                                                <Tag color='gray' size={16} id='tags'/>
                                                {item.tags.map((tag, index) => (
                                                    <Badge color='light-secondary' key={index}>
                                                    {tag.name && tag.name}
                                                    </Badge>
                                                ))}
                                                <UncontrolledTooltip placement='top' target='tags'>
                                                    Tags
                                                </UncontrolledTooltip>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className='d-flex justify-content-between'>
                                        <div>
                                            <Share2 id={`sharelink-${item.id}`} className={`cursor-pointer`} size={20} color="#000" onClick={() => Api.copyToClipboard(item.file)}/>
                                            <UncontrolledTooltip placement='top' target={`sharelink-${item.id}`}>
                                                    Copy Link To Share
                                            </UncontrolledTooltip>
                                        </div>
                                        <div><Avatar color="light-warning" id="avatar" content={'Muhammad Junaid'} initials/>
                                                <UncontrolledTooltip placement='top' target='avatar'>
                                                    Muhammad Junaid
                                                </UncontrolledTooltip></div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                        )
                        })}
                </Row>
            </Masonry>
        </Fragment>
  )
}

export default list