import { create } from "zustand";

type Step = 1 | 2 | 3;

interface ISignUpValues {
  tempId: string;
  email: string;
  step: Step;
}

interface ISignUpStore {
  signUpValues: ISignUpValues;
  actions: {
    addInfo: (info: Partial<ISignUpValues>) => void;
    resetValues: () => void;
  };
}

const initialValues: ISignUpValues = {
  tempId: "",
  email: "",
  step: 1,
};

export const useSignUpStore = create<ISignUpStore>((set) => ({
  signUpValues: initialValues,
  actions: {
    addInfo: (info) =>
      set((state) => ({
        signUpValues: { ...state.signUpValues, ...info },
      })),

    resetValues: () => set({ signUpValues: initialValues }),
  },
}));

interface IForgetPassValues {
  email: string;
  code: string;
  step: Step;
}

interface IForgetPassStore {
  forgetPassValues: IForgetPassValues;
  actions: {
    addInfo: (info: Partial<IForgetPassValues>) => void;
    resetValues: () => void;
  };
}

const forgetPassInitialValues: IForgetPassValues = {
  email: "",
  code: "",
  step: 1,
};

export const useForgetPassStore = create<IForgetPassStore>((set) => ({
  forgetPassValues: forgetPassInitialValues,
  actions: {
    addInfo: (info) =>
      set((state) => ({
        forgetPassValues: { ...state.forgetPassValues, ...info },
      })),

    resetValues: () => set({ forgetPassValues: forgetPassInitialValues }),
  },
}));
