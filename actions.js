import { createAction } from 'redux-actions';
import Api from '../../api';
import * as types from './types';
import * as TYPES from '../auth/types';
import { showToast } from '../app/actions';
import StorageService from '../../services/StorageService';

export const fetchAccountAction = createAction(types.FETCH_ACCOUNT);
export const editAccountAction = createAction(types.EDIT_ACCOUNT);

export const fetchLocationsAction = createAction(types.FETCH_LOCATIONS);
export const addLocationAction = createAction(types.ADD_LOCATION);
export const removeLocationAction = createAction(types.REMOVE_LOCATION);
export const editLocationAction = createAction(types.EDIT_LOCATION);

export const fetchStampsAction = createAction(types.FETCH_STAMPS);
export const addStampAction = createAction(types.ADD_STAMP);
export const removeStampAction = createAction(types.REMOVE_STAMP);
export const editStampAction = createAction(types.EDIT_STAMP);

export const downloadStampPdfAction = createAction(types.DOWNLOAD_STAMP_PDF);

export const fetchEventsAction = createAction(types.FETCH_EVENTS);

export const fetchCustomersAction = createAction(types.FETCH_CUSTOMERS);
export const fetchCustomerAction = createAction(types.FETCH_CUSTOMER);

// ACCOUNT

export const fetchAccount = () => (dispatch) => {
  return Api.fetchAccount()
    .then((response) => {
      const user = StorageService.getUserData();
      dispatch({
        type: TYPES.SET_USER,
        payload: user
      });
      const { account } = response.data;
      dispatch(fetchAccountAction(account));
    })
};

export const editAccount = (values) => (dispatch) => {
  return Api.editAccount(values)
    .then((response) => {
      const { account } = response.data;
      dispatch(editAccountAction(account))
    })
};

export const changePassword = (email) => (dispatch) => {
  return Api.changePassword(email)
    .then((response) => {
      dispatch(showToast({
        message: response,
        type: 'success'
      }));
    })
    .catch((err) => {
      dispatch(showToast({
        message: err,
        type: 'error'
      }));
    })
};

// LOCATIONS

export const fetchLocations = () => (dispatch) => {
  return Api.fetchLocations()
    .then((response) => {
      const { locations } = response.data;
      dispatch(fetchLocationsAction(locations));
    })
};

export const addLocation = (values) => (dispatch, getState) => {
  return Api.addLocation({ ...values })
    .then((response) => {
      const { location } = response.data;
      dispatch(addLocationAction(location));
    })
};

export const removeLocation = (id) => (dispatch) => {
  return Api.removeLocation(id)
    .then(() => {
      dispatch(removeLocationAction(id));
    })
};

export const editLocation = (id, values) => (dispatch) => {
  return Api.editLocation(id, values)
    .then((response) => {
      const { location } = response.data;
      dispatch(editLocationAction(location))
    })
};

// STAMPS

export const fetchStamps = (location_id) => (dispatch) => new Promise((resolve, reject) =>
  Api.fetchLocations()
    .then((responseLocation) => {
      const { locations } = responseLocation.data;
      dispatch(fetchLocationsAction(locations));
      Api.fetchStamps(location_id)
        .then((responseStamp) => {
          const { stamps } = responseStamp.data;
          dispatch(fetchStampsAction(stamps));
          resolve(stamps)
        });
    })
    .catch((error) => reject(error))
);

export const addStamp = (values) => (dispatch) => {
  const { location_id, name } = values;
  return Api.addStamp({
    name,
    location_id
  })
    .then((response) => {
      const { stamp } = response.data;
      dispatch(addStampAction(stamp));
    })
};

export const removeStamp = (id) => (dispatch) => {
  return Api.removeStamp(id)
    .then(() => {
      dispatch(removeStampAction(id));
    });
};

export const editStamp = (id, values) => (dispatch) => {
  return Api.editStamp(id, values)
    .then((response) => {
      const { stamp } = response.data;
      dispatch(editStampAction(stamp));
    });
};

export const downloadStampPdf = (id) => (dispatch) => {
  return Api.downloadStampPdf(id)
    .then((response) => {
      const link = document.createElement("a");

      link.setAttribute("href", `data:application/pdf;base64,${response.data.string}`);
      link.setAttribute('download', 'stamp.pdf');
      link.click();
      dispatch(downloadStampPdfAction());
    });
};

// EVENTS

export const fetchEvents = (count = 10, page = 1, location_id = null, from = null, to = null ) => (dispatch) => {
  return Api.fetchEvents(count, page, location_id, from, to)
    .then((responseEvents) => {
      const events = responseEvents.data;
      dispatch(fetchEventsAction(events));
    });
};

// CUSTOMERS

export const fetchCustomers = (id, showBy, page) => (dispatch) => {
  return new Promise((resolve, reject) => {
    if (!id) {
      Api.fetchCustomers(null, showBy, page)
        .then((resCustomers) => {
          const { data } = resCustomers;
          dispatch(fetchCustomersAction(data));
          resolve();
        })
        .catch((err) => reject(err));
    } else {
      Api.fetchCustomers(id)
        .then((resCustomers) => {
          const { customer } = resCustomers.data;
          dispatch(fetchCustomerAction(customer));
          resolve(customer);
        })
        .catch((err) => reject(err));
    }
  })
};
