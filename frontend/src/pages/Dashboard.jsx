import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Target, Users, AlertTriangle, Briefcase, Plus, Search, X, LogOut, CheckCircle2, Clock, Circle, Sun, Moon } from 'lucide-react';
import axios from 'axios';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const ModernCard = ({ title, value, icon, change, isAlert }) => (
  <div className={`bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border dark:border-zinc-800 hover:shadow-md transition-all duration-300 ${isAlert ? 'border-amber-200 dark:border-amber-900/50 hover:border-amber-300' : 'border-zinc-100 hover:border-indigo-100 dark:hover:border-indigo-500/30'}`}>
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-full ${isAlert ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-zinc-100 dark:bg-zinc-800'}`}>
        {icon}
      </div>
      <span className="font-semibold text-4xl text-zinc-950 dark:text-white">{value}</span>
    </div>
    <p className="text-zinc-600 dark:text-zinc-400 text-sm font-medium">{title}</p>
    <p className={`text-xs mt-1 ${isAlert ? 'text-amber-700 dark:text-amber-500' : 'text-zinc-500 dark:text-zinc-500'}`}>{change}</p>
  </div>
);

const CreateProjectModal = ({ isOpen, onClose, onProjectCreated, token }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await api.post('/api/projects', { title, description });
      onProjectCreated(response.data);
      setTitle('');
      setDescription('');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="bg-white dark:bg-zinc-900 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)] w-full max-w-md overflow-hidden border border-zinc-100 dark:border-zinc-800">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur-md">
          <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Create New Project</h3>
          <button onClick={onClose} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:rotate-90 rounded-full transition-all duration-300 cursor-pointer">
            <X className="w-5 h-5 text-zinc-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && <p className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>}
          <div>
            <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">Project Title</label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all bg-zinc-50 dark:bg-zinc-800 dark:text-white text-zinc-900 font-medium" placeholder="e.g., E-commerce Redesign"/>
          </div>
          <div>
            <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">Description</label>
            <textarea required rows="3" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none resize-none transition-all bg-zinc-50 dark:bg-zinc-800 dark:text-white text-zinc-900 font-medium" placeholder="Briefly describe the project goals..."/>
          </div>
          <div className="pt-5 flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3.5 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 active:scale-95 transition-all duration-200 cursor-pointer">Cancel</button>
            <button type="submit" disabled={loading} className="group relative overflow-hidden flex-1 px-4 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold shadow-md active:scale-95 disabled:opacity-70 transition-all duration-300 cursor-pointer border border-indigo-500/50">
              <span className="relative z-10 tracking-wide">{loading ? 'Creating...' : 'Create Project'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({ activeTasks: 0, totalUsers: 1, totalTasks: 0 });
  const [recentTasks, setRecentTasks] = useState([]);
  const navigate = useNavigate();

  // --- THEME STATE LOGIC ---
  const [isDark, setIsDark] = useState(localStorage.getItem('theme') === 'dark');

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = JSON.parse(localStorage.getItem('user'));
        
        if (!token) { navigate('/login'); return; }
        
        setUser(userData);
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        const [projectsRes, statsRes, recentRes] = await Promise.all([
          api.get('/api/projects', config),
          api.get('/api/projects/stats', config),
          api.get('/api/tasks/recent', config)
        ]);
        
        setProjects(Array.isArray(projectsRes.data) ? projectsRes.data : []);
        setStats(statsRes.data || { activeTasks: 0, totalUsers: 1, totalTasks: 0 });
        setRecentTasks(Array.isArray(recentRes.data) ? recentRes.data : recentRes.data?.tasks || []);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        if(error.response?.status === 401) { handleLogout(); }
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleProjectCreated = (newProject) => {
    setProjects([newProject, ...projects]);
    setAlertMessage('Created project successfully');
    setTimeout(() => setAlertMessage(''), 3000);
  };

  const filteredProjects = (Array.isArray(projects) ? projects : []).filter(project => 
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const safeRecentTasks = Array.isArray(recentTasks) ? recentTasks : [];

  const highlightMatch = (text, query) => {
    if (!query || query.trim() === '') return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, index) => 
          regex.test(part) ? (
            <strong key={index} className="bg-amber-200/60 dark:bg-amber-500/40 rounded-sm text-zinc-950 dark:text-white px-0.5">{part}</strong>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const formatStatus = (status) => {
    if(status === 'TODO') return { text: 'To Do', color: 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700', dot: 'bg-slate-400'  };
    if(status === 'IN_PROGRESS') return { text: 'In Progress', color: 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800/50', dot: 'bg-violet-500'};
    if(status === 'DONE') return { text: 'Done', color: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50', dot: 'bg-emerald-500'  };
    return { text: status, color: 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700' };
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-zinc-500 font-medium">Loading Workspace...</div>;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-white p-8 relative transition-colors duration-300">
      
      <AnimatePresence>
        {alertMessage && (
          <motion.div initial={{ opacity: 0, y: -20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.9 }} transition={{ type: "spring", stiffness: 300, damping: 25 }} className="fixed top-6 right-6 z-50 bg-zinc-900 border border-zinc-800 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 font-semibold text-sm">
            <div className="p-1 bg-emerald-500/10 text-emerald-400 rounded-full">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span>{alertMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <CreateProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onProjectCreated={handleProjectCreated} token={localStorage.getItem('token')}/>

      <div className="flex items-center justify-between pb-8 mb-8 border-b border-zinc-200/80 dark:border-zinc-800">
        <div className="flex items-center gap-4">
          <div className="bg-white dark:bg-zinc-900 p-2.5 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800">
            <LayoutDashboard className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">Team Overview</h1>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm">Welcome back, <span className="text-zinc-900 dark:text-white font-bold">{user?.name}</span></p>
              
              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wide border ${user?.role === 'ADMIN' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50' : 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800/50'}`}>
                {user?.role}
              </span>
              
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 ml-2"></span>
              
              <div className="relative w-[400px] focus-within:w-[500px] hidden lg:block group transition-all duration-300 ease-out ml-2">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects..." 
                  className="w-full pl-4 pr-11 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 outline-none shadow-sm hover:shadow-md font-medium text-zinc-800 dark:text-white text-sm transition-all" 
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center h-full px-1">
                  {searchQuery ? (
                    <button onClick={() => setSearchQuery('')} className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer" title="Clear search">
                        <X className="w-4 h-4" />
                    </button>
                  ) : (
                    <Search className="w-4 h-4 text-zinc-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-5">
          {/* --- THEME TOGGLE SLIDER (Integrated Icons) --- */}
          <div className="flex items-center pr-5 border-r border-zinc-200 dark:border-zinc-800 hidden md:flex">
            <label htmlFor="themeToggleDash" className="relative flex items-center h-8 w-16 cursor-pointer rounded-full bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 transition-colors shadow-inner">
              <input 
                type="checkbox" 
                id="themeToggleDash" 
                className="peer sr-only" 
                checked={isDark} 
                onChange={toggleTheme} 
              />
              <span className="absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white dark:bg-zinc-900 transition-transform duration-300 peer-checked:translate-x-8 shadow-sm">
                {isDark ? <Moon className="w-3.5 h-3.5 text-indigo-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
              </span>
            </label>
          </div>

          <button onClick={handleLogout} className="group flex items-center gap-2 text-sm font-bold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50 px-4 py-2.5 rounded-xl transition-all duration-300 cursor-pointer shadow-sm">
            <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"/> Logout
          </button>
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-500/20 uppercase border-2 border-white dark:border-zinc-900 cursor-pointer hover:scale-105 transition-transform">
            {user?.name.substring(0, 2)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
        <ModernCard title="Total Assigned Tasks" value={stats.activeTasks} icon={<Target className="w-7 h-7 text-indigo-600 dark:text-indigo-400"/>} change={`Out of ${stats.totalTasks} total tasks`}/>
        <ModernCard title="Active Projects" value={projects.length} icon={<Briefcase className="w-7 h-7 text-indigo-600 dark:text-indigo-400"/>} change="Realtime from DB"/>
        <ModernCard title="Active Team Members" value={stats.totalUsers} icon={<Users className="w-7 h-7 text-indigo-600 dark:text-indigo-400"/>} change="Total registered users"/>
        <ModernCard title="Overdue Items" value="0" icon={<AlertTriangle className="w-7 h-7 text-amber-600 dark:text-amber-500"/>} change="All clear!" isAlert/>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              {searchQuery ? 'Search Results' : 'Active Projects'}
            </h2>
            {user?.role === 'ADMIN' && (
              <button onClick={() => setIsModalOpen(true)} className="group relative overflow-hidden flex items-center gap-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-7 py-3 rounded-full text-sm font-bold shadow-md hover:shadow-lg active:scale-95 transition-all duration-300">
                <Plus className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500 relative z-10"/> 
                <span className="relative z-10 tracking-wide">Create New Project</span>
              </button>
            )}
          </div>
          
          <div className="space-y-4">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-2xl bg-zinc-50/50 dark:bg-zinc-800/50">
                <p className="text-zinc-500 font-semibold">
                  {searchQuery ? 'No projects matched your search.' : 'No projects found in DB.'}
                </p>
              </div>
            ) : (
              filteredProjects.map((p) => (
                <div key={p._id} className="group p-6 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
                        {highlightMatch(p.title, searchQuery)}
                      </h3>
                      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-1.5">
                        {highlightMatch(p.description, searchQuery)}
                      </p>
                    </div>
                    <button onClick={() => navigate(`/project/${p._id}`)} className="text-sm font-bold px-5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl group-hover:border-indigo-200 group-hover:bg-indigo-50 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-all duration-300">
                      View Tasks →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="xl:col-span-4 bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800">
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-8">Recent Activity</h2>
          
          <div className="space-y-6">
            {safeRecentTasks.length === 0 ? (
               <div className="text-center py-16 border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-2xl bg-zinc-50/50 dark:bg-zinc-800/50">
                 <p className="text-zinc-500 text-sm font-semibold">No tasks created yet.</p>
               </div>
            ) : (
              safeRecentTasks.map((task) => (
                <div key={task._id} className="flex gap-4">
                  <div className="relative mt-1">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center relative z-10">
                      <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="absolute top-8 bottom-[-24px] left-1/2 -translate-x-1/2 w-0.5 bg-zinc-100 dark:bg-zinc-800 last:hidden"></div>
                  </div>
                  
                  <div className="flex-1 pb-4">
                    <p className="text-sm font-bold text-zinc-900 dark:text-white leading-snug">
                      {task.title}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5" />
                      {task.projectId ? task.projectId.title : 'Unknown Project'}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${formatStatus(task.status).color}`}>
                        {formatStatus(task.status).text}
                      </span>
                      {task.assignedTo && (
                         <span className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-300 flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                           <Users className="w-3 h-3" /> {task.assignedTo.name.split(' ')[0]}
                         </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
