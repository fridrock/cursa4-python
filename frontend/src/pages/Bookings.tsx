import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  IconButton,
  MenuItem,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { useAuth } from '../contexts/AuthContext';
import type { Room, Booking } from '../services/api';
import { roomService, bookingService } from '../services/api';

const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState('');
  const [bookingForm, setBookingForm] = useState({
    room_id: '',
    start_time: new Date(),
    end_time: new Date(),
    purpose: '',
  });
  const { user } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [bookingsData, roomsData] = await Promise.all([
        bookingService.getBookings(),
        roomService.getRooms(),
      ]);
      // Filter bookings for non-admin users
      const filteredBookings = user?.is_admin 
        ? bookingsData 
        : bookingsData.filter((booking: Booking) => booking.user_id === user?.id);
      setBookings(filteredBookings);
      setRooms(roomsData);
    } catch (err) {
      setError('Ошибка при загрузке данных');
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setBookingForm({
      room_id: '',
      start_time: new Date(),
      end_time: new Date(),
      purpose: '',
    });
  };

  const handleSubmit = async () => {
    try {
      await bookingService.createBooking({
        room_id: parseInt(bookingForm.room_id),
        start_time: bookingForm.start_time.toISOString(),
        end_time: bookingForm.end_time.toISOString(),
        purpose: bookingForm.purpose,
      });
      handleCloseDialog();
      loadData();
    } catch (err) {
      setError('Ошибка при создании бронирования');
    }
  };

  const handleDelete = async (id: number) => {
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Бронирования</Typography>
        <Button variant="contained" color="primary" onClick={handleOpenDialog}>
          Новое бронирование
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Комната</TableCell>
              <TableCell>Начало</TableCell>
              <TableCell>Конец</TableCell>
              <TableCell>Цель</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>
                  {rooms.find(r => r.id === booking.room_id)?.name}
                </TableCell>
                <TableCell>
                  {new Date(booking.start_time).toLocaleString()}
                </TableCell>
                <TableCell>
                  {new Date(booking.end_time).toLocaleString()}
                </TableCell>
                <TableCell>{booking.purpose}</TableCell>
                <TableCell>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(booking.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Новое бронирование</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              select
              label="Комната"
              value={bookingForm.room_id}
              onChange={(e) => setBookingForm({ ...bookingForm, room_id: e.target.value })}
              fullWidth
            >
              {rooms.map((room) => (
                <MenuItem key={room.id} value={room.id}>
                  {room.name}
                </MenuItem>
              ))}
            </TextField>
            <DateTimePicker
              label="Время начала"
              value={bookingForm.start_time}
              onChange={(date) => date && setBookingForm({ ...bookingForm, start_time: date })}
              minDateTime={new Date()}
            />
            <DateTimePicker
              label="Время окончания"
              value={bookingForm.end_time}
              onChange={(date) => date && setBookingForm({ ...bookingForm, end_time: date })}
              minDateTime={bookingForm.start_time}
            />
            <TextField
              label="Цель"
              value={bookingForm.purpose}
              onChange={(e) => setBookingForm({ ...bookingForm, purpose: e.target.value })}
              fullWidth
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Создать
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Bookings; 