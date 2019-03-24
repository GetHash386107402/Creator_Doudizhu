import SocketController from './data/socket_controller'
import PlayerData from './data/player_data'
import  EventListener from './utility/event_listener'
const  Global = {} || Global;
Global.playerData = PlayerData();
Global.socket = SocketController();
Global.eventListener = EventListener({});
export default Global;