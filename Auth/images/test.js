const queryString = window.location.search;
console.log(queryString);


// id ---> 5 



    getUserReq.open("GET", `http://localhost:3000/products?id=${id}`)