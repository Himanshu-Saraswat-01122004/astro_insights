import { createSlice } from '@reduxjs/toolkit';

const formSlice = createSlice({
  name: 'form',
  initialState: {
    name: '',
    dob: '',
    tob: '',
    pob: '',
    coordinates: '',
  },
  reducers: {
    updateForm: (state, action) => {
      state[action.payload.field] = action.payload.value;
    },
    resetForm: (state) => {
      state.name = '';
      state.dob = '';
      state.tob = '';
      state.pob = '';
      state.coordinates = '';
    },
  },
});

export const { updateForm, resetForm } = formSlice.actions;
export default formSlice.reducer;
