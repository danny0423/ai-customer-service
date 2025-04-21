import { createBrowserRouter } from 'react-router';
import MainHeader from '../layout/MainHeader';
import Home from '../pages/Home';
import Chats from '../pages/Chats';
// import ChatsMui from '../pages/ChatsMui';


const route = createBrowserRouter([
  {
    path: '/',
    element: <MainHeader />,
    children: [
      { index: true, element: <Home /> },
      { path: '/chats', element: <Chats /> },
      // { path: '/chatsMui', element: <ChatsMui /> },
    ],
  },
]);

export default route;
