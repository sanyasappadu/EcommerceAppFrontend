

import React from 'react';
import { useAuth } from '../AuthContext'; // Import the custom hook
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/Inbox';
import MailIcon from '@mui/icons-material/Mail';

const Sidebar = () => {
  const { selectCategory } = useAuth(); // Get the selectCategory function from context

  return (
    <div style={{ padding: '16px' }}>
      <List onClick={() => selectCategory('All')}>
          <ListItem  >
            <ListItemButton >
              <ListItemIcon>
                {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
              </ListItemIcon>
              <ListItemText>All Products</ListItemText>
            </ListItemButton>
          </ListItem>
      </List>
      <List onClick={() => selectCategory('electronic')}>
          <ListItem  >
            <ListItemButton >
              <ListItemIcon>
                {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
              </ListItemIcon>
              <ListItemText>Electronics</ListItemText>
            </ListItemButton>
          </ListItem>
      </List>
      <List onClick={() => selectCategory('clothing')}>
          <ListItem  >
            <ListItemButton >
              <ListItemIcon>
                {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
              </ListItemIcon>
              <ListItemText>Clothes</ListItemText>
            </ListItemButton>
          </ListItem>
      </List>
      <List onClick={() => selectCategory('activewear')}>
          <ListItem  >
            <ListItemButton >
              <ListItemIcon>
                {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
              </ListItemIcon>
              <ListItemText>Active Wear</ListItemText>
            </ListItemButton>
          </ListItem>
      </List>
      <List onClick={() => selectCategory('shoes')}>
          <ListItem  >
            <ListItemButton >
              <ListItemIcon>
                {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
              </ListItemIcon>
              <ListItemText>Shoes</ListItemText>
            </ListItemButton>
          </ListItem>
      </List>
    </div>
  );
};

export default Sidebar;


// // components/Sidebar.jsx
// import React from 'react';
// import { Link } from 'react-router-dom';

// const Sidebar = () => {
//   return (
//     <div className="sidebar">
//       <ul>
//         <li><Link to="/new-in">New In</Link></li>
//         <li><Link to="/clothing">Clothing</Link></li>
//         <li><Link to="/shoes">Shoes</Link></li>
//         <li><Link to="/electronics">Electronics</Link></li>
//         <li><Link to="/accessories">Accessories</Link></li>
//         <li><Link to="/active-wear">Active Wear</Link></li>
//         <li><Link to="/gifts-living">Gifts & Living</Link></li>
//       </ul>
//     </div>
//   );
// }

// export default Sidebar;


