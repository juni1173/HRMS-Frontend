import React, { lazy, Suspense } from 'react'
import { Offcanvas, OffcanvasBody, OffcanvasHeader } from 'reactstrap'

const CustomOffcanvas = ({ isOpen, toggle, content, title, batch }) => {
  const componentMapping = {
    staffclassification: lazy(() => import('./staffclassification')),
    SelectEmployees: lazy(() => import('./SelectEmployees')),
    viewrecords: lazy(() => import('./viewrecords'))
  }

  // Get the component based on the content title
  const SelectedComponent = componentMapping[title] || null

  return (
    <Offcanvas direction={"end"} isOpen={isOpen} toggle={toggle} className="largeCanvas" >
         <OffcanvasHeader toggle={toggle}></OffcanvasHeader>
      <OffcanvasBody>
        {SelectedComponent ? (
          <Suspense fallback={<div>Loading...</div>}>
            <SelectedComponent content={content}  batch={batch}/>
          </Suspense>
        ) : (
          <div>Component not found for title: {content}</div>
        )}
      </OffcanvasBody>
    </Offcanvas>
  )
}

export default CustomOffcanvas
