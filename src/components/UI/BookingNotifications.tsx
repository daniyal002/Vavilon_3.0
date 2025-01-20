// // src/components/BookingNotifications.js
// import { useQueryClient } from '@tanstack/react-query';
// import { useEffect } from 'react';
// import addNotification, { Notifications } from 'react-push-notification';

// const BookingNotifications = () => {
//   const queryClient = useQueryClient()

//   useEffect(() => {
//     const ws = new WebSocket('ws://localhost:3003'); // Убедитесь, что порт совпадает с вашим сервером

//     ws.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       if (data.type === 'NEW_BOOKING') {
//         addNotification({
//           title: 'Warning',
//           native: true
//       })
//       queryClient.invalidateQueries({queryKey: ["showTimesWithBookings"]})
//       }
//     };

//     return () => {
//       ws.close();
//     };
//   }, []);

//   return (
//     <div>
//       <Notifications />
//     </div>
//   );
// };

// export default BookingNotifications;