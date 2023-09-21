import { type PayloadAction, createSlice, isAnyOf } from '@reduxjs/toolkit';

import { DataStatus } from '~/libs/enums/enums.js';
import { type ValueOf } from '~/libs/types/types.js';
import { type TruckGetItemResponseDto } from '~/packages/trucks/libs/types/types.js';

import {
  addTruck,
  calculateArrivalTime,
  getTrucksForBusiness,
  setTrucks,
  updateTruckLocationFromSocket,
} from './actions.js';
import { type TruckLocation } from './types/types.js';

type State = {
  trucks: TruckGetItemResponseDto[];
  chosenTruck: TruckGetItemResponseDto | null;
  dataStatus: ValueOf<typeof DataStatus>;
  truckLocation: TruckLocation | null;
  truckArrivalTime: { text: string; value: number } | null;
};

const initialState: State = {
  trucks: [],
  chosenTruck: null,
  dataStatus: DataStatus.IDLE,
  truckLocation: null,
  truckArrivalTime: null,
};

const { reducer, actions, name } = createSlice({
  initialState,
  name: 'trucks',
  reducers: {
    setChosenTruck: (state, action: PayloadAction<TruckGetItemResponseDto>) => {
      state.chosenTruck = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(addTruck.fulfilled, (state, action) => {
        state.trucks.push(action.payload);
        state.dataStatus = DataStatus.FULFILLED;
      })
      .addCase(setTrucks.fulfilled, (state, action) => {
        state.trucks = action.payload;
      })
      .addCase(addTruck.rejected, (state) => {
        state.dataStatus = DataStatus.REJECTED;
      })
      .addCase(updateTruckLocationFromSocket.fulfilled, (state, action) => {
        state.truckLocation = action.payload.latLng;
      })
      .addCase(calculateArrivalTime.fulfilled, (state, action) => {
        state.truckArrivalTime = action.payload;
      })
      .addCase(getTrucksForBusiness.fulfilled, (state, action) => {
        state.trucks = action.payload.items;
        state.dataStatus = DataStatus.FULFILLED;
      })
      .addMatcher(
        isAnyOf(getTrucksForBusiness.pending, addTruck.pending),
        (state) => {
          state.dataStatus = DataStatus.PENDING;
        },
      )
      .addMatcher(
        isAnyOf(getTrucksForBusiness.rejected, addTruck.rejected),
        (state) => {
          state.dataStatus = DataStatus.REJECTED;
        },
      );
  },
});

export { actions, name, reducer };
