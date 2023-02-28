import { createSlice } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";

type TJsonState = {
    info: string | ArrayBuffer | null | undefined;
    fileName: string;
    isThumbnale?: boolean;
};

type TSelfRecord = Record<
    string,
    | Record<
          string,
          Record<
              string,
              | Record<string, Record<string, Record<string, Record<string, string | number>> | string | number>>
              | string
              | number
          >
      >
    | string
    | number
>;

interface IJsonState {
    Data: TSelfRecord | null;
}

const initialState: IJsonState = {
    Data: null,
};

const fileSlice = createSlice({
    name: "file",
    initialState,
    reducers: {
        loadFile(state: IJsonState, action: PayloadAction<NonNullable<TJsonState>>) {
            if (action.payload.info === undefined || action.payload.info === null) return state;

            if (action.payload.isThumbnale)
                return {
                    Data: {
                        ...state.Data,
                        [action.payload.fileName]: action.payload.info as string,
                    },
                };

            const parsedData: Record<string, string[]> = JSON.parse(action.payload.info as string);
            const parsedSubdata = Object.entries(parsedData.Data).reduce((prevData, currData) => {
                return {
                    ...prevData,
                    [currData[0]]: JSON.parse(currData[1]),
                };
            }, {});

            return {
                Data: {
                    ...state.Data,
                    [action.payload.fileName]: parsedSubdata,
                },
            };
        },
    },
});

export const fileActionService = fileSlice.actions;
export default fileSlice.reducer;
