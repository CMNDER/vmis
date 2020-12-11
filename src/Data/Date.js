export const DateParser = (date) => {
    let today = null;
    if (date) {
      today = new Date(date);
    } else {
      today = new Date();
    }
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    let yyyy = today.getFullYear();
  
    // today = mm + '/' + dd + '/' + yyyy;
    today = yyyy + "/" + mm + "/" + dd;
    return today;
  };