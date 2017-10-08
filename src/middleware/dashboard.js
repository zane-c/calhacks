import firebase from 'firebase';
import { hashHistory } from 'react-router';
import * as api from '../actions/dashboard.js';

const middleware = store => next => (action) => {
  switch (action.type) {
    case api.JOIN_ROOM: {
      console.log('roomId: ', action.roomId, ' userId: ', action.userId);

      // Listeners
      firebase.database().ref(`rooms/${action.roomId}/questionData`)
        .on('value', snapshot => store.dispatch(api.setQuestionData(snapshot)));

      next(action);
      return hashHistory.push('/dashboard');
    }
    case api.CREATE_ROOM: {
      console.log('roomId: ', action.roomId, ' userId: ', action.userId);
      firebase.database().ref(`rooms/${action.roomId}`).set({
        roomcode: action.roomId,
        storedActivities: [],
        questions: [],
        chat: [],
      });

      // listeners
      firebase.database().ref(`rooms/${action.roomId}/questionData`)
        .on('value', snapshot => store.dispatch(api.setQuestionData(snapshot)));

      next(action);
      return hashHistory.push('/dashboard');
    }
    case api.UPDATE_QUESTIONS: {
      const { roomId } = store.getState().dashboard;
      firebase.database().ref(`rooms/${roomId}`).set({
        questionData: action.newData,
      });
      return next(action);
    }
    default: {
      return next(action);
    }
  }
};

export default middleware;
