exports.items = (arr, sortType) => {

  switch (sortType) {
    case "priceAscending":
      return arr.sort((a, b) => a.price - b.price);
      break;
    case "priceDescending":
      return arr.sort((a, b) => b.price - a.price);
      break;
    case "nameAscending":
      if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
      if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
      return 0;
      break;
    case "nameDescending":
      if (a.name.toLowerCase() > b.name.toLowerCase()) return -1;
      if (a.name.toLowerCase() < b.name.toLowerCase()) return 1;
      return 0;
      break;
    default:
      console.log("sorting method broken");
  }

}
