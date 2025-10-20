'use client';

import React, { useCallback } from 'react';
import { CollaborativeCounterProps } from '../lib/types';
import {
    Card,
    CardContent,
    CardHeader,
    Typography,
    Box,
    IconButton,
    Chip,
    Divider,
    Stack,
    Tooltip,
    Paper
} from '@mui/material';
import { Add, Remove, Numbers, AccessTime, Person } from '@mui/icons-material';
import { formatRelativeTime } from '../lib/utils';

const CollaborativeCounter = ({ counter, onIncrement, onDecrement }: CollaborativeCounterProps) => {
    const formatTimestamp = useCallback((timestamp: number | null) => {
        if (!timestamp) return 'Never';
        return formatRelativeTime(timestamp);
    }, []);

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardHeader
                title={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Numbers sx={{ color: 'primary.main' }} />
                        <Typography variant="h6" component="h2">
                            Counter
                        </Typography>
                    </Box>
                }
                sx={{ pb: 1 }}
            />
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 0 }}>
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        mb: 3,
                        borderRadius: 3,
                        backgroundColor: "wheat",
                        color: 'white',
                        minWidth: 120,
                        textAlign: 'center'
                    }}
                >
                    <Typography variant="h2" component="div" fontWeight="bold">
                        {counter.value}
                    </Typography>
                </Paper>

                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <Tooltip title="Decrement counter">
                        <IconButton
                            onClick={onDecrement}
                            size="large"
                            sx={{
                                bgcolor: 'error.main',
                                color: 'white',
                                '&:hover': {
                                    bgcolor: 'error.dark',
                                },
                                width: 56,
                                height: 56
                            }}
                        >
                            <Remove fontSize="large" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Increment counter">
                        <IconButton
                            onClick={onIncrement}
                            size="large"
                            sx={{
                                bgcolor: 'success.main',
                                color: 'white',
                                '&:hover': {
                                    bgcolor: 'success.dark',
                                },
                                width: 56,
                                height: 56
                            }}
                        >
                            <Add fontSize="large" />
                        </IconButton>
                    </Tooltip>
                </Box>

                {counter.lastUpdatedBy && (
                    <>
                        <Divider sx={{ width: '100%', mb: 2 }} />
                        <Stack spacing={1} sx={{ width: '100%' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                    Last updated by:
                                </Typography>
                                <Chip
                                    label={counter.lastUpdatedBy}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                />
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                    Updated:
                                </Typography>
                                <Typography variant="body2" fontWeight="medium">
                                    {formatTimestamp(counter.lastUpdatedAt)}
                                </Typography>
                            </Box>
                        </Stack>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export { CollaborativeCounter };
