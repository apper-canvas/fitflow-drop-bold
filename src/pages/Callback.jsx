import React, { useEffect } from 'react'

const Callback = () => {
  useEffect(() => {
    const { ApperUI } = window.ApperSDK;
    ApperUI.showSSOVerify("#authentication-callback");
  }, []);
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div id="authentication-callback"></div>
    </div>
  )
}

export default Callback