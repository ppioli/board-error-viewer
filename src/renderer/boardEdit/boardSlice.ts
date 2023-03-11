import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Board, Component } from '../../model/Board';
import { ApiError, ClientError } from '../../model/ApiError';
import _ from 'lodash';
import { RootState } from '../store';

interface BoardState {
  board: Board | null;
  status: 'IDLE' | 'ERROR' | 'LOADING';
  error: ApiError | ClientError | null;
}

const initialState: BoardState = {
  board: null,
  status: 'IDLE',
  error: null,
};

export const loadBoardThunk = createAsyncThunk(
  'board/loadBoard',
  async (path: string) => {
    return await window.electron.fileApi.boardOpen(path);
  }
);

export interface FormUpdateActionPayload {
  property: string,
  value: any,
}

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    updateBoard( state, action: PayloadAction<{name: string}>){
      state.board!.name = action.payload.name;
    },
    updateBoardProp(state, { payload }: PayloadAction<FormUpdateActionPayload>){
      console.log(state, payload)

      _.set(state.board!, payload.property, payload.value)
    }
  },
  extraReducers: (builder) =>
    builder
      .addCase(loadBoardThunk.pending, (state) => {
        state.status = 'LOADING';
      })
      .addCase(loadBoardThunk.fulfilled, (state, action) => {
        const { error, result: board } = action.payload;
        if (action.payload.error) {
          state.error = error;
          state.status = 'ERROR';
        }
        state.board = board;
        state.status = 'IDLE';
      }),
});

export default boardSlice.reducer;
const selectBoard = (state:RootState) => state.board;
export const selectTopLayer = createSelector( [selectBoard], (board) => board.board?.layerTop);
const selectTopLayerComponents = createSelector([selectTopLayer], ( layer ) => layer?.components ?? [] )
const selectLayerComponents = createSelector([selectTopLayerComponents], (components) => {
  const map: Record<string, Component> = {};
  components.forEach( c => {
    map[c.id] = c;
  })

  return map;
})

export const selectDimension = createSelector( [selectTopLayer, selectTopLayerComponents], (board, components) => {

  let height = 100,
    width = 100;
  const image = board?.image;
  if (image) {
    width = image.width;
    height = image.height;
  } else {
    const maxX = _.maxBy(components, (c) => c.position.x)?.position.x;
    const maxY = _.maxBy(components, (c) => c.position.y)?.position.y;
    // TODO breaks when deleting an image when there are components
    if (maxX && maxY) {
      width = maxX;
      height = maxY;
    }
  }

  return [width, height]
})

export const selectLayerComponentsIds = createSelector([selectLayerComponents], (map) => {
  return Object.keys(map)
})

export const selectLayerComponentById = createSelector([selectLayerComponents, (state,id) => id], (map, id) => {
  return map[id];
})

export const { updateBoard, updateBoardProp } = boardSlice.actions;
