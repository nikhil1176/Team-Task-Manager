import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Clock, CheckCircle2, Circle, X, Play, Check, Trash2, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';

// --- PREMIUM TASK CARD COMPONENT ---
const TaskCard = ({ task, onStatusChange, onDelete, isAdmin, currentUserId }) => {
  const getBorderColor = () => {
    if (task.status === 'TODO') return 'border-l-slate-400 dark:border-l-slate-500';
    if (task.status === 'IN_PROGRESS') return 'border-l-violet-500 dark:border-l-violet-400';
    if (task.status === 'DONE') return 'border-l-emerald-500 dark:border-l-emerald-400';
    return 'border-l-zinc-200';
  };

  // --- ACCESS CONTROL LOGIC ---
  // Status change button tabhi dikhega jab: Task unassigned ho, YA current user hi assignee ho
  const isAssignee = task.assignedTo && task.assignedTo._id === currentUserId;
  const isUnassigned = !task.assignedTo;
  const canChangeStatus = isAssignee || isUnassigned;

  return (
    <motion.div 
      layout 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`bg-white dark:bg-zinc-900/90 p-5 rounded-xl shadow-sm hover:shadow-md border-y border-r border-zinc-100 dark:border-zinc-800 border-l-4 ${getBorderColor()} transition-all duration-300 group`}
    >
      <div className="flex justify-between items-start gap-2 mb-2">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
              Task
            </span>
          </div>
          <h3 className="font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">
            {task.title}
          </h3>
        </div>
        
        {isAdmin && (
          <button onClick={() => onDelete(task._id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all" title="Delete Task">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-4">
        {task.description}
      </p>
      
      <div className="pt-4 border-t border-zinc-50 dark:border-zinc-800/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {task.assignedTo ? (
             <div className="flex items-center gap-2" title={task.assignedTo.name}>
               <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 text-white flex items-center justify-center text-[10px] font-bold shadow-sm shadow-violet-500/20">
                 {task.assignedTo.name.substring(0, 2).toUpperCase()}
               </div>
             </div>
          ) : (
             <div className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center border-dashed">
               <span className="text-[10px] font-medium text-zinc-400">NA</span>
             </div>
          )}
        </div>
        
        <div className="flex gap-2">
          {/* canChangeStatus lagaya gaya hai buttons ko secure karne ke liye */}
          {canChangeStatus && task.status === 'TODO' && (
            <button onClick={() => onStatusChange(task._id, 'IN_PROGRESS')} className="flex items-center gap-1.5 text-xs font-semibold text-violet-600 bg-violet-50 hover:bg-violet-100 dark:bg-violet-500/10 dark:text-violet-400 dark:hover:bg-violet-500/20 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
              <Play className="w-3.5 h-3.5" /> Start
            </button>
          )}
          {canChangeStatus && task.status === 'IN_PROGRESS' && (
            <button onClick={() => onStatusChange(task._id, 'DONE')} className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
              <Check className="w-3.5 h-3.5" /> Done
            </button>
          )}
          {task.status === 'DONE' && (
            <span className="flex items-center gap-1 text-xs font-semibold text-zinc-400 dark:text-zinc-500 px-2 py-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Completed
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// --- CREATE TASK MODAL ---
const CreateTaskModal = ({ isOpen, onClose, onTaskCreated, projectId, teamMembers }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const taskData = { title, description, projectId, status: 'TODO', assignedTo: assignedTo || null };
      const response = await api.post('/api/tasks', taskData);
      onTaskCreated(response.data);
      setTitle(''); setDescription(''); setAssignedTo(''); onClose();
    } catch (err) {
      console.error("Failed to create task", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-zinc-200 dark:border-zinc-800">
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Create New Task</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-md transition-colors cursor-pointer">
            <X className="w-5 h-5 text-zinc-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Task Title</label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all bg-white dark:bg-zinc-950 dark:text-white text-zinc-900" placeholder="e.g., Setup Database Schema"/>
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Description</label>
            <textarea required rows="3" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none resize-none transition-all bg-white dark:bg-zinc-950 dark:text-white text-zinc-900" placeholder="Add more details about this task..."/>
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Assign To</label>
            <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all bg-white dark:bg-zinc-950 dark:text-white text-zinc-900 cursor-pointer">
              <option value="">Unassigned</option>
              {teamMembers.map(member => (
                <option key={member._id} value={member._id}>{member.name} ({member.role})</option>
              ))}
            </select>
          </div>
          <div className="pt-2 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-semibold shadow-sm transition-colors disabled:opacity-70 cursor-pointer">
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// --- MAIN PROJECT DETAIL PAGE ---
const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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
  
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.role === 'ADMIN';
  const currentUserId = user?._id || user?.id; // Current User ID fetch kiya

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) { navigate('/login'); return; }
        
        const [projectRes, tasksRes, usersRes] = await Promise.all([
          api.get(`/api/projects/${id}`),
          api.get(`/api/tasks/project/${id}`),
          api.get(`/api/users`) 
        ]);
        
        setProject(projectRes.data); 
        setTasks(Array.isArray(tasksRes.data) ? tasksRes.data : []); 
        setTeamMembers(Array.isArray(usersRes.data) ? usersRes.data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate, token]);

  const handleTaskCreated = () => {
    const reloadTasks = async () => {
      const tasksRes = await api.get(`/api/tasks/project/${id}`);
      setTasks(Array.isArray(tasksRes.data) ? tasksRes.data : []);
    };
    reloadTasks();
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.patch(`/api/tasks/${taskId}/status`, { status: newStatus });
      setTasks(tasks.map(task => task._id === taskId ? { ...task, status: newStatus } : task));
    } catch (error) {
      console.error("Failed to update status", error); alert("Status update failed.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/api/tasks/${taskId}`);
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error("Failed to delete task", error); alert("Failed to delete task.");
    }
  };

  const todoTasks = (Array.isArray(tasks) ? tasks : []).filter(task => task.status === 'TODO');
  const inProgressTasks = (Array.isArray(tasks) ? tasks : []).filter(task => task.status === 'IN_PROGRESS');
  const doneTasks = (Array.isArray(tasks) ? tasks : []).filter(task => task.status === 'DONE');

  if (loading) return <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center font-bold text-zinc-500">Loading Board...</div>;

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 p-6 md:p-8 transition-colors duration-300">
      <CreateTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onTaskCreated={handleTaskCreated} projectId={id} teamMembers={teamMembers} />

      <div className="max-w-[1400px] mx-auto">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white font-semibold mb-8 transition-colors text-sm cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white tracking-tight capitalize mb-2">{project?.title}</h1>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium text-base max-w-2xl">{project?.description}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center pr-4 border-r border-zinc-200 dark:border-zinc-800">
              <label htmlFor="themeToggleProj" className="relative flex items-center h-8 w-14 cursor-pointer rounded-full bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 transition-colors shadow-inner">
                <input type="checkbox" id="themeToggleProj" className="peer sr-only" checked={isDark} onChange={toggleTheme} />
                <span className="absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white dark:bg-zinc-900 transition-transform duration-300 peer-checked:translate-x-6 shadow-sm">
                  {isDark ? <Moon className="w-3.5 h-3.5 text-violet-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                </span>
              </label>
            </div>

            {isAdmin && (
              <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all cursor-pointer">
                <Plus className="w-4 h-4"/> Create Task
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* TO DO COLUMN */}
          <div className="bg-slate-100/50 dark:bg-slate-900/20 rounded-2xl p-4 md:p-5 border border-slate-200/60 dark:border-slate-800/50 min-h-[calc(100vh-250px)]">
            <div className="flex items-center justify-between mb-5 px-1">
              <h2 className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 text-sm uppercase tracking-wide">
                <Circle className="w-4 h-4 text-slate-400"/> To Do
              </h2>
              <span className="bg-slate-200/50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold px-2.5 py-0.5 rounded-md">{todoTasks.length}</span>
            </div>
            <div className="space-y-3">
              <AnimatePresence>
                {/* currentUserId pass kiya gaya hai yahan */}
                {todoTasks.map(task => <TaskCard key={task._id} task={task} onStatusChange={handleStatusChange} onDelete={handleDeleteTask} isAdmin={isAdmin} currentUserId={currentUserId} />)}
              </AnimatePresence>
            </div>
          </div>

          {/* IN PROGRESS COLUMN */}
          <div className="bg-violet-50/50 dark:bg-violet-900/10 rounded-2xl p-4 md:p-5 border border-violet-100 dark:border-violet-900/30 min-h-[calc(100vh-250px)]">
            <div className="flex items-center justify-between mb-5 px-1">
              <h2 className="font-bold text-violet-700 dark:text-violet-400 flex items-center gap-2 text-sm uppercase tracking-wide">
                <Clock className="w-4 h-4 text-violet-500"/> In Progress
              </h2>
              <span className="bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-400 text-xs font-bold px-2.5 py-0.5 rounded-md">{inProgressTasks.length}</span>
            </div>
            <div className="space-y-3">
              <AnimatePresence>
                {inProgressTasks.map(task => <TaskCard key={task._id} task={task} onStatusChange={handleStatusChange} onDelete={handleDeleteTask} isAdmin={isAdmin} currentUserId={currentUserId} />)}
              </AnimatePresence>
            </div>
          </div>

          {/* DONE COLUMN */}
          <div className="bg-emerald-50/50 dark:bg-emerald-900/10 rounded-2xl p-4 md:p-5 border border-emerald-100 dark:border-emerald-900/30 min-h-[calc(100vh-250px)]">
            <div className="flex items-center justify-between mb-5 px-1">
              <h2 className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2 text-sm uppercase tracking-wide">
                <CheckCircle2 className="w-4 h-4 text-emerald-500"/> Done
              </h2>
              <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold px-2.5 py-0.5 rounded-md">{doneTasks.length}</span>
            </div>
            <div className="space-y-3">
              <AnimatePresence>
                {doneTasks.map(task => <TaskCard key={task._id} task={task} onStatusChange={handleStatusChange} onDelete={handleDeleteTask} isAdmin={isAdmin} currentUserId={currentUserId} />)}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;