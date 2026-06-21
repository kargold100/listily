// ─── Listily Mutations Log ───────────────────────────────────────────────────
// Persists ALL admin actions beyond overrides: new entries added via the
// register form, status changes (approve/reject) on listings, etc.
//
// Stored in localStorage as a log of mutations, replayed on every page load
// after data.js loads (so DB/MENTORS/OPPORTUNITIES include the changes).
//
// Mutation format:
//   { type: 'business'|'mentor'|'opportunity', op: 'add'|'status', id, data?, status?, ts }
// ─────────────────────────────────────────────────────────────────────────────

(function () {
  'use strict';

  const STORE_KEY = '_listily_mutations';

  function getAll() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); }
    catch (e) { return []; }
  }

  function saveAll(arr) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(arr)); } catch (e) {}
  }

  function add(mut) {
    const all = getAll();
    mut.ts = mut.ts || new Date().toISOString();
    all.push(mut);
    saveAll(all);
    return mut;
  }

  // Apply all mutations to in-memory DB/MENTORS/OPPORTUNITIES
  function applyAll() {
    const all = getAll();
    let added = 0, updated = 0;
    all.forEach(mut => {
      let arr = null;
      if (mut.type === 'business' && typeof DB !== 'undefined') arr = DB;
      else if (mut.type === 'mentor' && typeof MENTORS !== 'undefined') arr = MENTORS;
      else if (mut.type === 'opportunity' && typeof OPPORTUNITIES !== 'undefined') arr = OPPORTUNITIES;
      if (!arr) return;

      if (mut.op === 'add' && mut.data) {
        // Don't duplicate — check if id already exists
        const exists = arr.find(x => String(x.id) === String(mut.data.id));
        if (!exists) { arr.push(mut.data); added++; }
      } else if (mut.op === 'status') {
        const target = arr.find(x => String(x.id) === String(mut.id));
        if (target) { target.status = mut.status; if (mut.rejectReason) target.rejectReason = mut.rejectReason; updated++; }
      } else if (mut.op === 'update' && mut.data) {
        const target = arr.find(x => String(x.id) === String(mut.id));
        if (target) { Object.assign(target, mut.data); updated++; }
      }
    });
    if ((added > 0 || updated > 0) && window.console) {
      console.info('[Listily] Mutations applied: ' + added + ' added, ' + updated + ' updated');
    }
  }

  // ── Public API ─────────────────────────────────────────────
  window.Mutations = {
    add: add,
    getAll: getAll,
    applyAll: applyAll,
    clear() { localStorage.removeItem(STORE_KEY); },
    purge(predicate) {
      const all = getAll();
      const kept = all.filter(m => !predicate(m));
      saveAll(kept);
      return all.length - kept.length;
    },

    // Helpers for common ops
    recordAdd(type, fullEntry) {
      return add({ type, op: 'add', id: fullEntry.id, data: fullEntry });
    },
    recordStatus(type, id, status, rejectReason) {
      return add({ type, op: 'status', id, status, rejectReason });
    },
    recordUpdate(type, id, changes) {
      return add({ type, op: 'update', id, data: changes });
    },
  };

  // Apply mutations on script load (after data.js)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyAll);
  } else {
    applyAll();
  }
})();
