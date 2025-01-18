import React, {useContext, useEffect, useState, } from 'react'
import { useUserContext } from '../context/user.context.jsx'
import {useNavigate} from "react-router-dom"
import axios from "../config/axios.js"

const Home = () => {

  const {user} = useUserContext(); 
  const [isModelOpen, setisModelOpen] = useState(false)
  const [projectName, setprojectName] = useState("")
  const [projects, setProjects] = useState([])
  const [projectCreated, setProjectCreated] = useState(false)



  const navigate = useNavigate()  
  
  const createProject = (e)=>{
    e.preventDefault()
    
    axios.post("/project/create", {
      name: projectName,
    }).then((res)=>{
      setisModelOpen(false)
      setProjectCreated(true)
    }).catch((err)=>{
      console.log(err);
    })
  }

  useEffect(() => {
    axios.get("/project/all").then((res)=>{
      setProjects(res.data.projects)
      navigate("/")
    }).catch((err)=>{
      console.log(err);
    })
  }, [projectCreated])
  
  

  return (
    <main className='p-4'>
            <div className="projects flex flex-wrap gap-3">
                <button onClick={()=> setisModelOpen(true)}
                    className="project p-4 border border-slate-300 rounded-md">
                    New Project
                    <i className="ri-link ml-2"></i>
                </button>

            
            {projects.map((project, i)=>(
              <div key={project._id}
              onClick={()=>navigate(`/project`, {state: {project}})} className="project flex flex-col gap-2 cursor-pointer p-4 border border-slate-300 rounded-md min-w-52 hover:bg-slate-200">
                  <h2 className='font-semibold'>{project.name}</h2>

                  <div className="flex gap-2">
                      <p> <small> <i className="ri-user-line"></i> Collaborators</small> :</p>
                      {project?.users?.length}
                  </div>
              </div>
            ))}
                


            </div>

            
            { isModelOpen && ( <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-md shadow-md w-1/3">
                    <h2 className="text-xl mb-4">Create New Project</h2>
                    <form onSubmit={createProject}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Project Name</label>
                            <input
                                type="text" value={projectName} onChange={(e)=> setprojectName(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required />
                        </div>
                        <div className="flex justify-end">
                            <button onClick={()=> setisModelOpen(false)} type="button" className="mr-2 px-4 py-2 bg-gray-300 rounded-md" >Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Create</button>
                        </div>
                    </form>
                </div>
            </div>)}
            


        </main>
  )
}

export default Home