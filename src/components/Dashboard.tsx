"use client";

import React, { useCallback } from "react";
import { useCollaborativeSession } from "../hooks/useCollaborativeSession";
import { UsersList } from "./UsersList";
import { CollaborativeCounter } from "./Counter";
import { Chat } from "./Chat";
import { Box, Typography, AppBar, Toolbar, Container } from '@mui/material';

const Dashboard = () => {
    const {
        users,
        messages,
        counter,
        typingUsers,
        currentUserId,
        currentUsername,
        sendMessage,
        deleteMessage,
        updateCounter,
        markTyping,
    } = useCollaborativeSession();

    const handleIncrement = useCallback(() => updateCounter(true), [updateCounter]);
    const handleDecrement = useCallback(() => updateCounter(false), [updateCounter]);

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
                        Cross-Tab Collaboration Dashboard
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl" sx={{ py: 3 }}>
                <Box sx={{ display: 'flex', gap: 3, minHeight: 'calc(100vh - 120px)' }}>
                    <Box sx={{ width: { xs: '100%', md: '300px' }, flexShrink: 0 }}>
                        <UsersList users={users} currentUserId={currentUserId} typingUsers={typingUsers} />
                    </Box>

                    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                        <Box sx={{ flex: 1 }}>
                            <CollaborativeCounter
                                counter={counter}
                                onIncrement={handleIncrement}
                                onDecrement={handleDecrement}
                            />
                        </Box>

                        <Box sx={{ flex: 1 }}>
                            <Chat
                                messages={messages}
                                currentUserId={currentUserId}
                                currentUsername={currentUsername}
                                onSendMessage={sendMessage}
                                onDeleteMessage={deleteMessage}
                                onTyping={markTyping}
                            />
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Dashboard;