import React from 'react';
import { Typography, Box, Paper, Card, CardContent, CardHeader, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { MeetingRoom, Event, AdminPanelSettings, Person } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Добро пожаловать, {user?.name}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Эффективно управляйте бронированием переговорных комнат с помощью нашей системы.
        </Typography>
      </Paper>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Card>
            <CardHeader title="Быстрые действия" />
            <CardContent>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <MeetingRoom />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Просмотр доступных комнат" 
                    secondary="Просмотр и бронирование доступных переговорных комнат" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Event />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Управление бронированиями" 
                    secondary="Просмотр и управление вашими текущими бронированиями" 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Box>

        {user?.is_admin && (
          <Box sx={{ flex: 1 }}>
            <Card>
              <CardHeader title="Действия администратора" />
              <CardContent>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <AdminPanelSettings />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Управление комнатами" 
                      secondary="Добавление, редактирование или удаление переговорных комнат" 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Person />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Просмотр всех бронирований" 
                      secondary="Мониторинг и управление всеми бронированиями системы" 
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Home; 