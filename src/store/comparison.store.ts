import { create } from "zustand";
import { toast } from "react-toastify";

export const MIN_COMPARE_ITEMS = 2;
export const MAX_COMPARE_ITEMS = 4;

interface IComparisonStore {
  selectedIds: string[];
  actions: {
    toggleHouse: (id: string | number) => void;
    removeHouse: (id: string | number) => void;
    setIds: (ids: string[]) => void;
    clearAll: () => void;
    validateCanCompare: () => boolean;
  };
}

export const useComparisonStore = create<IComparisonStore>((set, get) => ({
  selectedIds: [],
  actions: {
    toggleHouse: (rawId) => {
      const id = String(rawId);
      set((state) => {
        const exists = state.selectedIds.includes(id);
        if (exists) {
          return {
            selectedIds: state.selectedIds.filter((item) => item !== id),
          };
        }
        if (state.selectedIds.length >= MAX_COMPARE_ITEMS) {
          toast.warning(
            `حداکثر ${MAX_COMPARE_ITEMS} ملک را می‌توانید برای مقایسه انتخاب کنید.`
          );
          return state;
        }
        return {
          selectedIds: [...state.selectedIds, id],
        };
      });
    },

    removeHouse: (rawId) => {
      const id = String(rawId);
      set((state) => ({
        selectedIds: state.selectedIds.filter((item) => item !== id),
      }));
    },

    setIds: (ids) =>
      set({
        selectedIds: ids.slice(0, MAX_COMPARE_ITEMS).map(String),
      }),

    clearAll: () => set({ selectedIds: [] }),

    validateCanCompare: () => {
      const count = get().selectedIds.length;
      if (count < MIN_COMPARE_ITEMS) {
        toast.warning(
          `برای مقایسه باید حداقل ${MIN_COMPARE_ITEMS} ملک را انتخاب کنید.`
        );
        return false;
      }
      return true;
    },
  },
}));