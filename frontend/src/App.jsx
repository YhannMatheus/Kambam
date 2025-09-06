/*
KAMBAM — Frontend (Single-file React app)
=======================================
Este arquivo contém um app React pronto para ser usado como base do frontend
para a API KAMBAM descrita pelo usuário.

Como usar (rápido):
1. Crie um projeto React (Vite recomendado):
   npm create vite@latest kambam-frontend -- --template react
   cd kambam-frontend
2. Instale dependências:
   npm install
   npm install classnames
3. Configure Tailwind (opcional, mas recomendado):
   npx tailwindcss init -p
   Adicione os diretórios ao content e importe './src/index.css' com as diretivas
   base/components/utilities do Tailwind.
4. Copie este arquivo para src/App.jsx e importe no src/main.jsx.
5. Execute:
   npm run dev

Ambiente / Variáveis:
- API_BASE_URL (opcional) -> default: http://localhost:3333  (ou qualquer porta do backend)

Descrição resumida do que está aqui:
- AuthContext: gerencia token JWT em localStorage e fornece dados do usuário
- API helper: fetch wrapper que injeta Authorization Bearer token
- Páginas: Login, Register, ProjectsList, KanbanBoard (board + colunas + tarefas)
- Drag & Drop: implementação com HTML5 Drag & Drop para mover tarefas entre colunas
- ProtectedRoute: renderiza rotas protegidas

Observações:
- Adaptar nomes de campos do backend (ex: /api/projects, /api/tasks) caso sejam diferentes
- O objetivo aqui é ser um ponto de partida estético e funcional
*/

import React, { useState, useEffect, createContext, useContext } from 'react';

// ---------- Config ----------
const API_BASE = (typeof window !== 'undefined' && window.__ENV__ && window.__ENV__.API_BASE_URL) || import.meta.env.VITE_API_BASE_URL || 'http://localhost:3333';

// ---------- Auth Context ----------
const AuthContext = createContext();
export function useAuth(){ return useContext(AuthContext); }

