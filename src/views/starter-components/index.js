import "@styles/react/apps/app-users.scss"
import PositionIndexComp from "./Components/index"

const Positions = () => {
 
    
  // CallBack Function to call async ajax requests

//   const CallBack = () => {
//     setCanvasOpen(false)
//     setCount(current => current + 1)
//   }

  // Canvas Panel Checks for Components Call

//   const CreateButtonStatus = jobState => {
//     switch (jobState) {
      
//       case 'true':
//           return <GroupHead stepperStatus={false} createForm={true} fetchGroupHeads={CallBack}/>
//       case 'false':
//         return <StaffClassification stepperStatus={false} createForm={true} fetchStaffClassification={CallBack} />
      
//       default:
//         return <p>No Data Found</p>
//     }
//   }

  return (
    <div>
        <PositionIndexComp />
    </div>
  
  )
}

export default Positions
