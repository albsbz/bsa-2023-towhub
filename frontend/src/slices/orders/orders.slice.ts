import { createSlice } from '@reduxjs/toolkit';

import { DataStatus } from '~/libs/enums/enums.js';
import { type ValueOf } from '~/libs/types/types.js';
import { type OrderFindByIdResponseDto } from '~/packages/orders/libs/types/types.js';

import { getOrder, updateOrderFromSocket } from './actions.js';

type State = {
  order: OrderFindByIdResponseDto | null;
  dataStatus: ValueOf<typeof DataStatus>;
};

const initialState: State = {
  order: null,
  dataStatus: DataStatus.IDLE,
};

const { reducer, actions, name } = createSlice({
  initialState,
  name: 'orders',
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getOrder.pending, (state) => {
        state.dataStatus = DataStatus.PENDING;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.order = action.payload;
        state.dataStatus = DataStatus.FULFILLED;
      })
      .addCase(getOrder.rejected, (state) => {
        state.dataStatus = DataStatus.REJECTED;
      })
      .addCase(updateOrderFromSocket.fulfilled, (state, action) => {
        if (state.order) {
          state.order.status = action.payload.status;
        }
      });
  },
});

export { actions, name, reducer };
