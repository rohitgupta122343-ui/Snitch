import { createSlice } from '@reduxjs/toolkit';

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orderId: null,
  },
  reducers: {
    setOrderId(state, action) {
      state.orderId = action.payload;
    },
    clearOrderId(state) {
      state.orderId = null;
    },
  },
});

export const { setOrderId, clearOrderId } = orderSlice.actions;
export default orderSlice.reducer;