import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import axios from "../config/axios"
import { initializeSocket, recievedMessage, sendMessage } from '../config/socket'
import { useUserContext } from '../context/user.context'

const Project = () => {

    const location = useLocation()
    const [ isSidePanelOpen, setIsSidePanelOpen ] = useState(false)
    const [ isModelOpen, setIsModelOpen ] = useState(false)
    const [ isSelectedId, setIsSelectedId ] = useState([])
    const [ users, setUsers ] = useState([])
    const [ project, setProject ] = useState(location.state.project)
    const [ message, setMessage ] = useState("")
    const {user} = useUserContext()
    const messageBox = useRef(null)
    
    // console.log(location.state.project._id);
    

    const handleSidePanel = ()=>{      
      setIsSidePanelOpen(!isSidePanelOpen)
    }
    const handleCollebrationModal = ()=>{      
      setIsModelOpen(!isModelOpen)
    }

    const sendMessages = ()=>{
      
      // const input = document.getElementById("messageInput");
      // if (event.key === "Enter" && input.value.trim() !== "") {
        sendMessage("project-message", {
          message: message,
          sender: user
        })
      // }
      appendOutgoingMessage(message)
      setMessage("")
    }

    const handleUserClick = (id)=>{        
      if(!isSelectedId.includes(id)){
        setIsSelectedId((prev)=> [...prev, id])
      }else{
        setIsSelectedId((prev) => prev.filter(item => item !== id));
      }
    }

    const addCollaborators = ()=>{
      axios.put("/project/add-user", {
        users: users,
        projectId: location.state.project._id
      }).then((res)=>{
        console.log(res.data);
        setIsModelOpen(false)
      }).catch((err)=>{
        console.log(err);
      })
    }

    useEffect(() => {
      initializeSocket(project._id)

      recievedMessage("project-message", (data)=>{
        console.log(data);
        
        appendIncomingMessage(data)
      })
      
      axios.get(`/project/get-project/${project._id}`).then((res)=>{
        setProject(res.data.project)
      }).catch((err)=>{
        console.log(err);
      })

      axios.get("/users/all").then((res)=>{
        setUsers(res.data.users)
      }).catch((err)=>{
        console.log(err);
      })
    }, []) 

    const appendIncomingMessage = (msgObject)=>{
        const messageBox = document.querySelector(".message-box")
        const msg = document.createElement("div")
        msg.classList.add('message', 'flex', 'flex-col', "w-fit" , "relative", "max-w-[15rem]", "p-2", "bg-slate-50", "rounded-md")
        msg.innerHTML = `
          <small className='opacity-65 text-xs'>${msgObject.sender?.email}</small>
          <p>${msgObject.message}</p>
        `
        messageBox.appendChild(msg)
        messageBox.scrollTop = messageBox.scrollHeight;
      }
      
      const appendOutgoingMessage = (outgoingMsg)=>{
        const messageBox = document.querySelector(".message-box")
        const msg = document.createElement("div")
        msg.classList.add('message', 'flex', 'flex-col',"w-fit", "text-right", "self-end", "relative", "max-w-[15rem]", "p-2", "bg-slate-50", "rounded-md")
        msg.innerHTML = `
        <small className='opacity-65 text-xs'>${user.email}</small>
        <p>${outgoingMsg}</p>
        `
        messageBox.scrollTop = messageBox.scrollHeight;
        messageBox.appendChild(msg)
    }
    
    
    
    
  return (
    <main className='h-screen w-screen flex'>
      <section className="left relative flex flex-col h-screen w-96 bg-slate-300">
        <header className='flex justify-between items-center p-2 px-4 w-full bg-slate-100 absolute top-0 z-40'>
            <button onClick={handleCollebrationModal} className='flex cursor-pointer gap-2'>
              <i className="ri-add-fill mr-1"></i>
              <p>Add collaborator</p>
            </button>
            <button onClick={handleSidePanel} className='p-2 cursor-pointer'>
              <i className="ri-group-fill"></i>
            </button>
        </header>

        <div className="conversation-area pt-14 pb-10 flex-grow flex flex-col h-full relative">
          <div className="message-box p-1 scrollbar-none flex-grow flex flex-col gap-2 overflow-auto max-h-full scrollbar-hide">
          {/* <div className="incoming relative w-fit inline-flex flex-col max-w-[15rem] p-2 bg-slate-50 rounded-md">
            <small className="opacity-65 text-xs">test@test.com</small>
            <p>Lorem lorem</p>
          </div>
            <div className="relative text-right flex self-end flex-col w-60 p-2 bg-slate-50 rounded-md ">
              <small className='opacity-65 text-xs'>test@test.com</small>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            </div> */}
          </div>
          <div className="inputField messageInput w-full flex absolute bottom-0">
            <input value={message} onChange={(e)=> setMessage(e.target.value) } className='p-2 px-4 border-none outline-none flex-grow' type="text" placeholder='Enter message' />
            <button onClick={sendMessages} className='px-5 bg-slate-950 text-white'><i className="ri-send-plane-fill"></i></button>
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
            {project.users && project.users.map((user)=>(
              <div key={user._id+user.email} className="user  cursor-pointer hover:bg-slate-200 p-2 flex gap-3 items-center">
                  <div className='aspect-square rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600'>
                      <i className="ri-user-fill absolute"></i>
                  </div>
                  <h1 className='font-semibold text-lg'>{user.email}</h1>
              </div>
            ))}
          </div>
        </div>

      </section>

      {isModelOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md w-96 max-w-full relative">
            <header className='flex justify-between items-center mb-4'>
                <h2 className='text-xl font-semibold'>Select User</h2>
                <button onClick={handleCollebrationModal} className='p-2'>
                    <i className="ri-close-fill"></i>
                </button>
            </header>
            <div  className="users-list flex flex-col gap-2 mb-2 max-h-96 overflow-auto">
              {users?.map((user, i)=>(
                <div key={i} onClick={()=>handleUserClick(user._id)} className={`user ${Array.from(isSelectedId).indexOf(user.id)!= -1 ? "bg-slate-200" : ""}  cursor-pointer bg-slate-100 hover:bg-slate-200 p-3 rounded-md flex items-center gap-3`} >
                    <div className='aspect-square relative rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600'>
                        <i className="ri-user-fill absolute"></i>
                    </div>
                    <h1 className='font-semibold text-lg'>test@test.com</h1>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center">
              <button onClick={addCollaborators}
                  className=' px-4 py-2 mt-3 bg-blue-600 text-white rounded-md'>
                  Add Collaborators
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default Project