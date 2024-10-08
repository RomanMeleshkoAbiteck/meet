import {useEffect, useRef, useCallback} from 'react';
import freeice from 'freeice';
import useStateWithCallback from './useStateWithCallback';
import socket from '../socket';
// import ACTIONS from '../socket/actions';
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

// const peerConnectionConfig = {
//   iceServers: [
//     ...freeice(),
//     { urls: 'stun:stun.l.google.com:19302' },
//     {
//       urls: 'turn:your-turn-server.com',
//       username: 'your-username',
//       credential: 'your-credential'
//     }
//   ]
// };

// T6G3TSR99LJ81PURDZ9MRVT9


export const LOCAL_VIDEO = 'LOCAL_VIDEO';


export default function useWebRTC(roomID) {
  const [clients, updateClients] = useStateWithCallback([]);

  const addNewClient = useCallback((newClient, cb) => {
    updateClients(list => {
      if (!list.includes(newClient)) {
        return [...list, newClient]
      }

      return list;
    }, cb);
  }, [clients, updateClients]);

  const peerConnections = useRef({});
  const localMediaStream = useRef(null);
  const peerMediaElements = useRef({
    [LOCAL_VIDEO]: null,
  });

  useEffect(() => {
    async function handleNewPeer({peerID, createOffer}) {
      if (peerID in peerConnections.current) {
        return console.warn(`Already connected to peer ${peerID}`);
      }
      // -------------Check---------------------------------------
      peerConnections.current[peerID] = new RTCPeerConnection({
        iceServers: [
             // STUN сервер
            { urls: 'stun:stun.l.google.com:19302' },

            // TURN сервер
            {
              urls: 'turn:relay1.expressturn.com:3478',
              username: 'efY4OHU3CAJTSV09PS',
              credential: 'Tqj2SczclzZ8ZjZD'
            },
            {
              urls: 'turn:numb.viagenie.ca',
              username: 'webrtc@live.com',
              credential: 'muazkh'
            },
            {
              urls: 'turn:192.158.29.39:3478?transport=udp',
              username: '28224511:1379330808',
              credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA='
            },
            {
              urls: 'turn:192.158.29.39:3478?transport=tcp',
              username: '28224511:1379330808',
              credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA='
            }




                // { urls: 'stun:stun.l.google.com:19302' },
                // {
                //   urls: 'turn:relay1.expressturn.com:3478',
                //   username: 'efY4OHU3CAJTSV09PS',
                //   credential: 'Tqj2SczclzZ8ZjZD'
                // },
                // {url:'stun:stun01.sipphone.com'},
                // {url:'stun:stun.ekiga.net'},
                // {url:'stun:stun.fwdnet.net'},
                // {url:'stun:stun.ideasip.com'},
                // {url:'stun:stun.iptel.org'},
                // {url:'stun:stun.rixtelecom.se'},
                // {url:'stun:stun.schlund.de'},
                // {url:'stun:stun.l.google.com:19302'},
                // {url:'stun:stun1.l.google.com:19302'},
                // {url:'stun:stun2.l.google.com:19302'},
                // {url:'stun:stun3.l.google.com:19302'},
                // {url:'stun:stun4.l.google.com:19302'},
                // {url:'stun:stunserver.org'},
                // {url:'stun:stun.softjoys.com'},
                // {url:'stun:stun.voiparound.com'},
                // {url:'stun:stun.voipbuster.com'},
                // {url:'stun:stun.voipstunt.com'},
                // {url:'stun:stun.voxgratia.org'},
                // {url:'stun:stun.xten.com'},
                // {
                //     url: 'turn:numb.viagenie.ca',
                //     credential: 'muazkh',
                //     username: 'webrtc@live.com'
                // },
                // {
                //     url: 'turn:192.158.29.39:3478?transport=udp',
                //     credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                //     username: '28224511:1379330808'
                // },
                // {
                //     url: 'turn:192.158.29.39:3478?transport=tcp',
                //     credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                //     username: '28224511:1379330808'
                // }
              ]


      });

      // peerConnections.current[peerID] = new RTCPeerConnection(peerConnectionConfig);

      // ------------------------------------------------------------------------
      peerConnections.current[peerID].onicecandidate = event => {
        if (event.candidate) {
          socket.emit(ACTIONS.RELAY_ICE, {
            peerID,
            iceCandidate: event.candidate,
          });
        }
      }

      let tracksNumber = 0;
      peerConnections.current[peerID].ontrack = ({streams: [remoteStream]}) => {
        tracksNumber++

        if (tracksNumber === 2) { // video & audio tracks received
          tracksNumber = 0;
          addNewClient(peerID, () => {
            if (peerMediaElements.current[peerID]) {
              peerMediaElements.current[peerID].srcObject = remoteStream;
            } else {
              // FIX LONG RENDER IN CASE OF MANY CLIENTS
              let settled = false;
              const interval = setInterval(() => {
                if (peerMediaElements.current[peerID]) {
                  peerMediaElements.current[peerID].srcObject = remoteStream;
                  settled = true;
                }

                if (settled) {
                  clearInterval(interval);
                }
              }, 1000);
            }
          });
        }
      }

      localMediaStream.current.getTracks().forEach(track => {
        peerConnections.current[peerID].addTrack(track, localMediaStream.current);
      });

      if (createOffer) {
        const offer = await peerConnections.current[peerID].createOffer();

        await peerConnections.current[peerID].setLocalDescription(offer);

        socket.emit(ACTIONS.RELAY_SDP, {
          peerID,
          sessionDescription: offer,
        });
      }
    }

    socket.on(ACTIONS.ADD_PEER, handleNewPeer);

    return () => {
      socket.off(ACTIONS.ADD_PEER);
    }
  }, []);

  useEffect(() => {
    async function setRemoteMedia({peerID, sessionDescription: remoteDescription}) {
      await peerConnections.current[peerID]?.setRemoteDescription(
        new RTCSessionDescription(remoteDescription)
      );

      if (remoteDescription.type === 'offer') {
        const answer = await peerConnections.current[peerID].createAnswer();

        await peerConnections.current[peerID].setLocalDescription(answer);

        socket.emit(ACTIONS.RELAY_SDP, {
          peerID,
          sessionDescription: answer,
        });
      }
    }

    socket.on(ACTIONS.SESSION_DESCRIPTION, setRemoteMedia)

    return () => {
      socket.off(ACTIONS.SESSION_DESCRIPTION);
    }
  }, []);

  useEffect(() => {
    socket.on(ACTIONS.ICE_CANDIDATE, ({peerID, iceCandidate}) => {
      peerConnections.current[peerID]?.addIceCandidate(
        new RTCIceCandidate(iceCandidate)
      );
    });

    return () => {
      socket.off(ACTIONS.ICE_CANDIDATE);
    }
  }, []);

  useEffect(() => {
    const handleRemovePeer = ({peerID}) => {
      if (peerConnections.current[peerID]) {
        peerConnections.current[peerID].close();
      }

      delete peerConnections.current[peerID];
      delete peerMediaElements.current[peerID];

      updateClients(list => list.filter(c => c !== peerID));
    };

    socket.on(ACTIONS.REMOVE_PEER, handleRemovePeer);

    return () => {
      socket.off(ACTIONS.REMOVE_PEER);
    }
  }, []);

  useEffect(() => {
    async function startCapture() {
      localMediaStream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: 1280,
          height: 720,
        }
      });

      addNewClient(LOCAL_VIDEO, () => {
        const localVideoElement = peerMediaElements.current[LOCAL_VIDEO];

        if (localVideoElement) {
          localVideoElement.volume = 0;
          localVideoElement.srcObject = localMediaStream.current;
        }
      });
    }

    startCapture()
      .then(() => socket.emit(ACTIONS.JOIN, {room: roomID}))
      .catch(e => console.error('Error getting userMedia:', e));

    return () => {
      // localMediaStream.current.getTracks().forEach(track => track.stop());

      socket.emit(ACTIONS.LEAVE);
    };
  }, [roomID]);

  const provideMediaRef = useCallback((id, node) => {
    peerMediaElements.current[id] = node;
  }, []);

  return {
    clients,
    provideMediaRef
  };
}
