/**
 * Modelo para anotações de gatos
 */
export interface Note {
  id: string;
  catId: string;
  date: string;
  text: string;
}

/**
 * Request para criação/atualização de anotação
 */
export interface NoteRequest {
  catId: string;
  date: string;
  text: string;
}