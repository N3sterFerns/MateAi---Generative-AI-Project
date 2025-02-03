import React, { useContext, useEffect, useState } from "react";
import { useUserContext } from "../context/user.context.jsx";
import { useNavigate } from "react-router-dom";
import axios from "../config/axios.js";
import UserInfo from "./UserInfo.jsx";

const Home = () => {
  const { user } = useUserContext();
  const [isModelOpen, setisModelOpen] = useState(false);
  const [projectName, setprojectName] = useState("");
  const [projects, setProjects] = useState([]);
  const [projectCreated, setProjectCreated] = useState(false);
  const [isProjectDeleted, setIsProjectDeleted] = useState(false);


  const navigate = useNavigate();

  const createProject = (e) => {
    e.preventDefault();

    axios
      .post("/project/create", {
        name: projectName,
      })
      .then((res) => {
        setisModelOpen(false);
        setProjectCreated(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteProject = (id) => {
    axios
      .get(`/project/remove/${id}`)
      .then(() => {
        setIsProjectDeleted(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    console.log("deleted");

    axios
      .get("/project/all")
      .then((res) => {
        setProjects(res.data.projects);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  }, [projectCreated, isProjectDeleted]);



  
  return (
    <>
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl font-bold text-blue-600">
                  Mate Ai
                </span>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <a
                    href="#"
                    className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
                  >
                    About Me
                  </a>
                </div>
              </div>
            </div>
            <div className="block">
              <div className="ml-4 flex items-center md:ml-6">
                <button className="p-2 text-gray-600 hover:text-blue-600">
                  <i className="ri-notification-3-line text-xl"></i>
                </button>
                
                <UserInfo/>
               
              </div>
            </div>

            {/* Mobile menu button
            {showLogout &&(
              <div className="-mr-2 flex md:hidden">
                <button onClick={handleLogout} className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-600">
                  <i className="ri-menu-line text-xl"></i>
                </button>
              </div>
                    
            )} */}
          </div>
        </div>
      </nav>

      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* New Project Card */}
          <button
            onClick={() => setisModelOpen(true)}
            className="group p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 transition-all duration-300 flex flex-col items-center justify-center min-h-[180px] hover:bg-blue-50"
          >
            <div className="text-center">
              <i className="ri-add-circle-line text-3xl text-blue-600 group-hover:text-blue-700 mb-2 transition-all"></i>
              <p className="font-semibold text-gray-700 group-hover:text-blue-700">
                New Project
              </p>
            </div>
          </button>

          {/* Project Cards */}
          {projects.map((project) => (
            <div
              key={project._id}
              onClick={() => navigate(`/project`, { state: { project } })}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-100 hover:border-blue-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-lg text-gray-800">
                    {project.name}
                  </h2>
                  <i className="ri-arrow-right-up-line text-gray-400 hover:text-blue-600"></i>
                </div>
                <i
                  className="ri-delete-bin-line text-red-500 cursor-pointer hover:text-red-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProject(project._id);
                  }}
                ></i>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                  <i className="ri-user-line text-sm"></i>
                  <span>{project?.users?.length || 0}</span>
                </div>
                <span className="text-xs text-gray-400">
                  Last updated: 2d ago
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* New Project Modal */}
        {isModelOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Create New Project
                </h2>
                <button
                  onClick={() => setisModelOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
              <form onSubmit={createProject}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setprojectName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter project name"
                    required
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setisModelOpen(false)}
                    className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Create Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default Home;
