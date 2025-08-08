import React from 'react'
import Template from "../components/common/Template"
import signUpImg from "../assets/undraw_sign-up_qamz.png"

const SignUp = () => {
  return (
    <div>
      <Template 
      img={signUpImg}
      des1={"Experience the future of online shopping."}
      des2={"Millions trust Shopfinity for their daily needs."}
      des3={"Shopping made simple, fast, and smart."}
      fromType={"signup"}
      />
    </div>
  )
}

export default SignUp