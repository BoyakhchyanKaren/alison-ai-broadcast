export enum BroadcastActionType {
    USER_JOIN = 'USER_JOIN',
    USER_LEAVE = 'USER_LEAVE',
    USER_UPDATE = 'USER_UPDATE',
    MESSAGE_SEND = 'MESSAGE_SEND',
    MESSAGE_DELETE = 'MESSAGE_DELETE',
    COUNTER_UPDATE = 'COUNTER_UPDATE',
    TYPING_START = 'TYPING_START',
    TYPING_STOP = 'TYPING_STOP',
    STATE_SYNC = 'STATE_SYNC',
    REQUEST_STATE = 'REQUEST_STATE'
}

export interface CollaborativeUser {
    id: string;
    username: string;
    lastActivity: number;
    isTyping: boolean;
    tabId: string;
}

export interface ChatMessage {
    id: string;
    userId: string;
    username: string;
    content: string;
    timestamp: number;
    expiresAt?: number | undefined;
}

export interface SharedCounter {
    value: number;
    lastUpdatedBy: string | null;
    lastUpdatedAt: number | null;
}

export interface SessionState {
    users: CollaborativeUser[];
    messages: ChatMessage[];
    counter: SharedCounter;
    typingUsers: string[];
}

export type BroadcastMessage =
    | { type: BroadcastActionType.USER_JOIN; payload: CollaborativeUser }
    | { type: BroadcastActionType.USER_LEAVE; payload: { userId: string } }
    | { type: BroadcastActionType.USER_UPDATE; payload: Partial<CollaborativeUser> & { id: string } }
    | { type: BroadcastActionType.MESSAGE_SEND; payload: ChatMessage }
    | { type: BroadcastActionType.MESSAGE_DELETE; payload: { messageId: string; userId: string } }
    | { type: BroadcastActionType.COUNTER_UPDATE; payload: { value: number; userId: string; username: string } }
    | { type: BroadcastActionType.TYPING_START; payload: { userId: string } }
    | { type: BroadcastActionType.TYPING_STOP; payload: { userId: string } }
    | { type: BroadcastActionType.STATE_SYNC; payload: SessionState }
    | { type: BroadcastActionType.REQUEST_STATE; payload: { requesterId: string } };

export type UserId = string;
export type MessageId = string;
export type TabId = string;
export type Timestamp = number;

export interface ChatComponentProps {
    messages: ChatMessage[];
    currentUserId: UserId;
    currentUsername: string;
    onSendMessage: (content: string, expiresInSeconds?: number) => void;
    onDeleteMessage: (messageId: MessageId) => void;
    onTyping: (isTyping: boolean) => void;
}

export interface CollaborativeCounterProps {
    counter: SharedCounter;
    onIncrement: () => void;
    onDecrement: () => void;
}

export interface UsersListComponentProps {
    users: CollaborativeUser[];
    currentUserId: UserId;
    typingUsers: string[];
}

export interface CollaborativeSessionHook {
    users: CollaborativeUser[];
    messages: ChatMessage[];
    counter: SharedCounter;
    typingUsers: string[];
    currentUserId: UserId;
    currentUsername: string;
    sendMessage: (content: string, expiresInSeconds?: number) => void;
    deleteMessage: (messageId: MessageId) => void;
    updateCounter: (increment: boolean) => void;
    markTyping: (isTyping: boolean) => void;
}