function AuthProvider({ children }){
  const [token, setToken] = useState(() => localStorage.getItem('kambam_token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    if (!token) { setUser(null); setLoading(false); return; }
    // fetch profile
    (async () => {
      try{
        const res = await fetch(`${API_BASE}/api/users/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Token inválido');
        const data = await res.json();
        setUser(data);
      }catch(e){
        console.warn(e);
        setToken(null);
        localStorage.removeItem('kambam_token');
      }finally{ setLoading(false); }
    })();
  }, [token]);

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/api/users/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error('Falha no login');
    const data = await res.json();
    const t = data.token || data.accessToken || data; // adapt
    setToken(t);
    localStorage.setItem('kambam_token', t);
    return t;
  };

  const register = async (name, email, password) => {
    const res = await fetch(`${API_BASE}/api/users/register`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(()=>({message:'Erro'}));
      throw new Error(err.message || 'Falha no registro');
    }
    return await res.json();
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('kambam_token');
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ---------- API helper ----------
async function api(path, { method = 'GET', body, token } = {}){
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, {
    method, headers, body: body ? JSON.stringify(body) : undefined
  });
  if (res.status === 204) return null;
  const data = await res.json().catch(()=>null);
  if (!res.ok) throw data || new Error('API error');
  return data;
}

// ---------- UI Helpers ----------
function Button({ children, className = '', ...props }){
  return (
    <button className={`px-4 py-2 rounded-md shadow-sm hover:shadow-md transition ${className}`} {...props}>{children}</button>
  );
}

// ---------- Pages / Components ----------
function LoginPage(){
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) =>{
    e.preventDefault(); setLoading(true); setError(null);
    try{
      await login(email, password);
    }catch(err){ setError(err.message); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Entrar no KAMBAM</h2>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm">Email</label>
            <input className="w-full mt-1 p-2 border rounded" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm">Senha</label>
            <input type="password" className="w-full mt-1 p-2 border rounded" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          {error && <div className="text-red-600">{error}</div>}
          <div className="flex justify-between items-center">
            <Button className="bg-indigo-600 text-white" type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</Button>
            <a href="#register" className="text-sm text-indigo-600">Criar conta</a>
          </div>
        </form>
      </div>
    </div>
  );
}

function RegisterPage(){
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const submit = async (e) =>{
    e.preventDefault(); setError(null); setSuccess(null);
    try{
      await register(name, email, password);
      setSuccess('Conta criada com sucesso. Faça login.');
    }catch(err){ setError(err.message); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Criar conta</h2>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm">Nome</label>
            <input className="w-full mt-1 p-2 border rounded" value={name} onChange={e=>setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm">Email</label>
            <input className="w-full mt-1 p-2 border rounded" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm">Senha</label>
            <input type="password" className="w-full mt-1 p-2 border rounded" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          {error && <div className="text-red-600">{error}</div>}
          {success && <div className="text-green-600">{success}</div>}
          <div className="flex justify-between items-center">
            <Button className="bg-green-600 text-white" type="submit">Criar</Button>
            <a href="#login" className="text-sm text-indigo-600">Já tenho conta</a>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProjectsList({ onOpenProject }){
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(()=>{
    (async ()=>{
      try{
        const data = await api('/api/projects', { token });
        setProjects(data || []);
      }catch(e){ setError('Erro ao carregar projetos'); }
      setLoading(false);
    })();
  }, [token]);

  if (loading) return <div>Carregando projetos...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Seus projetos</h3>
        <Button className="bg-indigo-600 text-white" onClick={async ()=>{
          const title = prompt('Nome do projeto');
          if (!title) return;
          try{
            const np = await api('/api/projects', { method: 'POST', body: { title }, token });
            setProjects(prev => [np, ...prev]);
          }catch(e){ alert('Erro'); }
        }}>Novo projeto</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map(p=> (
          <div key={p.id} className="bg-white p-4 rounded shadow">
            <h4 className="font-semibold">{p.title}</h4>
            <p className="text-sm text-slate-500">{p.description || '—'}</p>
            <div className="mt-3 flex gap-2">
              <Button className="bg-slate-100" onClick={()=>onOpenProject(p)}>Abrir</Button>
              <Button className="bg-red-100 text-red-800" onClick={async ()=>{
                if (!confirm('Remover projeto?')) return;
                await api(`/api/projects/${p.id}`, { method: 'DELETE', token });
                setProjects(prev => prev.filter(x=>x.id !== p.id));
              }}>Excluir</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KanbanBoard({ project, onBack }){
  const { token } = useAuth();
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(()=>{
    (async ()=>{
      try{
        const cols = await api(`/api/columns?projectId=${project.id}`, { token });
        // assume the backend returns columns with tasks included
        setColumns(cols || []);
      }catch(e){ console.error(e); }
      setLoading(false);
    })();
  }, [project.id, token]);

  const onDragStart = (e, taskId, fromColId) =>{
    e.dataTransfer.setData('text/plain', JSON.stringify({ taskId, fromColId }));
  };
  const onDrop = async (e, toColId) =>{
    e.preventDefault();
    const raw = e.dataTransfer.getData('text/plain');
    if (!raw) return;
    const { taskId, fromColId } = JSON.parse(raw);
    if (fromColId === toColId) return;
    try{
      // move on backend
      await api(`/api/tasks/${taskId}/move`, { method: 'POST', token, body: { columnId: toColId } });
      // optimistic update locally
      setColumns(prev => {
        const fromIdx = prev.findIndex(c=>c.id===fromColId);
        const toIdx = prev.findIndex(c=>c.id===toColId);
        if (fromIdx===-1||toIdx===-1) return prev;
        const task = prev[fromIdx].tasks.find(t=>t.id===taskId);
        if (!task) return prev;
        const copy = JSON.parse(JSON.stringify(prev));
        copy[fromIdx].tasks = copy[fromIdx].tasks.filter(t=>t.id!==taskId);
        copy[toIdx].tasks.unshift(task);
        return copy;
      });
    }catch(e){ console.error(e); }
  };

  const allowDrop = (e) => e.preventDefault();

  if (loading) return <div>Carregando board...</div>;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">{project.title}</h2>
          <div className="text-sm text-slate-500">{project.description}</div>
        </div>
        <div className="flex gap-2">
          <Button className="bg-slate-100" onClick={onBack}>Voltar</Button>
        </div>
      </div>

      <div className="grid grid-flow-col auto-cols-max gap-4 overflow-x-auto pb-4">
        {columns.map(col => (
          <div key={col.id} className="w-80 bg-slate-100 p-3 rounded-lg shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">{col.title} <span className="text-sm text-slate-500">({col.tasks?.length || 0})</span></h4>
              <button onClick={async ()=>{
                const title = prompt('Nome da coluna'); if (!title) return;
                try{
                  const c = await api('/api/columns', { method: 'POST', token, body: { projectId: project.id, title } });
                  setColumns(prev => [...prev, c]);
                }catch(e){ console.error(e); }
              }}>+</button>
            </div>

            <div className="flex-1 space-y-2" onDragOver={allowDrop} onDrop={(e)=>onDrop(e,col.id)}>
              {(col.tasks || []).map(task => (
                <div key={task.id} draggable onDragStart={(e)=>onDragStart(e, task.id, col.id)} className="bg-white p-3 rounded shadow cursor-grab" onDoubleClick={()=>setSelectedTask(task)}>
                  <div className="font-medium">{task.title}</div>
                  <div className="text-sm text-slate-500">{task.description ? task.description.slice(0,80) : ''}</div>
                </div>
              ))}
            </div>

            <div className="mt-3">
              <button className="text-sm text-indigo-600" onClick={async ()=>{
                const title = prompt('Título da tarefa'); if (!title) return;
                try{
                  const t = await api('/api/tasks', { method: 'POST', token, body: { title, columnId: col.id, projectId: project.id } });
                  setColumns(prev => prev.map(c=> c.id===col.id ? { ...c, tasks: [t, ...(c.tasks||[])] } : c));
                }catch(e){ console.error(e); }
              }}>+ Nova tarefa</button>
            </div>
          </div>
        ))}
      </div>

      {selectedTask && (
        <TaskModal task={selectedTask} onClose={()=>setSelectedTask(null)} onSave={async (updated)=>{
          try{
            const t = await api(`/api/tasks/${selectedTask.id}`, { method: 'PUT', token, body: updated });
            // update local
            setColumns(prev => prev.map(col=> ({ ...col, tasks: col.tasks.map(ts => ts.id===t.id ? t : ts) } )));
            setSelectedTask(null);
          }catch(e){ console.error(e); }
        }} />
      )}
    </div>
  );
}

function TaskModal({ task, onClose, onSave }){
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-6 rounded w-full max-w-lg">
        <h3 className="text-lg font-semibold">Editar tarefa</h3>
        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-sm">Título</label>
            <input className="w-full mt-1 p-2 border rounded" value={title} onChange={e=>setTitle(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm">Descrição</label>
            <textarea className="w-full mt-1 p-2 border rounded" value={description} onChange={e=>setDescription(e.target.value)} />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button onClick={onClose}>Cancelar</Button>
          <Button className="bg-indigo-600 text-white" onClick={()=>onSave({ title, description })}>Salvar</Button>
        </div>
      </div>
    </div>
  );
}

function Header(){
  const { user, logout } = useAuth();
  return (
    <header className="bg-white shadow-sm p-3 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="text-xl font-bold">KAMBAM</div>
        <div className="text-sm text-slate-500">Kanban manager</div>
      </div>
      <div className="flex items-center gap-3">
        {user && <div className="text-sm">{user.name || user.email}</div>}
        <button className="text-sm text-red-600" onClick={logout}>Sair</button>
      </div>
    </header>
  );
}

// ---------- Main App ----------
export default function App(){
  const [route, setRoute] = useState(() => {
    const h = window.location.hash.replace('#','');
    return h || 'home';
  });
  const [activeProject, setActiveProject] = useState(null);

  useEffect(()=>{
    const onHash = ()=> setRoute(window.location.hash.replace('#','') || 'home');
    window.addEventListener('hashchange', onHash);
    return ()=> window.removeEventListener('hashchange', onHash);
  },[]);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="container mx-auto p-4">
          {route === 'login' && <LoginPage />}
          {route === 'register' && <RegisterPage />}
          {route === 'home' && (
            <Home onOpenProject={(p)=>{ setActiveProject(p); setRoute('board'); }} />
          )}
          {route === 'board' && activeProject && (
            <KanbanBoard project={activeProject} onBack={()=>{ setActiveProject(null); setRoute('home'); }} />
          )}
        </main>
      </div>
    </AuthProvider>
  );
}

function Home({ onOpenProject }){
  const { token, loading } = useAuth();
  if (!token) return <div className="p-4">Por favor <a href="#login" className="text-indigo-600">entre</a> ou <a href="#register" className="text-indigo-600">registre-se</a>.</div>;
  if (loading) return <div className="p-4">Carregando...</div>;
  return <ProjectsList onOpenProject={onOpenProject} />;
}

/*
Possíveis melhorias para produção:
- Usar router real (React Router)
- Melhor tratamento de erros e loaders
- PWA / Service Worker
- WebSocket para updates em tempo real
- Tests e cobertura
- Componentização e arquivos separados
*/
