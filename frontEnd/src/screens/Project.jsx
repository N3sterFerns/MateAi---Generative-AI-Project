import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from "../config/axios"
import { initializeSocket, recievedMessage, sendMessage } from '../config/socket'
import { useUserContext } from '../context/user.context'
import Markdown from  "markdown-to-jsx"
import hljs from "highlight.js"
// import "highlight.js/styles/github.css";
import 'highlight.js/styles/atom-one-dark.css';
import UserInfo from './UserInfo'

const Project = () => {

    const location = useLocation()
    const navigate = useNavigate()
    const [ isSidePanelOpen, setIsSidePanelOpen ] = useState(false)
    const [ isModelOpen, setIsModelOpen ] = useState(false)
    const [ isSelectedId, setIsSelectedId ] = useState([])
    const [ users, setUsers ] = useState([])
    const [ search, setSearch] = useState("")
    const [ project, setProject ] = useState(location.state.project)
    const [ message, setMessage ] = useState("")
    const {user} = useUserContext()
    const [ messages, setMessages ] = useState([])
    const messageBoxRef = useRef(null)
    
    function SyntaxHighlightedCode({className, children}) {
      const ref = useRef(null)
  
      useEffect(() => {
          if (ref.current && className?.includes('lang-') ) {
              hljs.highlightElement(ref.current)
              // hljs won't reprocess the element unless this attribute is removed
              ref.current.removeAttribute('data-highlighted')
          }
      }, [ className, children ])
  
      return <code className={`${className} break-words whitespace-pre-wrap`} ref={ref} >{children}</code>
  }

  function WriteAiMessage(message) {

    // console.log(message);
    
    
    // const messageObject = JSON.parse(message)
    console.log(message);
    const messageBox = document.querySelector(".message-box")
    // messageBox.scrollTop = messageBox.scrollHeight;
    return (
        <div
            className='overflow-auto bg-slate-950 text-white rounded-sm p-2'
        >
            <Markdown
                children={message}
                options={{
                    overrides: {
                        code: SyntaxHighlightedCode,
                    },
                }}
            />
        </div>)
  }
    

    const handleSidePanel = ()=>{      
      setIsSidePanelOpen(!isSidePanelOpen)
    }
    const handleCollebrationModal = ()=>{      
      setIsModelOpen(!isModelOpen)
    }

    const sendMessages = ()=>{
      
      // const input = document.getElementById("messageInput");
      // if (message.trim()) {
        sendMessage("project-message", {
          message: message,
          sender: user
        })
      //   setMessage("")
      // }
      console.log(message);
      
      appendOutgoingMessage(message)
      setMessage(prevMessages=> [...prevMessages, {sender: user, message}])
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
        setMessages(prevMsg=> [...prevMsg, data])
      })
      
      axios.get(`/project/get-project/${project._id}`).then((res)=>{
        setProject(res.data.project)
      }).catch((err)=>{
        console.log(err);
      })

      // axios.get("/users/all").then((res)=>{
      //   setUsers(res.data.users)
      // }).catch((err)=>{
      //   console.log(err);
      // })
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
      
    //   const appendOutgoingMessage = (outgoingMsg)=>{
    //     const messageBox = document.querySelector(".message-box")
    //     const msg = document.createElement("div")
    //     msg.classList.add('message', 'flex', 'flex-col',"w-fit", "text-right", "self-end", "relative", "max-w-[15rem]", "p-2", "bg-slate-50", "rounded-md")
    //     msg.innerHTML = `
    //     <small className='opacity-65 text-xs'>${user.email}</small>
    //     <p>${outgoingMsg}</p>
    //     `
    //     // messageBox.scrollTop = messageBox.scrollHeight;
    //     messageBox.appendChild(msg)
    // }

    const appendOutgoingMessage = (outgoingMsg) => {
      // Use React state instead of direct DOM manipulation
      setMessages(prev => [...prev, {
        sender: { user: user, email: user.email },
        message: outgoingMsg
      }]);
    };

    useEffect(() => {
      const debounceTimer = setTimeout(() => {
        if (search) {
          fetchSearchUsers(search);
        } else {
          setUsers([]); // Clear results if email is empty
        }
      }, 500); // 500ms debounce delay      
  
      // Cleanup the timeout when email changes quickly
      return () => clearTimeout(debounceTimer);
    }, [search]);

    const fetchSearchUsers = async (email)=>{
        axios.get(`/users/all/search?email=${email}`).then((res)=>{
            setUsers(res.data.users)            
        }).catch((err)=>{
          console.log(err);
        })
    }


    useEffect(() => {
      if (messageBoxRef.current) {
        messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
        // console.log(messageBoxRef.current);
        
      }
    }, [messages, message]);

    
    
  return (
    <main className='h-screen w-screen flex flex-col'>
  {/* Navbar */}
  <nav className='w-full bg-white shadow-sm py-3 px-6 flex items-center justify-between'>
    <div className='flex items-center gap-4'>
      <button className='md:hidden p-2' onClick={handleSidePanel}>
        <i className="ri-menu-line text-xl"></i>
      </button>
      <h1 className='text-xl font-bold text-slate-800'>Project Chat</h1>
    </div>
    
    <UserInfo/>
  </nav>

  <div className='flex flex-1 overflow-hidden'>
    {/* Sidebar */}
    <section className={`md:relative absolute md:flex flex-col h-full w-80 bg-white border-r transition-transform duration-300 ${isSidePanelOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 z-30`}>
      <header className='flex justify-between items-center p-4 border-b'>
        <div className='flex items-center gap-2'>
          <div className='p-2 bg-blue-100 rounded-lg'>
            <i className="ri-team-line text-blue-600"></i>
          </div>
          <h2 className='font-semibold text-slate-800'>Collaborators</h2>
        </div>
        <button onClick={handleSidePanel} className='md:hidden p-2 hover:bg-slate-100 rounded-lg'>
          <i className="ri-close-line text-xl"></i>
        </button>
      </header>

      <div className='flex-1 overflow-y-auto p-2'>
        {project.users?.map((user, i) => (
            <div key={i+Math.random(10)} className='flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors'>
              <div className='w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-white'>
                <i className="ri-user-line"></i>
              </div>
              <div>
                <h3 className='font-medium text-slate-800'>{user.email}</h3>
                <span className='text-sm text-slate-500'>Collaborator</span>
              </div>
            </div>
        ))}
      </div>

      <div className='p-4 border-t'>
        <button 
          onClick={handleCollebrationModal}
          className='w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors'
        >
          <i className="ri-user-add-line"></i>
          Add Collaborator
        </button>
      </div>
    </section>

    {/* Chat Area */}
    <section className='flex-1 flex flex-col relative'>
      <div className=' h-[85vh] overflow-y-auto scrollbar-none'>
        <div  className="message-box p-1  flex-grow flex flex-col gap-2 ">
          {messages.map((msg, index) => (
            <div ref={messageBoxRef} key={`${index}-${msg.sender.user?._id}`} className={`${msg.sender.email === '@mateai' ? 'max-w-80' : 'max-w-52'} ${msg.sender.user?._id === user._id.toString() ? 'ml-auto' : ''} message overflow-auto scrollbar-none flex flex-col p-2 bg-slate-700 text-white w-fit rounded-md`}>
              <small className='opacity-65 text-xs'>{msg.sender.email}</small>
              <div className='text-sm'>
                {msg.sender.email === '@mateai' ? WriteAiMessage(msg.message) : <p>{msg.message}</p>}
              </div>
            </div>
          ))}
        </div>

        <div className='p-4 border-t bg-white absolute bottom-0 w-full'>
          <div className='relative'>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className='w-full pl-4 pr-12 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Type your message...'
              onKeyPress={(e) => e.key === 'Enter' && sendMessages()}
            />
            <button 
              onClick={sendMessages}
              className='absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-100 rounded-full'
            >
              <i className="ri-send-plane-2-fill text-blue-600 text-xl"></i>
            </button>
          </div>
        </div>
      </div>

    </section>

    {/* Add Collaborator Modal */}
    {isModelOpen && (
      <div className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-40'>
        <div className='bg-white rounded-xl w-full max-w-md'>
          <header className='flex justify-between items-center p-4 border-b'>
            <h2 className='text-lg font-semibold'>Add Collaborators</h2>
            <button 
              onClick={handleCollebrationModal}
              className='p-2 hover:bg-slate-100 rounded-lg'
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </header>
          
          <div className='p-4 pt-2 space-y-4'>
            

          <div className="max-w-2xl mx-auto ">
            <div className="relative flex items-center">
              {/* <!-- Search Icon --> */}
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* <!-- Search Input --> */}
              <input 
                type="text" 
                value={search}
                onChange={(e)=> setSearch(e.target.value)}
                placeholder="Search users..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none  transition-colors duration-200" 
                required
              />

              {/* <!-- Search Button (visible on mobile) --> */}
              <button className="md:hidden ml-1 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
            <hr className='my-2' />
          </div>

          <div className='space-y-2 scrollbar-none max-h-32 p-1 overflow-y-auto'>
                {/* Users list */}
                {users.length !== 0 ? (
                  users?.map((user)=>(
                    <div key={user._id+Math.random(1000)} onClick={() => handleUserClick(user._id)} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors
                      ${Array.from(isSelectedId).indexOf(user._id)!= -1 ? "bg-slate-200" : "bg-slate-400"} `}>
                      <div className='w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-white'>
                        <i className="ri-user-line"></i>
                      </div>
                      <span className='font-medium'>{user.email}</span>
                    </div>
                  ))
                ): (<h1 className='text-center text-sm'>No user Found!!</h1>)}
                
            </div>
            
            <button
              onClick={addCollaborators}
              className='w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors'
            >
              Add Selected Users
            </button>
          </div>
        </div>
      </div>
    )} 
  </div>
</main>
  )
}

export default Project