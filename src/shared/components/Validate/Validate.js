function validateEmail(value) {
  let reg = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;
  if (value == '') {
    return 'Your email is required';
  }
  if (!reg.test(value)) {
    return 'Invalid email, please fill again';
  } else return '';
}
function validatePhone(value) {
  let reg = /^\d{10}$/;
  if (value == '') {
    return 'Your phone number is required';
  }
  if (!reg.test(value)) {
    return 'Invalid phone number';
  } else return '';
}
function validateIdCode(value) {
  let reg = /^\d{9}$/;
  if (value == '') {
    return 'Your identify code is required';
  }
  if (!reg.test(value)) {
    return 'Invalid identify code (9 numbers)';
  } else return '';
}
function validateResidentCode(value) {
  let reg = /^\d{9}$/;
  if (value == '') {
    return 'Your resident code is required';
  }
  if (!reg.test(value)) {
    return 'Invalid resident code (9 numbers)';
  } else return '';
}
function validatePassword(value) {
  let reg = /^.{5,}$/;
  if (value == '') {
    return 'Your password is required';
  }
  if (!reg.test(value)) {
    return 'Password minimum eight characters';
  } else return '';
}

function validateName(value) {
  if (value == '') {
    return 'Your name is required';
  } else return '';
}

export {
  validateEmail as validateEmail,
  validatePassword as validatePassword,
  validatePhone as validatePhone,
  validateIdCode as validateIdCode,
  validateResidentCode as validateResidentCode,
  validateName as validateName,
};
