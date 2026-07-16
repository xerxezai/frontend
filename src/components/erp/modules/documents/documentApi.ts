import { erpFetch, erpUpload } from '../../../../hooks/useERPApi';
import type { DocumentT, DocumentVersionT, DocumentCommentT, DocumentAuditEntryT } from './documentsShared';

export function getDocuments(category?: string, search?: string): Promise<DocumentT[]> {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (search) params.set('search', search);
  const qs = params.toString();
  return erpFetch(`documents/${qs ? `?${qs}` : ''}`).then(res => (Array.isArray(res) ? res : res.results ?? []));
}

export function uploadDocument(formData: FormData): Promise<DocumentT> {
  return erpUpload('documents/', formData, 'POST');
}

export function getDocument(id: number): Promise<DocumentT> {
  return erpFetch(`documents/${id}/`);
}

export function updateDocument(id: number, body: Record<string, unknown>): Promise<DocumentT> {
  return erpFetch(`documents/${id}/`, { method: 'PATCH', body: JSON.stringify(body) });
}

export function deleteDocument(id: number): Promise<null> {
  return erpFetch(`documents/${id}/`, { method: 'DELETE' });
}

export function approveDocument(id: number): Promise<DocumentT> {
  return erpFetch(`documents/${id}/approve/`, { method: 'POST', body: JSON.stringify({}) });
}

export function rejectDocument(id: number): Promise<DocumentT> {
  return erpFetch(`documents/${id}/reject/`, { method: 'POST', body: JSON.stringify({}) });
}

export function getVersions(id: number): Promise<DocumentVersionT[]> {
  return erpFetch(`documents/${id}/versions/`);
}

export function uploadVersion(id: number, formData: FormData): Promise<DocumentVersionT> {
  return erpUpload(`documents/${id}/upload_version/`, formData, 'POST');
}

export function searchDocuments(query: string, category?: string): Promise<DocumentT[]> {
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (category) params.set('category', category);
  return erpFetch(`documents/search/?${params.toString()}`);
}

export function submitForReview(id: number): Promise<DocumentT> {
  return erpFetch(`documents/${id}/submit-for-review/`, { method: 'POST', body: JSON.stringify({}) });
}

export function trackDownload(id: number): Promise<{ status: string }> {
  return erpFetch(`documents/${id}/track-download/`, { method: 'POST', body: JSON.stringify({}) });
}

export function getComments(id: number): Promise<DocumentCommentT[]> {
  return erpFetch(`documents/${id}/comments/`);
}

export function addComment(id: number, comment: string): Promise<DocumentCommentT> {
  return erpFetch(`documents/${id}/comments/`, { method: 'POST', body: JSON.stringify({ comment }) });
}

export function deleteComment(id: number, commentId: number): Promise<null> {
  return erpFetch(`documents/${id}/comments/${commentId}/`, { method: 'DELETE' });
}

export function getAuditTrail(id: number): Promise<DocumentAuditEntryT[]> {
  return erpFetch(`documents/${id}/audit-trail/`);
}

export function generateShareLink(id: number): Promise<{ share_token: string; share_url: string }> {
  return erpFetch(`documents/${id}/generate-share-link/`, { method: 'POST', body: JSON.stringify({}) });
}
