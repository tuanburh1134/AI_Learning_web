export const AuthRoutes = {
  login: '/login',
  register: '/register'
} as const

export const AuthValidationMessages = {
  requiredField: 'Trường này không được để trống.',
  invalidEmail: 'Email không đúng định dạng.',
  passwordMinLength: 'Mật khẩu phải có ít nhất 8 ký tự.',
  passwordMismatch: 'Mật khẩu nhập lại không khớp.',
  registerSuccess: 'Đăng ký thành công. Vui lòng đăng nhập.',
  loginSuccess: 'Đăng nhập thành công.'
}

export const AuthFormFieldNames = {
  fullName: 'fullName',
  email: 'email',
  password: 'password',
  confirmPassword: 'confirmPassword'
} as const
