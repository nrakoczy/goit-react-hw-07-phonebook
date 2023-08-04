import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

axios.defaults.baseURL = 'https://64ca991a700d50e3c70519ca.mockapi.io';

const handleAsyncRequest = async (requestFn, thunkAPI) => {
  try {
    const response = await requestFn();
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
};

export const fetchContacts = createAsyncThunk(
  'contacts/fetchAll',
  async (_, thunkAPI) => {
    return handleAsyncRequest(() => axios.get('/contacts'), thunkAPI);
  }
);

export const addContact = createAsyncThunk(
  'contacts/addContact',
  async (contact, thunkAPI) => {
    return handleAsyncRequest(() => axios.post('/contacts', contact), thunkAPI);
  }
);

export const deleteContact = createAsyncThunk(
  'contacts/deleteContact',
  async (contactId, thunkAPI) => {
    return handleAsyncRequest(
      () => axios.delete(`/contacts/${contactId}`),
      thunkAPI
    );
  }
);

const contactsSlice = createSlice({
  name: 'contacts',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchContacts.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addContact.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteContact.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(addContact.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.push(action.payload);
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addMatcher(
        action =>
          [
            fetchContacts.rejected,
            addContact.rejected,
            deleteContact.rejected,
          ].includes(action.type),
        (state, action) => {
          state.isLoading = false;
          state.error = action.error.message || 'An error occurred.';
        }
      );
  },
});

export const contactsReducer = contactsSlice.reducer;
