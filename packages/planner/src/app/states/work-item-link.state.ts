import { WorkItemLinkUI } from './../models/link';

// Initial state will alway be null
// null - no link is loaded yet
// empty array may also mean link are loaded but there was no link
export type WorkItemLinkState = WorkItemLinkUI[] | null;

// Initial state will always be null
export const initialState: WorkItemLinkState = null;
