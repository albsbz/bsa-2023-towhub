import { type GeolocationLatLng } from '~/libs/packages/geolocation/types/types.js';
import {
  type EventAckCollback,
  type ServerToClientEventResponse,
} from '~/libs/packages/socket/libs/types/types.js';

import { type ClientToServerEvent } from '../enums/enums.js';

type ClientToServerEventParameter = {
  [ClientToServerEvent.AUTHORIZE_DRIVER]: (payload: { userId: number }) => void;
  [ClientToServerEvent.TRUCK_LOCATION_UPDATE]: (payload: {
    latLng: GeolocationLatLng;
    truckId: number;
  }) => void;
  [ClientToServerEvent.START_SHIFT]: (
    payload: { truckId: number },
    callback: EventAckCollback<
      ServerToClientEventResponse[typeof ClientToServerEvent.START_SHIFT]
    >,
  ) => void;
  [ClientToServerEvent.END_SHIFT]: () => void;
  [ClientToServerEvent.LEAVE_HOME_ROOM]: () => void;
  [ClientToServerEvent.JOIN_HOME_ROOM]: () => void;
  [ClientToServerEvent.BASE_EVENT]: (
    payload: unknown,
    callback?: EventAckCollback,
  ) => void;
};

export { type ClientToServerEventParameter };