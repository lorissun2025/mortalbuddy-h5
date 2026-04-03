// Supabase Auth Module for Xianxia Pet Game
// 修仙宠物游戏 - 云端认证与存档同步模块

const SUPABASE_URL = 'https://hdhuisgjvrjjaadbdzuf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkaHVpc2dqdnJqamFhZGJkenVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNTYxMDUsImV4cCI6MjA5MDczMjEwNX0.73RwO09o65EUZEF9oP4-1s8n9pvs_9NEpNxt8d3327E';

let supabaseClient = null;
let autoSyncTimer = null;

function createClient() {
  if (supabaseClient) return supabaseClient;
  if (typeof supabase !== 'undefined' && supabase.createClient) {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return supabaseClient;
  }
  console.error('[Auth] Supabase SDK 未加载');
  return null;
}

async function initAuth() {
  const client = createClient();
  if (!client) return null;
  const { data: { session } } = await client.auth.getSession();
  return session ? session.user : null;
}

async function loginWithGoogle() {
  const client = createClient();
  if (!client) return;
  await client.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.href }
  });
}

async function logout() {
  const client = createClient();
  if (!client) return;
  await client.auth.signOut();
}

async function syncToCloud(state) {
  const client = createClient();
  if (!client) return false;
  const user = getCurrentUser();
  if (!user) return false;
  const { error } = await client
    .from('game_states')
    .upsert({
      user_id: user.id,
      state_json: state,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });
  if (error) {
    console.error('[Auth] 同步失败:', error.message);
    return false;
  }
  return true;
}

async function syncFromCloud() {
  const client = createClient();
  if (!client) return null;
  const user = getCurrentUser();
  if (!user) return null;
  const { data, error } = await client
    .from('game_states')
    .select('state_json')
    .eq('user_id', user.id)
    .single();
  if (error || !data) return null;
  return data.state_json;
}

function isLoggedIn() {
  const client = createClient();
  if (!client) return false;
  const session = client.auth.getSession();
  return !!session;
}

function getCurrentUser() {
  const client = createClient();
  if (!client) return null;
  return client.auth.getUser ? null : null;
}

// Sync with debounce
function triggerAutoSync(state) {
  if (autoSyncTimer) clearTimeout(autoSyncTimer);
  autoSyncTimer = setTimeout(() => {
    syncToCloud(state);
    autoSyncTimer = null;
  }, 5000);
}

// Listen auth state change for auto-sync
function setupAutoSync(getStateFn) {
  const client = createClient();
  if (!client) return;
  client.auth.onAuthStateChange((_event, session) => {
    if (session && typeof getStateFn === 'function') {
      triggerAutoSync(getStateFn());
    }
  });
}

function showCloudStatus(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const update = async () => {
    const client = createClient();
    if (!client) { el.textContent = '☁️❌'; return; }
    const { data: { session } } = await client.auth.getSession();
    el.textContent = session ? '☁️' : '☁️❌';
  };
  update();
  const client = createClient();
  if (client) {
    client.auth.onAuthStateChange(() => update());
  }
}

function renderLoginPage(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = `
    <div style="
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a1a1a 100%);
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      font-family: 'Georgia', serif; color: #d4c5a0; z-index: 9999;
    ">
      <div style="text-align: center; margin-bottom: 60px;">
        <div style="font-size: 64px; margin-bottom: 20px;">🐉</div>
        <h1 style="
          font-size: 36px; letter-spacing: 8px; margin: 0 0 10px 0;
          background: linear-gradient(90deg, #ffd700, #ff8c00);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        ">仙缘录</h1>
        <p style="font-size: 14px; color: #8a7a5a; letter-spacing: 4px;">修仙宠物 · 云端存档</p>
      </div>
      <button onclick="loginWithGoogle()" style="
        background: linear-gradient(135deg, #2a1a4a, #1a2a3a);
        border: 1px solid #4a3a2a; border-radius: 8px;
        color: #d4c5a0; font-size: 16px; padding: 14px 40px;
        cursor: pointer; letter-spacing: 2px;
        display: flex; align-items: center; gap: 12px;
        transition: all 0.3s;
      " onmouseover="this.style.borderColor='#ffd700';this.style.boxShadow='0 0 20px rgba(255,215,0,0.3)'"
         onmouseout="this.style.borderColor='#4a3a2a';this.style.boxShadow='none'">
        <span style="font-size: 20px;">🌐</span>
        <span>以仙门令牌登录</span>
      </button>
      <p style="margin-top: 30px; font-size: 12px; color: #5a4a3a;">登录后可自动同步修仙进度</p>
    </div>
  `;
}

function getCurrentUser() {
  const client = createClient();
  if (!client) return null;
  try {
    const session = client.auth.session;
    return session && session.user ? session.user : null;
  } catch {
    return null;
  }
}

function isLoggedIn() {
  return !!getCurrentUser();
}
