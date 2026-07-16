import { erpFetch, erpUpload } from '../../../../hooks/useERPApi';
import type { DocumentT, DocumentVersionT } from './documentsShared';

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
