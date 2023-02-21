import * as Yup from 'yup';

const SignUpSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: Yup.string().required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  name: Yup.string().required('Name is required'),
  username: Yup.string().required('Username is required'),
});

export default SignUpSchema;
