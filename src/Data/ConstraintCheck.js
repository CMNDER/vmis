export const constraintCheck = (array, id, updatedQuantity) => {
    let x = [];//    
    let stringId = id.toString()
    for (let i in array) {
        if (array[i].vaccineid === stringId) {
            array[i].vaccineQuantity = updatedQuantity;
            x.push(1)
        }
    }
    if (x.includes(1)) {
        return array
    }
    else {
        return 0
    }
}