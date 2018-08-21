import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import * as types from './types';

const initialState = fromJS({
  account: {},
  locations: [],
  events: {},
  stamps: [],
  customers: {},
  customer: null,
  fetching: false
});

export default handleActions({
    [types.FETCHING]: (state, action) => state.set('fetching', action.payload),

    // ACCOUNT

    [types.FETCH_ACCOUNT]: (state, action) => state.set('account', fromJS(action.payload)),
    [types.EDIT_ACCOUNT]: (state, action) => state.set('account', fromJS(action.payload)),

    // LOCATIONS

    [types.FETCH_LOCATIONS]: (state, action) => state.set('locations', fromJS(action.payload)),
    [types.ADD_LOCATION]: (state, action) => state
      .set('locations', state.get('locations').push(fromJS(action.payload))),
    [types.EDIT_LOCATION]: (state, action) => {
      const index = state.get('locations').findIndex((location) => location.get('_id') === action.payload._id);
      return state.update('locations', locations => locations.set(index, fromJS(action.payload)));
    },
    [types.REMOVE_LOCATION]: (state, action) => state
      .set('locations', state.get('locations').filter(o => o.get('_id') !== action.payload)),

    // STAMPS

    [types.FETCH_STAMPS]: (state, action) => state
      .set('stamps', fromJS(action.payload)),
    [types.ADD_STAMP]: (state, action) => state
      .set('stamps', state.get('stamps').push(fromJS(action.payload))),
    [types.EDIT_STAMP]: (state, action) => {
      const index = state.get('stamps').findIndex((stamp) => stamp.get('_id') === action.payload._id);
      return state.update('stamps', stamps => stamps.set(index, fromJS(action.payload)));
    },
    [types.REMOVE_STAMP]: (state, action) => state
      .set('stamps', state.get('stamps').filter(o => o.get('_id') !== action.payload)),

    // EVENTS

    [types.FETCH_EVENTS]: (state, action) => state.set('events', fromJS(action.payload)),

    // CUSTOMERS

    [types.FETCH_CUSTOMERS]: (state, action) => state.set('customers', fromJS(action.payload)),
    [types.FETCH_CUSTOMER]: (state, action) => state.set('customer', fromJS(action.payload)),
  },
  initialState
);
