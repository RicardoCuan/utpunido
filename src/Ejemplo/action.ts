import { Action } from "app/redux/types";

export const changeTitle = (newTitle: string): Action => ({
  type: "CHANGE_TITLE",
  data: newTitle
});