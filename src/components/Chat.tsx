'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatComponentProps } from '../lib/types';
import {
    Avatar,
    Box,
    Card,
    CardContent,
    CardHeader,
    Typography,
    TextField,
    IconButton,
    Chip,
    Divider,
    Stack,
    Paper,
    Tooltip,
    InputAdornment
} from '@mui/material';
import {
    Send,
    Delete,
    Chat as ChatIcon,
    Schedule,
    AccessTime,
    Warning
} from '@mui/icons-material';
import { formatTimestamp, getExpirationText, isMessageExpired } from '../lib/utils';

const Chat = ({
    messages,
    currentUserId,
    onSendMessage,
    onDeleteMessage,
    onTyping,
}: ChatComponentProps) => {
    const [messageInput, setMessageInput] = useState('');
    const [expiresIn, setExpiresIn] = useState<string>('');
    const [isTyping, setIsTyping] = useState(false);
    const [, forceUpdate] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        const hasExpiringMessages = messages.some(msg => msg.expiresAt && msg.expiresAt > Date.now());
        if (hasExpiringMessages) {
            const interval = setInterval(() => {
                forceUpdate(prev => prev + 1);
            }, 100);
            return () => clearInterval(interval);
        }
        return undefined;
    }, [messages]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessageInput(e.target.value);

        if (!isTyping && e.target.value.length > 0) {
            setIsTyping(true);
            onTyping(true);
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            onTyping(false);
        }, 1000);
    }, [isTyping, onTyping]);

    const handleSendMessage = useCallback((e: React.FormEvent) => {
        e.preventDefault();

        const trimmedMessage = messageInput.trim();
        if (!trimmedMessage) return;

        const expirationSeconds = expiresIn ? parseInt(expiresIn, 10) : undefined;
        onSendMessage(trimmedMessage, expirationSeconds);

        setMessageInput('');
        setExpiresIn('');
        setIsTyping(false);
        onTyping(false);

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
    }, [messageInput, expiresIn, onSendMessage, onTyping]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e as React.FormEvent);
        }
    }, [handleSendMessage]);


    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardHeader
                title={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ChatIcon sx={{ color: 'primary.main' }} />
                        <Typography variant="h6" component="h2">
                            Chat
                        </Typography>
                        {messages.length > 0 && (
                            <Chip
                                label={messages.length}
                                size="small"
                                color="primary"
                                variant="outlined"
                            />
                        )}
                    </Box>
                }
                sx={{ pb: 1 }}
            />

            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 0 }}>
                <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2, maxHeight: 400 }}>
                    {messages.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <ChatIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="body1" color="text.secondary">
                                No messages yet. Start a conversation!
                            </Typography>
                        </Box>
                    ) : (
                        <Stack spacing={2}>
                            {messages.map(message => {
                                const isOwnMessage = message.userId === currentUserId;
                                const expirationText = getExpirationText(message.expiresAt);
                                const isExpired = isMessageExpired(message.expiresAt);

                                return (
                                    <Box
                                        key={message.id}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                                            alignItems: 'flex-start',
                                            gap: 1
                                        }}
                                    >
                                        {!isOwnMessage && (
                                            <Avatar
                                                sx={{
                                                    width: 32,
                                                    height: 32,
                                                    bgcolor: 'secondary.main'
                                                }}
                                            >
                                                {message.username.charAt(0).toUpperCase()}
                                            </Avatar>
                                        )}

                                        <Paper
                                            elevation={1}
                                            sx={{
                                                p: 2,
                                                maxWidth: '70%',
                                                bgcolor: isOwnMessage ? 'primary.main' : 'grey.100',
                                                color: isOwnMessage ? 'white' : 'text.primary',
                                                borderRadius: 2,
                                                position: 'relative'
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <Typography variant="caption" fontWeight="bold">
                                                    {message.username}
                                                </Typography>
                                                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                                    {formatTimestamp(message.timestamp)}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ mb: 1 }}>
                                                {isExpired ? (
                                                    <Typography sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <Warning sx={{ fontSize: 16 }} />
                                                        Message has expired
                                                    </Typography>
                                                ) : (
                                                    message.content
                                                )}
                                            </Box>

                                            {expirationText && !isExpired && (
                                                <Chip
                                                    icon={<Schedule />}
                                                    label={expirationText}
                                                    size="small"
                                                    color="warning"
                                                    variant="outlined"
                                                    sx={{ mt: 1 }}
                                                />
                                            )}

                                            {isOwnMessage && !isExpired && (
                                                <Tooltip title="Delete message">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => onDeleteMessage(message.id)}
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 4,
                                                            right: 4,
                                                            color: 'inherit',
                                                            opacity: 0.7,
                                                            '&:hover': { opacity: 1 }
                                                        }}
                                                    >
                                                        <Delete fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </Paper>

                                        {isOwnMessage && (
                                            <Avatar
                                                sx={{
                                                    width: 32,
                                                    height: 32,
                                                    bgcolor: 'primary.main'
                                                }}
                                            >
                                                {message.username.charAt(0).toUpperCase()}
                                            </Avatar>
                                        )}
                                    </Box>
                                );
                            })}
                        </Stack>
                    )}
                    <div ref={messagesEndRef} />
                </Box>

                <Divider />

                <Box sx={{ p: 2 }}>
                    <form onSubmit={handleSendMessage}>
                        <Stack spacing={2}>
                            <TextField
                                fullWidth
                                multiline
                                maxRows={4}
                                value={messageInput}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                placeholder="Type a message..."
                                variant="outlined"
                                size="small"
                            />

                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <TextField
                                    type="number"
                                    size="small"
                                    value={expiresIn}
                                    onChange={(e) => setExpiresIn(e.target.value)}
                                    placeholder="Expire in (sec)"
                                    inputProps={{ min: 1, max: 3600 }}
                                    sx={{ width: 150 }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AccessTime fontSize="small" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <Tooltip title="Send message">
                                    <span>
                                        <IconButton
                                            type="submit"
                                            disabled={!messageInput.trim()}
                                            color="primary"
                                            sx={{
                                                bgcolor: 'primary.main',
                                                color: 'white',
                                                '&:hover': {
                                                    bgcolor: 'primary.dark',
                                                },
                                                '&:disabled': {
                                                    bgcolor: 'grey.300',
                                                    color: 'grey.500'
                                                }
                                            }}
                                        >
                                            <Send />
                                        </IconButton>
                                    </span>
                                </Tooltip>
                            </Box>
                        </Stack>
                    </form>
                </Box>
            </CardContent>
        </Card>
    );
};

export { Chat };