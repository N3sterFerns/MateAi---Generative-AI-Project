import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'

const Project = () => {

    const location = useLocation()
    const [ isSidePanelOpen, setIsSidePanelOpen ] = useState(false)

    const handleSidePanel = ()=>{      
      setIsSidePanelOpen(!isSidePanelOpen)
    }
    
    
  return (
    <main className='h-screen w-screen flex'>
      <section className="left relative flex flex-col h-screen w-96 bg-slate-300">
        <header className='flex justify-between items-center p-2 px-4 w-full bg-slate-100 absolute top-0 z-40'>
            <button  className='flex cursor-pointer gap-2'>
              <i className="ri-add-fill mr-1"></i>
              <p>Add collaborator</p>
            </button>
            <button onClick={handleSidePanel} className='p-2 cursor-pointer'>
              <i className="ri-group-fill"></i>
            </button>
        </header>

        <div className="conversation-area pt-14 pb-10 flex-grow flex flex-col h-full relative">
          <div className="message-box p-1 flex-grow flex flex-col gap-2 overflow-auto max-h-full scrollbar-hide">
            <div className="incoming relative flex flex-col w-60 p-2 bg-slate-50 rounded-md ">
              <small className='opacity-65 text-xs'>test@test.com</small>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            </div>
            <div className="relative text-right flex self-end flex-col w-60 p-2 bg-slate-50 rounded-md ">
              <small className='opacity-65 text-xs'>test@test.com</small>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            </div>
          </div>
          <div className="inputField w-full flex absolute bottom-0">
            <input className='p-2 px-4 border-none outline-none flex-grow' type="text" placeholder='Enter message' />
            <button className='px-5 bg-slate-950 text-white'><i className="ri-send-plane-fill"></i></button>
          </div>
        </div>

        <div className={`sidePanel w-full h-full absolute transition-all ${isSidePanelOpen ?'translate-x-0' : '-translate-x-full'} bg-white top-0 z-50`}>
          <header className='flex justify-between items-center px-4 p-2 bg-slate-200'>

            <h1 className='font-semibold text-lg'>Collaborators</h1>

            <button onClick={handleSidePanel} className='p-2'>
                <i className="ri-close-fill text-2xl"></i>
            </button>
          </header>

          <div className="users flex flex-col gap-2 mt-2">
            <div className="user  cursor-pointer hover:bg-slate-200 p-2 flex  items-center">
                <div className='aspect-square rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600'>
                    <i className="ri-user-fill absolute"></i>
                </div>
                <h1 className='font-semibold text-lg'>t5est@test.com</h1>
            </div>
            <div className="user  cursor-pointer hover:bg-slate-200 p-2 flex gap-2 items-center">
                <div className='aspect-square rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600'>
                    <i className="ri-user-fill absolute"></i>
                </div>
                <h1 className='font-semibold text-lg'>t5est@test.com</h1>
            </div>
          </div>
        </div>

      </section>
    </main>
  )
}

export default Project