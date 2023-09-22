import { type PayloadAction, createSlice, isAnyOf } from '@reduxjs/toolkit';

import { DataStatus } from '~/libs/enums/enums.js';
import { type HttpError } from '~/libs/packages/http/http.js';
import { type ValueOf } from '~/libs/types/types.js';
import { type TruckGetItemResponseDto } from '~/packages/trucks/libs/types/types.js';

import {
  addTruck,
  calculateArrivalTime,
  findAllTrucksForBusiness,
  setTrucks,
  updateTruckLocationFromSocket,
} from './actions.js';
import { type TruckLocation } from './types/types.js';

type State = {
  trucks: TruckGetItemResponseDto[];
  chosenTruck: TruckGetItemResponseDto | null;
  dataStatus: ValueOf<typeof DataStatus>;
  total: number;
  error: HttpError | null;
  truckLocation: TruckLocation | null;
  truckArrivalTime: { text: string; value: number } | null;
};

const initialState: State = {
  trucks: [],
  total: 0,
  error: null,
  // chosenTruck: null,
  // Mock for demo
  chosenTruck: {
    'id': 1,
    'manufacturer': 'ford',
    'towType': 'hook_and_chain',
    'year': 1991,
    'capacity': 1,
    'pricePerKm': 10,
    businessId: 1,
    createdAt: '111',
    'licensePlateNumber': 'GB 88888',
  },
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
        state.trucks.unshift(action.payload);
        state.dataStatus = DataStatus.FULFILLED;
      })
      .addCase(setTrucks.fulfilled, (state, action) => {
        state.trucks = action.payload;
      })
      .addCase(findAllTrucksForBusiness.fulfilled, (state, action) => {
        state.trucks = action.payload.items;
        state.total = action.payload.total;
        state.dataStatus = DataStatus.FULFILLED;
      })
      .addCase(updateTruckLocationFromSocket.fulfilled, (state, action) => {
        state.truckLocation = action.payload.latLng;
      })
      .addCase(calculateArrivalTime.fulfilled, (state, action) => {
        state.truckArrivalTime = action.payload;
      })
      .addMatcher(
        isAnyOf(findAllTrucksForBusiness.pending, addTruck.pending),
        (state) => {
          state.dataStatus = DataStatus.PENDING;
        },
      )
      .addMatcher(
        isAnyOf(addTruck.rejected, findAllTrucksForBusiness.rejected),
        (state, action) => {
          state.dataStatus = DataStatus.REJECTED;
          state.error = action.payload as HttpError | null;
        },
      );
  },
});

export { actions, name, reducer };
