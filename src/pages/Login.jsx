import React from 'react'
import Template from "../components/common/Template"
import  loginImg from "../assets/undraw_login_weas.png"

const Login = () => {
  return (
    <div>
        <Template 
      img={loginImg}
      des1={"Welcome Back"}
      des2={"Sign in to explore deals and delights."}
      des3={"Shopping made simple, fast, and smart."}
      fromType={"login"}
      />
    </div>
  )
}

export default Login