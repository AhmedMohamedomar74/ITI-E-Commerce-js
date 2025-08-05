let userName = document.getElementById('userName');
let Email = document.getElementById('Email');
let Address = document.getElementById('address');
let Tel = document.getElementById('tel');
let Password = document.getElementById('password');
let register = document.getElementById('register');

var fetchAlluserReq = new XMLHttpRequest();
var users = [];
let userNameError = document.getElementById('userNameError');
let emailError = document.getElementById('emailError');
let addressError = document.getElementById('addressError');
let telError = document.getElementById('telError');
let passwordError = document.getElementById('passwordError');
const regexPatterns = {
  userName: /^[a-zA-Z ]{3,20}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  address: /^.{3,100}$/,
  tel: /^01[0-2,5]{1}[0-9]{8}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/
};

function validateInput(input, pattern, errorMsg, errorElement, message) {
  if (!pattern.test(input.value.trim())) {
    input.classList.add('invalid');
    input.classList.remove('valid');
    errorElement.innerText = message;
    errorElement.style.display = 'block';
    return false;
  } else {
    input.classList.remove('invalid');
    input.classList.add('valid');
    errorElement.style.display = 'none';
    return true;
  }
}

function checkInputsFilled2() {
  let validUser = validateInput(userName, regexPatterns.userName, userNameError, userNameError, "الاسم يجب أن يكون بين 3 و 20 حرفًا");
  let validEmail = validateInput(Email, regexPatterns.email, emailError, emailError, "البريد غير صالح");
  let validAddr = validateInput(Address, regexPatterns.address, addressError, addressError, "العنوان لا يقل عن 3 حروف");
  let validTel = validateInput(Tel, regexPatterns.tel, telError, telError, "رقم الهاتف غير صالح (مثل: 01012345678)");
  let validPass = validateInput(Password, regexPatterns.password, passwordError, passwordError, "كلمة المرور يجب أن تحتوي على حرف كبير وصغير ورقم");

  register.disabled = !(validUser && validEmail && validAddr && validTel && validPass);
}

[userName, Email, Address, Tel, Password].forEach(input => {
  input.addEventListener('input', checkInputsFilled2);
});
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
        user_name: userName.value,
        email: Email.value,
        address: Address.value,
        tel: Tel.value,
        password: Password.value,
        key : "customer"
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
