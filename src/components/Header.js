import React from "react";
import DarkMode from "./Darkmode";

function Header() {
  return (
    <div className='switch-bar'>
      <div className='icon-container' />
      <div className='title-container'>
        TODO
      </div>
      <div className='icon-container' >
        <DarkMode />
      </div>
    </div>
  )
}

export default Header