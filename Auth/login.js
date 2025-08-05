
let userNameConfirm = document.getElementById('userNameconfirm');
let passwordConfirm = document.getElementById('passwordConfirm');
let logIn = document.getElementById('login');
var getUserReq = new XMLHttpRequest()
logIn.disabled = true;

var adminLogin = false
var adminKeyValue

let users = JSON.parse(localStorage.getItem('users')) || [];



function fetchUser(userName, pass) {
    console.log({ user: userName, pass: pass })

    getUserReq.open("GET", `http://localhost:3000/users?user_name=${userName}&key=customer&password=${pass}`)
    getUserReq.send()
}


function fetchAdmin(userName, pass,key) {
    console.log({ admin: userName, pass: pass  , adminKey:key})

    getUserReq.open("GET", `http://localhost:3000/users?user_name=${userName}&key=${key}&password=${pass}`)
    getUserReq.send()
}

function setCookie(key, value, daysToExpire) {
    const date = new Date();
    date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = key + "=" + value + ";" + expires + ";path=/";
}

logIn.addEventListener('click', function (e) {
    e.preventDefault();

    let usersLog = {
        user: userNameConfirm.value,
        pass: passwordConfirm.value.trim()
    };
    if (adminLogin == false) {
        fetchUser(usersLog.user, usersLog.pass)
    } else {
        fetchAdmin(usersLog.user, usersLog.pass,adminKeyValue)
    }
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
            // sessionStorage.setItem("user",JSON.stringify(user[0]))
            
            alert("تم تسجيل الدخول بنجاح");
            userNameConfirm.value = '';
            passwordConfirm.value = '';
            if (adminLogin == true) {
                window.location.href = "./../admin/order.html";
            } else {
                window.location.href = "./../customer/Home.html";
                setCookie("userId",user[0].id,30)
            }
        }
        else
        {
            alert('البيانات غير صحيحه');
        }
    }
})


let admink=document.getElementById('adminK');
let admininner=document.getElementById('admin')

function adminKey(){
    if(admink.style.display=='block'){
    admink.style.display='none';
    admininner.innerHTML='login as admin'
    }
    else{
    admink.style.display='block';
    admininner.innerHTML=''
    }
}

admink.addEventListener("change", (event) => {
    adminKeyValue =  event.target.value
    adminLogin = true
});