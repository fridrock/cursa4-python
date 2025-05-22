import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Tabs, Tab, Alert, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import type { Room, Booking } from '../services/api';
import { roomService, bookingService } from '../services/api';

interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const AdminDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [openRoomDialog, setOpenRoomDialog] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [roomForm, setRoomForm] = useState({
    name: '',
    capacity: '',
    location: '',
    amenities: '',
  });
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [roomsData, bookingsData] = await Promise.all([
        roomService.getRooms(),
        bookingService.getBookings(),
      ]);
      setRooms(roomsData);
      setBookings(bookingsData);
    } catch (err) {
      setError('Ошибка при загрузке данных');
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenRoomDialog = (room?: Room) => {
    if (room) {
      setSelectedRoom(room);
      setRoomForm({
        name: room.name,
        capacity: room.capacity.toString(),
        location: room.location,
        amenities: room.amenities || '',
      });
    } else {
      setSelectedRoom(null);
      setRoomForm({ name: '', capacity: '', location: '', amenities: '' });
    }
    setOpenRoomDialog(true);
  };

  const handleCloseRoomDialog = () => {
    setOpenRoomDialog(false);
    setSelectedRoom(null);
    setRoomForm({ name: '', capacity: '', location: '', amenities: '' });
  };

  const handleRoomSubmit = async () => {
    try {
      const roomData = {
        name: roomForm.name,
        capacity: parseInt(roomForm.capacity),
        location: roomForm.location,
        amenities: roomForm.amenities,
      };
      if (selectedRoom) {
        await roomService.updateRoom(selectedRoom.id, roomData);
      } else {
        await roomService.createRoom(roomData);
      }
      handleCloseRoomDialog();
      loadData();
    } catch (err) {
      setError('Ошибка при сохранении комнаты');
    }
  };

  const handleDeleteRoom = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить эту комнату?')) {
      try {
        await roomService.deleteRoom(id);
        loadData();
      } catch (err) {
        setError('Ошибка при удалении комнаты');
      }
    }
  };

  const handleDeleteBooking = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить это бронирование?')) {
      try {
        await bookingService.deleteBooking(id);
        loadData();
      } catch (err) {
        setError('Ошибка при удалении бронирования');
      }
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Панель администратора
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}
      <Paper sx={{ width: '100%' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Админ" />
          <Tab label="Комнаты" />
          <Tab label="Бронирования" />
        </Tabs>
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>Информация администратора</Typography>
          <Box sx={{ mb: 2 }}>
            <strong>Имя:</strong> {user?.name}<br />
            <strong>Email:</strong> {user?.email}<br />
            <strong>Роль:</strong> {user?.is_admin ? 'Администратор' : 'Пользователь'}
          </Box>
          <Typography variant="body1">Вы можете управлять комнатами и бронированиями, используя вкладки выше.</Typography>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mb: 2 }}>
            <Button variant="contained" color="primary" onClick={() => handleOpenRoomDialog()}>
              Добавить комнату
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Название</TableCell>
                  <TableCell>Вместимость</TableCell>
                  <TableCell>Расположение</TableCell>
                  <TableCell>Удобства</TableCell>
                  <TableCell>Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell>{room.name}</TableCell>
                    <TableCell>{room.capacity}</TableCell>
                    <TableCell>{room.location}</TableCell>
                    <TableCell>{room.amenities}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleOpenRoomDialog(room)}><EditIcon /></IconButton>
                      <IconButton color="error" onClick={() => handleDeleteRoom(room.id)}><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Комната</TableCell>
                  <TableCell>Пользователь</TableCell>
                  <TableCell>Время начала</TableCell>
                  <TableCell>Время окончания</TableCell>
                  <TableCell>Цель</TableCell>
                  <TableCell>Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{rooms.find(r => r.id === booking.room_id)?.name}</TableCell>
                    <TableCell>{booking.user_id}</TableCell>
                    <TableCell>{new Date(booking.start_time).toLocaleString()}</TableCell>
                    <TableCell>{new Date(booking.end_time).toLocaleString()}</TableCell>
                    <TableCell>{booking.purpose}</TableCell>
                    <TableCell>
                      <IconButton color="error" onClick={() => handleDeleteBooking(booking.id)}><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>
      <Dialog open={openRoomDialog} onClose={handleCloseRoomDialog}>
        <DialogTitle>{selectedRoom ? 'Редактировать комнату' : 'Добавить новую комнату'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Название"
              value={roomForm.name}
              onChange={e => setRoomForm({ ...roomForm, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Вместимость"
              type="number"
              value={roomForm.capacity}
              onChange={e => setRoomForm({ ...roomForm, capacity: e.target.value })}
              fullWidth
            />
            <TextField
              label="Расположение"
              value={roomForm.location}
              onChange={e => setRoomForm({ ...roomForm, location: e.target.value })}
              fullWidth
            />
            <TextField
              label="Удобства"
              value={roomForm.amenities}
              onChange={e => setRoomForm({ ...roomForm, amenities: e.target.value })}
              fullWidth
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRoomDialog}>Отмена</Button>
          <Button onClick={handleRoomSubmit} variant="contained" color="primary">
            {selectedRoom ? 'Обновить' : 'Создать'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard; 