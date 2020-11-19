import { Store } from "app/redux/store";
import { Action } from "app/redux/types";

export function changeTitle (
  state: Store = {},
  action: Action
): Store {
  switch (action.type) {
    case "CHANGE_TITLE": {
      return {
        title: action.data
      }
    }
    default: {
      return state;
    }
  }
}
