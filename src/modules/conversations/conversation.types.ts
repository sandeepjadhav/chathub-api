export interface CreateConversationRequest {
  title?: string;
  providerId?: string;
  modelId?: string;
  isTemporary?: boolean;
}

export interface UpdateConversationRequest {
  title?: string;
  providerId?: string;
  modelId?: string;
   isTemporary?: boolean;
}
