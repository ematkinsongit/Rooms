// https://dev.to/thatgalnatalie/how-to-get-started-with-redux-toolkit-41e
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import firebaseClient from 'firebase/client';

const initialState = {
  data: {},
  isLoaded: false,
  hasErrors: false,
};

const widget = createSlice({
  name: "widget",
  initialState,
  reducers: {
    getData: (state) => {
    },

    getDataSuccess: (state, action) => {
      state.isLoaded = true;
      state.data = action.payload;
    },

    getDataFailure: (state, action) => {
      state.isLoaded = true;
      state.hasErrors = true;
    },

    createDataFailure: (state) => {
      state.hasErrors = true;
    },
  }
});

export const reducer = widget.reducer;

export const {
  getData, getDataSuccess, getDataFailure, createDataFailure
} = widget.actions;

export const fetchAllWidgets = createAsyncThunk(
  "widget/fetchAllWidgets",
  async (_, thunkAPI) => {
    // Set the loading state to true
    thunkAPI.dispatch(getData());

    try {
      const data = await _fetchAllWidgetsFromDb();
      thunkAPI.dispatch(getDataSuccess(data));
    } catch (error) {
      console.error('error', error)
      // Set any erros while trying to fetch
      thunkAPI.dispatch(getDataFailure(error));
    }
  }
);

export const createWidget = createAsyncThunk(
  "widget/createWidget",
  async (payload, thunkAPI) => {
    try {
      await _createWidget(payload.title, payload.type);
    } catch (error) {
      console.error('error', error)
      // Set any erros while trying to fetch
      thunkAPI.dispatch(createDataFailure());
    }
  }
);

async function _fetchAllWidgetsFromDb() {
  const snapshot = await firebaseClient.firestore().collection('widgets').get();

  const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  return data;
}

async function _createWidget(title, type) {
  const doc = await firebaseClient.firestore().collection('widgets').add({ title, type });

  return doc;
}
