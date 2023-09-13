const CountHelper = () => {
    const countItems = (list) => {
      if (Array.isArray(list)) {
        return list.length
      } else {
        throw new Error('Input is not an array')
      }
    }
  
    return {
      countItems
    }
  }
  
  export default CountHelper
  