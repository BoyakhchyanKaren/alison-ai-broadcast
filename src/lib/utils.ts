import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const generateId = (prefix: string = 'id'): string => {
    return `${prefix}-${dayjs().valueOf()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generateUsername = (): string => {
    const timestamp = dayjs().valueOf();
    const userNumber = Math.floor(timestamp / 1000) % 1000;
    return `User ${userNumber}`;
};

export const generateTabId = (): string => {
    return generateId('tab');
};

export const formatTimestamp = (timestamp: number): string => {
    return dayjs(timestamp).format('HH:mm');
};

export const formatRelativeTime = (timestamp: number): string => {
    return dayjs(timestamp).fromNow();
};

export const isMessageExpired = (expiresAt?: number): boolean => {
    if (!expiresAt) return false;
    return dayjs(expiresAt).isBefore(dayjs());
};

export const getExpirationText = (expiresAt?: number): string | null => {
    if (!expiresAt) return null;

    const now = dayjs();
    const expiration = dayjs(expiresAt);
    const remainingSeconds = expiration.diff(now, 'second');

    if (remainingSeconds <= 0) return 'Expired';
    if (remainingSeconds < 60) return `Expires in ${remainingSeconds}s`;
    return `Expires in ${Math.ceil(remainingSeconds / 60)}m`;
};

export const getUserStatusColor = (lastActivity: number): 'success' | 'warning' | 'default' => {
    const seconds = Math.floor((Date.now() - lastActivity) / 1000);
    if (seconds < 5) return 'success';
    if (seconds < 60) return 'warning';
    return 'default';
};

export const sortUsersByActivity = <T extends { id: string; lastActivity: number }>(
    users: T[],
    currentUserId: string
): T[] => {
    return [...users].sort((a, b) => {
        if (a.id === currentUserId) return -1;
        if (b.id === currentUserId) return 1;
        return b.lastActivity - a.lastActivity;
    });
};

export const TYPING_TIMEOUT = 2200;
export const USER_CLEANUP_INTERVAL = 5200;
export const USER_INACTIVE_THRESHOLD = 10200;
export const MESSAGE_CLEANUP_INTERVAL = 1200;
export const SESSION_ID = 'collaborative-session';
