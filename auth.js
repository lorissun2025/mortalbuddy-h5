// MortalBuddy - Supabase Auth Module
// 修仙宠物游戏 - 云端认证与存档同步

const SUPABASE_URL = 'https://hdhuisgjvrjjaadbdzuf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkaHVpc2dqdnJqamFhZGJkenVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNTYxMDUsImV4cCI6MjA5MDczMjEwNX0.73RwO09o65EUZEF9oP4-1s8n9pvs_9NEpNxt8d3327E';

let sb = null;
let autoSyncTimer = null;
let currentUser = null;

function getSB() {
  if (sb) return sb;
  if (typeof supabase !== 'undefined' && supabase.createClient) {
    sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return sb;
  }
  console.error('[Auth] Supabase SDK 未加载');
  return null;
}

async function initAuth() {
  const client = getSB();
  if (!client) return null;
  try {
    const { data: { session } } = await client.auth.getSession();
    if (session && session.user) {
      currentUser = session.user;
      return currentUser;
    }
  } catch (e) {
    console.error('[Auth] initAuth error:', e);
  }
  return null;
}

async function loginWithGoogle() {
  const client = getSB();
  if (!client) return;
  try {
    await client.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + window.location.pathname }
    });
  } catch (e) {
    console.error('[Auth] login error:', e);
    alert('登录失败：' + e.message);
  }
}

async function logout() {
  const client = getSB();
  if (!client) return;
  try {
    await client.auth.signOut();
    currentUser = null;
    alert('已退出登录');
    location.reload();
  } catch (e) {
    console.error('[Auth] logout error:', e);
  }
}

function isLoggedIn() {
  return !!currentUser;
}

function getCurrentUser() {
  return currentUser;
}

async function syncToCloud(state) {
  const client = getSB();
  if (!client || !currentUser) return false;
  if (!state) return false;
  try {
    const stateStr = typeof state === 'string' ? state : JSON.stringify(state);
    if (!stateStr || stateStr === '{}' || stateStr === 'null') return false;
    const { error } = await client
      .from('game_states')
      .upsert({
        user_id: currentUser.id,
        state_json: stateStr,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
    if (error) {
      console.error('[Auth] 同步失败:', error.message);
      return false;
    }
    console.log('[Auth] 云端同步成功');
    return true;
  } catch (e) {
    console.error('[Auth] sync error:', e);
    return false;
  }
}

async function syncFromCloud() {
  const client = getSB();
  if (!client || !currentUser) return null;
  try {
    const { data, error } = await client
      .from('game_states')
      .select('state_json')
      .eq('user_id', currentUser.id)
      .single();
    if (error) {
      console.log('[Auth] syncFromCloud: no cloud data yet or error:', error.message);
      return null;
    }
    if (!data || !data.state_json) return null;
    const cloudState = typeof data.state_json === 'string' ? JSON.parse(data.state_json) : data.state_json;
    if (!cloudState || !cloudState.pet) return null;
    // Apply cloud data to game
    if (typeof game !== 'undefined' && game) {
      game.state = cloudState;
      game.save();
      if (typeof updateUI === 'function') updateUI();
      console.log('[Auth] 云端数据已加载:', cloudState.pet.species);
    }
    return cloudState;
  } catch (e) {
    console.error('[Auth] syncFromCloud error:', e);
    return null;
  }
}

function triggerAutoSync(state) {
  if (autoSyncTimer) clearTimeout(autoSyncTimer);
  autoSyncTimer = setTimeout(() => {
    syncToCloud(state);
    autoSyncTimer = null;
  }, 5000);
}

function showCloudStatus(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = currentUser ? '☁️' : '☁️❌';
}
