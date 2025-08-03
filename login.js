
let userNameConfirm = document.getElementById('userNameconfirm');
let passwordConfirm = document.getElementById('passwordConfirm');
let logIn = document.getElementById('login');
var getUserReq = new XMLHttpRequest()
logIn.disabled = true;

let users = JSON.parse(localStorage.getItem('users')) || [];


function fetchUser(userName, pass) {
    console.log({ user: userName, pass: pass })

    getUserReq.open("GET", `http://localhost:3000/users?user_name=${userName}&password=${pass}`)
    getUserReq.send()

}

logIn.addEventListener('click', function (e) {
    e.preventDefault();

    let usersLog = {
        user: userNameConfirm.value,
        pass: passwordConfirm.value.trim()
    };
    fetchUser(usersLog.user, usersLog.pass)
    // let isMatch = users.some(function (u) {
    //     return (
    //         u.user_name.toLowerCase() === usersLog.user.toLowerCase() &&
    //         u.password === usersLog.pass
    //     );
    // });

    // if (isMatch) {

    // }
    // else {
        
    // }
});

function checkInputsFilledLog() {
    if (
        userNameConfirm.value.trim() !== '' &&
        passwordConfirm.value.trim() !== ''
    ) {
        logIn.disabled = false;
    } else {
        logIn.disabled = true;
    }
}

userNameConfirm.addEventListener('input', checkInputsFilledLog);
passwordConfirm.addEventListener('input', checkInputsFilledLog);


getUserReq.addEventListener("readystatechange", () => {
    console.log({ status: getUserReq.status, response: getUserReq.status })
    if ((getUserReq.status == 200) && (getUserReq.readyState == 4)) {
        var user = JSON.parse(getUserReq.response)
        console.log(user)
        if (user.length) {
            console.log(user[0])
            sessionStorage.setItem("user",JSON.stringify(user[0]))
            alert("تم تسجيل الدخول بنجاح");
            userNameConfirm.value = '';
            passwordConfirm.value = '';
            window.location.href = "index.html";
        }
        else
        {
            alert('اسم المستخدم أو كلمة المرور غير صحيحة');
        }
    }
})