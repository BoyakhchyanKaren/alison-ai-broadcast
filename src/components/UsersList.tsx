'use client';

import React, { useMemo } from 'react';
import { UsersListComponentProps } from '../lib/types';
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Chip,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography,
    Divider,
    Badge,
    Tooltip
} from '@mui/material';
import { Person, Circle } from '@mui/icons-material';
import { formatRelativeTime, getUserStatusColor, sortUsersByActivity } from '../lib/utils';

const UsersList = ({ users, currentUserId, typingUsers }: UsersListComponentProps) => {
    const sortedUsers = useMemo(() => sortUsersByActivity(users, currentUserId), [users, currentUserId]);

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Person sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" component="h2">
                        Active Users
                    </Typography>
                    <Chip
                        label={users.length}
                        size="small"
                        color="primary"
                        sx={{ ml: 1 }}
                    />
                </Box>

                <Divider sx={{ mb: 2 }} />

                <List sx={{ p: 0 }}>
                    {sortedUsers.map((user, index) => {
                        const isTyping = typingUsers.includes(user.id);
                        const isCurrentUser = user.id === currentUserId;
                        const statusColor = getUserStatusColor(user.lastActivity);

                        return (
                            <React.Fragment key={user.id}>
                                <ListItem sx={{ px: 0 }}>
                                    <ListItemAvatar>
                                        <Badge
                                            overlap="circular"
                                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                            badgeContent={
                                                <Tooltip title={isTyping ? 'Typing' : 'Online'}>
                                                    <Circle
                                                        sx={{
                                                            fontSize: 12,
                                                            color: isTyping ? 'warning.main' : `${statusColor}.main`
                                                        }}
                                                    />
                                                </Tooltip>
                                            }
                                        >
                                            <Avatar
                                                alt={user.username}
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    bgcolor: isCurrentUser ? 'primary.main' : 'secondary.main'
                                                }}
                                            >
                                                {user.username.charAt(0).toUpperCase()}
                                            </Avatar>
                                        </Badge>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="body1" fontWeight={isCurrentUser ? 'bold' : 'normal'}>
                                                    {user.username}
                                                </Typography>
                                                {isCurrentUser && (
                                                    <Chip label="You" size="small" color="primary" variant="outlined" />
                                                )}
                                            </Box>
                                        }
                                        secondary={
                                            <Typography variant="body2" color="text.secondary" component="span">
                                                {isTyping ? (
                                                    <span style={{ color: 'warning.main' }}>
                                                        Typing...
                                                    </span>
                                                ) : (
                                                    formatRelativeTime(user.lastActivity)
                                                )}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                                {index < sortedUsers.length - 1 && <Divider variant="inset" component="li" />}
                            </React.Fragment>
                        );
                    })}
                </List>
            </CardContent>
        </Card>
    );
};

export { UsersList };