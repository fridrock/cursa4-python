import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { useAuth } from '../contexts/AuthContext';
import type { Room, Booking } from '../services/api';
import { roomService, bookingService } from '../services/api';

const Rooms: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState('');
  const [bookingForm, setBookingForm] = useState({
    start_time: new Date(),
    end_time: new Date(),
    purpose: '',
  });

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const roomsData = await roomService.getRooms();
      setRooms(roomsData);
    } catch (err) {
      setError('Ошибка при загрузке комнат');
    }
  };

  const handleOpenDialog = (room: Room) => {
    setSelectedRoom(room);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRoom(null);
    setBookingForm({
      start_time: new Date(),
      end_time: new Date(),
      purpose: '',
    });
  };

  const handleSubmit = async () => {
    if (!selectedRoom) return;

    try {
      await bookingService.createBooking({
        room_id: selectedRoom.id,
        start_time: bookingForm.start_time.toISOString(),
        end_time: bookingForm.end_time.toISOString(),
        purpose: bookingForm.purpose,
      });
      handleCloseDialog();
    } catch (err) {
      setError('Ошибка при создании бронирования');
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Переговорные комнаты
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
        {rooms.map((room) => (
          <Box key={room.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {room.name}
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Вместимость" 
                      secondary={`${room.capacity} человек`} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Расположение" 
                      secondary={room.location} 
                    />
                  </ListItem>
                  {room.amenities && (
                    <ListItem>
                      <ListItemText 
                        primary="Удобства" 
                        secondary={room.amenities} 
                      />
                    </ListItem>
                  )}
                </List>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  variant="contained"
                  onClick={() => handleOpenDialog(room)}
                  sx={{
                    bgcolor: '#ff9800',
                    '&:hover': {
                      bgcolor: '#ffc947',
                    },
                    textTransform: 'none',
                    fontSize: '1rem',
                  }}
                >
                  Забронировать
                </Button>
              </CardActions>
            </Card>
          </Box>
        ))}
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          Бронирование комнаты {selectedRoom?.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
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

export default Rooms; 