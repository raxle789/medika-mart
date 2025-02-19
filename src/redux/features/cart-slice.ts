import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { StaticImageData } from "next/image";

interface IItem {
  id: number;
  name: string;
  price: number;
  url: StaticImageData;
}

interface IInitState {
  itemsAmount: number;
  items: IItem[];
  itemsTotalData: {
    id: number;
    name: string;
    amount: number;
    subTotal: number;
  }[];
}

interface ICartFirestoreItem {
  id: number;
  name: string;
  price: number;
  url: StaticImageData;
  amount: number;
  subTotal: number;
}

interface IFillOrEmpty {
  type: string;
  data?: ICartFirestoreItem[];
}

const initialState: IInitState = {
  itemsAmount: 0,
  items: [],
  itemsTotalData: [],
};

export const cartSlice = createSlice({
  name: "cart slice",
  initialState,
  reducers: {
    setAddItem: (state, action: PayloadAction<IItem>) => {
      // console.log("addCartPayload: ", action.payload);
      // console.log("state.items: ", state.items);
      // console.log({ state.itemsAmount });
      let itemFound: any;
      let itemTotalFound: any;
      if (state.items) {
        itemFound = state.items.find(
          (item: any) => item.id === action.payload.id
        );
        itemTotalFound = state.itemsTotalData.find(
          (item: any) => item.id === action.payload.id
        );
      }
      if (!itemFound) {
        // console.log({ itemFound });
        state.items.push(action.payload);
      }

      if (!itemTotalFound) {
        const newItemTotalData = {
          id: action.payload.id,
          name: action.payload.name,
          amount: 1,
          subTotal: action.payload.price,
        };
        state.itemsTotalData.push(newItemTotalData);
      } else {
        const index = state.itemsTotalData.findIndex(
          (item) => item.id === action.payload.id
        );
        state.itemsTotalData[index].amount += 1;
        state.itemsTotalData[index].subTotal =
          action.payload.price * state.itemsTotalData[index].amount;
      }
      state.itemsAmount += 1;

      // console.log("cartSlice: ", state);
    },
    setAddAmount: (state, action: PayloadAction<number>) => {
      if (state.itemsTotalData) {
        const index = state.itemsTotalData.findIndex(
          (item) => item.id === action.payload
        );
        state.itemsTotalData[index].amount += 1;
        state.itemsTotalData[index].subTotal =
          state.items[index].price * state.itemsTotalData[index].amount;
        state.itemsAmount += 1;
      }
    },
    setSubtractAmount: (state, action: PayloadAction<number>) => {
      if (state.itemsTotalData) {
        const index = state.itemsTotalData.findIndex(
          (item) => item.id === action.payload
        );
        state.itemsTotalData[index].amount -= 1;
        state.itemsTotalData[index].subTotal =
          state.items[index].price * state.itemsTotalData[index].amount;

        if (state.itemsTotalData[index].amount === 0) {
          state.itemsTotalData.splice(index, 1);
          state.items.splice(index, 1);
        }
        state.itemsAmount -= 1;
      }
    },
    setFillOrEmpty: (state, action: PayloadAction<IFillOrEmpty>) => {
      if (action.payload.type === "fill") {
        if (action.payload.data) {
          action.payload.data.forEach((item) => {
            const newItem = {
              id: item.id,
              name: item.name,
              price: item.price,
              url: item.url,
            };
            state.items.push(newItem);

            const newItemTotalData = {
              id: item.id,
              name: item.name,
              amount: item.amount,
              subTotal: item.subTotal,
            };
            state.itemsTotalData.push(newItemTotalData);
            state.itemsAmount += item.amount;
          });
        }
      } else {
        state.itemsAmount = 0;
        state.items.splice(0, state.items.length);
        state.itemsTotalData.splice(0, state.itemsTotalData.length);
      }
    },
  },
});

export const { setAddItem, setAddAmount, setSubtractAmount, setFillOrEmpty } =
  cartSlice.actions;
export default cartSlice.reducer;
