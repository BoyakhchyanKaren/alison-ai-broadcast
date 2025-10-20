'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { BroadcastMessage as BroadcastChannelMessage, useBroadcastChannel } from 'react-broadcast-sync';
import { CollaborativeUser, ChatMessage, SharedCounter, SessionState, BroadcastMessage, CollaborativeSessionHook, BroadcastActionType } from '../lib/types';
import {
    generateTabId,
    generateUsername,
    TYPING_TIMEOUT,
    USER_CLEANUP_INTERVAL,
    USER_INACTIVE_THRESHOLD,
    MESSAGE_CLEANUP_INTERVAL,
    SESSION_ID
} from '../lib/utils';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export function useCollaborativeSession(): CollaborativeSessionHook {
    const tabId = useRef(generateTabId());
    const userId = useRef(`user-${tabId.current}`);
    const username = useRef(generateUsername());
    const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const hasInitialized = useRef(false);

    const [users, setUsers] = useState<CollaborativeUser[]>([]);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [counter, setCounter] = useState<SharedCounter>({
        value: 0,
        lastUpdatedBy: null,
        lastUpdatedAt: null,
    });
    const [typingUsers, setTypingUsers] = useState<string[]>([]);

    const { messages, postMessage, clearReceivedMessages } = useBroadcastChannel(SESSION_ID, {
        sourceName: tabId.current,
    });

    const cleanupExpiredMessages = useCallback(() => {
        const now = dayjs().valueOf();
        setChatMessages(prev => prev.filter(msg => !msg.expiresAt || msg.expiresAt > now));
    }, []);

    const cleanupInactiveUsers = useCallback(() => {
        const now = dayjs().valueOf();
        setUsers(prev => prev.filter(user =>
            user.id === userId.current || (now - user.lastActivity) < USER_INACTIVE_THRESHOLD
        ));
    }, []);

    const sendMessage = useCallback((content: string, expiresInSeconds?: number) => {
        const message: ChatMessage = {
            id: `msg-${dayjs().valueOf()}-${Math.random()}`,
            userId: userId.current,
            username: username.current,
            content,
            timestamp: dayjs().valueOf(),
            expiresAt: expiresInSeconds ? dayjs().add(expiresInSeconds, 'second').valueOf() : undefined,
        };

        postMessage(BroadcastActionType.MESSAGE_SEND, { type: BroadcastActionType.MESSAGE_SEND, payload: message });
        setChatMessages(prev => [...prev, message]);

        const updatedUser: CollaborativeUser = {
            id: userId.current,
            username: username.current,
            lastActivity: dayjs().valueOf(),
            isTyping: false,
            tabId: tabId.current,
        };
        postMessage(BroadcastActionType.USER_UPDATE, { type: BroadcastActionType.USER_UPDATE, payload: updatedUser });
        setUsers(prev =>
            prev.map(user => user.id === userId.current ? updatedUser : user)
        );
    }, [postMessage]);

    const deleteMessage = useCallback((messageId: string) => {
        postMessage(BroadcastActionType.MESSAGE_DELETE, { type: BroadcastActionType.MESSAGE_DELETE, payload: { messageId, userId: userId.current } });
        setChatMessages(prev => prev.filter(msg => msg.id !== messageId));
    }, [postMessage]);

    const updateCounter = useCallback((increment: boolean) => {
        const newValue = counter.value + (increment ? 1 : -1);
        const update = {
            value: newValue,
            userId: userId.current,
            username: username.current,
        };

        postMessage(BroadcastActionType.COUNTER_UPDATE, { type: BroadcastActionType.COUNTER_UPDATE, payload: update });
        setCounter({
            value: newValue,
            lastUpdatedBy: username.current,
            lastUpdatedAt: dayjs().valueOf(),
        });

        const updatedUser: CollaborativeUser = {
            id: userId.current,
            username: username.current,
            lastActivity: dayjs().valueOf(),
            isTyping: false,
            tabId: tabId.current,
        };
        postMessage(BroadcastActionType.USER_UPDATE, { type: BroadcastActionType.USER_UPDATE, payload: updatedUser });
        setUsers(prev =>
            prev.map(user => user.id === userId.current ? updatedUser : user)
        );
    }, [postMessage, counter.value]);

    const markTyping = useCallback((isTyping: boolean) => {
        if (isTyping) {
            postMessage(BroadcastActionType.TYPING_START, { type: BroadcastActionType.TYPING_START, payload: { userId: userId.current } });

            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

            typingTimeoutRef.current = setTimeout(() => {
                postMessage(BroadcastActionType.TYPING_STOP, { type: BroadcastActionType.TYPING_STOP, payload: { userId: userId.current } });
            }, TYPING_TIMEOUT);
        } else {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            postMessage(BroadcastActionType.TYPING_STOP, { type: BroadcastActionType.TYPING_STOP, payload: { userId: userId.current } });
        }

        const updatedUser: CollaborativeUser = {
            id: userId.current,
            username: username.current,
            lastActivity: dayjs().valueOf(),
            isTyping: false,
            tabId: tabId.current,
        };
        postMessage(BroadcastActionType.USER_UPDATE, { type: BroadcastActionType.USER_UPDATE, payload: updatedUser });
        setUsers(prev =>
            prev.map(user => user.id === userId.current ? updatedUser : user)
        );
    }, [postMessage]);

    useEffect(() => {
        if (!hasInitialized.current) {
            hasInitialized.current = true;
            const currentCollaborativeUser: CollaborativeUser = {
                id: userId.current,
                username: username.current,
                lastActivity: dayjs().valueOf(),
                isTyping: false,
                tabId: tabId.current,
            };
            setUsers([currentCollaborativeUser]);
            postMessage(BroadcastActionType.USER_JOIN, { type: BroadcastActionType.USER_JOIN, payload: currentCollaborativeUser });
            postMessage(BroadcastActionType.REQUEST_STATE, { type: BroadcastActionType.REQUEST_STATE, payload: { requesterId: userId.current } });
        }

        const handleBeforeUnload = () => {
            postMessage(BroadcastActionType.USER_LEAVE, { type: BroadcastActionType.USER_LEAVE, payload: { userId: userId.current } });
        };

        const handleVisibilityChange = () => {
            const updatedUser: CollaborativeUser = {
                id: userId.current,
                username: username.current,
                lastActivity: dayjs().valueOf(),
                isTyping: false,
                tabId: tabId.current,
            };
            postMessage(BroadcastActionType.USER_UPDATE, { type: BroadcastActionType.USER_UPDATE, payload: updatedUser });
            setUsers(prev =>
                prev.map(user => user.id === userId.current ? updatedUser : user)
            );
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        const cleanupInterval = setInterval(cleanupInactiveUsers, USER_CLEANUP_INTERVAL);
        const messageCleanupInterval = setInterval(cleanupExpiredMessages, MESSAGE_CLEANUP_INTERVAL);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            clearInterval(cleanupInterval);
            clearInterval(messageCleanupInterval);
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, [postMessage, cleanupInactiveUsers, cleanupExpiredMessages]);

    useEffect(() => {
        if (messages.length === 0) return;

        messages.forEach((msg: BroadcastChannelMessage) => {
            const action = msg.message as BroadcastMessage;

            if (msg.source === tabId.current &&
                [BroadcastActionType.MESSAGE_SEND, BroadcastActionType.COUNTER_UPDATE].includes(action.type)) {
                return;
            }

            switch (action.type) {
                case BroadcastActionType.USER_JOIN:
                    setUsers(prev => {
                        const exists = prev.some(u => u.id === action.payload.id);
                        if (exists) return prev;
                        return [...prev, action.payload];
                    });
                    break;

                case BroadcastActionType.USER_LEAVE:
                    setUsers(prev => prev.filter(u => u.id !== action.payload.userId));
                    setTypingUsers(prev => prev.filter(id => id !== action.payload.userId));
                    break;

                case BroadcastActionType.USER_UPDATE:
                    setUsers(prev => prev.map(user =>
                        user.id === action.payload.id
                            ? { ...user, ...action.payload }
                            : user
                    ));
                    break;

                case BroadcastActionType.MESSAGE_SEND:
                    setChatMessages(prev => {
                        const exists = prev.some(m => m.id === action.payload.id);
                        if (exists) return prev;
                        return [...prev, action.payload];
                    });
                    break;

                case BroadcastActionType.MESSAGE_DELETE:
                    if (action.payload.userId !== userId.current) {
                        setChatMessages(prev => prev.filter(msg => msg.id !== action.payload.messageId));
                    }
                    break;

                case BroadcastActionType.COUNTER_UPDATE:
                    setCounter({
                        value: action.payload.value,
                        lastUpdatedBy: action.payload.username,
                        lastUpdatedAt: dayjs().valueOf(),
                    });
                    break;

                case BroadcastActionType.TYPING_START:
                    if (action.payload.userId !== userId.current) {
                        setTypingUsers(prev => {
                            if (prev.includes(action.payload.userId)) return prev;
                            return [...prev, action.payload.userId];
                        });
                    }
                    break;

                case BroadcastActionType.TYPING_STOP:
                    setTypingUsers(prev => prev.filter(id => id !== action.payload.userId));
                    break;

                case BroadcastActionType.REQUEST_STATE:
                    if (action.payload.requesterId !== userId.current) {
                        setUsers(currentUsers => {
                            setChatMessages(currentMessages => {
                                setCounter(currentCounter => {
                                    setTypingUsers(currentTypingUsers => {
                                        const currentState: SessionState = {
                                            users: currentUsers,
                                            messages: currentMessages,
                                            counter: currentCounter,
                                            typingUsers: currentTypingUsers,
                                        };
                                        postMessage(BroadcastActionType.STATE_SYNC, { type: BroadcastActionType.STATE_SYNC, payload: currentState });
                                        return currentTypingUsers;
                                    });
                                    return currentCounter;
                                });
                                return currentMessages;
                            });
                            return currentUsers;
                        });
                    }
                    break;

                case BroadcastActionType.STATE_SYNC:
                    setUsers(prev => {
                        const merged = [...prev];
                        action.payload.users.forEach((user: CollaborativeUser) => {
                            if (!merged.some(u => u.id === user.id)) {
                                merged.push(user);
                            }
                        });
                        return merged;
                    });

                    if (chatMessages.length === 0) {
                        setChatMessages([...action.payload.messages]);
                        setCounter(action.payload.counter);
                    }
                    setTypingUsers(action.payload.typingUsers.filter((id: string) => id !== userId.current));
                    break;
            }
        });

        clearReceivedMessages();
    }, [messages, postMessage, clearReceivedMessages, chatMessages.length]);

    return {
        users,
        messages: chatMessages,
        counter,
        typingUsers,
        currentUserId: userId.current,
        currentUsername: username.current,
        sendMessage,
        deleteMessage,
        updateCounter,
        markTyping,
    };
}
