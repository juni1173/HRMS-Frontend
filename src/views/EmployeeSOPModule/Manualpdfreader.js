const ManualPdfReader = ({ file }) => {
  return (
      <iframe
          src={file}
          width="850"
          height="600"
          style={{ border: 'none' }}
          title="PDF Viewer"
      />
  )
}

export default ManualPdfReader