const normalizePhone = (value: any, previousValue:any) => {
    if (!value) {
      return value
    }
    const onlyNums = value.replace(/[^\d]/g, '')
    console.log(onlyNums.length);
    if (!previousValue || value.length > previousValue.length) {
      // typing forward
      if (onlyNums.length === 4) {
        return onlyNums + '-'
      }
      if (onlyNums.length === 7) {
        return onlyNums.slice(0, 4) + '-' + onlyNums.slice(4) + '-'
      }
    }
    if (onlyNums.length <= 4) {
      return onlyNums
    }
    if (onlyNums.length <= 7) {
      return onlyNums.slice(0, 4) + '-' + onlyNums.slice(4)
    }
    return onlyNums.slice(0, 4) + '-' + onlyNums.slice(4, 7) + '-' + onlyNums.slice(7, 12)
  }
  
  export default normalizePhone