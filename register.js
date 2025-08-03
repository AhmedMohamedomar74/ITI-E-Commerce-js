let userName = document.getElementById('userName');
let Email = document.getElementById('Email');
let Address = document.getElementById('address');
let Tel = document.getElementById('tel');
let Password = document.getElementById('password');
let register = document.getElementById('register');

var fetchAlluserReq = new XMLHttpRequest()
var users = []
// register.disabled = true;
// console.log(register)

// let users = JSON.parse(localStorage.getItem('users')) || [];



fetchAlluserReq.addEventListener("readystatechange", () => {
    if ((fetchAlluserReq.status == 200) && (fetchAlluserReq.readyState == 4)) {
        users = JSON.parse(fetchAlluserReq.response)
        console.log(users)
    }
})


function fetchAllusers() {
    fetchAlluserReq.open("GET", "http://localhost:3000/users")
    fetchAlluserReq.send()
}




register.addEventListener('click', function (e) {
    e.preventDefault();
    var http = new XMLHttpRequest();
    let user = {
        user_name: userName.value.trim(),
        email: Email.value.trim(),
        address: Address.value.trim(),
        tel: Tel.value.trim(),
        password: Password.value.trim()
    };

    let isDouble = users.some(function (u) {
        return (
            u.user_name.toLowerCase() === user.user_name.toLowerCase() ||
            u.email.toLowerCase() === user.email.toLowerCase()
        );
    });

    if (isDouble) {
        alert('userName or email already exists');
    } else {
        http.open('POST', 'http://localhost:3000/users');
        http.setRequestHeader('Content-Type', 'application/json');
        http.onreadystatechange = function () {
            if ((http.readyState == 4) && (http.status == 201)) {
                window.location.href = "./login.html"
                alert("تم التسجيل بنجاح!");
                register.disabled = true;
                userName.value = '';
                Email.value = '';
                Address.value = '';
                Tel.value = '';
                Password.value = '';
            }
        }
        http.send(JSON.stringify(user));
    }
});

function checkInputsFilled() {
    if (
        userName.value.trim() !== '' &&
        Email.value.trim() !== '' &&
        Address.value.trim() !== '' &&
        Tel.value.trim() !== '' &&
        Password.value.trim() !== ''
    ) {
        // register.disabled = false;
    } else {
        // register.disabled = true;
    }
}


fetchAllusers()

userName.addEventListener('input', checkInputsFilled);
Email.addEventListener('input', checkInputsFilled);
Address.addEventListener('input', checkInputsFilled);
Tel.addEventListener('input', checkInputsFilled);
