import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import { erpFetch, useERPList } from '../../../../hooks/useERPApi';
import { FF, WHITE, OG, BORDER, inp, fmtINR, Card3D } from './mlmShared';

interface TreeNode {
  id: number;
  distributor_id: string;
  name: string;
  level: number;
  total_sales: number;
  total_earnings: number;
  status: string;
  children: TreeNode[];
}

const LEVEL_COLOR: Record<number, string> = { 1: OG, 2: '#1d4ed8', 3: '#8b5cf6' };

/** Returns true if this node or any descendant matches the query — used to auto-expand
 *  the ancestor chain of a search hit. */
function subtreeMatches(node: TreeNode, q: string): boolean {
  if (!q) return false;
  if (node.name.toLowerCase().includes(q) || node.distributor_id.toLowerCase().includes(q)) return true;
  return node.children.some(c => subtreeMatches(c, q));
}

function TreeNodeView({ node, query, depth }: { node: TreeNode; query: string; depth: number }) {
  const q = query.trim().toLowerCase();
  const isMatch = !!q && (node.name.toLowerCase().includes(q) || node.distributor_id.toLowerCase().includes(q));
  const hasMatchingDescendant = subtreeMatches(node, q) && !isMatch;
  const [expanded, setExpanded] = useState(true);

  // Auto-expand ancestor chain of a search hit whenever the query changes.
  useEffect(() => {
    if (q && subtreeMatches(node, q)) setExpanded(true);
  }, [q]); // eslint-disable-line react-hooks/exhaustive-deps

  const hasChildren = node.children.length > 0;

  return (
    <div style={{ position: 'relative', paddingLeft: depth > 0 ? 26 : 0 }}>
      {depth > 0 && (
        <div style={{ position: 'absolute', left: 8, top: 0, bottom: 0, width: 1, background: 'rgba(0,0,0,0.10)' }} />
      )}
      <div style={{ position: 'relative', marginBottom: 10 }}>
        {depth > 0 && (
          <div style={{ position: 'absolute', left: 8, top: 20, width: 18, height: 1, background: 'rgba(0,0,0,0.10)' }} />
        )}
        <Card3D accent={LEVEL_COLOR[node.level] || OG} p="12px 16px" style={{
          display: 'inline-flex', alignItems: 'center', gap: 12, minWidth: 260,
          ...(isMatch ? { outline: '2px solid #C9883A', boxShadow: '0 0 0 4px rgba(201,136,58,0.18)', background: '#fffaf1' } : {}),
        }}>
          {hasChildren ? (
            <button onClick={() => setExpanded(e => !e)} title={expanded ? 'Collapse' : 'Expand'}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className={`fas fa-chevron-${expanded ? 'down' : 'right'}`} style={{ fontSize: 11 }} />
            </button>
          ) : <span style={{ width: 20, flexShrink: 0 }} />}
          <div style={{ width: 34, height: 34, borderRadius: 9, background: `${LEVEL_COLOR[node.level] || OG}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <i className="fas fa-user" style={{ color: LEVEL_COLOR[node.level] || OG, fontSize: 13 }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 13, color: '#1A1A1A', whiteSpace: 'nowrap' }}>{node.name}</div>
            <div style={{ fontFamily: FF, fontSize: 11, color: '#6B6B6B' }}>{node.distributor_id} · Level {node.level}</div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontFamily: FF, fontWeight: 800, fontSize: 12.5, color: OG }}>{fmtINR(node.total_sales)}</div>
            <div style={{ fontFamily: FF, fontSize: 10, color: '#9ca3af' }}>sales</div>
          </div>
        </Card3D>
        {hasMatchingDescendant && !expanded && (
          <span style={{ marginLeft: 10, fontSize: 11, color: '#C9883A', fontFamily: FF, fontWeight: 700 }}>● match below</span>
        )}
      </div>
      {hasChildren && expanded && (
        <div>
          {node.children.map(child => <TreeNodeView key={child.id} node={child} query={query} depth={depth + 1} />)}
        </div>
      )}
    </div>
  );
}

export default function NetworkTreePanel() {
  const distributors = useERPList<any>('mlm/distributors/');
  const [rootId, setRootId] = useState<string>('');
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const roots = useMemo(() => distributors.data.filter((d: any) => !d.sponsor), [distributors.data]);

  useEffect(() => {
    if (!rootId && roots.length > 0) setRootId(String(roots[0].id));
  }, [roots, rootId]);

  const loadTree = useCallback(async (id: string) => {
    if (!id) { setTree(null); return; }
    setLoading(true);
    try { setTree(await erpFetch(`mlm/distributors/${id}/network/`)); }
    catch (err: any) { toast.error(err.message || 'Could not load network tree'); setTree(null); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadTree(rootId); }, [rootId, loadTree]);

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20, alignItems: 'center' }}>
        <select value={rootId} onChange={e => setRootId(e.target.value)} style={{ ...inp, width: 260 }}>
          <option value="">— Select root distributor —</option>
          {roots.map((d: any) => <option key={d.id} value={d.id}>{d.distributor_id} — {d.name}</option>)}
        </select>
        <div style={{ position: 'relative' }}>
          <i className="fas fa-search" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: 12 }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or ID to highlight…" style={{ ...inp, width: 260, paddingLeft: 30 }} />
        </div>
        <button onClick={() => loadTree(rootId)} title="Refresh tree" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: 12, fontFamily: FF, display: 'flex', alignItems: 'center', gap: 6 }}>
          <i className="fas fa-sync-alt" style={{ fontSize: 11 }} />Refresh
        </button>
      </div>

      {loading ? (
        <div className="d-flex align-items-center justify-content-center py-5"><div className="spinner-border" style={{ color: OG }} /></div>
      ) : !tree ? (
        <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, padding: 48, textAlign: 'center', color: '#6B6B6B', fontFamily: FF }}>
          {roots.length === 0 ? 'No top-level distributors found. Add a root distributor first.' : 'Select a root distributor to view its network.'}
        </div>
      ) : (
        <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, padding: '20px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
          <TreeNodeView node={tree} query={search} depth={0} />
        </div>
      )}
    </div>
  );
}
