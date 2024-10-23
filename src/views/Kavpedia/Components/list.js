import React from 'react'
import Masonry from 'react-masonry-component'
import { Badge } from 'reactstrap'
const list = ({ data }) => {
  return (
    <Masonry className="row kavpedia js-animation">
        {Object.values(data).map((item) => (
                <div className="row mb-2" key={item.id}>
                    <div className="col-md-9">
                    <a href={item.file && item.file} target='_blank' className='link'>
                        <h1 className=''
                         style={{color: '#1a0dab', fontFamily:'Arial,sans-serif', fontSize:'20px', fontWeight:'40px'}}>
                            {item.title && item.title}
                        </h1>
                    </a>
                        {item.tags.length > 0 && (
                            item.tags.map((tag, index) => (
                                <Badge color='light-secondary' key={index}>
                                {tag.name && tag.name}
                                </Badge>
                            ))
                        )}
                    </div>
                </div>
        ))}
    </Masonry>
  )
}

export default list