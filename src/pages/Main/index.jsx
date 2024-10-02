import {useState, useEffect, useRef} from 'react';
import socket from '../../socket';
// import ACTIONS from '../../socket/actions';
const ACTIONS = {
  JOIN: 'join',
  LEAVE: 'leave',
  SHARE_ROOMS: 'share-rooms',
  ADD_PEER: 'add-peer',
  REMOVE_PEER: 'remove-peer',
  RELAY_SDP: 'relay-sdp',
  RELAY_ICE: 'relay-ice',
  ICE_CANDIDATE: 'ice-candidate',
  SESSION_DESCRIPTION: 'session-description'
};
// import {useHistory} from 'react-router';
import { useNavigate } from 'react-router-dom';
import {v4} from 'uuid';

export default  function Main() {
  // const history = useHistory();
    const navigate = useNavigate();
  const [rooms, updateRooms] = useState([]);
  const rootNode = useRef();

  useEffect(() => {
    socket.on(ACTIONS.SHARE_ROOMS, ({rooms = []} = {}) => {
      if (rootNode.current) {
        updateRooms(rooms);
      }
    });
  }, []);

  return (
    <div ref={rootNode}>
        <p>Home page</p>
      <h1>Available Rooms</h1>
      <p>meet.pp.ua</p>
        <p>Set socket by meet.pp.ua</p>
        <p>I can not connnected!!!</p>

      <ul>
        {rooms.map(roomID => (
          <li key={roomID}>
            {roomID}
            <button onClick={() => {
              navigate(`/room/${roomID}`);
            }}>JOIN ROOM</button>
          </li>
        ))}
      </ul>

      <button onClick={() => {
        navigate(`/room/${v4()}`);
      }}>Create New Room</button>
    </div>
  );
}

