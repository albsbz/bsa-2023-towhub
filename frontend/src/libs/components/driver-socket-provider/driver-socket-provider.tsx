import { type FC } from 'react';

import { DataStatus } from '~/libs/enums/data-status.enum';
import { AppRoute } from '~/libs/enums/enums.js';
import {
  useAppDispatch,
  useAppSelector,
  useEffect,
  useNavigate,
} from '~/libs/hooks/hooks.js';
import { notification } from '~/libs/packages/notification/notification.js';
import {
  socketTryAddDriverListeners,
  socketTryRemoveDriverListeners,
} from '~/libs/packages/socket/libs/helpers/helpers.js';
import { actions as authActions } from '~/slices/auth/auth.js';
import {
  selectSocketDriverAuthErrorMessage,
  selectSocketDriverAuthStatus,
  selectUser,
} from '~/slices/auth/selectors.js';
import { ShiftStatus } from '~/slices/driver/libs/enums/enums.js';
import {
  selectActiveTruck,
  selectShiftStatus,
} from '~/slices/driver/selectors.js';
import { selectOrder } from '~/slices/orders/selectors.js';
import { startWatchTruckLocation } from '~/slices/trucks/actions.js';

import { RouterOutlet } from '../router/router.js';

const DriverSocketProvider: FC = () => {
  const socketDriverAuthStatus = useAppSelector(selectSocketDriverAuthStatus);
  const socketDriverAuthErrorMessage = useAppSelector(
    selectSocketDriverAuthErrorMessage,
  );
  const user = useAppSelector(selectUser);
  const currentOrder = useAppSelector(selectOrder);
  const shiftStatus = useAppSelector(selectShiftStatus);
  const activeTruck = useAppSelector(selectActiveTruck);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (shiftStatus === ShiftStatus.ACTIVE && activeTruck) {
      void dispatch(startWatchTruckLocation({ truckId: activeTruck.id }));
    }
  }, [activeTruck, dispatch, shiftStatus]);

  useEffect(() => {
    socketTryAddDriverListeners(dispatch);

    if (socketDriverAuthStatus === DataStatus.IDLE && user) {
      void dispatch(authActions.authorizeDriverSocket(user.id));
    } else if (
      socketDriverAuthStatus === DataStatus.REJECTED &&
      socketDriverAuthErrorMessage
    ) {
      notification.error(socketDriverAuthErrorMessage);
    }

    return () => {
      socketTryRemoveDriverListeners();
    };
  }, [dispatch, socketDriverAuthStatus, user, socketDriverAuthErrorMessage]);

  useEffect(() => {
    if (currentOrder) {
      navigate(`${AppRoute.ORDERS}/${currentOrder.id}`);
    }
  }, [navigate, currentOrder]);

  return <RouterOutlet />;
};

export { DriverSocketProvider };
